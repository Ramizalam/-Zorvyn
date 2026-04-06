import { z } from 'zod';

export const createUserSchema = z.object({
    email: z.string().email('Invalid email address'),
    name: z.string().min(2).max(100),
    password: z
        .string()
        .min(8)
        .regex(/[A-Z]/, 'Must contain an uppercase letter')
        .regex(/[0-9]/, 'Must contain a number'),
    role: z.enum(['VIEWER', 'ANALYST', 'ADMIN']).default('VIEWER'),
});

export const updateUserSchema = z.object({
    name: z.string().min(2).max(100).optional(),
    role: z.enum(['VIEWER', 'ANALYST', 'ADMIN']).optional(),
    isActive: z.boolean().optional(),
});

export type CreateUserInput = z.infer<typeof createUserSchema>;
export type UpdateUserInput = z.infer<typeof updateUserSchema>;
