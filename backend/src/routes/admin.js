import express from 'express';
import { authenticate, adminOnly } from '../middlewares/auth.js';
import * as videoGenerationService from '../services/videoGenerationService.js';
import db from '../models/db.js';

const router = express.Router();

// ─── DASHBOARD & STATS ──────────────────────────────────────────────────────

router.get('/dashboard/stats', authenticate, adminOnly, async (req, res) => {
  try {
    const totalCount = await db.queryFirst('SELECT COUNT(*) as count FROM users');
    const activeCount = await db.queryFirst('SELECT COUNT(*) as count FROM users WHERE is_active = 1');
    const newTodayCount = await db.queryFirst("SELECT COUNT(*) as count FROM users WHERE date(created_at) = date('now')");
    
    // Get real alert counts
    const pendingSignals = await db.queryFirst("SELECT COUNT(*) as count FROM ai_signals WHERE status = 'PENDING'");
    const resolvedToday = await db.queryFirst("SELECT COUNT(*) as count FROM ai_signals WHERE date(created_at) = date('now') AND status != 'PENDING'");

    res.json({
      users: {
        total: totalCount?.count || 0,
        active: activeCount?.count || 0,
        new_today: newTodayCount?.count || 0
      },
      system: {
        api_requests_24h: 4520, 
        uptime: '99.8%',
        health: "Optimal"
      },
      alerts: {
        ai_signals_generated: 47,
        active_alerts: pendingSignals?.count || 0,
        resolved_today: resolvedToday?.count || 0
      }
    });
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    res.status(500).json({ error: 'Failed' });
  }
});

router.get('/stats', authenticate, adminOnly, async (req, res) => {
  try {
    const totalCount = await db.queryFirst('SELECT COUNT(*) as count FROM users');
    const activeCount = await db.queryFirst('SELECT COUNT(*) as count FROM users WHERE is_active = 1');
    
    res.json({
      total_users: totalCount?.count || 0,
      active_users: activeCount?.count || 0,
      total_portfolios: 120,
      api_calls_24h: 4520,
      system_health: "Optimal",
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed' });
  }
});

// ─── AI SYSTEM MONITORING ───────────────────────────────────────────────────

router.get('/ai/system-status', authenticate, adminOnly, async (req, res) => {
  // Semi-dynamic status
  res.json({
    overall_health: 'HEALTHY',
    uptime_percentage: 99.8,
    last_check: new Date().toISOString(),
    circuit_breaker_state: 'CLOSED',
    memory_usage_mb: 234,
    cpu_usage_percent: 42,
    active_agents: 5,
    pending_requests: 12
  });
});

router.get('/ai/agents', authenticate, adminOnly, (req, res) => {
  res.json({
    agents: [
      { id: 1, name: 'SentimentAgent', status: 'ACTIVE', tasks_completed: 342, success_rate: 94.2 },
      { id: 2, name: 'TechnicalAgent', status: 'ACTIVE', tasks_completed: 289, success_rate: 91.5 },
      { id: 3, name: 'FundamentalAgent', status: 'ACTIVE', tasks_completed: 156, success_rate: 88.9 },
      { id: 4, name: 'NewsAgent', status: 'ACTIVE', tasks_completed: 412, success_rate: 96.1 },
      { id: 5, name: 'RiskAgent', status: 'IDLE', tasks_completed: 98, success_rate: 92.3 }
    ]
  });
});

router.get('/ai/audit-trail', authenticate, adminOnly, async (req, res) => {
  try {
    const logs = await db.query('SELECT * FROM audit_logs ORDER BY timestamp DESC LIMIT 50');
    res.json({ 
      entries: Array.isArray(logs) ? logs.map(l => ({
        timestamp: l.timestamp,
        agent: l.email || 'SYSTEM',
        action: l.action,
        status: l.status,
        details: { query_type: l.module }
      })) : [] 
    });
  } catch (error) {
    res.status(500).json({ entries: [] });
  }
});

router.get('/ai/compliance/violations', authenticate, adminOnly, (req, res) => {
  res.json({
    violations: [
      { id: 1, type: 'RISK_THRESHOLD', severity: 'LOW', description: 'High concentration in single sector', timestamp: new Date().toISOString() }
    ]
  });
});

router.get('/ai/metrics/performance', authenticate, adminOnly, (req, res) => {
  res.json({
    metrics: {
      avg_latency_ms: 245,
      latency_history: [
        { time: '10:00', latency: 220 },
        { time: '10:05', latency: 235 },
        { time: '10:10', latency: 245 },
        { time: '10:15', latency: 215 }
      ],
      error_rate: 0.2,
      throughput: 1850
    }
  });
});

// ─── USER MANAGEMENT ────────────────────────────────────────────────────────

router.get('/users', authenticate, adminOnly, async (req, res) => {
  try {
    const users = await db.query('SELECT id, email, full_name, role, is_active, risk_profile, last_login, created_at, updated_at FROM users ORDER BY created_at DESC');
    res.json(Array.isArray(users) ? users : []);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

router.post('/users', authenticate, adminOnly, async (req, res) => {
  try {
    const { email, full_name, role = 'user', risk_profile = 'moderate' } = req.body;
    if (!email || !full_name) return res.status(400).json({ error: 'Missing fields' });

    const existingUser = await db.queryFirst('SELECT id FROM users WHERE email = ?', [email]);
    if (existingUser) return res.status(409).json({ error: 'User exists' });

    const now = new Date().toISOString();
    const result = await db.execute(
      `INSERT INTO users (email, username, full_name, hashed_password, role, risk_profile, is_active, created_at, updated_at) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [email, email.split('@')[0], full_name, 'TEMP_PASS', role, risk_profile, 1, now, now]
    );

    const newUser = await db.queryFirst('SELECT * FROM users WHERE id = ?', [Number(result.lastInsertRowid)]);
    res.status(201).json({ success: true, user: newUser });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.patch('/users/:userId/toggle-status', authenticate, adminOnly, async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await db.queryFirst('SELECT is_active FROM users WHERE id = ?', [userId]);
    if (!user) return res.status(404).json({ error: 'User not found' });

    const newStatus = user.is_active ? 0 : 1;
    await db.execute('UPDATE users SET is_active = ?, updated_at = ? WHERE id = ?', [newStatus, new Date().toISOString(), userId]);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ─── CONTENT MANAGEMENT ─────────────────────────────────────────────────────

router.get('/content', authenticate, adminOnly, async (req, res) => {
  try {
    const content = await db.query('SELECT * FROM content_management ORDER BY created_at DESC');
    res.json(content);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch content' });
  }
});

router.post('/content', authenticate, adminOnly, async (req, res) => {
  try {
    const { title, type, content = 'No content provided' } = req.body;
    await db.execute('INSERT INTO content_management (title, type, content, status) VALUES (?, ?, ?, ?)', [title, type, content, 'DRAFT']);
    res.status(201).json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Failed to create content' });
  }
});

router.delete('/content/:id', authenticate, adminOnly, async (req, res) => {
  try {
    await db.execute('DELETE FROM content_management WHERE id = ?', [req.params.id]);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete content' });
  }
});

router.patch('/content/:id/status', authenticate, adminOnly, async (req, res) => {
  try {
    const item = await db.queryFirst('SELECT status FROM content_management WHERE id = ?', [req.params.id]);
    const nextStatus = item.status === 'DRAFT' ? 'REVIEW' : item.status === 'REVIEW' ? 'PUBLISHED' : 'DRAFT';
    await db.execute('UPDATE content_management SET status = ?, updated_at = ? WHERE id = ?', [nextStatus, new Date().toISOString(), req.params.id]);
    res.json({ success: true, status: nextStatus });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update status' });
  }
});

// ─── STOCK DATA & PIPELINES ─────────────────────────────────────────────────

router.get('/stock-data/status', authenticate, adminOnly, async (req, res) => {
  try {
    const pipelines = await db.query('SELECT * FROM ingestion_pipelines');
    res.json(pipelines);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch pipelines' });
  }
});

router.post('/stock-data/refresh/:pipelineId', authenticate, adminOnly, async (req, res) => {
  try {
    const { pipelineId } = req.params;
    await db.execute("UPDATE ingestion_pipelines SET status = 'SYNCING', updated_at = ? WHERE id = ?", [new Date().toISOString(), pipelineId]);
    
    // Simulate sync
    setTimeout(async () => {
      await db.execute("UPDATE ingestion_pipelines SET status = 'HEALTHY', last_sync = ?, updated_at = ? WHERE id = ?", [new Date().toISOString(), new Date().toISOString(), pipelineId]);
    }, 5000);

    res.json({ success: true, message: 'Sync initialized' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to start refresh' });
  }
});

// ─── ALERTS & SIGNALS ───────────────────────────────────────────────────────

router.get('/ai/signals/pending', authenticate, adminOnly, async (req, res) => {
  try {
    const signals = await db.query("SELECT * FROM ai_signals WHERE status = 'PENDING' ORDER BY created_at DESC");
    res.json(signals);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch signals' });
  }
});

router.post('/ai/signals/:id/action', authenticate, adminOnly, async (req, res) => {
  try {
    const { id } = req.params;
    const { action } = req.body; // 'APPROVE' or 'OVERRIDE'
    const status = action === 'APPROVE' ? 'APPROVED' : 'OVERRIDDEN';
    await db.execute('UPDATE ai_signals SET status = ? WHERE id = ?', [status, id]);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Failed to process signal' });
  }
});

router.get('/ai/logic-switches', authenticate, adminOnly, async (req, res) => {
  try {
    const switches = await db.query('SELECT * FROM logic_switches');
    res.json(switches);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch switches' });
  }
});

router.post('/ai/logic-switches/:id/toggle', authenticate, adminOnly, async (req, res) => {
  try {
    const { id } = req.params;
    const sw = await db.queryFirst('SELECT status FROM logic_switches WHERE id = ?', [id]);
    const nextStatus = sw.status ? 0 : 1;
    await db.execute('UPDATE logic_switches SET status = ?, updated_at = ? WHERE id = ?', [nextStatus, new Date().toISOString(), id]);
    res.json({ success: true, status: nextStatus });
  } catch (error) {
    res.status(500).json({ error: 'Failed to toggle switch' });
  }
});

// ─── SYSTEM SETTINGS ────────────────────────────────────────────────────────

router.get('/settings', authenticate, adminOnly, async (req, res) => {
  try {
    const settings = await db.query('SELECT * FROM system_settings');
    res.json(settings);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch settings' });
  }
});

router.patch('/settings', authenticate, adminOnly, async (req, res) => {
  try {
    const { updates } = req.body; // Array of { key, value }
    for (const update of updates) {
      await db.execute('UPDATE system_settings SET value = ?, updated_at = ? WHERE key = ?', [update.value, new Date().toISOString(), update.key]);
    }
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update settings' });
  }
});

// ─── REPORTS & ANALYTICS ────────────────────────────────────────────────────

router.get('/reports/summary', authenticate, adminOnly, async (req, res) => {
  try {
    const totalUsers = await db.queryFirst('SELECT COUNT(*) as count FROM users');
    const adminUsers = await db.queryFirst("SELECT COUNT(*) as count FROM users WHERE role = 'admin'");
    
    // Distribution calculation
    const total = totalUsers.count || 1;
    const free = Math.round(((total - adminUsers.count) / total) * 100);
    const pro = Math.round((adminUsers.count / total) * 100);

    res.json({
      kpis: [
        { label: 'Platform Reach', value: total, change: '+12%', positive: true },
        { label: 'Avg Session', value: '18m', change: '+5%', positive: true },
        { label: 'Active Alerts', value: 42, change: '-2%', positive: false },
        { label: 'System Health', value: '100%', change: 'Optimal', positive: true }
      ],
      distribution: { free, pro, institutional: 0 },
      topStocks: [
        { symbol: 'RELIANCE', users: 1240, engagement: 'High', sentiment: 'BULLISH' },
        { symbol: 'TCS', users: 890, engagement: 'Medium', sentiment: 'NEUTRAL' },
        { symbol: 'HDFCBANK', users: 750, engagement: 'High', sentiment: 'BULLISH' },
        { symbol: 'INFY', users: 620, engagement: 'Low', sentiment: 'BEARISH' }
      ]
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch report summary' });
  }
});

// ─── AUDIT LOGS ─────────────────────────────────────────────────────────────

router.get('/logs/audit', authenticate, adminOnly, async (req, res) => {
  try {
    const logs = await db.query('SELECT * FROM audit_logs ORDER BY timestamp DESC LIMIT 100');
    res.json(logs);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch audit logs' });
  }
});

// ─── VIDEO ENGINE ───────────────────────────────────────────────────────────

router.get('/video-engine/jobs', authenticate, (req, res) => {
  res.json({ jobs: videoGenerationService.getAllVideoJobs() });
});

router.post('/video-engine/jobs', authenticate, async (req, res) => {
  try {
    const { title, duration = '60s' } = req.body;
    if (!title) return res.status(400).json({ error: 'Title required' });
    const job = await videoGenerationService.createVideoJob(title, duration);
    res.status(201).json({ success: true, job });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/video-engine/jobs/:id', authenticate, (req, res) => {
  const job = videoGenerationService.getVideoJob(req.params.id);
  if (!job) return res.status(404).json({ error: 'Not found' });
  res.json(job);
});

router.delete('/video-engine/jobs/:id', authenticate, adminOnly, (req, res) => {
  const deleted = videoGenerationService.deleteVideoJob(req.params.id);
  if (!deleted) return res.status(404).json({ error: 'Not found' });
  res.json({ success: true });
});

export default router;
