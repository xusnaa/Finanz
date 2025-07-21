import { z } from 'zod';

export const RegisterSchema = z.object({
  email: z.string().email({ message: 'Invalid email address' }),
  password: z
    .string()
    .min(8, { message: 'Password must be at least 8 characters' })
    .max(64)
    .regex(/[a-z]/, { message: 'Must include a lowercase letter' })
    .regex(/[A-Z]/, { message: 'Must include an uppercase letter' })
    .regex(/[0-9]/, { message: 'Must include a number' }),

  firstname: z.string().min(1, { message: 'Name is required' }),
  latname: z.string().min(1, { message: 'Name is required' }),
});

export const loginSchema = z.object({
  email: z.string().email({ message: 'Invalid email address' }),
  password: z.string().min(1, { message: 'Password is required' }),
});
