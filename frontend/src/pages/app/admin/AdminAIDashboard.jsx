import React, { useState, useEffect } from 'react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { useAuthStore } from '../../../store/authStore';
import '../../../styles/pages/admin/AdminAIDashboard.scss';

const AdminAIDashboard = () => {
  const { accessToken } = useAuthStore();
  const [systemStatus, setSystemStatus] = useState(null);
  const [agentMetrics, setAgentMetrics] = useState([]);
  const [auditTrail, setAuditTrail] = useState([]);
  const [complianceViolations, setComplianceViolations] = useState([]);
  const [performanceMetrics, setPerformanceMetrics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    if (accessToken) {
      fetchDashboardData();
      const interval = setInterval(fetchDashboardData, 10000); // Refresh every 10s
      return () => clearInterval(interval);
    }
  }, [accessToken]);

  const fetchDashboardData = async () => {
    try {
      const headers = { Authorization: `Bearer ${accessToken}` };

      const [status, agents, audit, compliance, perf] = await Promise.all([
        fetch('/api/v1/admin/ai/status', { headers }).then(r => {
          if (!r.ok) throw new Error(`HTTP ${r.status}`);
          return r.json();
        }),
        fetch('/api/v1/admin/ai/agents', { headers }).then(r => {
          if (!r.ok) throw new Error(`HTTP ${r.status}`);
          return r.json();
        }),
        fetch('/api/v1/admin/ai/audit-trail', { headers }).then(r => {
          if (!r.ok) throw new Error(`HTTP ${r.status}`);
          return r.json();
        }),
        fetch('/api/v1/admin/ai/compliance/violations', { headers }).then(r => {
          if (!r.ok) throw new Error(`HTTP ${r.status}`);
          return r.json();
        }),
        fetch('/api/v1/admin/ai/metrics/performance', { headers }).then(r => {
          if (!r.ok) throw new Error(`HTTP ${r.status}`);
          return r.json();
        }),
      ]);

      setSystemStatus(status);
      setAgentMetrics(agents.agents || []);
      setAuditTrail(audit.entries || []);
      setComplianceViolations(compliance.violations || []);
      setPerformanceMetrics(perf.metrics?.latency_history || []);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      setLoading(false);
    }
  };

  const getCircuitBreakerColor = (state) => {
    switch (state) {
      case 'CLOSED': return '#10b981'; // green
      case 'OPEN': return '#ef4444'; // red
      case 'HALF_OPEN': return '#f59e0b'; // amber
      default: return '#6b7280';
    }
  };

  const SystemStatusCard = () => (
    <div className="status-card">
      <h3>System Health</h3>
      {systemStatus && (
        <div className="status-content">
          <div className="circuit-breaker">
            <div className="indicator" style={{ backgroundColor: getCircuitBreakerColor(systemStatus.circuit_breaker_state) }}></div>
            <div>
              <p className="label">Circuit Breaker</p>
              <p className="value">{systemStatus.circuit_breaker_state}</p>
            </div>
          </div>
          
          <div className="status-metrics">
            <div className="metric">
              <span className="label">Total Requests Today</span>
              <span className="value">{systemStatus.total_requests || 0}</span>
            </div>
            <div className="metric">
              <span className="label">Success Rate</span>
              <span className="value">{((systemStatus.successful_requests / Math.max(systemStatus.total_requests, 1)) * 100).toFixed(1)}%</span>
            </div>
            <div className="metric">
              <span className="label">Agents Online</span>
              <span className="value">{systemStatus.agents_count || 0}</span>
            </div>
            <div className="metric">
              <span className="label">Avg Response Time</span>
              <span className="value">{(systemStatus.avg_response_time || 0).toFixed(0)}ms</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  const AgentMetricsCard = () => (
    <div className="agents-card">
      <h3>Agent Performance</h3>
      <div className="agents-grid">
        {agentMetrics.map((agent) => (
          <div key={agent.agent_name} className="agent-item">
            <div className="agent-header">
              <h4>{agent.agent_name}</h4>
              <span className="autonomy-badge" style={{ backgroundColor: `rgba(59, 130, 246, ${agent.autonomy_score / 100})` }}>
                {agent.autonomy_score}% Autonomy
              </span>
            </div>
            <div className="agent-stats">
              <div className="stat">
                <span className="label">Success Rate</span>
                <span className="value">{(agent.success_rate * 100).toFixed(1)}%</span>
              </div>
              <div className="stat">
                <span className="label">Avg Response</span>
                <span className="value">{(agent.avg_response_time || 0).toFixed(0)}ms</span>
              </div>
              <div className="stat">
                <span className="label">Executions</span>
                <span className="value">{agent.execution_count || 0}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const ComplianceCard = () => (
    <div className="compliance-card">
      <h3>Compliance & Violations</h3>
      {complianceViolations.length > 0 ? (
        <div className="violations-list">
          {complianceViolations.slice(0, 5).map((violation, idx) => (
            <div key={idx} className="violation-item">
              <div className="violation-header">
                <span className="type">{violation.violation_type}</span>
                <span className="severity" style={{ color: violation.severity === 'HIGH' ? '#ef4444' : '#f59e0b' }}>
                  {violation.severity}
                </span>
              </div>
              <p className="reason">{violation.reason}</p>
              <p className="timestamp">{new Date(violation.timestamp).toLocaleString()}</p>
            </div>
          ))}
        </div>
      ) : (
        <p className="no-violations">✓ No violations detected</p>
      )}
    </div>
  );

  const AuditTrailCard = () => (
    <div className="audit-card">
      <h3>Recent Decisions (Audit Trail)</h3>
      <div className="audit-list">
        {auditTrail.slice(0, 5).map((entry, idx) => (
          <div key={idx} className="audit-entry">
            <div className="entry-header">
              <span className="action">{entry.action}</span>
              <span className="timestamp">{new Date(entry.timestamp).toLocaleTimeString()}</span>
            </div>
            <p className="decision">{entry.decision}</p>
            {entry.reason && <p className="reason">Reason: {entry.reason}</p>}
          </div>
        ))}
      </div>
    </div>
  );

  const PerformanceChart = () => (
    <div className="performance-card">
      <h3>Response Time Trend</h3>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={performanceMetrics.slice(-20)}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="timestamp" />
          <YAxis label={{ value: 'Response Time (ms)', angle: -90, position: 'insideLeft' }} />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="response_time" stroke="#3b82f6" name="Response Time" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );

  const AgentDistribution = () => {
    const data = agentMetrics.map(agent => ({
      name: agent.agent_name,
      value: agent.execution_count || 0
    }));

    const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

    return (
      <div className="distribution-card">
        <h3>Agent Usage Distribution</h3>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, value }) => `${name}: ${value}`}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>
    );
  };

  if (loading) {
    return <div className="dashboard-loading">Loading AI System Dashboard...</div>;
  }

  return (
    <div className="admin-ai-dashboard">
      <header className="dashboard-header">
        <h1>🤖 Multi-Agent AI System Dashboard</h1>
        <p>Enterprise Monitoring & Compliance Tracking</p>
      </header>

      <div className="tab-navigation">
        <button
          className={`tab-btn ${activeTab === 'overview' ? 'active' : ''}`}
          onClick={() => setActiveTab('overview')}
        >
          Overview
        </button>
        <button
          className={`tab-btn ${activeTab === 'agents' ? 'active' : ''}`}
          onClick={() => setActiveTab('agents')}
        >
          Agents
        </button>
        <button
          className={`tab-btn ${activeTab === 'compliance' ? 'active' : ''}`}
          onClick={() => setActiveTab('compliance')}
        >
          Compliance
        </button>
        <button
          className={`tab-btn ${activeTab === 'audit' ? 'active' : ''}`}
          onClick={() => setActiveTab('audit')}
        >
          Audit Trail
        </button>
      </div>

      <div className="dashboard-content">
        {activeTab === 'overview' && (
          <div className="overview-grid">
            <SystemStatusCard />
            <AgentDistribution />
            <PerformanceChart />
          </div>
        )}

        {activeTab === 'agents' && (
          <div className="agents-section">
            <AgentMetricsCard />
          </div>
        )}

        {activeTab === 'compliance' && (
          <div className="compliance-section">
            <ComplianceCard />
          </div>
        )}

        {activeTab === 'audit' && (
          <div className="audit-section">
            <AuditTrailCard />
          </div>
        )}
      </div>

      <footer className="dashboard-footer">
        <p>Last updated: {new Date().toLocaleTimeString()}</p>
        <p>Enterprise Ready | Autonomous Agents | Compliance Monitored</p>
      </footer>
    </div>
  );
};

export default AdminAIDashboard;
