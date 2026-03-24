import React, { useState, useEffect } from 'react';
import { useAuthStore } from '../store/authStore';
import '../styles/components/SystemHealthIndicator.css';

const SystemHealthIndicator = ({ compact = false }) => {
  const { accessToken } = useAuthStore();
  const [health, setHealth] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (accessToken) {
      fetchHealth();
      const interval = setInterval(fetchHealth, 5000);
      return () => clearInterval(interval);
    }
  }, [accessToken]);

  const fetchHealth = async () => {
    try {
      const response = await fetch('/api/v1/admin/ai/system-status', {
        headers: { Authorization: `Bearer ${accessToken}` }
      });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const data = await response.json();
      
      // Map nested backend response to component state
      const healthData = {
        circuit_breaker_state: data.system?.circuit_breaker?.state || 'CLOSED',
        successful_requests: data.system?.circuit_breaker?.success_count || 0,
        total_requests: (data.system?.circuit_breaker?.success_count || 0) + (data.system?.circuit_breaker?.failure_count || 0),
        avg_response_time: data.performance?.latency_metrics?.orchestration?.avg_ms || 0,
        agents_count: Object.keys(data.agents || {}).length || 0,
      };
      
      setHealth(healthData);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching system health:', error);
    }
  };

  if (loading) return <div className="health-loading">Loading...</div>;
  if (!health) return null;

  const getHealthColor = (state) => {
    switch (state) {
      case 'CLOSED': return '#10b981';
      case 'OPEN': return '#ef4444';
      case 'HALF_OPEN': return '#f59e0b';
      default: return '#6b7280';
    }
  };

  const getHealthStatus = (state) => {
    switch (state) {
      case 'CLOSED': return '🟢 Healthy';
      case 'OPEN': return '🔴 Degraded';
      case 'HALF_OPEN': return '🟡 Recovering';
      default: return '⚪ Unknown';
    }
  };

  if (compact) {
    return (
      <div className="system-health-compact">
        <div className="health-dot" style={{ backgroundColor: getHealthColor(health.circuit_breaker_state) }}></div>
        <span className="health-status">{getHealthStatus(health.circuit_breaker_state)}</span>
        <span className="health-detail">{health.total_requests || 0} reqs today</span>
      </div>
    );
  }

  return (
    <div className="system-health-indicator">
      <div className="health-header">
        <h4>System Health</h4>
        <div className="status-badge" style={{ backgroundColor: getHealthColor(health.circuit_breaker_state) }}>
          {getHealthStatus(health.circuit_breaker_state)}
        </div>
      </div>

      <div className="health-details">
        <div className="detail-row">
          <span className="label">Circuit Breaker:</span>
          <span className="value">{health.circuit_breaker_state}</span>
        </div>
        <div className="detail-row">
          <span className="label">Success Rate:</span>
          <span className="value">
            {((health.successful_requests / Math.max(health.total_requests, 1)) * 100).toFixed(1)}%
          </span>
        </div>
        <div className="detail-row">
          <span className="label">Avg Response:</span>
          <span className="value">{(health.avg_response_time || 0).toFixed(0)}ms</span>
        </div>
        <div className="detail-row">
          <span className="label">Active Agents:</span>
          <span className="value">{health.agents_count || 0}</span>
        </div>
      </div>

      <div className="health-footer">
        Updated: {new Date().toLocaleTimeString()}
      </div>
    </div>
  );
};

export default SystemHealthIndicator;
