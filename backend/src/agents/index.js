/**
 * ArthaNova AI Agents - Module Index
 * Track 6: AI for the Indian Investor
 *
 * Exports all three core agents:
 * 1. BulkDealAgent - Distress selling vs routine block detection
 * 2. BreakoutAgent - Technical breakout with conflicting signal resolution
 * 3. PortfolioNewsAgent - Portfolio-aware news prioritization
 */

export { BulkDealAgent, analyzeBulkDeal } from './bulkDealAgent.js';
export { BreakoutAgent, analyzeBreakout } from './breakoutAgent.js';
export { PortfolioNewsAgent, analyzePortfolioNews } from './portfolioNewsAgent.js';

// Quick reference for available agents
export const AVAILABLE_AGENTS = [
  {
    name: 'BulkDealAgent',
    endpoint: '/api/v1/agents/bulk-deal/analyze',
    description: 'Detects distress selling vs routine blocks from NSE/BSE filings',
    autonomousSteps: 3,
    exampleInput: { symbol: 'RELIANCE' },
  },
  {
    name: 'BreakoutAgent',
    endpoint: '/api/v1/agents/breakout/analyze',
    description: 'Technical breakout analysis with conflicting signal resolution',
    autonomousSteps: 3,
    exampleInput: { symbol: 'TCS.NS' },
  },
  {
    name: 'PortfolioNewsAgent',
    endpoint: '/api/v1/agents/portfolio-news/analyze',
    description: 'Portfolio-aware news prioritization with P&L impact',
    autonomousSteps: 3,
    exampleInput: {
      portfolio: {
        holdings: [
          { symbol: 'HDFCBANK', quantity: 100, avgPrice: 1600 },
          { symbol: 'TCS', quantity: 50, avgPrice: 3500 },
        ]
      }
    },
  },
];
