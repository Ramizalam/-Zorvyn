import type { Request, Response, NextFunction, RequestHandler } from 'express';
import  { ZodObject, ZodError } from 'zod';
import { sendError } from '../utils/apiResponse.js';

/**
 * Zod validation middleware factory.
 * Usage: validate(myZodSchema)
 */
export const validate = (schema: ZodObject): RequestHandler => {
    return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            await schema.parseAsync(req.body);
            next();
        } catch (error) {
            sendError(res, 'Validation failed', 400, error);
        }
    };
};
