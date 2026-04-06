import { Router } from 'express';
import { userController } from './user.controller';
import { authenticate } from '../../middleware/authenticate';
import { authorize } from '../../middleware/authorize';
import { validate } from '../../middleware/validate';
import { createUserSchema, updateUserSchema } from './user.schema';

const router = Router();

// All user management routes require authentication + ADMIN role
router.use(authenticate, authorize('ADMIN'));

// GET /api/users?page=1&limit=10&search=...
router.get('/', userController.getAll);

// GET /api/users/:id
router.get('/:id', userController.getById);

// POST /api/users
router.post('/', validate(createUserSchema), userController.create);

// PATCH /api/users/:id
router.patch('/:id', validate(updateUserSchema), userController.update);

// DELETE /api/users/:id
router.delete('/:id', userController.delete);

export default router;
