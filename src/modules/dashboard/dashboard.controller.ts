import { Request, Response } from 'express';
import { dashboardService } from './dashboard.service';
import { sendSuccess } from '../../utils/apiResponse';
import { asyncHandler } from '../../utils/asyncHandler';

export const dashboardController = {
    getSummary: asyncHandler(async (_req: Request, res: Response) => {
        const summary = await dashboardService.getSummary();
        sendSuccess(res, summary, 'Dashboard summary');
    }),

    getCategoryTotals: asyncHandler(async (_req: Request, res: Response) => {
        const categories = await dashboardService.getCategoryTotals();
        sendSuccess(res, categories, 'Category totals');
    }),

    getRecentActivity: asyncHandler(async (req: Request, res: Response) => {
        const limit = parseInt(req.query.limit as string) || 10;
        const activity = await dashboardService.getRecentActivity(limit);
        sendSuccess(res, activity, 'Recent activity');
    }),

    getMonthlyTrends: asyncHandler(async (req: Request, res: Response) => {
        const year = parseInt(req.query.year as string) || new Date().getFullYear();
        const trends = await dashboardService.getMonthlyTrends(year);
        sendSuccess(res, trends, `Monthly trends for ${year}`);
    }),
};
