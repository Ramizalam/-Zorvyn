import { z } from 'zod';

export const createRecordSchema = z.object({
    amount: z
        .number({ required_error: 'Amount is required', invalid_type_error: 'Amount must be a number' })
        .positive('Amount must be a positive number'),
    type: z.enum(['INCOME', 'EXPENSE'], {
        required_error: 'Type is required',
        invalid_type_error: 'Type must be either INCOME or EXPENSE',
    }),
    category: z.string().min(1, 'Category is required').max(100),
    date: z.string().refine(val => !isNaN(Date.parse(val)), 'Invalid date format'),
    notes: z.string().max(500).optional(),
});

export const updateRecordSchema = z.object({
    amount: z.number().positive().optional(),
    type: z.enum(['INCOME', 'EXPENSE']).optional(),
    category: z.string().min(1).max(100).optional(),
    date: z.string().refine(val => !isNaN(Date.parse(val)), 'Invalid date format').optional(),
    notes: z.string().max(500).optional().nullable(),
});

export const filterRecordSchema = z.object({
    type: z.enum(['INCOME', 'EXPENSE']).optional(),
    category: z.string().optional(),
    dateFrom: z.string().optional(),
    dateTo: z.string().optional(),
    search: z.string().optional(),
    page: z.string().optional(),
    limit: z.string().optional(),
});

export type CreateRecordInput = z.infer<typeof createRecordSchema>;
export type UpdateRecordInput = z.infer<typeof updateRecordSchema>;
export type FilterRecordInput = z.infer<typeof filterRecordSchema>;
