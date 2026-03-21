import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { useAuthStore } from '../../../store/authStore';
import styles from '../../../styles/pages/app/admin/AdminDashboard.module.scss';

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  
  // AI Monitoring states
  const [systemStatus, setSystemStatus] = useState(null);
  const [agentMetrics, setAgentMetrics] = useState([]);
  const [auditTrail, setAuditTrail] = useState([]);
  const [complianceViolations, setComplianceViolations] = useState([]);
  const [performanceMetrics, setPerformanceMetrics] = useState([]);
  
  const { accessToken } = useAuthStore();

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await axios.get('/api/v1/admin/dashboard/stats', {
          headers: { Authorization: `Bearer ${accessToken}` }
        });
        setStats(response.data);
      } catch (error) {
        console.error('Error fetching admin stats:', error);
      } finally {
        setLoading(false);
      }
    };
    if (accessToken) fetchStats();
  }, [accessToken]);

  // Fetch AI Dashboard Data
  useEffect(() => {
    if (accessToken) {
      fetchAIDashboardData();
      const interval = setInterval(fetchAIDashboardData, 10000);
      return () => clearInterval(interval);
    }
  }, [accessToken]);

  const fetchAIDashboardData = async () => {
    try {
      const headers = { Authorization: `Bearer ${accessToken}` };

      // Fetch each endpoint individually and handle errors per endpoint
      const fetchEndpoint = async (url, errorDefault) => {
        try {
          const response = await fetch(url, { headers });
          if (!response.ok) {
            console.warn(`Failed to fetch ${url}: ${response.status}`);
            return errorDefault;
          }
          return await response.json();
        } catch (err) {
          console.warn(`Error fetching ${url}:`, err);
          return errorDefault;
        }
      };

      const [status, agents, audit, compliance, perf] = await Promise.all([
        fetchEndpoint('/api/v1/admin/ai/status', {}),
        fetchEndpoint('/api/v1/admin/ai/agents', { agents: [] }),
        fetchEndpoint('/api/v1/admin/ai/audit-trail', { entries: [] }),
        fetchEndpoint('/api/v1/admin/ai/compliance/violations', { violations: [] }),
        fetchEndpoint('/api/v1/admin/ai/metrics/performance', { metrics: { latency_history: [] } }),
      ]);

      setSystemStatus(status && typeof status === 'object' ? status : {});
      setAgentMetrics(Array.isArray(agents?.agents) ? agents.agents : []);
      setAuditTrail(Array.isArray(audit?.entries) ? audit.entries : []);
      setComplianceViolations(Array.isArray(compliance?.violations) ? compliance.violations : []);
      setPerformanceMetrics(Array.isArray(perf?.metrics?.latency_history) ? perf.metrics.latency_history : []);
    } catch (error) {
      console.error('Error fetching AI dashboard data:', error);
      // Set safe defaults
      setSystemStatus({});
      setAgentMetrics([]);
      setAuditTrail([]);
      setComplianceViolations([]);
      setPerformanceMetrics([]);
    }
  };

  const getCircuitBreakerColor = (state) => {
    switch (state) {
      case 'CLOSED': return '#10b981';
      case 'OPEN': return '#ef4444';
      case 'HALF_OPEN': return '#f59e0b';
      default: return '#6b7280';
    }
  };

  const ADMIN_STATS = stats ? [
    { label: 'Total Users', value: stats.users.total, change: `+${stats.users.new_today}`, positive: true, icon: '👥' },
    { label: 'API Loads (24h)', value: stats.system.api_requests_24h.toLocaleString(), change: 'Stable', positive: true, icon: '🔥' },
    { label: 'AI Signals Dispatch', value: stats.alerts.ai_signals_generated, change: 'Running', positive: true, icon: '🎯' },
    { label: 'System Uptime', value: stats.system.uptime, change: 'Optimal', positive: true, icon: '⚡' },
  ] : [];

  return (
    <div className={styles.adminDashboard}>
      <div className="page-header" style={{ marginBottom: 32 }}>
        <div>
          <h1 className="page-title">Admin Command Center 🛠️</h1>
          <p className="page-subtitle">Governance, platform health, and AI system oversight.</p>
        </div>
        <div style={{ display: 'flex', gap: 12 }}>
          <Link to="/admin/settings" className="btn btn-secondary btn-sm">⚙️ System Settings</Link>
          <Link to="/admin/users" className="btn btn-primary btn-sm">👥 User Management</Link>
        </div>
      </div>

      {/* Tab Navigation */}
      <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', borderBottom: '1px solid #e5e7eb' }}>
        <button
          onClick={() => setActiveTab('overview')}
          style={{
            padding: '0.75rem 1.5rem',
            background: activeTab === 'overview' ? '#3b82f6' : 'transparent',
            color: activeTab === 'overview' ? 'white' : '#6b7280',
            border: 'none',
            borderBottom: activeTab === 'overview' ? '3px solid #3b82f6' : 'none',
            cursor: 'pointer',
            fontWeight: 600,
          }}
        >
          📊 Platform Overview
        </button>
        <button
          onClick={() => setActiveTab('ai')}
          style={{
            padding: '0.75rem 1.5rem',
            background: activeTab === 'ai' ? '#3b82f6' : 'transparent',
            color: activeTab === 'ai' ? 'white' : '#6b7280',
            border: 'none',
            borderBottom: activeTab === 'ai' ? '3px solid #3b82f6' : 'none',
            cursor: 'pointer',
            fontWeight: 600,
          }}
        >
          🧠 Multi-Agent AI System
        </button>
      </div>

      {/* OVERVIEW TAB */}
      {activeTab === 'overview' && (
        <>
          <div className={styles.statsGrid}>
            {loading ? (
              [1, 2, 3, 4].map(i => (
                <div key={i} className={`${styles.statCard} loading`}>
                  <div className={styles.label}>Loading Stats...</div>
                  <div className={styles.value}>----</div>
                </div>
              ))
            ) : ADMIN_STATS.map((stat) => (
              <div key={stat.label} className={styles.statCard}>
                <div className={styles.iconWrapper}>{stat.icon}</div>
                <div className={styles.label}>{stat.label}</div>
                <div className={styles.value}>{stat.value}</div>
                <div className={`${styles.change} ${stat.positive ? styles.positive : styles.negative}`}>
                  {stat.change}
                </div>
              </div>
            ))}
          </div>

          <div className={styles.contentRow}>
            <div className={styles.card}>
              <div className={styles.cardHeader}>
                <h3>🖥️ System Registry Activity</h3>
                <span className="badge badge-secondary" style={{ fontSize: 10 }}>LIVE FEED</span>
              </div>
              <div className={styles.cardBody} style={{ padding: 0 }}>
                <table className={styles.activityTable}>
                  <thead>
                    <tr>
                      <th>Identity</th>
                      <th>Operation</th>
                      <th>Module</th>
                      <th style={{ textAlign: 'right' }}>Timestamp</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      { user: 'Admin Root', action: 'Update Auth Policy', module: 'Auth-Kevlar', date: '2m ago' },
                      { user: 'AI Engine v2.4', action: 'Generate Signal', module: 'Intelligence', date: '15m ago' },
                      { user: 'Cloud Scheduler', action: 'Snapshot DB', module: 'Database', date: '42m ago' },
                      { user: 'Video Pipeline', action: 'Render Complete', module: 'Video-Gen', date: '1h ago' },
                      { user: 'Sentinel AI', action: 'Flagged Login IP', module: 'Security', date: '2h ago' },
                    ].map((row, i) => (
                      <tr key={i}>
                        <td><strong>{row.user}</strong></td>
                        <td><span style={{ fontSize: '0.8rem', color: '#5E6C84' }}>{row.action}</span></td>
                        <td><span className="badge badge-secondary" style={{ fontSize: '0.7rem' }}>{row.module}</span></td>
                        <td style={{ textAlign: 'right', fontSize: '0.75rem', color: '#97A0AF' }}>{row.date}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className={styles.card}>
              <div className={styles.cardHeader}>
                <h3>🚨 Health Monitor</h3>
              </div>
              <div className={styles.cardBody}>
                <div className={styles.healthList}>
                  {[
                    { type: 'success', msg: 'Core API nodes reporting healthy.', time: '10:00 AM' },
                    { type: 'warn', msg: `Node-4 CPU spikes: ${stats?.system.cpu_usage || '14%'}`, time: '09:45 AM' },
                    { type: 'success', msg: `${stats?.alerts.ai_signals_generated || 142} signals dispatched today.`, time: '09:15 AM' },
                    { type: 'info', msg: 'Daily data integrity check passed.', time: '08:00 AM' },
                    { type: 'error', msg: 'Memory leakage detected in video-gen-clstr.', time: 'Last night' },
                  ].map((log, i) => (
                    <div key={i} className={styles.healthItem}>
                      <div className={`${styles.typeIndicator} ${styles[log.type]}`}></div>
                      <div className={styles.msgContainer}>
                        <div className={styles.msg}>{log.msg}</div>
                        <div className={styles.time}>{log.time}</div>
                      </div>
                    </div>
                  ))}
                </div>
                <button className="btn btn-sm btn-secondary" style={{ width: '100%', marginTop: 20 }}>
                  Deep Diagnostic &rarr;
                </button>
              </div>
            </div>
          </div>
        </>
      )}

      {/* AI SYSTEM TAB */}
      {activeTab === 'ai' && (
        <>
          {/* System Health Card */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
            <div style={{ background: '#f8f9fa', border: '1px solid #e5e7eb', borderRadius: '0.75rem', padding: '1.5rem' }}>
              <h3 style={{ marginBottom: '1rem' }}>🟢 Circuit Breaker Status</h3>
              {systemStatus && (
                <>
                  <div style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <div style={{ width: '16px', height: '16px', borderRadius: '50%', backgroundColor: getCircuitBreakerColor(systemStatus.circuit_breaker_state || 'CLOSED') }}></div>
                    <span style={{ fontWeight: 600 }}>{systemStatus.circuit_breaker_state || 'CLOSED'}</span>
                  </div>
                  <div style={{ fontSize: '0.9rem', color: '#6b7280' }}>
                    <div>✓ Success Rate: {((systemStatus.successful_requests / Math.max(systemStatus.total_requests, 1)) * 100).toFixed(1)}%</div>
                    <div>⏱️ Avg Response: {(systemStatus.avg_response_time || 0).toFixed(0)}ms</div>
                    <div>🤖 Active Agents: {systemStatus.agents_count || 0}</div>
                  </div>
                </>
              )}
            </div>

            {/* Agent Performance */}
            <div style={{ background: '#f8f9fa', border: '1px solid #e5e7eb', borderRadius: '0.75rem', padding: '1.5rem' }}>
              <h3 style={{ marginBottom: '1rem' }}>Agent Performance ({agentMetrics.length})</h3>
              {agentMetrics.slice(0, 3).map((agent) => (
                <div key={agent.agent_name} style={{ marginBottom: '0.75rem', fontSize: '0.85rem' }}>
                  <div style={{ fontWeight: 600 }}>{agent.agent_name}</div>
                  <div style={{ color: '#6b7280' }}>Success: {(agent.success_rate * 100).toFixed(1)}% | Response: {agent.avg_response_time || 0}ms</div>
                </div>
              ))}
            </div>

            {/* Compliance Status */}
            <div style={{ background: '#f8f9fa', border: '1px solid #e5e7eb', borderRadius: '0.75rem', padding: '1.5rem' }}>
              <h3 style={{ marginBottom: '1rem' }}>⚖️ Compliance</h3>
              <div style={{ fontSize: '0.9rem', color: complianceViolations.length === 0 ? '#10b981' : '#ef4444', fontWeight: 600 }}>
                {complianceViolations.length === 0 ? '✓ No violations' : `⚠️ ${complianceViolations.length} violations`}
              </div>
              {complianceViolations.slice(0, 2).map((v, i) => (
                <div key={i} style={{ fontSize: '0.75rem', color: '#6b7280', marginTop: '0.5rem' }}>
                  {v.violation_type}
                </div>
              ))}
            </div>
          </div>

          {/* Audit Trail */}
          <div style={{ background: '#f8f9fa', border: '1px solid #e5e7eb', borderRadius: '0.75rem', padding: '1.5rem', marginBottom: '2rem' }}>
            <h3 style={{ marginBottom: '1rem' }}>📋 Recent Audit Decisions</h3>
            <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
              {auditTrail.slice(0, 5).map((entry, i) => (
                <div key={i} style={{ padding: '0.75rem', borderBottom: '1px solid #e5e7eb', fontSize: '0.85rem' }}>
                  <div style={{ fontWeight: 600 }}>{entry.action}</div>
                  <div style={{ color: '#6b7280' }}>{entry.decision}</div>
                  <div style={{ fontSize: '0.75rem', color: '#9ca3af' }}>{new Date(entry.timestamp).toLocaleString()}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Performance Chart */}
          {performanceMetrics.length > 0 && (
            <div style={{ background: '#f8f9fa', border: '1px solid #e5e7eb', borderRadius: '0.75rem', padding: '1.5rem' }}>
              <h3 style={{ marginBottom: '1rem' }}>Response Time Trend</h3>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={performanceMetrics.slice(-20)}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="timestamp" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="response_time" stroke="#3b82f6" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          )}
        </>
      )}
    </div>
  );
}
