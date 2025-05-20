import { z } from 'zod';

export const SignupDTO = z.object({
  firstName: z.string().min(1, 'firstName is required'),
  lastName: z.string().min(1, 'lastName is required'),
  email: z.string().email('Invalid email'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export const LoginDTO = z.object({
  email: z.string().email('Invalid email'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export type SignupInput = z.infer<typeof SignupDTO>;
export type LoginInput = z.infer<typeof LoginDTO>;
