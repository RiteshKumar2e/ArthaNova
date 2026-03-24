import express from 'express';
import * as portfolioController from '../controllers/portfolioController.js';
import { authenticate } from '../middlewares/auth.js';

const router = express.Router();

router.get('/', authenticate, portfolioController.getPortfolio);
router.post('/holdings', authenticate, portfolioController.addHolding);
router.delete('/holdings/:id', authenticate, portfolioController.removeHolding);
router.get('/analytics', authenticate, portfolioController.getPortfolioAnalytics);

export default router;
