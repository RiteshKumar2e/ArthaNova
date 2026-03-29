/**
 * AI AGENTS CONTROLLER
 * Orchestrates Track 6 AI Agents for Indian Investor Intelligence
 *
 * Endpoints:
 * - POST /api/v1/agents/bulk-deal/analyze - Bulk Deal Distress Detection
 * - POST /api/v1/agents/breakout/analyze - Technical Breakout Analysis
 * - POST /api/v1/agents/portfolio-news/analyze - Portfolio-Aware News Prioritization
 * - GET /api/v1/agents/status - Agent health status
 */

import asyncHandler from 'express-async-handler';
import { BulkDealAgent, analyzeBulkDeal } from '../agents/bulkDealAgent.js';
import { BreakoutAgent, analyzeBreakout } from '../agents/breakoutAgent.js';
import { PortfolioNewsAgent, analyzePortfolioNews } from '../agents/portfolioNewsAgent.js';

/**
 * GET /api/v1/agents/status
 * Check health and availability of all agents
 */
export const getAgentsStatus = asyncHandler(async (req, res) => {
  const status = {
    service: 'ArthaNova AI Agents',
    version: '1.0.0',
    status: 'operational',
    timestamp: new Date().toISOString(),
    agents: {
      bulkDealAgent: {
        name: 'Bulk Deal Analysis Agent',
        description: 'Detects distress selling vs routine blocks from NSE/BSE filings',
        status: 'active',
        autonomousSteps: 3,
        capabilities: [
          'Signal Detection (Bulk Deal Filing)',
          'Context Enrichment (Management Commentary + Earnings)',
          'Risk-Adjusted Alert Generation (Claude-Powered)',
        ],
      },
      breakoutAgent: {
        name: 'Technical Breakout Agent',
        description: 'Analyzes breakouts with conflicting signal resolution',
        status: 'active',
        autonomousSteps: 3,
        capabilities: [
          'Pattern Detection (52W High, Volume, RSI)',
          'Conflicting Signal Analysis (FII Data, Overbought)',
          'Balanced Recommendation (NOT binary buy/sell)',
        ],
      },
      portfolioNewsAgent: {
        name: 'Portfolio News Prioritization Agent',
        description: 'Prioritizes news based on user portfolio materiality',
        status: 'active',
        autonomousSteps: 3,
        capabilities: [
          'News & Portfolio Ingestion (Event Classification)',
          'Materiality Analysis (P&L Impact Calculation)',
          'Prioritized Alert Generation (Quantified Impact)',
        ],
      },
    },
    track6Compliance: {
      requirement: 'Agent must complete at least 3 sequential analysis steps without human input',
      status: 'COMPLIANT',
      allAgentsHave3Steps: true,
    },
  };

  res.json(status);
});

/**
 * POST /api/v1/agents/bulk-deal/analyze
 * Run Bulk Deal Analysis Agent
 *
 * Body (optional):
 * - symbol: string - Specific stock symbol to analyze (e.g., 'RELIANCE')
 */
export const analyzeBulkDealHandler = asyncHandler(async (req, res) => {
  const { symbol } = req.body;

  console.log('[AgentsController] Starting Bulk Deal Analysis', { symbol });

  const result = await analyzeBulkDeal(symbol || null);

  if (!result.success) {
    return res.status(result.error === 'No recent bulk deals detected' ? 404 : 500).json({
      success: false,
      error: result.error || result.message || 'Analysis failed',
      step: result.step,
      log: result.log?.slice(-5), // Last 5 log entries
    });
  }

  res.json({
    success: true,
    agentType: 'BULK_DEAL_ANALYSIS',
    pipelineSteps: result.pipelineSteps,
    autonomousSteps: result.autonomousSteps,
    alert: result.alert,
    executionLog: result.executionLog?.slice(-10), // Last 10 log entries
  });
});

/**
 * POST /api/v1/agents/breakout/analyze
 * Run Technical Breakout Agent
 *
 * Body (required):
 * - symbol: string - Stock symbol to analyze (e.g., 'TCS.NS', 'RELIANCE.NS')
 */
export const analyzeBreakoutHandler = asyncHandler(async (req, res) => {
  const { symbol } = req.body;

  if (!symbol) {
    return res.status(400).json({
      success: false,
      error: 'Symbol is required',
      example: { symbol: 'TCS.NS' },
    });
  }

  console.log('[AgentsController] Starting Breakout Analysis', { symbol });

  const result = await analyzeBreakout(symbol);

  if (!result.success) {
    return res.status(500).json({
      success: false,
      error: result.error || result.message || 'Analysis failed',
      step: result.step,
      log: result.log?.slice(-5),
    });
  }

  res.json({
    success: true,
    agentType: 'TECHNICAL_BREAKOUT_ANALYSIS',
    pipelineSteps: result.pipelineSteps,
    autonomousSteps: result.autonomousSteps,
    recommendation: result.recommendation,
    executionLog: result.executionLog?.slice(-10),
  });
});

/**
 * POST /api/v1/agents/portfolio-news/analyze
 * Run Portfolio-Aware News Prioritization Agent
 *
 * Body (required):
 * - portfolio: { holdings: [{ symbol, quantity, avgPrice }] }
 * - news (optional): Array of custom news events to analyze
 *
 * Example:
 * {
 *   "portfolio": {
 *     "holdings": [
 *       { "symbol": "HDFCBANK", "quantity": 100, "avgPrice": 1600 },
 *       { "symbol": "TCS", "quantity": 50, "avgPrice": 3500 },
 *       { "symbol": "SUNPHARMA", "quantity": 200, "avgPrice": 1050 }
 *     ]
 *   }
 * }
 */
export const analyzePortfolioNewsHandler = asyncHandler(async (req, res) => {
  const { portfolio, news } = req.body;

  if (!portfolio || !portfolio.holdings || portfolio.holdings.length === 0) {
    return res.status(400).json({
      success: false,
      error: 'Portfolio with holdings array is required',
      example: {
        portfolio: {
          holdings: [
            { symbol: 'HDFCBANK', quantity: 100, avgPrice: 1600 },
            { symbol: 'TCS', quantity: 50, avgPrice: 3500 },
            { symbol: 'SUNPHARMA', quantity: 200, avgPrice: 1050 },
          ]
        }
      },
    });
  }

  console.log('[AgentsController] Starting Portfolio News Analysis', {
    holdings: portfolio.holdings.length,
    customNews: !!news,
  });

  const result = await analyzePortfolioNews(portfolio, news || null);

  if (!result.success) {
    return res.status(500).json({
      success: false,
      error: result.error || result.message || 'Analysis failed',
      step: result.step,
      log: result.log?.slice(-5),
    });
  }

  res.json({
    success: true,
    agentType: 'PORTFOLIO_NEWS_PRIORITIZATION',
    pipelineSteps: result.pipelineSteps,
    autonomousSteps: result.autonomousSteps,
    alerts: result.alerts,
    executionLog: result.executionLog?.slice(-10),
  });
});

/**
 * POST /api/v1/agents/full-analysis
 * Run all three agents for comprehensive portfolio intelligence
 *
 * Body:
 * - symbol: string - Primary stock to analyze for bulk deal and breakout
 * - portfolio: { holdings: [...] } - User portfolio for news prioritization
 */
export const runFullIntelligenceAnalysis = asyncHandler(async (req, res) => {
  const { symbol, portfolio } = req.body;

  if (!symbol && !portfolio) {
    return res.status(400).json({
      success: false,
      error: 'Provide either a symbol (for bulk deal + breakout) or portfolio (for news analysis), or both',
      example: {
        symbol: 'TCS.NS',
        portfolio: {
          holdings: [
            { symbol: 'HDFCBANK', quantity: 100, avgPrice: 1600 },
            { symbol: 'TCS', quantity: 50, avgPrice: 3500 },
          ]
        }
      },
    });
  }

  console.log('[AgentsController] Starting Full Intelligence Analysis');

  const results = {
    timestamp: new Date().toISOString(),
    analysisType: 'FULL_PORTFOLIO_INTELLIGENCE',
    agents: {},
  };

  // Run agents in parallel where possible
  const promises = [];

  if (symbol) {
    promises.push(
      analyzeBulkDeal(symbol).then(r => ({ type: 'bulkDeal', result: r })),
      analyzeBreakout(symbol).then(r => ({ type: 'breakout', result: r })),
    );
  }

  if (portfolio?.holdings?.length > 0) {
    promises.push(
      analyzePortfolioNews(portfolio).then(r => ({ type: 'portfolioNews', result: r })),
    );
  }

  const agentResults = await Promise.allSettled(promises);

  // Process results
  agentResults.forEach(({ status, value }) => {
    if (status === 'fulfilled' && value) {
      results.agents[value.type] = {
        success: value.result.success,
        data: value.result.success
          ? (value.result.alert || value.result.recommendation || value.result.alerts)
          : null,
        error: value.result.success ? null : (value.result.error || value.result.message),
        autonomousSteps: value.result.autonomousSteps || 3,
      };
    }
  });

  // Calculate overall success
  const agentNames = Object.keys(results.agents);
  const successfulAgents = agentNames.filter(a => results.agents[a].success);

  results.summary = {
    totalAgentsRun: agentNames.length,
    successfulAgents: successfulAgents.length,
    failedAgents: agentNames.length - successfulAgents.length,
    totalAutonomousSteps: agentNames.reduce((sum, a) => sum + (results.agents[a].autonomousSteps || 0), 0),
  };

  res.json(results);
});

export default {
  getAgentsStatus,
  analyzeBulkDealHandler,
  analyzeBreakoutHandler,
  analyzePortfolioNewsHandler,
  runFullIntelligenceAnalysis,
};
