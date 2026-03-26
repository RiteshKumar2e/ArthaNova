import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { stocksAPI } from '../../../../api/client';
import styles from '../../../../styles/pages/app/user/research/TechnicalAnalysis.module.css';

export default function TechnicalAnalysisPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedSymbol, setSelectedSymbol] = useState('RELIANCE');
  const [technicalData, setTechnicalData] = useState(null);
  const [screenerData, setScreenerData] = useState([]);

  const SCREENER_SYMBOLS = ['RELIANCE', 'TCS', 'HDFCBANK', 'INFY', 'ICICIBANK', 'BAJFINANCE', 'BHARTIARTL', 'SBIN', 'LT', 'ITC'];

  useEffect(() => {
    loadScreenerData();
    handleSelectStock('RELIANCE');
  }, []);

  const loadScreenerData = async () => {
    setLoading(true);
    setError(null);
    try {
      const results = [];
      // To avoid rate limiting, we limit parallel calls
      const symbolsToProcess = SCREENER_SYMBOLS.slice(0, 6); 
      
      const promises = symbolsToProcess.map(symbol => 
        stocksAPI.getTechnicals(symbol)
          .then(res => res.data)
          .catch(e => null)
      );

      const resolved = await Promise.all(promises);
      setScreenerData(resolved.filter(Boolean));
    } catch (error) {
      console.error('Error loading screener data:', error);
      setError('Failed to load real-time screener. API limits may be reached.');
    } finally {
      setLoading(false);
    }
  };

  const handleSelectStock = async (symbol) => {
    setSelectedSymbol(symbol);
    setLoading(true);
    try {
      const response = await stocksAPI.getTechnicals(symbol);
      setTechnicalData(response.data);
    } catch (error) {
      console.error('Error loading technical data:', error);
      toast.error(`Failed to load technicals for ${symbol}`);
    } finally {
      setLoading(false);
    }
  };

  const getTrendColor = (trend) => {
    switch (trend) {
      case 'BULLISH': return '#14a800';
      case 'BEARISH': return '#ff4444';
      default: return '#ff9900';
    }
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1>📊 CHART PATTERN INTELLIGENCE</h1>
        <p>Real-time Pattern Detection & Success Calibration for Indian Equities</p>
      </header>

      <section className={styles.screenerSection}>
        <div className={styles.sectionTitleRow}>
           <h2 style={{margin: 0}}>LIVE UNIVERSE SCANNER</h2>
           <button onClick={loadScreenerData} className="btn btn-sm" style={{border: '3px solid #000'}}>🔄 RE-SCAN NSE</button>
        </div>
        <div className={styles.screenerGrid}>
          {screenerData.map((stock) => (
            <div 
              key={stock.symbol} 
              className={styles.screenerCard}
              onClick={() => handleSelectStock(stock.symbol)}
              style={{
                borderColor: getTrendColor(stock.trend),
                background: selectedSymbol === stock.symbol ? '#f0f0f0' : '#fff',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
            >
              <h3 style={{fontSize: '1rem'}}>{stock.symbol}</h3>
              <p className={styles.price}>₹{stock.price.toFixed(2)}</p>
              <div className={styles.trend} style={{ color: getTrendColor(stock.trend), fontWeight: 950, fontSize: '0.7rem' }}>
                {stock.trend}
              </div>
              <p className={styles.signals} style={{fontSize: '0.65rem'}}>
                🟢 {stock.bullSignals} | 🔴 {stock.bearSignals}
              </p>
            </div>
          ))}
          {screenerData.length === 0 && !loading && (
             <p style={{gridColumn: '1/-1', textAlign: 'center', padding: '1rem', fontWeight: 700}}>Scanning the market... Please wait.</p>
          )}
        </div>
      </section>

      {technicalData && (
        <section className={styles.detailedAnalysis}>
          <div className={styles.analysisHeader}>
             <h2 style={{margin: 0}}>{technicalData.symbol} - AGENTIC ANALYSIS</h2>
             <span style={{background: '#000', color: '#fff', padding: '10px 15px', fontSize: '0.8rem', fontWeight: 900, border: '3px solid #C4FF00', boxShadow: '4px 4px 0px #000'}}>{technicalData.source}</span>
          </div>
          
          <div className={styles.mainGrid}>
            <div className={styles.leftColumn}>
              <div className={styles.card}>
                <h3>TREND BIAS</h3>
                <div className={styles.trendBox} style={{ borderColor: getTrendColor(technicalData.trend), background: '#fff' }}>
                  <p className={styles.trendLabel} style={{ color: getTrendColor(technicalData.trend), margin: 0, fontSize: '2rem' }}>
                    {technicalData.trend}
                  </p>
                  <p className={styles.strength} style={{fontWeight: 800, color: '#666'}}>
                    {technicalData.bullSignals > 5 ? 'VERY STRONG CONVICTION' : 'MODERATE STRENGTH'}
                  </p>
                  <div style={{height: '10px', background: '#eee', border: '2px solid #000', marginTop: '1rem', overflow: 'hidden'}}>
                     <div style={{height: '100%', background: getTrendColor(technicalData.trend), width: `${Math.min(100, (technicalData.bullSignals / 8) * 100)}%`}}></div>
                  </div>
                </div>
              </div>

              <div className={styles.card}>
                <h3>OSCILLATORS</h3>
                <div className={styles.indicatorList}>
                  <IndicatorRow 
                    name="RSI (14)" 
                    value={technicalData.indicators.rsi14?.toFixed(2)}
                    status={technicalData.indicators.rsi14 < 30 ? 'OVERSOLD' : technicalData.indicators.rsi14 > 70 ? 'OVERBOUGHT' : 'NEUTRAL'}
                  />
                  <IndicatorRow 
                    name="RSI (7)" 
                    value={technicalData.indicators.rsi7?.toFixed(2)}
                  />
                  <IndicatorRow 
                    name="MOMENTUM" 
                    value={(technicalData.bullSignals - technicalData.bearSignals).toFixed(1)}
                    status={technicalData.trend}
                  />
                </div>
              </div>

              <div className={styles.card}>
                <h3>PIVOTS & LEVELS</h3>
                <div className={styles.levelsList}>
                  <Level label="LTP" value={technicalData.price} color="#000" />
                  <Level label="SMA 20 (SUPPORT)" value={technicalData.indicators.sma20} />
                  <Level label="SMA 50 (BASELINE)" value={technicalData.indicators.sma50} />
                  <Level label="UPPER BOUND" value={technicalData.indicators.bollinger?.upper} color="#ff9900" />
                  <Level label="LOWER BOUND" value={technicalData.indicators.bollinger?.lower} color="#ff4444" />
                </div>
              </div>
            </div>

            <div className={styles.rightColumn}>
              <div className={styles.card}>
                <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem'}}>
                  <h3 style={{margin: 0}}>PATTERN RECOGNITION</h3>
                  <span style={{fontSize: '0.6rem', fontWeight: 800, color: '#777'}}>SCANNING 100 CANDLES...</span>
                </div>
                <div className={styles.patternList}>
                  {technicalData.patterns.length > 0 ? (
                    technicalData.patterns.map((p, idx) => (
                      <div key={idx} className={styles.patternItem} style={{ borderLeft: `6px solid ${p.status === 'BULLISH' ? '#14a800' : '#ff4444'}`, background: '#fcfcfc', padding: '0.8rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                          <span style={{ fontWeight: 950, textTransform: 'uppercase', fontSize: '0.85rem' }}>{p.name}</span>
                          <span className="badge badge-yellow" style={{ fontSize: '10px', color: '#000', fontWeight: 950 }}>{p.success_rate} SUCCESS</span>
                        </div>
                        <p style={{ margin: 0, fontSize: '0.75rem', color: '#333', lineHeight: '1.4', fontWeight: 600 }}>{p.explanation}</p>
                      </div>
                    ))
                  ) : (
                    <div style={{ textAlign: 'center', padding: '2rem' }}>
                       <p style={{ fontSize: '0.8rem', color: '#666', fontWeight: 700 }}>No major technical patterns detected currently.</p>
                       <p style={{ fontSize: '0.65rem', color: '#999' }}>Price action is within normal volatility ranges.</p>
                    </div>
                  )}
                </div>
              </div>

              <div className={styles.card} style={{background: '#000', color: '#C4FF00', border: 'none'}}>
                <h3>TACTICAL INTELLIGENCE</h3>
                <div className={styles.tradeSetup} style={{background: 'transparent', color: '#C4FF00', padding: 0}}>
                  <div style={{display: 'flex', flexDirection: 'column', gap: '0.5rem'}}>
                    <div style={{display: 'flex', justifyContent: 'space-between'}}>
                      <span>BIAS:</span>
                      <strong style={{fontSize: '1.1rem'}}>{technicalData.trend}</strong>
                    </div>
                    <div style={{display: 'flex', justifyContent: 'space-between'}}>
                      <span>SIGNAL STRENGTH:</span>
                      <strong>{technicalData.bullSignals + technicalData.bearSignals} TOTAL</strong>
                    </div>
                    <div style={{borderTop: '1px solid #333', marginTop: '0.5rem', paddingTop: '0.5rem'}}>
                       <p style={{margin: 0, fontSize: '0.75rem', color: '#fff'}}><strong>AI NOTE:</strong> {technicalData.trend === 'BULLISH' ? 'Price is holding above SMA-20. Momentum favors long entries on minor pullbacks.' : 'Price under pressure below SMA-20. Sell-on-rise strategy recommended.'}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {loading && (
        <div className={styles.loading}>
          <div className={styles.spinner}></div>
          <p>AGENTIC ENGINE SCANNING NSE UNIVERSE...</p>
        </div>
      )}
    </div>
  );
}

function IndicatorRow({ name, value, status }) {
  let statusColor = '#aaa';
  if (status === 'OVERSOLD' || status === 'BULLISH') statusColor = '#14a800';
  if (status === 'OVERBOUGHT' || status === 'BEARISH') statusColor = '#ff4444';

  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px', borderBottom: '2px solid #000', fontSize: '0.85rem' }}>
      <span style={{fontWeight: 700}}>{name}</span>
      <div>
        <span style={{ marginRight: '10px', fontWeight: '900' }}>{value}</span>
        {status && <span style={{ color: statusColor, fontWeight: 950, fontSize: '0.7rem' }}>[{status}]</span>}
      </div>
    </div>
  );
}

function Level({ label, value, color }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px', borderBottom: '2px solid #000', fontSize: '0.85rem' }}>
      <span style={{fontWeight: 700}}>{label}</span>
      <span style={{ color: color || '#14a800', fontWeight: '900' }}>
        ₹{parseFloat(value)?.toFixed(2) || 'N/A'}
      </span>
    </div>
  );
}
