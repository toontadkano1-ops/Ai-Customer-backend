import { z } from 'zod';

export const customerSchema = z.object({
  name: z.string().min(2, 'Customer name is required'),
  email: z.string().email('Valid email is required'),
  preferences: z.object({
    interests: z.array(z.string()).default([]),
    preferred_channel: z.string().default('web_chat'),
    notifications: z.boolean().default(true)
  }).optional()
});
