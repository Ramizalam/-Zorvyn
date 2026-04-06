import type{ Request, Response, NextFunction, RequestHandler } from 'express';
import { sendError } from '../utils/apiResponse.js';

/**
 * Role-based authorization middleware factory.
 * Usage: authorize('ADMIN', 'ANALYST')
 */
export const authorize = (...allowedRoles: string[]): RequestHandler => {
    return (req: Request, res: Response, next: NextFunction): void => {
        if (!req.user) {
            sendError(res, 'Not authenticated', 401);
            return;
        }

        if (!allowedRoles.includes(req.user.role)) {
            sendError(
                res,
                `Access denied. Required role(s): ${allowedRoles.join(', ')}. Your role: ${req.user.role}`,
                403
            );
            return;
        }

        next();
    };
};
