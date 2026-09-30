import { db } from '../database/db.js';
import { customerSchema } from '../validators/customerValidator.js';

export const customerController = {
  list: async (req, res, next) => {
    try {
      const businessId = req.user.business_id;
      const customers = await db.find('customers', { business_id: businessId });
      
      // Enrich with ticket counts & latest conversation
      const allTickets = await db.find('tickets', { business_id: businessId });
      const allConversations = await db.find('conversations', { business_id: businessId });

      const enriched = customers.map(c => {
        const customerTickets = allTickets.filter(t => t.customer_id === c.id);
        const openTickets = customerTickets.filter(t => t.status === 'open' || t.status === 'in_progress');
        const customerConvs = allConversations.filter(conv => conv.customer_id === c.id);
        
        return {
          ...c,
          totalTickets: customerTickets.length,
          openTickets: openTickets.length,
          totalConversations: customerConvs.length
        };
      });

      res.json({ success: true, data: enriched });
    } catch (err) {
      next(err);
    }
  },

  getById: async (req, res, next) => {
    try {
      const { id } = req.params;
      const customer = await db.findById('customers', id);
      if (!customer) {
        return res.status(404).json({ success: false, message: 'Customer not found' });
      }

      // Customer isolation check
      if (req.user.role === 'customer' && req.user.id !== id) {
        return res.status(403).json({ success: false, message: 'Forbidden access' });
      }

      const tickets = await db.find('tickets', { customer_id: id });
      const conversations = await db.find('conversations', { customer_id: id });
      const recommendations = await db.find('recommendations', { customer_id: id });

      res.json({
        success: true,
        data: {
          ...customer,
          tickets,
          conversations,
          recommendations
        }
      });
    } catch (err) {
      next(err);
    }
  },

  create: async (req, res, next) => {
    try {
      const validated = customerSchema.parse(req.body);
      const businessId = req.user.business_id;

      const newCustomer = await db.insert('customers', {
        business_id: businessId,
        name: validated.name,
        email: validated.email,
        preferences: validated.preferences || { interests: [], preferred_channel: 'web_chat', notifications: true }
      });

      res.status(201).json({ success: true, data: newCustomer });
    } catch (err) {
      next(err);
    }
  },

  update: async (req, res, next) => {
    try {
      const { id } = req.params;
      const customer = await db.findById('customers', id);
      if (!customer) {
        return res.status(404).json({ success: false, message: 'Customer not found' });
      }

      const updated = await db.update('customers', id, req.body);
      res.json({ success: true, data: updated });
    } catch (err) {
      next(err);
    }
  }
};
