import type  { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { sendError } from '../utils/apiResponse.js';
import { prisma } from '../lib/prisma.js';

export interface JwtPayload {
    userId: string;
    role: string;
}

// Extend Express Request type
declare global {
    namespace Express {
        interface Request {
            user?: {
                id: string;
                role: string;
                email: string;
            };
        }
    }
}

export const authenticate = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            sendError(res, 'Authorization token is missing or malformed', 401);
            return;
        }

        const token = authHeader.split(' ')[1];
        const secret = process.env.JWT_SECRET;

        if (!secret) {
            sendError(res, 'Server configuration error', 500);
            return;
        }

        const decoded = jwt.verify(token as string, secret) as JwtPayload;

        const user = await prisma.user.findUnique({
            where: { id: decoded.userId },
            select: { id: true, role: true, email: true, isActive: true },
        });

        if (!user) {
            sendError(res, 'User not found', 401);
            return;
        }

        if (!user.isActive) {
            sendError(res, 'Account is deactivated. Please contact an administrator.', 403);
            return;
        }

        req.user = { id: user.id, role: user.role, email: user.email };
        next();
    } catch (error) {
        if (error instanceof jwt.TokenExpiredError) {
            sendError(res, 'Token has expired', 401);
        } else if (error instanceof jwt.JsonWebTokenError) {
            sendError(res, 'Invalid token', 401);
        } else {
            next(error);
        }
    }
};
