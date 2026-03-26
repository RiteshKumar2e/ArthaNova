import express from 'express';
import { authenticate } from '../middlewares/auth.js';
import * as aiController from '../controllers/aiController.js';
import groqService from '../services/groqService.js';

const router = express.Router();


router.post('/chat', authenticate, async (req, res) => {
  try {
    const { prompt, message, history = [], session_id } = req.body;
    const userMessage = prompt || message;
    
    if (!userMessage) {
      return res.status(400).json({ error: "Prompt or message is required" });
    }

    const sessionId = session_id || "sess_" + Math.random().toString(36).slice(-8);
    
    // Call real Groq service
    const aiResponse = await groqService.chat(userMessage, history);

    res.json({
      id: "msg_" + Math.random().toString(36).slice(-8),
      session_id: sessionId,
      role: "assistant",
      content: aiResponse.content,
      sources: [],
      created_at: aiResponse.timestamp,
      status: "delivered"
    });
  } catch (error) {
    console.error("AI Chat Error:", error.message);
    res.status(500).json({ 
      error: "AI Engine Error", 
      detail: error.message 
    });
  }
});


router.get('/chat/sessions', authenticate, async (req, res) => {
  res.json([
    { id: "sess_demo_1", title: "Portfolio Risk Analysis", created_at: new Date().toISOString() },
    { id: "sess_demo_2", title: "Dividend Stock Search", created_at: new Date().toISOString() }
  ]);
});

router.delete('/chat/sessions/:id', authenticate, async (req, res) => {
  res.json({ success: true, message: `Session ${req.params.id} deleted` });
});

router.delete('/chat/sessions/:id/clear', authenticate, async (req, res) => {
  res.json({ success: true, message: `Session ${req.params.id} cleared` });
});

router.delete('/chat/messages/:id', authenticate, async (req, res) => {
  res.json({ success: true, message: `Message ${req.params.id} deleted` });
});


router.get('/opportunity-radar', authenticate, aiController.getOpportunityRadar);

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
router.get('/chart-patterns/:symbol', authenticate, aiController.getChartPatterns);

export default router;

