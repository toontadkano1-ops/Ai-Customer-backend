import { db } from '../database/db.js';
import { aiProvider } from '../services/ai/aiProvider.js';
import { createTicketSchema, updateTicketSchema, addTicketMessageSchema } from '../validators/ticketValidator.js';

export const ticketController = {
  list: async (req, res, next) => {
    try {
      const businessId = req.user.business_id;
      let filter = { business_id: businessId };

      if (req.user.role === 'customer') {
        filter.customer_id = req.user.id;
      }

      const tickets = await db.find('tickets', filter);
      const customers = await db.find('customers', { business_id: businessId });
      const profiles = await db.find('profiles', { business_id: businessId });

      const enriched = tickets.map(t => {
        const customer = customers.find(c => c.id === t.customer_id);
        const agent = profiles.find(p => p.id === t.assigned_agent_id);

        return {
          ...t,
          customer_name: customer ? customer.name : 'Alex Mercer',
          customer_email: customer ? customer.email : 'customer@acme.com',
          assigned_agent_name: agent ? agent.full_name : (t.assigned_agent_id ? 'Support Specialist' : 'Unassigned')
        };
      });

      // Sort by updated_at descending
      enriched.sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime());

      res.json({ success: true, data: enriched });
    } catch (err) {
      next(err);
    }
  },

  getById: async (req, res, next) => {
    try {
      const { id } = req.params;
      const ticket = await db.findById('tickets', id);
      if (!ticket) {
        return res.status(404).json({ success: false, message: 'Ticket not found' });
      }

      if (req.user.role === 'customer' && ticket.customer_id !== req.user.id) {
        return res.status(403).json({ success: false, message: 'Forbidden' });
      }

      let customer = await db.findById('customers', ticket.customer_id);
      if (!customer) {
        customer = {
          id: ticket.customer_id,
          name: 'Alex Mercer',
          email: 'customer@acme.com'
        };
      }

      const agent = ticket.assigned_agent_id ? await db.findById('profiles', ticket.assigned_agent_id) : null;
      
      let messages = await db.find('ticket_messages', { ticket_id: id });
      
      // If customer, filter out internal notes
      if (req.user.role === 'customer') {
        messages = messages.filter(m => !m.is_internal);
      }

      // Sort messages chronologically
      messages.sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());

      res.json({
        success: true,
        data: {
          ...ticket,
          customer_name: customer ? customer.name : 'Alex Mercer',
          customer_email: customer ? customer.email : 'customer@acme.com',
          assigned_agent_name: agent ? agent.full_name : 'Unassigned',
          messages
        }
      });
    } catch (err) {
      next(err);
    }
  },

  create: async (req, res, next) => {
    try {
      const validated = createTicketSchema.parse(req.body);
      const businessId = req.user.business_id;

      // Determine valid customerId
      let customerId = validated.customer_id;
      if (!customerId) {
        if (req.user.role === 'customer') {
          customerId = req.user.id;
        } else {
          // For Admin/Agent, pick the first customer
          const customers = await db.find('customers', { business_id: businessId });
          customerId = customers.length > 0 ? customers[0].id : req.user.id;
        }
      }

      // AI auto priority suggestion if not explicitly provided
      let priority = validated.priority;
      let aiPrioritySuggestion = null;

      if (!priority) {
        const suggestion = aiProvider.suggestTicketPriority({
          subject: validated.subject,
          description: validated.description
        });
        priority = suggestion.priority;
        aiPrioritySuggestion = suggestion;
      }

      const ticket = await db.insert('tickets', {
        business_id: businessId,
        customer_id: customerId,
        assigned_agent_id: validated.assigned_agent_id || null,
        subject: validated.subject,
        description: validated.description,
        priority: priority || 'medium',
        category: validated.category || 'General',
        status: 'open'
      });

      // Initial message
      await db.insert('ticket_messages', {
        ticket_id: ticket.id,
        sender_id: req.user.id,
        sender_name: req.user.full_name,
        sender_type: req.user.role === 'customer' ? 'customer' : 'agent',
        content: validated.description,
        is_internal: false
      });

      res.status(201).json({
        success: true,
        data: ticket,
        ai_suggestion: aiPrioritySuggestion
      });
    } catch (err) {
      next(err);
    }
  },

  update: async (req, res, next) => {
    try {
      const { id } = req.params;
      const validated = updateTicketSchema.parse(req.body);
      const ticket = await db.findById('tickets', id);

      if (!ticket) {
        return res.status(404).json({ success: false, message: 'Ticket not found' });
      }

      // Check permissions: only admin and agents can update tickets arbitrarily
      if (req.user.role === 'customer') {
        return res.status(403).json({ success: false, message: 'Only support agents can modify ticket status' });
      }

      const updates = { ...validated };
      if (validated.status === 'resolved' || validated.status === 'closed') {
        updates.resolved_at = new Date().toISOString();
      }

      const updated = await db.update('tickets', id, updates);

      // If status changed, post system message
      if (validated.status && validated.status !== ticket.status) {
        await db.insert('ticket_messages', {
          ticket_id: id,
          sender_id: req.user.id,
          sender_name: 'System Automation',
          sender_type: 'system',
          content: `Ticket status updated from "${ticket.status}" to "${validated.status}" by ${req.user.full_name}.`,
          is_internal: true
        });
      }

      res.json({ success: true, data: updated });
    } catch (err) {
      next(err);
    }
  },

  addMessage: async (req, res, next) => {
    try {
      const { id } = req.params;
      const validated = addTicketMessageSchema.parse(req.body);
      const ticket = await db.findById('tickets', id);

      if (!ticket) {
        return res.status(404).json({ success: false, message: 'Ticket not found' });
      }

      // Customers cannot post internal notes
      let isInternal = validated.is_internal;
      if (req.user.role === 'customer') {
        isInternal = false;
        if (ticket.customer_id !== req.user.id) {
          return res.status(403).json({ success: false, message: 'Forbidden' });
        }
      }

      const msg = await db.insert('ticket_messages', {
        ticket_id: id,
        sender_id: req.user.id,
        sender_name: req.user.full_name,
        sender_type: req.user.role === 'customer' ? 'customer' : 'agent',
        content: validated.content,
        is_internal: isInternal
      });

      // Update ticket updated_at
      await db.update('tickets', id, { updated_at: new Date().toISOString() });

      res.status(201).json({ success: true, data: msg });
    } catch (err) {
      next(err);
    }
  }
};
