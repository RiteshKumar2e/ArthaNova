import express from 'express';
import * as stocksController from '../controllers/stocksController.js';

const router = express.Router();

router.get('/', stocksController.listStocks);
router.get('/market-overview', stocksController.getMarketOverview);
router.get('/sectors', stocksController.getSectors);
router.get('/:symbol', stocksController.getStockDetail);
router.get('/:symbol/ohlcv', stocksController.getStockOHLCV);
router.get('/:symbol/technicals', stocksController.getStockTechnicals);

export default router;
