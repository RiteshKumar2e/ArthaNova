import React, { useState, useEffect } from 'react';
import { useAuthStore } from '../store/authStore';
import '../styles/components/HighConvictionTrades.scss';

const HighConvictionTrades = () => {
  const { accessToken } = useAuthStore();
  const [trades, setTrades] = useState(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // 'all', 'buy', 'sell'
  const [sortBy, setSortBy] = useState('confidence'); // 'confidence', 'rr_ratio'

  useEffect(() => {
    if (accessToken) {
      fetchHighConvictionTrades();
      const interval = setInterval(fetchHighConvictionTrades, 30000); // Refresh every 30s
      return () => clearInterval(interval);
    }
  }, [accessToken]);

  const fetchHighConvictionTrades = async () => {
    try {
      const response = await fetch('/api/v1/ai/high-conviction-trades', {
        headers: { Authorization: `Bearer ${accessToken}` }
      });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const data = await response.json();
      setTrades(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching high-conviction trades:', error);
    }
  };

  const getFilteredSignals = () => {
    if (!trades) return [];
    
    let signals = [];
    if (filter === 'buy' || filter === 'all') {
      signals = [...signals, ...trades.buy_signals];
    }
    if (filter === 'sell' || filter === 'all') {
      signals = [...signals, ...trades.sell_signals];
    }

    // Sort
    return signals.sort((a, b) => {
      if (sortBy === 'confidence') {
        return b.confidence - a.confidence;
      } else if (sortBy === 'rr_ratio') {
        return b.risk_reward_ratio - a.risk_reward_ratio;
      }
      return 0;
    });
  };

  const getSignalColor = (signal) => {
    if (signal.signal === 'BUY') return '#10b981';
    if (signal.signal === 'SELL') return '#ef4444';
    return '#f59e0b';
  };

  const formatPrice = (price) => {
    if (!price) return 'N/A';
    return '₹' + price.toFixed(2);
  };

  if (loading) {
    return <div className="hc-trades-loading">⏳ Loading high-conviction trades...</div>;
  }

  if (!trades || (trades.buy_signals.length === 0 && trades.sell_signals.length === 0)) {
    return (
      <div className="hc-trades-empty">
        <div className="empty-message">
          <span className="emoji">📊</span>
          <p>No high-conviction signals at the moment</p>
          <small>Check back soon for multi-agent confirmed opportunities</small>
        </div>
      </div>
    );
  }

  const filteredSignals = getFilteredSignals();

  return (
    <div className="high-conviction-trades">
      <div className="hc-header">
        <div className="title-section">
          <h2>🔥 High Conviction Trades</h2>
          <span className="signal-count">{filteredSignals.length}</span>
        </div>
        <div className="controls">
          <select 
            value={filter} 
            onChange={(e) => setFilter(e.target.value)}
            className="filter-select"
          >
            <option value="all">All Signals</option>
            <option value="buy">Buy Only</option>
            <option value="sell">Sell Only</option>
          </select>
          
          <select 
            value={sortBy} 
            onChange={(e) => setSortBy(e.target.value)}
            className="sort-select"
          >
            <option value="confidence">Sort by Confidence</option>
            <option value="rr_ratio">Sort by R:R Ratio</option>
          </select>
        </div>
      </div>

      <div className="hc-criteria">
        <div className="criterion">
          <span className="icon">✓</span>
          <span className="text">Confidence ≥ {trades.confidence_threshold}</span>
        </div>
        <div className="criterion">
          <span className="icon">✓</span>
          <span className="text">{trades.confirmations_required} confirmations</span>
        </div>
        <div className="criterion">
          <span className="icon">✓</span>
          <span className="text">Risk-Reward ≥ {trades.min_rr_ratio}</span>
        </div>
      </div>

      <div className="hc-signals-container">
        {filteredSignals.length === 0 ? (
          <div className="no-filtered-signals">
            No {filter} signals match your criteria
          </div>
        ) : (
          filteredSignals.map((signal, index) => (
            <div key={index} className="hc-signal-card">
              <div className="signal-header">
                <div className="signal-symbol">
                  <span className="symbol">{signal.symbol}</span>
                  <span 
                    className="signal-badge"
                    style={{ backgroundColor: getSignalColor(signal) }}
                  >
                    {signal.signal}
                  </span>
                </div>
                <div className="signal-metrics">
                  <div className="metric confidence">
                    <span className="label">Confidence</span>
                    <span className="value">{signal.confidence.toFixed(1)}%</span>
                  </div>
                  <div className="metric rr-ratio">
                    <span className="label">R:R</span>
                    <span className="value">{signal.risk_reward_ratio.toFixed(2)}:1</span>
                  </div>
                  <div className="metric probability">
                    <span className="label">Probability</span>
                    <span className="value">{signal.probability.toFixed(0)}%</span>
                  </div>
                </div>
              </div>

              <div className="signal-prices">
                <div className="price-item">
                  <span className="price-label">Entry Range</span>
                  <span className="price-value">
                    {formatPrice(signal.entry_range.min)} - {formatPrice(signal.entry_range.max)}
                  </span>
                </div>
                <div className="price-item target">
                  <span className="price-label">🎯 Target</span>
                  <span className="price-value">{formatPrice(signal.target)}</span>
                </div>
                <div className="price-item stop-loss">
                  <span className="price-label">🛑 Stop Loss</span>
                  <span className="price-value">{formatPrice(signal.stop_loss)}</span>
                </div>
              </div>

              <div className="signal-why-matters">
                <h4>Why This Matters</h4>
                {signal.why_matters && signal.why_matters.length > 0 ? (
                  <ul>
                    {signal.why_matters.map((reason, i) => (
                      <li key={i}>{reason}</li>
                    ))}
                  </ul>
                ) : (
                  <p>Multi-signal confirmation detected</p>
                )}
              </div>

              <div className="signal-justification">
                <h4>Multi-Agent Justification</h4>
                <div className="agent-signals">
                  {signal.multi_agent_justification && Object.entries(signal.multi_agent_justification).map(([agent, details]) => (
                    <div key={agent} className="agent-item">
                      <span className="agent-name">{agent}</span>
                      <span className="agent-signal" style={{ color: getSignalColor({ signal: details.signal || 'NEUTRAL' }) }}>
                        {details.signal || 'NEUTRAL'}
                      </span>
                      <span className="agent-reasoning">{details.reasoning}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="signal-portfolio-impact">
                <h4>Portfolio Impact</h4>
                <div className="impact-items">
                  <div className="impact-item">
                    <span className="label">Action</span>
                    <span className="value">{signal.portfolio_impact?.action || 'N/A'}</span>
                  </div>
                  <div className="impact-item">
                    <span className="label">Diversification</span>
                    <span className="value">{signal.portfolio_impact?.diversification_impact || 'Check portfolio balance'}</span>
                  </div>
                </div>
              </div>

              <div className="signal-footer">
                <small>Generated: {new Date(signal.generated_at).toLocaleString()}</small>
                <button className="action-btn">View Details</button>
              </div>
            </div>
          ))
        )}
      </div>

      <div className="hc-footer">
        <small>Last updated: {new Date(trades.generated_at).toLocaleTimeString()}</small>
        <small>Total signals: {trades.buy_signals.length} BUY + {trades.sell_signals.length} SELL</small>
      </div>

      <div className="hc-disclaimer">
        <strong>⚠️ Disclaimer:</strong> These signals are AI-generated for informational purposes only. 
        Not financial advice. Always do your own research and consult with a financial advisor.
      </div>
    </div>
  );
};

export default HighConvictionTrades;
