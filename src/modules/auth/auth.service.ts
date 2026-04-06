import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { prisma } from '../../lib/prisma.js';
import { RegisterInput, LoginInput } from './auth.schema.js';
import type { Role } from '../../generated/prisma/enums.js';


export const authService = {
    async register(data: RegisterInput) {
        const existingUser = await prisma.user.findUnique({ where: { email: data.email } });
        if (existingUser) {
            const error = new Error('A user with this email already exists') as Error & { statusCode: number };
            error.statusCode = 409;
            throw error;
        }

        const hashedPassword = await bcrypt.hash(data.password, 12);

        const user = await prisma.user.create({
            data: {
                email: data.email,
                name: data.name,
                password: hashedPassword,
                role: (data.role as Role) ?? 'VIEWER',
            },
            select: { id: true, email: true, name: true, role: true, createdAt: true },
        });

        const token = generateToken(user.id, user.role);
        return { user, token };
    },

    async login(data: LoginInput) {
        const user = await prisma.user.findUnique({ where: { email: data.email } });

        if (!user) {
            const error = new Error('Invalid email or password') as Error & { statusCode: number };
            error.statusCode = 401;
            throw error;
        }

        if (!user.isActive) {
            const error = new Error('Account is deactivated. Please contact an administrator.') as Error & { statusCode: number };
            error.statusCode = 403;
            throw error;
        }

        const isPasswordValid = await bcrypt.compare(data.password, user.password);
        if (!isPasswordValid) {
            const error = new Error('Invalid email or password') as Error & { statusCode: number };
            error.statusCode = 401;
            throw error;
        }

        const token = generateToken(user.id, user.role);
        const { password: _, ...userWithoutPassword } = user;

        return { user: userWithoutPassword, token };
    },
};

function generateToken(userId: string, role: string): string {
    const secret = process.env.JWT_SECRET!;
    const expiresIn = process.env.JWT_EXPIRES_IN || '7d';
    return jwt.sign({ userId, role }, secret, { expiresIn } as jwt.SignOptions);
}
