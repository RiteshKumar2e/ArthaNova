import React, { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { aiAPI } from '../api/client';
import '../styles/components/HighConvictionTrades.css';

const HighConvictionTrades = () => {
  const [trades, setTrades] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all'); // 'all', 'buy', 'sell'
  const [sortBy, setSortBy] = useState('confidence'); // 'confidence', 'rr_ratio'
  const [lastUpdate, setLastUpdate] = useState(new Date());
  const navigate = useNavigate();

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
    }
  }, []);

  useEffect(() => {
    fetchHighConvictionTrades();
    const interval = setInterval(fetchHighConvictionTrades, 60000);
    return () => clearInterval(interval);
  }, [fetchHighConvictionTrades]);

  const getFilteredSignals = () => {
    if (!trades) return [];
    
    let signals = [];
    if (filter === 'buy' || filter === 'all') {
      signals = [...signals, ...(trades.buy_signals || [])];
    }
    if (filter === 'sell' || filter === 'all') {
      signals = [...signals, ...(trades.sell_signals || [])];
    }

    return signals.sort((a, b) => {
      if (sortBy === 'confidence') {
        return b.confidence - a.confidence;
      } else if (sortBy === 'rr_ratio') {
        return b.risk_reward_ratio - a.risk_reward_ratio;
      }
      return 0;
    });
  };

  const formatPrice = (price) => {
    if (price === undefined || price === null) return '₹0.00';
    return '₹' + price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };

  if (loading) {
    return (
      <div className="hc-trades-loading">
        <span className="loading-emoji">🤖</span>
        <p>Crunching Market Intelligence...</p>
      </div>
    );
  }

  if (!trades || (!trades.buy_signals && !trades.sell_signals)) {
    return (
      <div className="hc-trades-empty">
        <div className="empty-message">
          <span className="emoji">📡</span>
          <p>Scanning Deep Markets...</p>
          <p className="sub-text">No High Conviction Signals Detected Yet.</p>
        </div>
      </div>
    );
  }

  const filteredSignals = getFilteredSignals();

  return (
    <div className="high-conviction-trades animate-fadeIn">
      {/* Header with Title and Control Buttons */}
      <div className="hc-header">
        <div className="title-section">
          <h2>🔥 HIGH CONVICTION TRADES</h2>
          <span className="signal-count">{filteredSignals.length}</span>
        </div>
        <div className="controls">
          <button 
            className={`control-btn ${filter === 'all' ? 'active' : ''}`}
            onClick={() => setFilter('all')}
          >
            ALL SIGNALS
          </button>
          <button 
            className={`control-btn ${sortBy === 'confidence' ? 'active' : ''}`}
            onClick={() => setSortBy(sortBy === 'confidence' ? 'rr_ratio' : 'confidence')}
          >
            {sortBy === 'confidence' ? 'SORT BY CONFIDENCE' : 'SORT BY R:R RATIO'}
          </button>
        </div>
      </div>

      {/* Global Criteria Info Bar */}
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

      {/* Signals List Layout */}
      <div className="hc-signals-container">
        {filteredSignals.length === 0 ? (
          <div className="no-filtered-signals hc-trades-empty">
             <span className="search-emoji">🔍</span>
             NO {filter.toUpperCase()} SIGNALS MATCH CRITERIA
          </div>
        ) : (
          filteredSignals.map((signal, index) => (
            <div key={`${signal.symbol}-${index}`} className="hc-signal-card">
              {/* Card Header: Symbol + Side Button */}
              <div className="signal-card-header">
                <Link to={`/stocks/${signal.symbol}`} className="symbol-link">
                  <h3 className="symbol-name">{signal.symbol}</h3>
                </Link>
                <div className={`signal-action-badge ${signal.signal.toLowerCase()}`}>
                  {signal.signal}
                </div>
              </div>

              {/* Top Row: Key Metrics */}
              <div className="signal-metrics-row">
                <div className="metric-box">
                  <span className="m-label">CONFIDENCE</span>
                  <span className="m-value">{signal.confidence.toFixed(1)}%</span>
                </div>
                <div className="metric-box">
                  <span className="m-label">R:R RATIO</span>
                  <span className="m-value">{signal.risk_reward_ratio.toFixed(2)}:1</span>
                </div>
                <div className="metric-box">
                  <span className="m-label">WIN PROB.</span>
                  <span className="m-value">{signal.probability.toFixed(0)}%</span>
                </div>
              </div>

              {/* Price Ranges & Levels */}
              <div className="signal-price-levels">
                <div className="price-row entry">
                  <span className="p-label">ENTRY RANGE</span>
                  <span className="p-value">
                    {formatPrice(signal.entry_range?.min)} - {formatPrice(signal.entry_range?.max)}
                  </span>
                </div>
                <div className="price-row target-level">
                  <span className="p-label"><span className="p-icon">🎯</span> TARGET PRICE</span>
                  <span className="p-value">{formatPrice(signal.target)}</span>
                </div>
                <div className="price-row stop-level">
                  <span className="p-label"><span className="p-icon">🛑</span> HARD STOP LOSS</span>
                  <span className="p-value">{formatPrice(signal.stop_loss)}</span>
                </div>
              </div>

              {/* Logic Thesis Section */}
              <div className="signal-thesis-section">
                <h4 className="thesis-title">SIGNAL THESIS</h4>
                <ul className="thesis-list">
                  {signal.why_matters && signal.why_matters.length > 0 ? (
                    signal.why_matters.map((reason, i) => (
                      <li key={i}>{reason}</li>
                    ))
                  ) : (
                    <li>Multi-Agent Consensus Triggered</li>
                  )}
                </ul>
              </div>

              {/* Simple Footer/Action if needed */}
              <div className="signal-card-footer">
                <span className="gen-time">GEN AT: {new Date(signal.generated_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                <button 
                  className="trade-btn" 
                  onClick={() => navigate(`/stocks/${signal.symbol}`)}
                >
                  EXECUTE
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      <div className="hc-bottom-disclaimer">
        <span>⚠️ REAL-TIME AI INTELLIGENCE GRID | NO FINANCIAL ADVICE</span>
        <span className="last-sync">SYCHRONIZED: {lastUpdate.toLocaleTimeString()}</span>
      </div>
    </div>
  );
};

export default HighConvictionTrades;


