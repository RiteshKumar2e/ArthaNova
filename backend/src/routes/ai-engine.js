import express from 'express';
import { authenticate } from '../middlewares/auth.js';

const router = express.Router();

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

export default router;
