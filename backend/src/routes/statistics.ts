import express from 'express';
import * as statisticsController from '../controllers/statisticsController';
import { authenticateJWT } from '../middlewares/authMiddleware';

const router = express.Router();

// Helper to wrap async controllers and forward errors
function wrap(fn: any) {
  return (req: any, res: any, next: any) => Promise.resolve(fn(req, res)).catch(next);
}

// Get financial statistics with filtering (admin only)
router.get('/financial', authenticateJWT, wrap(statisticsController.getFinancialStatistics));

// Get sales summary for dashboard (admin only)
router.get('/sales-summary', authenticateJWT, wrap(statisticsController.getSalesSummary));

export default router;
