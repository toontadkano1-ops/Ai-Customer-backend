import { db } from '../database/db.js';
import { aiProvider } from '../services/ai/aiProvider.js';
import { sentimentService } from '../services/sentiment/sentimentService.js';
import { chatMessageSchema, escalateChatSchema } from '../validators/chatValidator.js';

export const chatController = {
  sendMessage: async (req, res, next) => {
    try {
      const validated = chatMessageSchema.parse(req.body);
      const businessId = req.user.business_id;

      // 1. Resolve Customer ID
      let customerId = validated.customer_id;
      let customer = null;

      if (customerId) {
        customer = await db.findById('customers', customerId);
      }

      if (!customer) {
        if (req.user.role === 'customer') {
          customer = await db.findById('customers', req.user.id);
          if (!customer) {
            customer = await db.insert('customers', {
              id: req.user.id,
              business_id: businessId,
              name: req.user.full_name || 'Customer',
              email: req.user.email,
              preferences: { interests: ['Cloud Infrastructure'], preferred_channel: 'web_chat', notifications: true }
            });
          }
          customerId = customer.id;
        } else {
          // If Admin or Agent is testing the assistant, bind to the first demo customer or create one
          const existingCustomers = await db.find('customers', { business_id: businessId });
          if (existingCustomers.length > 0) {
            customer = existingCustomers[0];
            customerId = customer.id;
          } else {
            customer = await db.insert('customers', {
              business_id: businessId,
              name: req.user.full_name || 'Demo Customer',
              email: req.user.email,
              preferences: { interests: ['Cloud Infrastructure', 'Kubernetes'], preferred_channel: 'web_chat', notifications: true }
            });
            customerId = customer.id;
          }
        }
      }

      // 2. Get or create active conversation
      let conversationId = validated.conversation_id;
      let conversation = null;

      if (conversationId) {
        conversation = await db.findById('conversations', conversationId);
      }

      if (!conversation) {
        conversation = await db.insert('conversations', {
          business_id: businessId,
          customer_id: customerId,
          status: 'active'
        });
        conversationId = conversation.id;
      }

      // 3. Fetch conversation history for context
      const existingMessages = await db.find('messages', { conversation_id: conversationId });

      // 4. Save incoming customer message
      const customerMsg = await db.insert('messages', {
        conversation_id: conversationId,
        sender_type: req.user.role === 'customer' ? 'customer' : 'customer',
        content: validated.message,
        sentiment: 'neutral',
        intent: 'general'
      });

      // 5. Run sentiment analysis and record AI analysis
      const analysis = await sentimentService.analyzeAndRecordMessage(customerMsg.id, validated.message);

      // 6. Generate grounded AI assistant response
      const aiResult = await aiProvider.generateChatResponse({
        businessId,
        message: validated.message,
        conversationHistory: existingMessages,
        customerName: customer ? customer.name : 'Valued Customer'
      });

      // 7. Save assistant message
      const assistantMsg = await db.insert('messages', {
        conversation_id: conversationId,
        sender_type: 'assistant',
        content: aiResult.content,
        sentiment: aiResult.sentiment,
        intent: aiResult.intent
      });

      // Update conversation timestamp
      await db.update('conversations', conversationId, { updated_at: new Date().toISOString() });

      res.json({
        success: true,
        conversation_id: conversationId,
        user_message: {
          id: customerMsg.id,
          content: customerMsg.content,
          sender_type: 'customer',
          sentiment: analysis.sentiment,
          intent: analysis.intent,
          confidence: analysis.confidence,
          created_at: customerMsg.created_at
        },
        message: {
          id: assistantMsg.id,
          content: assistantMsg.content,
          sender_type: 'assistant',
          sentiment: aiResult.sentiment,
          intent: aiResult.intent,
          confidence: aiResult.confidence,
          sources: aiResult.sources,
          is_uncertain: aiResult.is_uncertain,
          suggested_actions: aiResult.suggested_actions,
          escalation_recommended: aiResult.escalation_recommended,
          created_at: assistantMsg.created_at
        }
      });
    } catch (err) {
      next(err);
    }
  },

  getConversations: async (req, res, next) => {
    try {
      const businessId = req.user.business_id;
      let filter = { business_id: businessId };

      if (req.user.role === 'customer') {
        filter.customer_id = req.user.id;
      }

      const conversations = await db.find('conversations', filter);
      const allCustomers = await db.find('customers', { business_id: businessId });
      const allMessages = await db.find('messages', {});

      const enriched = conversations.map(c => {
        const cust = allCustomers.find(cu => cu.id === c.customer_id);
        const msgs = allMessages.filter(m => m.conversation_id === c.id);
        const lastMsg = msgs.length > 0 ? msgs[msgs.length - 1] : null;

        return {
          ...c,
          customer_name: cust ? cust.name : (c.customer_id ? `Customer (${c.customer_id.slice(0, 6)})` : 'Valued Customer'),
          customer_email: cust ? cust.email : 'customer@apex.io',
          message_count: msgs.length,
          last_message: lastMsg ? lastMsg.content : 'Session initialized',
          last_sentiment: lastMsg ? lastMsg.sentiment : 'neutral'
        };
      });

      // Sort by updated_at desc
      enriched.sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime());

      res.json({ success: true, data: enriched });
    } catch (err) {
      next(err);
    }
  },

  getConversationById: async (req, res, next) => {
    try {
      const { id } = req.params;
      const conversation = await db.findById('conversations', id);
      if (!conversation) {
        return res.status(404).json({ success: false, message: 'Conversation not found' });
      }

      if (req.user.role === 'customer' && conversation.customer_id !== req.user.id) {
        return res.status(403).json({ success: false, message: 'Forbidden' });
      }

      const messages = await db.find('messages', { conversation_id: id });
      let customer = await db.findById('customers', conversation.customer_id);
      if (!customer) {
        customer = {
          id: conversation.customer_id,
          name: 'Alex Mercer',
          email: 'customer@acme.com'
        };
      }

      // Fetch AI analysis for each message if present
      const allAnalysis = await db.find('ai_analysis', {});
      const enrichedMessages = messages.map(m => {
        const analysis = allAnalysis.find(a => a.message_id === m.id);
        return {
          ...m,
          analysis: analysis || null
        };
      });

      res.json({
        success: true,
        data: {
          ...conversation,
          customer,
          messages: enrichedMessages
        }
      });
    } catch (err) {
      next(err);
    }
  },

  escalate: async (req, res, next) => {
    try {
      const validated = escalateChatSchema.parse(req.body);
      const conversation = await db.findById('conversations', validated.conversation_id);
      if (!conversation) {
        return res.status(404).json({ success: false, message: 'Conversation not found' });
      }

      // Mark conversation as escalated
      await db.update('conversations', conversation.id, { status: 'escalated' });

      // Automatically create a prioritized support ticket
      const messages = await db.find('messages', { conversation_id: conversation.id });
      const lastCustomerMsg = messages.filter(m => m.sender_type === 'customer').pop();

      const ticket = await db.insert('tickets', {
        business_id: conversation.business_id,
        customer_id: conversation.customer_id,
        subject: `[Escalated Chat] Issue raised by customer`,
        description: `Chat session #${conversation.id.slice(0, 8)} was escalated to human agent.\nReason: ${validated.reason}\n\nLast inquiry: "${lastCustomerMsg ? lastCustomerMsg.content : 'N/A'}"`,
        priority: 'high',
        category: 'Customer Support Escalation',
        status: 'open'
      });

      // System notification in ticket
      await db.insert('ticket_messages', {
        ticket_id: ticket.id,
        sender_id: req.user.id,
        sender_name: 'AI Concierge Escalation Service',
        sender_type: 'system',
        content: `Chat session #${conversation.id.slice(0, 8)} was escalated to human agent. Escalation reason: "${validated.reason}".`,
        is_internal: true
      });

      res.json({
        success: true,
        message: 'Conversation escalated to human agent and ticket opened',
        ticket_id: ticket.id
      });
    } catch (err) {
      next(err);
    }
  },

  submitFeedback: async (req, res, next) => {
    try {
      const { customer_id, conversation_id, rating, comment } = req.body;
      const cId = customer_id || req.user.id;

      const record = await db.insert('feedback', {
        customer_id: cId,
        conversation_id: conversation_id || null,
        rating: Math.min(Math.max(parseInt(rating || 5, 10), 1), 5),
        comment: comment || ''
      });

      res.status(201).json({ success: true, data: record });
    } catch (err) {
      next(err);
    }
  },

  addConversationMessage: async (req, res, next) => {
    try {
      const { id } = req.params;
      const { content } = req.body;

      if (!content || !content.trim()) {
        return res.status(400).json({ success: false, message: 'Message content is required' });
      }

      const conversation = await db.findById('conversations', id);
      if (!conversation) {
        return res.status(404).json({ success: false, message: 'Conversation not found' });
      }

      const senderType = req.user.role === 'customer' ? 'customer' : 'agent';
      const msg = await db.insert('messages', {
        conversation_id: id,
        sender_type: senderType,
        content,
        sentiment: 'positive',
        intent: senderType === 'agent' ? 'agent_reply' : 'customer_followup'
      });

      await db.update('conversations', id, { updated_at: new Date().toISOString() });

      res.status(201).json({ success: true, data: msg });
    } catch (err) {
      next(err);
    }
  },

  updateConversationStatus: async (req, res, next) => {
    try {
      const { id } = req.params;
      const { status } = req.body;

      const conversation = await db.findById('conversations', id);
      if (!conversation) {
        return res.status(404).json({ success: false, message: 'Conversation not found' });
      }

      const updated = await db.update('conversations', id, { status });
      res.json({ success: true, data: updated });
    } catch (err) {
      next(err);
    }
  }
};
