import { prisma } from '../../lib/prisma';

export const dashboardService = {
    async getSummary() {
        const [incomeResult, expenseResult, recentCount] = await prisma.$transaction([
            prisma.financialRecord.aggregate({
                where: { isDeleted: false, type: 'INCOME' },
                _sum: { amount: true },
                _count: true,
            }),
            prisma.financialRecord.aggregate({
                where: { isDeleted: false, type: 'EXPENSE' },
                _sum: { amount: true },
                _count: true,
            }),
            prisma.financialRecord.count({ where: { isDeleted: false } }),
        ]);

        const totalIncome = Number(incomeResult._sum.amount ?? 0);
        const totalExpenses = Number(expenseResult._sum.amount ?? 0);

        return {
            totalIncome,
            totalExpenses,
            netBalance: totalIncome - totalExpenses,
            incomeCount: incomeResult._count,
            expenseCount: expenseResult._count,
            recordCount: recentCount,
        };
    },

    async getCategoryTotals() {
        const records = await prisma.financialRecord.findMany({
            where: { isDeleted: false },
            select: { category: true, type: true, amount: true },
        });

        const totals: Record<string, { income: number; expense: number; net: number }> = {};

        for (const record of records) {
            if (!totals[record.category]) {
                totals[record.category] = { income: 0, expense: 0, net: 0 };
            }
            const amount = Number(record.amount);
            if (record.type === 'INCOME') {
                totals[record.category].income += amount;
            } else {
                totals[record.category].expense += amount;
            }
            totals[record.category].net = totals[record.category].income - totals[record.category].expense;
        }

        return Object.entries(totals).map(([category, values]) => ({
            category,
            ...values,
        }));
    },

    async getRecentActivity(limit = 10) {
        return prisma.financialRecord.findMany({
            where: { isDeleted: false },
            orderBy: { createdAt: 'desc' },
            take: Math.min(limit, 50),
            select: {
                id: true,
                amount: true,
                type: true,
                category: true,
                date: true,
                notes: true,
                createdAt: true,
                createdBy: { select: { name: true } },
            },
        });
    },

    async getMonthlyTrends(year: number) {
        const startDate = new Date(year, 0, 1);
        const endDate = new Date(year, 11, 31, 23, 59, 59);

        const records = await prisma.financialRecord.findMany({
            where: {
                isDeleted: false,
                date: { gte: startDate, lte: endDate },
            },
            select: { amount: true, type: true, date: true },
        });

        const months = Array.from({ length: 12 }, (_, i) => ({
            month: i + 1,
            monthName: new Date(year, i, 1).toLocaleString('default', { month: 'long' }),
            income: 0,
            expense: 0,
            net: 0,
        }));

        for (const record of records) {
            const month = record.date.getMonth(); // 0-indexed
            const amount = Number(record.amount);
            if (record.type === 'INCOME') {
                months[month].income += amount;
            } else {
                months[month].expense += amount;
            }
            months[month].net = months[month].income - months[month].expense;
        }

        return { year, months };
    },
};
