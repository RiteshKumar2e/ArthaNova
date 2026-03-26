import React, { useState, useEffect, useCallback } from 'react';
import { aiAPI } from '../api/client';
import '../styles/components/HighConvictionTrades.css';

const HighConvictionTrades = () => {
  const [trades, setTrades] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all'); // 'all', 'buy', 'sell'
  const [sortBy, setSortBy] = useState('confidence'); // 'confidence', 'rr_ratio'
  const [lastUpdate, setLastUpdate] = useState(new Date());

  const fetchHighConvictionTrades = useCallback(async () => {
    try {
      const response = await aiAPI.getHighConvictionTrades();
      setTrades(response.data);
      setError(null);
      setLastUpdate(new Date());
      setLoading(false);
    } catch (error) {
      console.error('Error fetching high-conviction trades:', error);
      setError('Failed to fetch high-conviction trades');
      setLoading(false);
      // Don't clear previous data on error - show stale data instead of nothing
    }
  }, []);

  useEffect(() => {
    fetchHighConvictionTrades();
    const interval = setInterval(fetchHighConvictionTrades, 60000); // Increased to 60s to reduce API load
    return () => clearInterval(interval);
  }, [fetchHighConvictionTrades]);

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
    if (signal.signal === 'BUY') return '#C4FF00'; // Lime
    if (signal.signal === 'SELL') return '#FF3131'; // Red
    return '#FFDD55'; // Yellow
  };

  const formatPrice = (price) => {
    if (!price) return 'N/A';
    return '₹' + price.toLocaleString(undefined, { minimumFractionDigits: 2 });
  };

  if (loading) {
    return (
      <div className="hc-trades-loading">
        <span style={{ fontSize: '3rem', display: 'block', marginBottom: '1rem' }}>🤖</span>
        <p>Crunching Market Intelligence...</p>
      </div>
    );
  }

  if (!trades || (!trades.buy_signals && !trades.sell_signals) || 
      ((trades.buy_signals || []).length === 0 && (trades.sell_signals || []).length === 0)) {
    return (
      <div className="hc-trades-empty">
        <div className="empty-message">
          <span className="emoji">📡</span>
          <p>Scanning Deep Markets...</p>
          <p style={{ fontSize: '0.8rem', opacity: 0.7 }}>No High Conviction Signals Detected Yet.</p>
        </div>
      </div>
    );
  }

  const filteredSignals = getFilteredSignals();

  return (
    <div className="high-conviction-trades animate-fadeIn">
      {/* Container Header */}
      <div className="hc-header">
        <div className="title-section">
          <h2>🔥 HIGH CONVICTION TRADES</h2>
          <span className="signal-count">{filteredSignals.length}</span>
        </div>
        <div className="controls">
          <select 
            value={filter} 
            onChange={(e) => setFilter(e.target.value)}
            className="filter-select"
          >
            <option value="all">ALL SIGNALS</option>
            <option value="buy">BUY ONLY</option>
            <option value="sell">SELL ONLY</option>
          </select>
          
          <select 
            value={sortBy} 
            onChange={(e) => setSortBy(e.target.value)}
            className="sort-select"
          >
            <option value="confidence">SORT BY CONFIDENCE</option>
            <option value="rr_ratio">SORT BY R:R RATIO</option>
          </select>
        </div>
      </div>

      {/* Global Criteria Info */}
      <div className="hc-criteria">
        <div className="criterion">
          <span className="icon">✓</span>
          <span className="text">CONFIDENCE ≥ {trades.confidence_threshold}%</span>
        </div>
        <div className="criterion">
          <span className="icon">✓</span>
          <span className="text">AGENTS ≥ {trades.confirmations_required}</span>
        </div>
        <div className="criterion">
          <span className="icon">✓</span>
          <span className="text">RISK-REWARD ≥ {trades.min_rr_ratio}</span>
        </div>
      </div>

      {/* Signals List */}
      <div className="hc-signals-container">
        {filteredSignals.length === 0 ? (
          <div className="no-filtered-signals hc-trades-empty">
             <span style={{ fontSize: '2rem', display: 'block' }}>🔍</span>
             NO {filter.toUpperCase()} SIGNALS MATCH CRITERIA
          </div>
        ) : (
          filteredSignals.map((signal, index) => (
            <div key={index} className="hc-signal-card">
              <div className="signal-header">
                <div className="signal-symbol">
                  <span className="symbol">{signal.symbol}</span>
                  <span 
                    className="signal-badge"
                    style={{ 
                      backgroundColor: getSignalColor(signal),
                      color: signal.signal === 'SELL' ? '#fff' : '#000'
                    }}
                  >
                    {signal.signal}
                  </span>
                </div>
                <div className="signal-metrics">
                  <div className="metric">
                    <span className="label">Confidence</span>
                    <span className="value">{signal.confidence.toFixed(1)}%</span>
                  </div>
                  <div className="metric">
                    <span className="label">R:R Ratio</span>
                    <span className="value">{signal.risk_reward_ratio.toFixed(2)}:1</span>
                  </div>
                  <div className="metric">
                    <span className="label">Win Prob.</span>
                    <span className="value">{signal.probability.toFixed(0)}%</span>
                  </div>
                </div>
              </div>

              {/* Price Strategy */}
              <div className="signal-prices">
                <div className="price-item">
                  <span className="price-label">Entry Range</span>
                  <span className="price-value">
                    {formatPrice(signal.entry_range.min)} - {formatPrice(signal.entry_range.max)}
                  </span>
                </div>
                <div className="price-item target">
                  <span className="price-label">🎯 Target Price</span>
                  <span className="price-value">{formatPrice(signal.target)}</span>
                </div>
                <div className="price-item stop-loss">
                  <span className="price-label">🛑 Hard Stop Loss</span>
                  <span className="price-value">{formatPrice(signal.stop_loss)}</span>
                </div>
              </div>

              {/* Logic Sections */}
              <div className="signal-why-matters">
                <h4>Signal Thesis</h4>
                {signal.why_matters && signal.why_matters.length > 0 ? (
                  <ul>
                    {signal.why_matters.map((reason, i) => (
                      <li key={i}>{reason}</li>
                    ))}
                  </ul>
                ) : (
                  <p style={{ fontSize: '0.8rem', fontWeight: 600 }}>Multi-Agent Confirmation Triggered</p>
                )}
              </div>

              <div className="signal-justification">
                <h4>Agent Intelligence Consensus</h4>
                <div className="agent-signals">
                  {signal.multi_agent_justification && Object.entries(signal.multi_agent_justification).map(([agent, details]) => (
                    <div key={agent} className="agent-item">
                      <span className="agent-name">{agent}</span>
                      <span 
                        className="agent-signal" 
                        style={{ color: details.signal === 'BUY' ? '#14a800' : details.signal === 'SELL' ? '#FF3131' : '#888' }}
                      >
                        {details.signal || 'NEUTRAL'}
                      </span>
                      <span className="agent-reasoning">{details.reasoning}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Portfolio Alignment */}
              <div className="signal-portfolio-impact">
                <h4>Portfolio Strategy</h4>
                <div className="impact-items">
                  <div className="impact-item">
                    <span className="label">Recommended Action</span>
                    <span className="value" style={{ color: getSignalColor(signal) }}>{signal.portfolio_impact?.action || 'MONITOR'}</span>
                  </div>
                  <div className="impact-item">
                    <span className="label">Impact Assessment</span>
                    <span className="value">{signal.portfolio_impact?.diversification_impact || 'BALANCED'}</span>
                  </div>
                </div>
              </div>

              <div className="signal-footer">
                <small>GEN: {new Date(signal.generated_at).toLocaleTimeString()}</small>
                <button className="action-btn">EXECUTE TRADE</button>
              </div>
            </div>
          ))
        )}
      </div>

      <div className="hc-footer">
        <small>LAST UPDATE: {lastUpdate.toLocaleTimeString()}</small>
        <small>ACTIVE SIGNALS: {trades.buy_signals.length}B / {trades.sell_signals.length}S</small>
      </div>

      <div className="hc-disclaimer">
        <strong>⚠️ DATA DISCLAIMER:</strong> These signals are calculated by ArthaNova AI Intelligence Grid based on real-time market parameters and multi-agent sentiment analysis. Intelligence is purely for informational purposes and does not constitute financial advice. Execute trades responsibly.
      </div>
    </div>
  );
};

export default HighConvictionTrades;
