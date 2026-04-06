import type{ Request, Response } from 'express';
import { authService } from './auth.service.js';
import type { RegisterInput, LoginInput } from './auth.schema.js';
import { sendSuccess } from '../../utils/apiResponse.js';
import { asyncHandler } from '../../utils/asyncHandler.js';

export const authController = {
    register: asyncHandler(async (req: Request, res: Response) => {
        const data = req.body as RegisterInput;
        const result = await authService.register(data);
        sendSuccess(res, result, 'User registered successfully', 201);
    }),

    login: asyncHandler(async (req: Request, res: Response) => {
        const data = req.body as LoginInput;
        const result = await authService.login(data);
        sendSuccess(res, result, 'Login successful');
    }),

    me: asyncHandler(async (req: Request, res: Response) => {
        sendSuccess(res, req.user, 'Authenticated user info');
    }),
};
