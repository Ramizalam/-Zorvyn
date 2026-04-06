import { z } from 'zod';

export const registerSchema = z.object({
    email: z.email('Invalid Email address'),
    name: z.string().min(8, 'Name must be at least 8 characters').max(100),
    password: z
        .string()
        .min(8, 'Password must be at least 8 characters')
        .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
        .regex(/[0-9]/, 'Password must contain at least one number'),
    role: z.enum(['VIEWER', 'ANALYST', 'ADMIN']).optional(),
});

export const loginSchema = z.object({
    email: z.email('Invalid email address'),
    password: z.string().min(8, 'Password is required'),
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
