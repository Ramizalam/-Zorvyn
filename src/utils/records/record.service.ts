import { prisma } from '../../lib/prisma';
import { CreateRecordInput, UpdateRecordInput } from './record.schema';
import { RecordType, Prisma } from '@prisma/client';

interface RecordFilters {
    type?: string;
    category?: string;
    dateFrom?: string;
    dateTo?: string;
    search?: string;
    page?: number;
    limit?: number;
}

export const recordService = {
    async createRecord(data: CreateRecordInput, userId: string) {
        return prisma.financialRecord.create({
            data: {
                amount: data.amount,
                type: data.type as RecordType,
                category: data.category,
                date: new Date(data.date),
                notes: data.notes,
                createdById: userId,
            },
            include: {
                createdBy: { select: { id: true, name: true, email: true } },
            },
        });
    },

    async getRecords(filters: RecordFilters = {}) {
        const { type, category, dateFrom, dateTo, search, page = 1, limit = 10 } = filters;
        const skip = (page - 1) * Math.min(limit, 100);
        const take = Math.min(limit, 100);

        const where: Prisma.FinancialRecordWhereInput = {
            isDeleted: false,
            ...(type && { type: type as RecordType }),
            ...(category && { category: { contains: category, mode: 'insensitive' } }),
            ...(dateFrom || dateTo
                ? {
                    date: {
                        ...(dateFrom && { gte: new Date(dateFrom) }),
                        ...(dateTo && { lte: new Date(dateTo) }),
                    },
                }
                : {}),
            ...(search && {
                OR: [
                    { notes: { contains: search, mode: 'insensitive' } },
                    { category: { contains: search, mode: 'insensitive' } },
                ],
            }),
        };

        const [records, total] = await prisma.$transaction([
            prisma.financialRecord.findMany({
                where,
                skip,
                take,
                orderBy: { date: 'desc' },
                include: { createdBy: { select: { id: true, name: true } } },
            }),
            prisma.financialRecord.count({ where }),
        ]);

        return {
            records,
            pagination: {
                total,
                page,
                limit: take,
                totalPages: Math.ceil(total / take),
            },
        };
    },

    async getRecordById(id: string) {
        const record = await prisma.financialRecord.findFirst({
            where: { id, isDeleted: false },
            include: { createdBy: { select: { id: true, name: true, email: true } } },
        });

        if (!record) {
            const error = new Error('Record not found') as Error & { statusCode: number };
            error.statusCode = 404;
            throw error;
        }

        return record;
    },

    async updateRecord(id: string, data: UpdateRecordInput) {
        await recordService.getRecordById(id); // throws 404 if not found

        return prisma.financialRecord.update({
            where: { id },
            data: {
                ...(data.amount !== undefined && { amount: data.amount }),
                ...(data.type && { type: data.type as RecordType }),
                ...(data.category && { category: data.category }),
                ...(data.date && { date: new Date(data.date) }),
                ...(data.notes !== undefined && { notes: data.notes }),
            },
            include: { createdBy: { select: { id: true, name: true } } },
        });
    },

    async softDeleteRecord(id: string) {
        await recordService.getRecordById(id); // throws 404 if not found

        await prisma.financialRecord.update({
            where: { id },
            data: { isDeleted: true },
        });

        return { deleted: true, id };
    },
};
