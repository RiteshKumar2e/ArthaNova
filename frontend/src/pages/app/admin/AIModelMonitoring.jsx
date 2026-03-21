import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuthStore } from '../../../store/authStore';

export default function AIModelMonitoring() {
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  const { accessToken } = useAuthStore();

  useEffect(() => {
    const fetchAIStatus = async () => {
      try {
        const response = await axios.get('/api/v1/admin/ai/status', {
          headers: { Authorization: `Bearer ${accessToken}` }
        });
        setStatus(response.data);
      } catch (error) {
        console.error('Error fetching AI status:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchAIStatus();
  }, [accessToken]);

  return (
    <div className="animate-fadeIn">
      <div className="page-header">
        <div>
          <h1 className="page-title">AI Model Monitoring 🤖</h1>
          <p className="page-subtitle">Track performance, latency, and training status of ArthaNova AI modules.</p>
        </div>
        <button className="btn btn-primary">⚡ Retrain Sentiment Model</button>
      </div>

      <div className="grid-3" style={{ marginBottom: 24 }}>
        <div className="metric-card">
          <div className="metric-label">Total AI Queries</div>
          <div className="metric-value">{status?.system?.orchestrator?.total_queries || 0}</div>
          <div className="metric-change positive">▲ {status?.system?.orchestrator?.multi_agent_executions || 0} multi-agent</div>
        </div>
        <div className="metric-card">
          <div className="metric-label">Compliance Blocks</div>
          <div className="metric-value">{status?.system?.orchestrator?.compliance_blocks || 0}</div>
          <div className="metric-change negative">Safety Guardrails</div>
        </div>
        <div className="metric-card">
          <div className="metric-label">Avg. Orchestration Latency</div>
          <div className="metric-value">
            {status?.performance?.latency_metrics?.orchestration?.avg 
              ? `${Math.round(status.performance.latency_metrics.orchestration.avg)}ms` 
              : 'N/A'}
          </div>
          <div className="metric-change positive">Groq Optimized</div>
        </div>
      </div>

      <div className="card">
        <div className="card-header">
          <h3>Active AI Modules</h3>
        </div>
        <div className="table-responsive">
          <table className="table">
            <thead>
              <tr>
                <th>Module Name</th>
                <th>Status</th>
                <th>Version</th>
                <th>Avg Latency</th>
                <th>Health</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan="6" style={{ textAlign: 'center', padding: 40 }}>Loading AI status...</td></tr>
              ) : (
                Object.values(status?.agents || {}).map(agent => (
                  <tr key={agent.name}>
                    <td>
                      <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <strong>{agent.name.toUpperCase()}</strong>
                        <span style={{ fontSize: '0.75rem', color: '#5E6C84' }}>{agent.capability}</span>
                      </div>
                    </td>
                    <td>
                      <span className={`badge ${agent.status === 'idle' || agent.status === 'completed' || agent.status === 'processing' ? 'badge-success' : 'badge-danger'}`}>
                        {agent.status.toUpperCase()}
                      </span>
                    </td>
                    <td><code>v1.0.4</code></td>
                    <td>{agent.metrics?.avg_response_time_ms || 0}ms</td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <div className={`status-indicator ${agent.status !== 'failed' ? 'success' : 'danger'}`}></div>
                        <span style={{ fontSize: '0.8rem' }}>{agent.metrics?.autonomy_score || '0%'} Autonomy</span>
                      </div>
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: 8 }}>
                        <button className="btn btn-sm btn-secondary">Logs</button>
                        <button className="btn btn-sm btn-primary">Restart</button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
              {!loading && Object.keys(status?.agents || {}).length === 0 && (
                <tr><td colSpan="6" style={{ textAlign: 'center', padding: 40 }}>No active AI modules detected.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
