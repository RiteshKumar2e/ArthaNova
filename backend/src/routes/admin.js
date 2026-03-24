import express from 'express';
import { authenticate, adminOnly } from '../middlewares/auth.js';

const router = express.Router();

router.get('/stats', authenticate, adminOnly, (req, res) => {
  res.json({
    total_users: 154,
    active_users: 86,
    total_portfolios: 120,
    api_calls_24h: 4520,
    system_health: "Optimal",
  });
});

router.get('/users', authenticate, adminOnly, async (req, res) => {
  // Logic already exists in userController, but this is for admin listing
  res.json([]);
});

export default router;
