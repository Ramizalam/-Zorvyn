import { Request, Response } from 'express';
import { userService } from './user.service';
import { CreateUserInput, UpdateUserInput } from './user.schema';
import { sendSuccess } from '../../utils/apiResponse';
import { asyncHandler } from '../../utils/asyncHandler';

export const userController = {
    getAll: asyncHandler(async (req: Request, res: Response) => {
        const page = parseInt(req.query.page as string) || 1;
        const limit = Math.min(parseInt(req.query.limit as string) || 10, 100);
        const search = req.query.search as string | undefined;

        const result = await userService.getAllUsers(page, limit, search);
        sendSuccess(res, result.users, 'Users retrieved', 200, { pagination: result.pagination });
    }),

    getById: asyncHandler(async (req: Request, res: Response) => {
        const user = await userService.getUserById(req.params.id);
        sendSuccess(res, user, 'User retrieved');
    }),

    create: asyncHandler(async (req: Request, res: Response) => {
        const data = req.body as CreateUserInput;
        const user = await userService.createUser(data);
        sendSuccess(res, user, 'User created', 201);
    }),

    update: asyncHandler(async (req: Request, res: Response) => {
        const data = req.body as UpdateUserInput;
        const user = await userService.updateUser(req.params.id, data);
        sendSuccess(res, user, 'User updated');
    }),

    delete: asyncHandler(async (req: Request, res: Response) => {
        const result = await userService.deleteUser(req.params.id);
        sendSuccess(res, result, 'User deleted');
    }),
};
