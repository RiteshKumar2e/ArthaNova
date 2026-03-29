/**
 * AI AGENTS ROUTES
 * Track 6: AI for the Indian Investor
 *
 * Routes:
 * GET  /api/v1/agents/status - Check agent health
 * POST /api/v1/agents/bulk-deal/analyze - Bulk deal distress detection
 * POST /api/v1/agents/breakout/analyze - Technical breakout analysis
 * POST /api/v1/agents/portfolio-news/analyze - Portfolio news prioritization
 * POST /api/v1/agents/full-analysis - Run all agents
 */

import express from 'express';
import {
  getAgentsStatus,
  analyzeBulkDealHandler,
  analyzeBreakoutHandler,
  analyzePortfolioNewsHandler,
  runFullIntelligenceAnalysis,
} from '../controllers/agentsController.js';

const router = express.Router();

/**
 * @route   GET /api/v1/agents/status
 * @desc    Get status and capabilities of all AI agents
 * @access  Public
 */
router.get('/status', getAgentsStatus);

/**
 * @route   POST /api/v1/agents/bulk-deal/analyze
 * @desc    Run Bulk Deal Analysis Agent (3-step autonomous)
 * @body    { symbol?: string }
 * @access  Public
 *
 * Example: POST /api/v1/agents/bulk-deal/analyze
 * Body: { "symbol": "RELIANCE" }
 *
 * Pipeline:
 * 1. DETECT: Retrieve bulk deal filing from NSE/BSE
 * 2. ENRICH: Cross-reference management commentary + earnings
 * 3. ALERT: Generate risk-adjusted alert with specific action
 */
router.post('/bulk-deal/analyze', analyzeBulkDealHandler);

/**
 * @route   POST /api/v1/agents/breakout/analyze
 * @desc    Run Technical Breakout Agent (3-step autonomous)
 * @body    { symbol: string }
 * @access  Public
 *
 * Example: POST /api/v1/agents/breakout/analyze
 * Body: { "symbol": "TCS.NS" }
 *
 * Pipeline:
 * 1. DETECT: Identify breakout pattern (52-week high, volume)
 * 2. ANALYZE: Surface conflicting signals (RSI overbought, FII)
 * 3. RECOMMEND: Balanced, data-backed recommendation
 */
router.post('/breakout/analyze', analyzeBreakoutHandler);

/**
 * @route   POST /api/v1/agents/portfolio-news/analyze
 * @desc    Run Portfolio-Aware News Prioritization Agent (3-step autonomous)
 * @body    { portfolio: { holdings: [{ symbol, quantity, avgPrice }] }, news?: Array }
 * @access  Public
 *
 * Example: POST /api/v1/agents/portfolio-news/analyze
 * Body: {
 *   "portfolio": {
 *     "holdings": [
 *       { "symbol": "HDFCBANK", "quantity": 100, "avgPrice": 1600 },
 *       { "symbol": "TCS", "quantity": 50, "avgPrice": 3500 },
 *       { "symbol": "SUNPHARMA", "quantity": 200, "avgPrice": 1050 }
 *     ]
 *   }
 * }
 *
 * Pipeline:
 * 1. INGEST: Retrieve breaking news and portfolio holdings
 * 2. ANALYZE: Calculate financial materiality for each holding
 * 3. PRIORITIZE: Generate prioritized alerts with P&L impact
 */
router.post('/portfolio-news/analyze', analyzePortfolioNewsHandler);

/**
 * @route   POST /api/v1/agents/full-analysis
 * @desc    Run all three agents for comprehensive analysis
 * @body    { symbol: string, portfolio: { holdings: [...] } }
 * @access  Public
 *
 * Example: POST /api/v1/agents/full-analysis
 * Body: {
 *   "symbol": "TCS.NS",
 *   "portfolio": {
 *     "holdings": [
 *       { "symbol": "HDFCBANK", "quantity": 100, "avgPrice": 1600 },
 *       { "symbol": "TCS", "quantity": 50, "avgPrice": 3500 }
 *     ]
 *   }
 * }
 */
router.post('/full-analysis', runFullIntelligenceAnalysis);

export default router;
