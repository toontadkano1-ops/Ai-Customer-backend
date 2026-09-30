import { z } from 'zod';

export const registerSchema = z.object({
  email: z.string().email('Valid email is required'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  full_name: z.string().min(2, 'Full name is required'),
  role: z.enum(['admin', 'agent', 'customer']).default('customer'),
  business_name: z.string().optional()
});

export const loginSchema = z.object({
  email: z.string().email('Valid email is required'),
  password: z.string().min(1, 'Password is required')
});
