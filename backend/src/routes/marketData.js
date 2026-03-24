import express from 'express';
import * as marketDataController from '../controllers/marketDataController.js';
import * as stocksController from '../controllers/stocksController.js';

const newsRouter = express.Router();
newsRouter.get('/', marketDataController.getNews);
newsRouter.get('/sentiment-summary', marketDataController.getSentimentSummary);

const ipoRouter = express.Router();
ipoRouter.get('/', marketDataController.getIpos);
ipoRouter.get('/:ipo_id', marketDataController.getIpoDetail);

const insiderRouter = express.Router();
insiderRouter.get('/', marketDataController.getInsiderTrades);

const dealsRouter = express.Router();
dealsRouter.get('/', marketDataController.getDeals);

const stockRouter = express.Router();
stockRouter.get('/market-overview', stocksController.getMarketOverview);
stockRouter.get('/sectors', stocksController.getSectors);
stockRouter.get('/quote/:symbol', stocksController.getStockDetail);
// Added others as needed by frontend

export { newsRouter, ipoRouter, insiderRouter, dealsRouter, stockRouter };
