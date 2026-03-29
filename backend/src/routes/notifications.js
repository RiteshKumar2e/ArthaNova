import express from 'express';
import { authenticate, adminOnly } from '../middlewares/auth.js';
import { apiCache } from '../middlewares/cache.js';
import db from '../models/db.js';

const router = express.Router();

// List user notifications - cached for 15 seconds to reduce DB load
router.get('/', authenticate, apiCache(15), async (req, res) => {
  try {
    const userId = req.user.id;
    // Broadcast + User specific
    const notifications = await db.query(
      'SELECT * FROM notifications WHERE (user_id IS NULL OR user_id = ?) ORDER BY created_at DESC LIMIT 50',
      [userId]
    );
    res.json(notifications || []);
  } catch (error) {
    res.status(500).json({ error: 'Failed' });
  }
});

// Mark as read
router.put('/:id/read', authenticate, async (req, res) => {
  try {
    await db.execute('UPDATE notifications SET is_read = 1 WHERE id = ? AND user_id = ?', [req.params.id, req.user.id]);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Failed' });
  }
});

// Admin list
router.get('/admin/list', authenticate, adminOnly, async (req, res) => {
  try {
    const notifications = await db.query('SELECT * FROM notifications ORDER BY created_at DESC LIMIT 100');
    res.json(notifications || []);
  } catch (error) {
    res.status(500).json({ error: 'Failed' });
  }
});

// Admin send
router.post('/send', authenticate, adminOnly, async (req, res) => {
  try {
    const { title, message, type = 'info', user_id = null } = req.body;
    const now = new Date().toISOString();
    await db.execute(
      'INSERT INTO notifications (user_id, title, message, type, is_read, created_at) VALUES (?, ?, ?, ?, 0, ?)',
      [user_id, title, message, type, now]
    );
    res.status(201).json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Failed' });
  }
});

export default router;
