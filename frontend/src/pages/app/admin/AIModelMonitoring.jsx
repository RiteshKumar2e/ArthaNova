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
          <div className="metric-label">Inference Queue</div>
          <div className="metric-value">{status?.queue_size || 0}</div>
        </div>
        <div className="metric-card">
          <div className="metric-label">Total Predictions (24h)</div>
          <div className="metric-value">124,502</div>
        </div>
        <div className="metric-card">
          <div className="metric-label">Avg. Latency</div>
          <div className="metric-value">340ms</div>
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
              ) : status?.models.map(model => (
                <tr key={model.name}>
                  <td><strong>{model.name}</strong></td>
                  <td>
                    <span className={`badge ${model.status === 'online' ? 'badge-success' : 'badge-warning'}`}>
                      {model.status.toUpperCase()}
                    </span>
                  </td>
                  <td><code>{model.version}</code></td>
                  <td>{model.latency}</td>
                  <td>
                    <div className={`status-indicator ${model.status === 'online' ? 'success' : 'warning'}`}></div>
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: 8 }}>
                      <button className="btn btn-sm btn-secondary">Logs</button>
                      <button className="btn btn-sm btn-primary">Restart</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
