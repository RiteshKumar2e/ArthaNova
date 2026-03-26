import React, { useState, useEffect } from 'react';
import { aiAPI, dealsAPI } from '../../../../api/client';
import styles from './DealsTrackerPage.module.css';

export default function DealsTrackerPage() {
  const [loading, setLoading] = useState(true);
  const [deals, setDeals] = useState([]);
  const [activeAnalysis, setActiveAnalysis] = useState(null);
  const [analyzingSymbol, setAnalyzingSymbol] = useState(null);

  useEffect(() => {
    const fetchDeals = async () => {
      try {
        const res = await dealsAPI.list();
        setDeals(res.data || []);
      } catch (err) {
        console.error('Failed to fetch deals', err);
      } finally {
        setLoading(false);
      }
    };
    fetchDeals();
  }, []);

  const analyzeDeal = async (symbol) => {
    setAnalyzingSymbol(symbol);
    try {
      const res = await aiAPI.getBulkDealAnalysis(symbol);
      setActiveAnalysis(res.data);
    } catch (err) {
      console.error('AI Analysis failed', err);
    } finally {
      setAnalyzingSymbol(null);
    }
  };

  if (loading) {
     return (
       <div className="page-wrapper text-center" style={{ padding: '100px' }}>
         <div className="neo-tag cyan animate-pulse">📡 SYNCHRONIZING WITH NSE DATA STREAMS...</div>
       </div>
     );
  }

  return (
    <div className="page-wrapper animate-fadeIn">
      <div className="page-header">
        <div>
          <h1 className="page-title">🤝 BULK & BLOCK DEALS</h1>
          <p className="page-subtitle">Real-Time Institutional Money Flow Tracking</p>
        </div>
      </div>

      <div className={styles.layout}>
        <div className={styles.dealsList}>
          <div className={styles.listHeader}>
             <span>SYMBOL</span>
             <span>CLIENT</span>
             <span>TYPE</span>
             <span>VALUE</span>
             <span>ACTION</span>
          </div>
          <div className={styles.scrollArea}>
            {deals.length === 0 ? (
              <div style={{ padding: '40px', textAlign: 'center', fontWeight: 900 }}>NO DEALS DETECTED IN LAST 24H.</div>
            ) : (
              deals.map((deal, idx) => (
                <div key={idx} className={styles.dealRow}>
                  <div className={styles.symbolCol}>
                    <div className={styles.symbol}>{deal.symbol}</div>
                    <div className={styles.date}>{deal.date}</div>
                  </div>
                  <div className={styles.clientCol}>{deal.clientName}</div>
                  <div className={styles.typeCol}>
                    <span className={`${styles.typeBadge} ${deal.buySell === 'S' ? styles.sell : styles.buy}`}>
                      {deal.buySell === 'S' ? 'SELL' : 'BUY'}
                    </span>
                  </div>
                  <div className={styles.valueCol}>₹{(deal.quantity * deal.price / 10000000).toFixed(1)} Cr</div>
                  <div className={styles.actionCol}>
                    <button 
                      className="btn btn-sm btn-black" 
                      onClick={() => analyzeDeal(deal.symbol)}
                      disabled={analyzingSymbol === deal.symbol}
                    >
                      {analyzingSymbol === deal.symbol ? '...' : 'AI ANALYZE'}
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        <div className={styles.analysisPane}>
           {activeAnalysis ? (
             <div className={styles.analysisContent}>
                <div className={styles.paneHeader}>
                  <span className="neo-tag lime">SENTINEL ANALYSIS</span>
                  <button onClick={() => setActiveAnalysis(null)} className={styles.closeBtn}>✕</button>
                </div>
                <h3 className={styles.dealTitle}>{activeAnalysis.title}</h3>
                <div className={styles.statRow}>
                   <div className={styles.stat}>
                      <div className={styles.statLabel}>SEVERITY</div>
                      <div className={styles.statVal} style={{ color: activeAnalysis.severity === 'HIGH' ? 'red' : 'orange' }}>{activeAnalysis.severity}</div>
                   </div>
                   <div className={styles.stat}>
                      <div className={styles.statLabel}>CONFIDENCE</div>
                      <div className={styles.statVal}>{activeAnalysis.recommendation.confidence}%</div>
                   </div>
                </div>
                
                <div className={styles.aiText}>
                   {activeAnalysis.ai_analysis}
                </div>

                <div className={styles.recBox}>
                   <div className={styles.recLabel}>STRATEGIC ACTION</div>
                   <div className={styles.recVal}>{activeAnalysis.recommendation.action}</div>
                   <p className={styles.recRationale}>{activeAnalysis.recommendation.rationale}</p>
                </div>

                <div className={styles.orchestration}>
                   <div className={styles.orchTitle}>MULTI-AGENT TRACE</div>
                   <div className={styles.agentChain}>
                      {activeAnalysis.orchestrationData.agents_used.map(agent => (
                        <span key={agent} className={styles.agentTag}>{agent}</span>
                      ))}
                   </div>
                </div>
             </div>
           ) : (
             <div className={styles.emptyPane}>
                <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🤖</div>
                <p>SELECT A DEAL TO INITIALIZE <br/><strong>DEEP AGENTIC ANALYSIS</strong></p>
             </div>
           )}
        </div>
      </div>
    </div>
  );
}
