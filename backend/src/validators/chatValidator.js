import { z } from 'zod';

export const chatMessageSchema = z.object({
  conversation_id: z.string().nullish(),
  customer_id: z.string().nullish(),
  message: z.string().min(1, 'Message cannot be empty')
});

export const escalateChatSchema = z.object({
  conversation_id: z.string().min(1, 'Conversation ID is required'),
  reason: z.string().default('Customer requested human escalation')
});

export const sentimentAnalysisSchema = z.object({
  text: z.string().min(1, 'Text content is required')
});
