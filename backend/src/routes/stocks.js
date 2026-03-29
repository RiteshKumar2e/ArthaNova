import express from 'express';
import * as stocksController from '../controllers/stocksController.js';
import { apiCache } from '../middlewares/cache.js';

const router = express.Router();

// Cache list endpoint for 60 seconds to reduce load
router.get('/', apiCache(60), stocksController.listStocks);
router.get('/market-overview', apiCache(120), stocksController.getMarketOverview);
router.get('/sectors', apiCache(300), stocksController.getSectors);
router.get('/:symbol', apiCache(60), stocksController.getStockDetail);
router.get('/:symbol/ohlcv', apiCache(60), stocksController.getStockOHLCV);
router.get('/:symbol/technicals', apiCache(60), stocksController.getStockTechnicals);

export default router;
