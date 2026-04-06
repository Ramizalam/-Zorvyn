import { Router } from 'express';
import { dashboardController } from './dashboard.controller';
import { authenticate } from '../../middleware/authenticate';
import { authorize } from '../../middleware/authorize';

const router = Router();

router.use(authenticate);

// GET /api/dashboard/summary — all roles
router.get('/summary', authorize('VIEWER', 'ANALYST', 'ADMIN'), dashboardController.getSummary);

// GET /api/dashboard/categories — all roles
router.get(
    '/categories',
    authorize('VIEWER', 'ANALYST', 'ADMIN'),
    dashboardController.getCategoryTotals
);

// GET /api/dashboard/recent?limit=10 — all roles
router.get(
    '/recent',
    authorize('VIEWER', 'ANALYST', 'ADMIN'),
    dashboardController.getRecentActivity
);

// GET /api/dashboard/trends?year=2026 — ANALYST and ADMIN only
router.get('/trends', authorize('ANALYST', 'ADMIN'), dashboardController.getMonthlyTrends);

export default router;
