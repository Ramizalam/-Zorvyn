import bcrypt from 'bcryptjs';
import { prisma } from '../../lib/prisma';
import { CreateUserInput, UpdateUserInput } from './user.schema';
import { Role } from '@prisma/client';

export const userService = {
    async getAllUsers(page = 1, limit = 10, search?: string) {
        const skip = (page - 1) * limit;

        const where = search
            ? {
                OR: [
                    { name: { contains: search, mode: 'insensitive' as const } },
                    { email: { contains: search, mode: 'insensitive' as const } },
                ],
            }
            : {};

        const [users, total] = await prisma.$transaction([
            prisma.user.findMany({
                where,
                skip,
                take: limit,
                select: {
                    id: true,
                    email: true,
                    name: true,
                    role: true,
                    isActive: true,
                    createdAt: true,
                    updatedAt: true,
                },
                orderBy: { createdAt: 'desc' },
            }),
            prisma.user.count({ where }),
        ]);

        return {
            users,
            pagination: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit),
            },
        };
    },

    async getUserById(id: string) {
        const user = await prisma.user.findUnique({
            where: { id },
            select: {
                id: true,
                email: true,
                name: true,
                role: true,
                isActive: true,
                createdAt: true,
                updatedAt: true,
                _count: { select: { records: true } },
            },
        });

        if (!user) {
            const error = new Error('User not found') as Error & { statusCode: number };
            error.statusCode = 404;
            throw error;
        }

        return user;
    },

    async createUser(data: CreateUserInput) {
        const existing = await prisma.user.findUnique({ where: { email: data.email } });
        if (existing) {
            const error = new Error('A user with this email already exists') as Error & { statusCode: number };
            error.statusCode = 409;
            throw error;
        }

        const hashedPassword = await bcrypt.hash(data.password, 12);
        return prisma.user.create({
            data: {
                email: data.email,
                name: data.name,
                password: hashedPassword,
                role: data.role as Role,
            },
            select: { id: true, email: true, name: true, role: true, isActive: true, createdAt: true },
        });
    },

    async updateUser(id: string, data: UpdateUserInput) {
        await userService.getUserById(id); // throws 404 if not found

        return prisma.user.update({
            where: { id },
            data: {
                ...(data.name && { name: data.name }),
                ...(data.role && { role: data.role as Role }),
                ...(data.isActive !== undefined && { isActive: data.isActive }),
            },
            select: { id: true, email: true, name: true, role: true, isActive: true, updatedAt: true },
        });
    },

    async deleteUser(id: string) {
        await userService.getUserById(id); // throws 404 if not found
        await prisma.user.delete({ where: { id } });
        return { deleted: true };
    },
};
