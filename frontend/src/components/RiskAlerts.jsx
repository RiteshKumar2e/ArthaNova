import React, { useState, useEffect } from 'react';
import { useAuthStore } from '../store/authStore';
import '../styles/components/RiskAlerts.css';

const RiskAlerts = () => {
  const { accessToken } = useAuthStore();
  const [alerts, setAlerts] = useState(null);
  const [loading, setLoading] = useState(true);
  const [expandedAlert, setExpandedAlert] = useState(null);
  const [filterLevel, setFilterLevel] = useState('all'); // 'all', 'high', 'medium', 'low'

  useEffect(() => {
    if (accessToken) {
      fetchRiskAlerts();
      const interval = setInterval(fetchRiskAlerts, 30000); // Refresh every 30s
      return () => clearInterval(interval);
    }
  }, [accessToken]);

  const fetchRiskAlerts = async () => {
    try {
      const response = await fetch('/api/v1/ai/risk-alerts', {
        headers: { Authorization: `Bearer ${accessToken}` }
      });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const data = await response.json();
      setAlerts(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching risk alerts:', error);
    }
  };

  const getAlertColor = (level) => {
    switch (level) {
      case 'high':
        return '#ef4444';
      case 'medium':
        return '#f59e0b';
      case 'low':
        return '#3b82f6';
      default:
        return '#6b7280';
    }
  };

  const getAlertIcon = (type) => {
    switch (type) {
      case 'concentration':
        return '📊';
      case 'market_condition':
        return '📉';
      case 'volatility':
        return '⚡';
      case 'technical_weakness':
        return '📐';
      case 'bearish_signal':
        return '🔴';
      default:
        return '⚠️';
    }
  };

  const getFilteredAlerts = () => {
    if (!alerts) return [];
    
    let allAlerts = [
      ...alerts.stock_alerts,
      ...alerts.portfolio_risks
    ];

    if (filterLevel !== 'all') {
      allAlerts = allAlerts.filter(alert => alert.level === filterLevel);
    }

    return allAlerts.sort((a, b) => {
      const priorityOrder = { high: 0, medium: 1, low: 2 };
      return (priorityOrder[a.level] || 3) - (priorityOrder[b.level] || 3);
    });
  };

  if (loading) {
    return <div className="risk-alerts-loading">⏳ Loading risk alerts...</div>;
  }

  const filteredAlerts = getFilteredAlerts();
  const alertStatus = alerts?.alert_status || 'CLEAR';

  return (
    <div className="risk-alerts">
      <div className="risk-header">
        <div className="title-section">
          <h2>⚠️ Risk Alerts</h2>
          <span className={`alert-status ${alertStatus.toLowerCase()}`}>
            {alertStatus === 'ACTIVE' ? '🔴' : '🟢'} {alertStatus}
          </span>
        </div>
        <div className="alert-summary">
          <div className="summary-item">
            <span className="count">{alerts?.stock_alerts?.length || 0}</span>
            <span className="label">Stock Alerts</span>
          </div>
          <div className="summary-item">
            <span className="count">{alerts?.portfolio_risks?.length || 0}</span>
            <span className="label">Portfolio Risks</span>
          </div>
          <div className="summary-item">
            <span className="count">{alerts?.total_alerts || 0}</span>
            <span className="label">Total Alerts</span>
          </div>
        </div>
      </div>

      <div className="risk-filters">
        <button
          className={`filter-btn ${filterLevel === 'all' ? 'active' : ''}`}
          onClick={() => setFilterLevel('all')}
        >
          All Alerts
        </button>
        <button
          className={`filter-btn high ${filterLevel === 'high' ? 'active' : ''}`}
          onClick={() => setFilterLevel('high')}
        >
          🔴 High Priority
        </button>
        <button
          className={`filter-btn medium ${filterLevel === 'medium' ? 'active' : ''}`}
          onClick={() => setFilterLevel('medium')}
        >
          🟡 Medium Priority
        </button>
        <button
          className={`filter-btn low ${filterLevel === 'low' ? 'active' : ''}`}
          onClick={() => setFilterLevel('low')}
        >
          🔵 Low Priority
        </button>
      </div>

      <div className="alerts-container">
        {filteredAlerts.length === 0 ? (
          <div className="no-alerts">
            <span className="emoji">✅</span>
            <p>No {filterLevel !== 'all' ? filterLevel + ' priority' : ''} alerts</p>
            <small>Your portfolio looks good!</small>
          </div>
        ) : (
          filteredAlerts.map((alert, index) => (
            <div
              key={index}
              className={`alert-card ${alert.level}`}
              onClick={() => setExpandedAlert(expandedAlert === index ? null : index)}
            >
              <div className="alert-top">
                <div className="alert-title">
                  <span className="alert-icon">{getAlertIcon(alert.type)}</span>
                  <div className="title-text">
                    <h4>{alert.symbol || alert.type?.replace(/_/g, ' ').toUpperCase()}</h4>
                    <p>{alert.description}</p>
                  </div>
                </div>
                <div className="alert-level-badge" style={{ backgroundColor: getAlertColor(alert.level) }}>
                  {alert.level.toUpperCase()}
                </div>
              </div>

              {expandedAlert === index && (
                <div className="alert-expanded">
                  <div className="alert-details">
                    <div className="detail-section">
                      <h5>🎯 Recommended Action</h5>
                      <p>{alert.action || 'Monitor the situation'}</p>
                    </div>

                    {alert.why_matters && alert.why_matters.length > 0 && (
                      <div className="detail-section">
                        <h5>📋 Why This Matters</h5>
                        <ul>
                          {alert.why_matters.map((reason, i) => (
                            <li key={i}>{reason}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {alert.multi_agent_justification && Object.keys(alert.multi_agent_justification).length > 0 && (
                      <div className="detail-section">
                        <h5>🤖 Agent Analysis</h5>
                        <div className="agent-details">
                          {Object.entries(alert.multi_agent_justification).map(([agent, details]) => (
                            <div key={agent} className="agent-analysis">
                              <span className="agent-label">{agent}</span>
                              <span className="agent-text">{details.reasoning}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {alert.portfolio_impact && Object.keys(alert.portfolio_impact).length > 0 && (
                      <div className="detail-section">
                        <h5>💼 Portfolio Impact</h5>
                        <div className="impact-details">
                          <div className="impact-row">
                            <span className="impact-label">Action:</span>
                            <span className="impact-value">{alert.portfolio_impact.action || 'N/A'}</span>
                          </div>
                          <div className="impact-row">
                            <span className="impact-label">Diversification:</span>
                            <span className="impact-value">{alert.portfolio_impact.diversification_impact || 'None'}</span>
                          </div>
                        </div>
                      </div>
                    )}

                    {alert.confidence && (
                      <div className="detail-section">
                        <h5>📊 Signal Metrics</h5>
                        <div className="metrics-grid">
                          <div className="metric">
                            <span className="metric-label">Confidence</span>
                            <span className="metric-value">{alert.confidence.toFixed(1)}%</span>
                          </div>
                          <div className="metric">
                            <span className="metric-label">Probability</span>
                            <span className="metric-value">{alert.probability.toFixed(0)}%</span>
                          </div>
                          {alert.risk_reward_ratio && (
                            <div className="metric">
                              <span className="metric-label">Risk-Reward</span>
                              <span className="metric-value">{alert.risk_reward_ratio.toFixed(2)}:1</span>
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    {alert.target && (
                      <div className="detail-section">
                        <h5>💹 Price Targets</h5>
                        <div className="price-targets">
                          {alert.entry_range && (
                            <div className="price-row">
                              <span className="price-label">Entry Range:</span>
                              <span className="price-value">
                                ₹{alert.entry_range.min.toFixed(2)} - ₹{alert.entry_range.max.toFixed(2)}
                              </span>
                            </div>
                          )}
                          <div className="price-row">
                            <span className="price-label">Target:</span>
                            <span className="price-value">₹{alert.target.toFixed(2)}</span>
                          </div>
                          <div className="price-row">
                            <span className="price-label">Stop Loss:</span>
                            <span className="price-value">₹{alert.stop_loss.toFixed(2)}</span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="alert-actions">
                    <button className="action-btn primary">View Details</button>
                    <button className="action-btn secondary">Dismiss</button>
                  </div>
                </div>
              )}

              <div className="alert-footer">
                {!expandedAlert === index && (
                  <small>Priority: {alert.priority || 'N/A'} • Click to expand</small>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      <div className="risk-alerts-footer">
        <small>Last updated: {new Date(alerts?.generated_at || new Date()).toLocaleTimeString()}</small>
        <small>Auto-refresh every 30 seconds</small>
      </div>

      <div className="risk-disclaimer">
        <strong>💡 Note:</strong> Alerts are generated by our AI system based on multi-agent analysis. 
        Use them as guidance but always perform your own due diligence before making decisions.
      </div>
    </div>
  );
};

export default RiskAlerts;
