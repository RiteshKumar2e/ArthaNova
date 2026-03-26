import express from 'express';
import authRouter from './auth.js';
import stocksRouter from './stocks.js';
import userRouter from './user.js';
import portfolioRouter from './portfolio.js';
import aiEngineRouter from './ai-engine.js';
import adminRouter from './admin.js';
import googleOtpAuthRouter from './google-otp-auth.js';
import { newsRouter, ipoRouter, insiderRouter, dealsRouter, stockRouter } from './marketData.js';
import backtestRouter from './backtest.js';
import { apiCache } from '../middlewares/cache.js';

const apiRouter = express.Router();

// Routers
apiRouter.use('/auth_debug', authRouter);
apiRouter.use('/auth/google', googleOtpAuthRouter);
// Apply 5 minute cache to all stock queries
apiRouter.use('/stocks', apiCache(300), stocksRouter);
apiRouter.use('/users', userRouter);
apiRouter.use('/portfolio', portfolioRouter);
apiRouter.use('/ai', aiEngineRouter);
apiRouter.use('/news', apiCache(300), newsRouter);
apiRouter.use('/ipo', ipoRouter);
apiRouter.use('/insider', insiderRouter);
apiRouter.use('/deals', dealsRouter);
// Apply cache to market data API wrapper
apiRouter.use('/market-data', apiCache(300), stockRouter);
apiRouter.use('/admin', adminRouter);
apiRouter.use('/alerts', (req, res) => res.json({ message: 'Alerts Router Placeholder' }));
apiRouter.use('/backtest', backtestRouter);
apiRouter.use('/watchlist', (req, res) => res.json({ message: 'Watchlist Router Placeholder' }));
apiRouter.use('/notifications', (req, res) => res.json([]));

export default apiRouter;
