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

const apiRouter = express.Router();

// Routers
apiRouter.use('/auth_debug', authRouter);
apiRouter.use('/auth/google', googleOtpAuthRouter);
apiRouter.use('/stocks', stocksRouter);
apiRouter.use('/users', userRouter);
apiRouter.use('/portfolio', portfolioRouter);
apiRouter.use('/ai', aiEngineRouter);
apiRouter.use('/news', newsRouter);
apiRouter.use('/ipo', ipoRouter);
apiRouter.use('/insider', insiderRouter);
apiRouter.use('/deals', dealsRouter);
apiRouter.use('/market-data', stockRouter); // Python router used /api/v1/market-data prefix for stock_router too

apiRouter.use('/admin', adminRouter);
apiRouter.use('/alerts', (req, res) => res.json({ message: 'Alerts Router Placeholder' }));
apiRouter.use('/backtest', backtestRouter);
apiRouter.use('/watchlist', (req, res) => res.json({ message: 'Watchlist Router Placeholder' }));
apiRouter.use('/notifications', (req, res) => res.json([]));

export default apiRouter;
