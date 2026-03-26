import React, { useState, useEffect } from 'react';
import { aiAPI } from '../api/client';
import '../styles/components/RiskAlerts.css';

const RiskAlerts = () => {
  const [alerts, setAlerts] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedAlert, setExpandedAlert] = useState(null);
  const [filterLevel, setFilterLevel] = useState('all'); // 'all', 'high', 'medium', 'low'

  useEffect(() => {
    fetchRiskAlerts();
    const interval = setInterval(fetchRiskAlerts, 60000); // Increased to 60s to reduce API load
    return () => clearInterval(interval);
  }, []);

  const fetchRiskAlerts = async () => {
    try {
      const response = await aiAPI.getRiskAlerts();
      setAlerts(response.data);
      setError(null);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching risk alerts:', error);
      setError('Failed to fetch risk alerts');
      setLoading(false);
      // Don't clear previous data on error - show stale data instead of nothing
    }
  };

  const getAlertColor = (level) => {
    switch (level) {
      case 'high': return '#FF3131'; // Red
      case 'medium': return '#FFDD55'; // Yellow
      case 'low': return '#C4FF00'; // Lime
      default: return '#000';
    }
  };

  const getAlertIcon = (type) => {
    switch (type) {
      case 'concentration': return '📊';
      case 'market_condition': return '📉';
      case 'volatility': return '⚡';
      case 'technical_weakness': return '📐';
      case 'bearish_signal': return '🔴';
      default: return '⚠️';
    }
  };

  const getFilteredAlerts = () => {
    if (!alerts) return [];
    
    let allAlerts = [
      ...(alerts?.stock_alerts || []),
      ...(alerts?.portfolio_risks || [])
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
    return (
      <div className="risk-alerts-loading">
        <span style={{ fontSize: '3rem', display: 'block', marginBottom: '1rem' }}>🛡️</span>
        <p>Scanning Portfolio Security Grid...</p>
      </div>
    );
  }

  const filteredAlerts = getFilteredAlerts();
  const alertStatus = alerts?.alert_status || 'CLEAR';

  return (
    <div className="risk-alerts animate-fadeIn">
      {/* Container Header */}
      <div className="risk-header">
        <div className="title-section">
          <h2>⚠️ RISK ALERT CENTER</h2>
          <span className={`alert-status ${alertStatus.toLowerCase()}`}>
            {alertStatus === 'ACTIVE' ? '🔴 DANGER DETECTED' : '🟢 STATUS: CLEAR'}
          </span>
        </div>
        <div className="alert-summary">
          <div className="summary-item">
            <span className="count">{alerts?.stock_alerts?.length || 0}</span>
            <span className="label">STOCKS</span>
          </div>
          <div className="summary-item">
            <span className="count">{alerts?.portfolio_risks?.length || 0}</span>
            <span className="label">PORTFOLIO</span>
          </div>
          <div className="summary-item">
            <span className="count">{alerts?.total_alerts || 0}</span>
            <span className="label">TOTAL</span>
          </div>
        </div>
      </div>

      {/* Priority Filters */}
      <div className="risk-filters">
        <button
          className={`filter-btn ${filterLevel === 'all' ? 'active' : ''}`}
          onClick={() => setFilterLevel('all')}
        >
          ALL ALERTS
        </button>
        <button
          className={`filter-btn high ${filterLevel === 'high' ? 'active' : ''}`}
          onClick={() => setFilterLevel('high')}
        >
          🔴 HIGH PRIORITY
        </button>
        <button
          className={`filter-btn medium ${filterLevel === 'medium' ? 'active' : ''}`}
          onClick={() => setFilterLevel('medium')}
        >
          🟡 MEDIUM
        </button>
        <button
          className={`filter-btn low ${filterLevel === 'low' ? 'active' : ''}`}
          onClick={() => setFilterLevel('low')}
        >
          🟢 LOW
        </button>
      </div>

      {/* Alerts Feed */}
      <div className="alerts-container">
        {filteredAlerts.length === 0 ? (
          <div className="no-alerts">
            <span className="emoji">🛡️</span>
            <p>NO {filterLevel !== 'all' ? filterLevel.toUpperCase() + ' ' : ''} THREATS DETECTED</p>
            <p style={{ fontSize: '0.8rem', opacity: 0.7, textTransform: 'uppercase', fontStyle: 'italic', marginTop: '10px' }}>Your intelligence grid is clear.</p>
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
                <div className="alert-level-badge" style={{ 
                    backgroundColor: getAlertColor(alert.level),
                    color: alert.level === 'high' ? '#fff' : '#000'
                  }}>
                  {alert.level.toUpperCase()}
                </div>
              </div>

              {expandedAlert === index && (
                <div className="alert-expanded">
                  <div className="alert-details">
                    <div className="detail-section">
                      <h5>🎯 INTELLIGENCE RECOMMENDATION</h5>
                      <p style={{ fontWeight: 800, fontSize: '1rem' }}>{alert.action || 'Monitor carefully for volatility spikes.'}</p>
                    </div>

                    {alert.why_matters && alert.why_matters.length > 0 && (
                      <div className="detail-section">
                        <h5>📋 RISK THESIS</h5>
                        <ul>
                          {alert.why_matters.map((reason, i) => (
                            <li key={i}>{reason}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {alert.multi_agent_justification && Object.keys(alert.multi_agent_justification).length > 0 && (
                      <div className="detail-section">
                        <h5>🤖 MULTI-AGENT VETTING</h5>
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

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                      {alert.portfolio_impact && Object.keys(alert.portfolio_impact).length > 0 && (
                        <div className="detail-section">
                          <h5>💼 PORTFOLIO IMPACT</h5>
                          <div className="impact-details">
                            <div className="impact-row">
                              <span className="impact-label">DECISION:</span>
                              <span className="impact-value" style={{ color: '#FF3131' }}>{alert.portfolio_impact.action?.toUpperCase() || 'N/A'}</span>
                            </div>
                            <div className="impact-row">
                              <span className="impact-label">DIVERSIFICATION:</span>
                              <span className="impact-value">{alert.portfolio_impact.diversification_impact || 'None'}</span>
                            </div>
                          </div>
                        </div>
                      )}

                      {alert.confidence && (
                        <div className="detail-section">
                          <h5>📊 ALGORITHM METRICS</h5>
                          <div className="metrics-grid">
                            <div className="metric">
                              <span className="metric-label">Confidence</span>
                              <span className="metric-value">{alert.confidence.toFixed(1)}%</span>
                            </div>
                            <div className="metric">
                              <span className="metric-label">Severity</span>
                              <span className="metric-value">{alert.probability.toFixed(0)}%</span>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="alert-actions">
                    <button className="action-btn primary">VIEW FULL ANALYSIS</button>
                    <button className="action-btn secondary" onClick={(e) => { e.stopPropagation(); /* Dismiss logic */ }}>DISMISS</button>
                  </div>
                </div>
              )}

              <div className="alert-footer">
                <small>{expandedAlert === index ? 'CLICK TO COLLAPSE' : 'CLICK TO REVEAL DEEP ANALYSIS'}</small>
              </div>
            </div>
          ))
        )}
      </div>

      <div className="risk-alerts-footer">
        <small>LAST SYNC: {new Date(alerts?.generated_at || new Date()).toLocaleTimeString()}</small>
        <small>REAL-TIME MONITORING ENABLED</small>
      </div>

      <div className="risk-disclaimer">
        <strong>💡 INTELLIGENCE NOTE:</strong> Risk alerts are prioritized based on deep-learning models. High priority alerts suggest immediate portfolio reconsideration. Use data to supplement your own financial research.
      </div>
    </div>
  );
};

export default RiskAlerts;
