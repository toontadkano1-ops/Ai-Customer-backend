import { z } from 'zod';

export const createTicketSchema = z.object({
  customer_id: z.string().nullish(),
  subject: z.string().min(3, 'Subject must be at least 3 characters'),
  description: z.string().min(5, 'Description must be at least 5 characters'),
  priority: z.enum(['low', 'medium', 'high', 'urgent']).nullish(),
  category: z.string().default('General'),
  assigned_agent_id: z.string().nullish()
});

export const updateTicketSchema = z.object({
  status: z.enum(['open', 'in_progress', 'waiting_for_customer', 'resolved', 'closed']).nullish(),
  priority: z.enum(['low', 'medium', 'high', 'urgent']).nullish(),
  assigned_agent_id: z.string().nullish(),
  category: z.string().nullish()
});

export const addTicketMessageSchema = z.object({
  content: z.string().min(1, 'Message content cannot be empty'),
  is_internal: z.boolean().default(false)
});
