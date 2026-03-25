import express from 'express';
import { authenticate } from '../middlewares/auth.js';

const router = express.Router();

import * as aiController from '../controllers/aiController.js';

router.post('/chat', authenticate, async (req, res) => {
  // Mock AI Chat
  res.json({
    role: "assistant",
    content: "This is a placeholder for the AI Engine. Once the AI SDK is fully integrated, you will see real responses here.",
    sources: [],
  });
});

router.get('/chat/sessions', authenticate, async (req, res) => {
  res.json([]);
});

router.get('/opportunity-radar', authenticate, async (req, res) => {
  res.json({
    opportunities: [
      { symbol: "RELIANCE", signal: "strong_buy", confidence: 0.85, reason: "Expanding green energy investments" },
      { symbol: "TCS", signal: "hold", confidence: 0.6, reason: "Global tech slowdown" },
    ],
  });
});

router.get('/high-conviction-trades', authenticate, async (req, res) => {
  res.json({
    buy_signals: [
      {
        symbol: "HDFCBANK",
        signal: "BUY",
        confidence: 88.5,
        risk_reward_ratio: 3.2,
        probability: 72,
        entry_range: { min: 1420, max: 1435 },
        target: 1580,
        stop_loss: 1385,
        why_matters: ["Double bottom formation", "Institutional accumulation in progress"],
        multi_agent_justification: {
          "SentimentAgent": { signal: "BUY", reasoning: "Positive social momentum" },
          "TechnicalAgent": { signal: "BUY", reasoning: "RSI reversal from oversold" }
        },
        portfolio_impact: { action: "STRONG ACCUMULATE", diversification_impact: "Increases Banking exposure" },
        generated_at: new Date().toISOString()
      }
    ],
    sell_signals: [],
    confidence_threshold: 80,
    confirmations_required: 2,
    min_rr_ratio: 2.5
  });
});

router.get('/risk-alerts', authenticate, async (req, res) => {
  res.json({
    stock_alerts: [
      {
        symbol: "PAYTM",
        type: "technical_weakness",
        description: "Significant breakdown below support level",
        level: "high",
        action: "REDUCE EXPOSURE",
        why_matters: ["Continuous downward trend", "Strong resistance at 450"],
        multi_agent_justification: {
          "RiskAgent": { reasoning: "Volatility exceedes safety threshold" }
        },
        confidence: 94,
        probability: 88
      }
    ],
    portfolio_risks: [],
    total_alerts: 1,
    alert_status: "ACTIVE",
    generated_at: new Date().toISOString()
  });
});

router.get('/bulk-deal-analysis', authenticate, aiController.getBulkDealAnalysis);
router.get('/technical-breakout-analysis', authenticate, aiController.getTechnicalBreakoutAnalysis);
router.get('/portfolio-news-prioritization', authenticate, aiController.getPortfolioNewsPrioritization);

export default router;
