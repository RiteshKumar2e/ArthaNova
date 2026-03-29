import express from 'express';
import { authenticate } from '../middlewares/auth.js';
import * as aiController from '../controllers/aiController.js';
import groqService from '../services/groqService.js';
import db from '../models/db.js';

const router = express.Router();


router.post('/chat', authenticate, async (req, res) => {
  try {
    const { prompt, message, history = [], session_id } = req.body;
    const userMessage = prompt || message;
    const userId = req.user?.id;
    
    if (!userMessage) {
      return res.status(400).json({ error: "Prompt or message is required" });
    }

    let sessionId = session_id;
    
    // If no session_id provided, create a new session
    if (!sessionId) {
      sessionId = "sess_" + Math.random().toString(36).slice(-8);
      await db.execute(
        'INSERT INTO chat_sessions (id, user_id, title) VALUES (?, ?, ?)',
        [sessionId, userId, userMessage.slice(0, 50)]
      );
    }
    
    // 1. Save User Message
    const userMsgId = "msg_" + Math.random().toString(36).slice(-8);
    await db.execute(
      'INSERT INTO chat_messages (id, session_id, role, content) VALUES (?, ?, ?, ?)',
      [userMsgId, sessionId, 'user', userMessage]
    );

    // Call real Groq service (portfolio-aware)
    const aiResponse = await groqService.chat(userMessage, history, userId);
    
    // 2. Save AI Message
    const aiMsgId = "msg_" + Math.random().toString(36).slice(-8);
    const orchestrationStr = JSON.stringify({
      agents_used: aiResponse.agents_used || ["GroqAgent"],
      query_type: aiResponse.query_type || "GENERAL",
      routing_confidence: aiResponse.routing_confidence || 0.9,
      execution_time: aiResponse.execution_time || 0,
      agent_responses: aiResponse.agent_responses || {}
    });

    await db.execute(
      'INSERT INTO chat_messages (id, session_id, role, content, sources, orchestration) VALUES (?, ?, ?, ?, ?, ?)',
      [aiMsgId, sessionId, 'assistant', aiResponse.content, JSON.stringify([]), orchestrationStr]
    );

    res.json({
      id: aiMsgId,
      message_id: aiMsgId, // Match frontend expectation
      session_id: sessionId,
      role: "assistant",
      content: aiResponse.content,
      sources: aiResponse.sources || [],
      created_at: new Date().toISOString(),
      status: "delivered",
      user_message_id: userMsgId,
      // Pass orchestration data for frontend visualizer
      ...JSON.parse(orchestrationStr)
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
  try {
    const sessions = await db.query(
      'SELECT id, title, created_at FROM chat_sessions WHERE user_id = ? ORDER BY created_at DESC',
      [req.user.id]
    );
    res.json(sessions);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch sessions" });
  }
});

router.get('/chat/sessions/:id', authenticate, async (req, res) => {
  try {
    const session = await db.queryFirst(
      'SELECT id, title FROM chat_sessions WHERE id = ? AND user_id = ?',
      [req.params.id, req.user.id]
    );
    
    if (!session) {
      return res.status(404).json({ error: "Session not found" });
    }

    const messages = await db.query(
      'SELECT id, role, content, sources, orchestration, created_at FROM chat_messages WHERE session_id = ? ORDER BY created_at ASC',
      [req.params.id]
    );

    // Parse JSON strings back to objects
    const parsedMessages = messages.map(msg => ({
      ...msg,
      sources: msg.sources ? JSON.parse(msg.sources) : [],
      orchestration: msg.orchestration ? JSON.parse(msg.orchestration) : {}
    }));

    res.json({
      session,
      messages: parsedMessages
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch session messages" });
  }
});

router.delete('/chat/sessions/:id', authenticate, async (req, res) => {
  try {
    await db.execute('DELETE FROM chat_sessions WHERE id = ? AND user_id = ?', [req.params.id, req.user.id]);
    res.json({ success: true, message: `Session ${req.params.id} deleted` });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete session" });
  }
});

router.delete('/chat/sessions/:id/clear', authenticate, async (req, res) => {
  try {
    await db.execute('DELETE FROM chat_messages WHERE session_id = ?', [req.params.id]);
    res.json({ success: true, message: `Session ${req.params.id} cleared` });
  } catch (error) {
    res.status(500).json({ error: "Failed to clear session" });
  }
});

router.delete('/chat/messages/:id', authenticate, async (req, res) => {
  try {
    await db.execute('DELETE FROM chat_messages WHERE id = ?', [req.params.id]);
    res.json({ success: true, message: `Message ${req.params.id} deleted` });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete message" });
  }
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

