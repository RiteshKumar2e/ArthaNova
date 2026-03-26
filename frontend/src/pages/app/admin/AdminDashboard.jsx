import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { useAuthStore } from '../../../store/authStore';
import { aiAPI, adminAPI } from '../../../api/client';
import RiskAlerts from '../../../components/RiskAlerts';
import styles from '../../../styles/pages/app/admin/AdminDashboard.module.css';

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    users: { total: 0, active: 0, new_today: 0 },
    system: { api_requests_24h: 0, uptime: '99%', health: 'N/A' },
    alerts: { ai_signals_generated: 0, active_alerts: 0, resolved_today: 0 }
  });
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
        const response = await adminAPI.getDashboardStats();
        // Merge fetched data with defaults to ensure structure
        const validStats = response.data || {};
        setStats({
          users: { total: 0, active: 0, new_today: 0, ...validStats.users },
          system: { api_requests_24h: 0, uptime: '99%', health: 'N/A', ...validStats.system },
          alerts: { ai_signals_generated: 0, active_alerts: 0, resolved_today: 0, ...validStats.alerts }
        });
      } catch (error) {
        console.error('Error fetching admin stats:', error);
        // Stats already has default values, so no need to reset
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

      // Fetch each endpoint using the centralized aiAPI client
      const [statusRes, agentsRes, auditRes, complianceRes, perfRes] = await Promise.all([
        aiAPI.getSystemStatus().catch(() => ({ data: {} })),
        aiAPI.getAgentMetrics().catch(() => ({ data: { agents: [] } })),
        aiAPI.getAuditTrail().catch(() => ({ data: { entries: [] } })),
        aiAPI.getComplianceViolations().catch(() => ({ data: { violations: [] } })),
        aiAPI.getPerformanceMetrics().catch(() => ({ data: { metrics: { latency_history: [] } } })),
      ]);

      const status = statusRes.data;
      const agents = agentsRes.data;
      const audit = auditRes.data;
      const compliance = complianceRes.data;
      const perf = perfRes.data;

      setSystemStatus(status && typeof status === 'object' ? status : {});
      // Support both array and object for agents (the new backend returns an object)
      const agentsArray = Array.isArray(agents?.agents) 
        ? agents.agents 
        : agents?.agents 
          ? Object.values(agents.agents) 
          : [];
      setAgentMetrics(agentsArray);
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

  const ADMIN_STATS = [
    { label: 'Total Users', value: stats.users?.total || 0, change: `+${stats.users?.new_today || 0}`, positive: true, icon: '👥' },
    { label: 'API Loads (24h)', value: (stats.system?.api_requests_24h || 0).toLocaleString(), change: 'Stable', positive: true, icon: '🔥' },
    { label: 'AI Signals Dispatch', value: stats.alerts?.ai_signals_generated || 0, change: 'Running', positive: true, icon: '🎯' },
    { label: 'System Uptime', value: stats.system?.uptime || '99%', change: 'Optimal', positive: true, icon: '⚡' },
  ];

  return (
    <div className={styles.adminDashboard + " animate-fadeIn"}>
      <div className="page-header">
        <div>
          <h1 className="page-title">ADMIN COMMAND CENTER 🛠️</h1>
          <p className="page-subtitle">GOVERNANCE, PLATFORM HEALTH, AND AI SYSTEM OVERSIGHT.</p>
        </div>
        <div style={{ display: 'flex', gap: 12 }}>
          <Link to="/admin/settings" className="btn btn-secondary btn-sm">⚙️ SYSTEM SETTINGS</Link>
          <Link to="/admin/users" className="btn btn-primary btn-sm">👥 USER MANAGEMENT</Link>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className={styles.tabNav}>
        <button
          className={`${styles.tabButton} ${activeTab === 'overview' ? styles.active : ''}`}
          onClick={() => setActiveTab('overview')}
        >
          📊 PLATFORM OVERVIEW
        </button>
        <button
          className={`${styles.tabButton} ${activeTab === 'ai' ? styles.active : ''}`}
          onClick={() => setActiveTab('ai')}
        >
          🧠 MULTI-AGENT AI SYSTEM
        </button>
      </div>

      {/* OVERVIEW TAB */}
      {activeTab === 'overview' && (
        <>
          <div className={styles.statsGrid}>
            {loading ? (
              [1, 2, 3, 4].map(i => (
                <div key={i} className={styles.statCard}>
                  <div className={styles.label}>LOADING...</div>
                  <div className={styles.value}>----</div>
                </div>
              ))
            ) : ADMIN_STATS.map((stat) => (
              <div key={stat.label} className={styles.statCard}>
                <div className={styles.iconWrapper}>{stat.icon}</div>
                <div className={styles.label}>{stat.label}</div>
                <div className={styles.value}>{stat.value}</div>
                <div className={styles.change}>
                  {stat.change}
                </div>
              </div>
            ))}
          </div>

          <div className={styles.contentRow}>
            <div className={styles.card}>
              <div className={styles.cardHeader}>
                <h3>🖥️ SYSTEM REGISTRY ACTIVITY</h3>
                <span className="badge badge-secondary" style={{ fontSize: 10 }}>LIVE FEED</span>
              </div>
              <div className={styles.cardBody} style={{ padding: 0 }}>
                <div className={styles.tableWrapper}>
                  <table className={styles.activityTable}>
                    <thead>
                      <tr>
                        <th>IDENTITY</th>
                        <th>OPERATION</th>
                        <th>MODULE</th>
                        <th style={{ textAlign: 'right' }}>TIMESTAMP</th>
                      </tr>
                    </thead>
                    <tbody>
                      {auditTrail.length === 0 ? (
                        <tr><td colSpan="4" style={{ textAlign: 'center', padding: 40, fontWeight: 800, color: '#999' }}>NO RECENT SYSTEM ACTIVITY RECORDED.</td></tr>
                      ) : auditTrail.slice(0, 8).map((entry, i) => (
                        <tr key={i}>
                          <td><strong>{entry.agent?.toUpperCase() || 'SYSTEM'}</strong></td>
                          <td><span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#333' }}>{entry.action?.toUpperCase()}</span></td>
                          <td><span className="badge badge-info" style={{ fontSize: '0.65rem' }}>{entry.details?.query_type?.toUpperCase() || 'CORE'}</span></td>
                          <td style={{ textAlign: 'right', fontSize: '0.7rem', fontWeight: 800, color: '#666' }}>
                            {new Date(entry.timestamp).toLocaleTimeString()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            <div className={styles.card}>
              <div className={styles.cardHeader}>
                <h3>🚨 HEALTH MONITOR</h3>
              </div>
              <div className={styles.cardBody} style={{ padding: 0 }}>
                <div className={styles.healthList}>
                  {complianceViolations.length === 0 ? (
                    <div style={{ padding: 40, textAlign: 'center' }}>
                      <div style={{ fontSize: '2.5rem', marginBottom: 16 }}>✔️</div>
                      <p style={{ color: '#14a800', fontWeight: 950, textTransform: 'uppercase' }}>ALL SYSTEMS COMPLIANT</p>
                      <p style={{ fontSize: '0.7rem', fontWeight: 800, color: '#666', marginTop: 8 }}>NO SAFETY VIOLATIONS OR CIRCUIT BREAKS DETECTED IN CURRENT SESSION.</p>
                    </div>
                  ) : complianceViolations.map((log, i) => (
                    <div key={i} className={styles.healthItem}>
                      <div className={`${styles.typeIndicator} ${styles.error}`}></div>
                      <div className={styles.msgContainer}>
                        <div className={styles.msg}>{log.violation_type?.toUpperCase()}</div>
                        <div className={styles.time}>{new Date(log.timestamp).toLocaleTimeString()}</div>
                      </div>
                    </div>
                  ))}
                </div>
                <div style={{ padding: 16 }}>
                  <button className="btn btn-sm btn-secondary btn-full">
                    DEEP DIAGNOSTIC &rarr;
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {/* AI SYSTEM TAB */}
      {activeTab === 'ai' && (
        <>
          <div className={styles.aiGrid}>
            <div className={styles.aiCard}>
              <h3>🟢 CIRCUIT BREAKER</h3>
              {systemStatus && (
                <>
                  <div style={{ marginBottom: 16, display: 'flex', alignItems: 'center', gap: 12 }}>
                    <div style={{ width: 14, height: 14, border: '2px solid #000', borderRadius: '50%', backgroundColor: getCircuitBreakerColor(systemStatus.circuit_breaker_state || 'CLOSED') }}></div>
                    <span style={{ fontWeight: 900, fontSize: '1rem' }}>{systemStatus.circuit_breaker_state || 'CLOSED'}</span>
                  </div>
                  <div className={styles.performanceRow}>
                    <span className={styles.performanceLabel}>UPTIME</span>
                    <span>{(systemStatus.uptime_percentage || 99.8).toFixed(1)}%</span>
                  </div>
                  <div className={styles.performanceRow}>
                    <span className={styles.performanceLabel}>MEMORY</span>
                    <span>{(systemStatus.memory_usage_mb || 0)}MB</span>
                  </div>
                  <div className={styles.performanceRow}>
                    <span className={styles.performanceLabel}>ACTIVE AGENTS</span>
                    <span>{systemStatus.active_agents || 0}</span>
                  </div>
                </>
              )}
            </div>

            <div className={styles.aiCard}>
              <h3>AGENT PERFORMANCE ({agentMetrics.length})</h3>
              {agentMetrics.length === 0 ? (
                 <p style={{ fontSize: '0.75rem', fontWeight: 700, color: '#999' }}>NO ACTIVE AGENTS FOUND</p>
              ) : agentMetrics.slice(0, 3).map((agent) => (
                <div key={agent.name} style={{ marginBottom: 16 }}>
                  <div style={{ fontWeight: 900, fontSize: '0.75rem' }}>{agent.name.toUpperCase()}</div>
                  <div className={styles.performanceRow} style={{ border: 'none', padding: 0 }}>
                    <span className={styles.performanceLabel}>SUCCESS: {agent.success_rate ? agent.success_rate.toFixed(1) : 'N/A'}%</span>
                    <span>{agent.tasks_completed || 0} tasks</span>
                  </div>
                </div>
              ))}
            </div>

            <div className={styles.aiCard}>
              <h3>⚖️ COMPLIANCE STATUS</h3>
              <div style={{ fontSize: '1rem', color: complianceViolations.length === 0 ? '#14a800' : '#FF3131', fontWeight: 950, marginBottom: 12 }}>
                {complianceViolations.length === 0 ? '✓ COMPLIANT' : `⚠️ ${complianceViolations.length} VIOLATIONS`}
              </div>
              {complianceViolations.slice(0, 2).map((v, i) => (
                <div key={i} style={{ fontSize: '0.65rem', fontWeight: 800, color: '#666', marginTop: 4, textTransform: 'uppercase' }}>
                  {v.type || v.violation_type || 'Unknown'}
                </div>
              ))}
            </div>
          </div>

          {/* Audit Trail */}
          <div className={styles.card} style={{ marginBottom: 32 }}>
            <div className={styles.cardHeader}>📋 RECENT AUDIT DECISIONS</div>
            <div className={styles.cardBody} style={{ padding: 0, maxHeight: 300, overflowY: 'auto' }}>
              {auditTrail.length === 0 ? (
                <p style={{ padding: 40, textAlign: 'center', fontWeight: 900, color: '#999' }}>NO RECENT AUDIT DATA</p>
              ) : auditTrail.slice(0, 5).map((entry, i) => (
                <div key={i} style={{ padding: '12px 20px', borderBottom: '2px solid #eee' }}>
                  <div style={{ fontWeight: 950, fontSize: '0.8rem', textTransform: 'uppercase' }}>{entry.action}</div>
                  <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#555', margin: '4px 0' }}>{entry.decision?.toUpperCase()}</div>
                  <div style={{ fontSize: '0.65rem', fontWeight: 800, color: '#999' }}>{new Date(entry.timestamp).toLocaleString()}</div>
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
                  <XAxis dataKey="time" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="latency" stroke="#3b82f6" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          )}
        </>
      )}
      
      {/* Risk Alerts Section */}
      <div style={{ marginTop: 32, marginBottom: 32 }}>
        <RiskAlerts />
      </div>
    </div>
  );
}
