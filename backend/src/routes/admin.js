import express from 'express';
import { authenticate, adminOnly } from '../middlewares/auth.js';
import * as videoGenerationService from '../services/videoGenerationService.js';

const router = express.Router();

// Dashboard stats endpoint - returns stats with proper structure
router.get('/dashboard/stats', authenticate, adminOnly, (req, res) => {
  res.json({
    users: {
      total: 154,
      active: 86,
      new_today: 5
    },
    system: {
      api_requests_24h: 4520,
      uptime: '99.8%',
      health: "Optimal"
    },
    alerts: {
      ai_signals_generated: 47,
      active_alerts: 12,
      resolved_today: 8
    }
  });
});

// Legacy stats endpoint for backward compatibility
router.get('/stats', authenticate, adminOnly, (req, res) => {
  res.json({
    total_users: 154,
    active_users: 86,
    total_portfolios: 120,
    api_calls_24h: 4520,
    system_health: "Optimal",
  });
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

router.get('/ai/audit-trail', authenticate, adminOnly, (req, res) => {
  res.json({
    entries: [
      { timestamp: new Date().toISOString(), agent: 'SentimentAgent', action: 'GENERATED_SIGNAL', status: 'SUCCESS' },
      { timestamp: new Date(Date.now() - 60000).toISOString(), agent: 'TechnicalAgent', action: 'ANALYSIS_COMPLETE', status: 'SUCCESS' },
      { timestamp: new Date(Date.now() - 120000).toISOString(), agent: 'NewsAgent', action: 'FETCHED_ARTICLES', status: 'SUCCESS' }
    ]
  });
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
  // Logic already exists in userController, but this is for admin listing
  res.json([]);
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

// Create new user
router.post('/users', authenticate, adminOnly, async (req, res) => {
  try {
    const { email, full_name, role, risk_profile } = req.body;
    // Mock implementation - would normally interact with database
    res.json({
      id: Math.floor(Math.random() * 10000),
      email,
      full_name,
      role,
      risk_profile,
      is_active: true,
      created_at: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).json({ detail: 'Failed to create user' });
  }
});

// Toggle user status
router.patch('/users/:id/toggle-status', authenticate, adminOnly, async (req, res) => {
  try {
    const { id } = req.params;
    // Mock implementation
    res.json({
      id: parseInt(id),
      is_active: true,
      updated_at: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error toggling user status:', error);
    res.status(500).json({ detail: 'Failed to toggle user status' });
  }
});

export default router;
