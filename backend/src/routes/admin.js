import express from 'express';
import { authenticate, adminOnly } from '../middlewares/auth.js';
import * as videoGenerationService from '../services/videoGenerationService.js';
import db from '../models/db.js';

const router = express.Router();

// Dashboard stats endpoint - returns stats with proper structure
router.get('/dashboard/stats', authenticate, adminOnly, async (req, res) => {
  try {
    const totalCount = await db.queryFirst('SELECT COUNT(*) as count FROM users');
    const activeCount = await db.queryFirst('SELECT COUNT(*) as count FROM users WHERE is_active = 1');
    const newTodayCount = await db.queryFirst("SELECT COUNT(*) as count FROM users WHERE date(created_at) = date('now')");

    res.json({
      users: {
        total: totalCount?.count || 0,
        active: activeCount?.count || 0,
        new_today: newTodayCount?.count || 0
      },
      system: {
        api_requests_24h: 4520, // Keep as mock for now unless we have a request log
        uptime: '99.8%',
        health: "Optimal"
      },
      alerts: {
        ai_signals_generated: 47,
        active_alerts: 12,
        resolved_today: 8
      }
    });
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    res.status(500).json({ error: 'Failed to fetch dashboard stats' });
  }
});

// Legacy stats endpoint for backward compatibility
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

// AI System monitoring endpoints
router.get('/ai/system-status', authenticate, adminOnly, (req, res) => {
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
    // Ensure the data format matches what the frontend expects (entries: [])
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
    console.error('Audit trail fetch failed:', error);
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

router.get('/users', authenticate, adminOnly, async (req, res) => {
  try {
    // Fetch all users from database with relevant fields
    const users = await db.query(
      `SELECT 
        id, 
        email, 
        full_name, 
        role,
        is_active,
        risk_profile,
        last_login,
        created_at,
        updated_at
       FROM users 
       ORDER BY created_at DESC`
    );

    // Return users or empty array if none found
    res.json(Array.isArray(users) ? users : []);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({
      error: 'Failed to fetch users',
      message: error.message
    });
  }
});

// Create new user (admin only)
router.post('/users', authenticate, adminOnly, async (req, res) => {
  try {
    const { email, full_name, role = 'user', risk_profile = 'moderate' } = req.body;

    // Validation
    if (!email || !full_name) {
      return res.status(400).json({
        error: 'Missing required fields',
        message: 'email and full_name are required'
      });
    }

    // Check if user already exists
    const existingUser = await db.queryFirst('SELECT id FROM users WHERE email = ?', [email]);
    if (existingUser) {
      return res.status(409).json({
        error: 'User already exists',
        message: 'An account with this email already exists'
      });
    }

    // Create new user with temporary password
    const tempPassword = Math.random().toString(36).slice(-10) + 'Temp@123';
    const now = new Date().toISOString();
    
    const result = await db.execute(
      `INSERT INTO users (email, full_name, role, risk_profile, is_active, created_at, updated_at) 
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [email, full_name, role, risk_profile, 1, now, now]
    );

    const newUser = await db.queryFirst(
      'SELECT id, email, full_name, role, is_active, risk_profile, last_login, created_at, updated_at FROM users WHERE id = ?',
      [Number(result.lastInsertRowid)]
    );

    res.status(201).json({
      success: true,
      message: 'User created successfully',
      user: newUser
    });
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).json({
      error: 'Failed to create user',
      message: error.message
    });
  }
});

// Toggle user active status
router.patch('/users/:userId/toggle-status', authenticate, adminOnly, async (req, res) => {
  try {
    const { userId } = req.params;

    // Get current status
    const user = await db.queryFirst('SELECT is_active FROM users WHERE id = ?', [userId]);
    if (!user) {
      return res.status(404).json({
        error: 'User not found',
        message: `User with ID ${userId} does not exist`
      });
    }

    // Toggle status
    const newStatus = user.is_active ? 0 : 1;
    const now = new Date().toISOString();
    
    await db.execute(
      'UPDATE users SET is_active = ?, updated_at = ? WHERE id = ?',
      [newStatus, now, userId]
    );

    const updatedUser = await db.queryFirst(
      'SELECT id, email, full_name, role, is_active, risk_profile, last_login, created_at, updated_at FROM users WHERE id = ?',
      [userId]
    );

    res.json({
      success: true,
      message: 'User status updated',
      user: updatedUser
    });
  } catch (error) {
    console.error('Error toggling user status:', error);
    res.status(500).json({
      error: 'Failed to update user status',
      message: error.message
    });
  }
});

// Audit logs endpoint
router.get('/logs/audit', authenticate, adminOnly, (req, res) => {
  res.json([
    {
      id: 1,
      user: 'admin@arthanova.in',
      action: 'LOGIN',
      details: 'Admin login successful',
      timestamp: new Date(Date.now() - 3600000).toISOString()
    },
    {
      id: 2,
      user: 'demo@arthanova.in',
      action: 'PORTFOLIO_UPDATE',
      details: 'Updated portfolio holdings',
      timestamp: new Date(Date.now() - 7200000).toISOString()
    }
  ]);
});

// Video engine jobs endpoint (accessible to all authenticated users)
router.get('/video-engine/jobs', authenticate, (req, res) => {
  const jobs = videoGenerationService.getAllVideoJobs();
  res.json({ jobs });
});

// Create video engine job
router.post('/video-engine/jobs', authenticate, async (req, res) => {
  try {
    const { title, duration = '60s' } = req.body;

    if (!title) {
      return res.status(400).json({
        error: 'Missing required field',
        message: 'title is required',
      });
    }

    // Create the video job
    const job = await videoGenerationService.createVideoJob(title, duration);

    res.status(201).json({
      success: true,
      message: 'Video generation job created',
      job,
    });
  } catch (error) {
    console.error('❌ Error creating video job:', error.message);
    res.status(500).json({
      error: 'Failed to create video job',
      message: error.message,
    });
  }
});

// Get video job by ID (for polling progress)
router.get('/video-engine/jobs/:id', authenticate, (req, res) => {
  const job = videoGenerationService.getVideoJob(req.params.id);

  if (!job) {
    return res.status(404).json({
      error: 'Not found',
      message: `Video job ${req.params.id} not found`,
    });
  }

  res.json(job);
});

// Delete video engine job
router.delete('/video-engine/jobs/:id', authenticate, adminOnly, (req, res) => {
  try {
    const deleted = videoGenerationService.deleteVideoJob(req.params.id);

    if (!deleted) {
      return res.status(404).json({
        error: 'Not found',
        message: `Video job ${req.params.id} not found`,
      });
    }

    res.json({
      success: true,
      message: `Video job ${req.params.id} deleted`,
    });
  } catch (error) {
    console.error('❌ Error deleting video job:', error.message);
    res.status(500).json({
      error: 'Failed to delete video job',
      message: error.message,
    });
  }
});

export default router;
