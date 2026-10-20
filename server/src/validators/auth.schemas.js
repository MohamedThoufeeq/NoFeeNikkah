import { z } from 'zod';

const email = z.string().trim().toLowerCase().email('Enter a valid email address.');
const password = z
  .string()
  .min(8, 'Password must be at least 8 characters.')
  .max(128, 'Password must be at most 128 characters.');
const username = z
  .string()
  .trim()
  .min(3, 'Username must be at least 3 characters.')
  .max(30, 'Username must be at most 30 characters.')
  .regex(/^[a-zA-Z0-9_]+$/, 'Username may contain letters, numbers and underscores only.');

export const registerSchema = z.object({
  username,
  email,
  password,
  fullName: z.string().trim().max(120).optional(),
});

export const loginSchema = z.object({
  email,
  password: z.string().min(1, 'Password is required.').max(128),
});

export const socialLoginSchema = z.object({
  accessToken: z.string().min(20, 'A valid Supabase access token is required.'),
});
