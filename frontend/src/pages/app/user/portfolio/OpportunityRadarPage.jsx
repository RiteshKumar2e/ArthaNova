import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { aiAPI } from '../../../../api/client'
import styles from '../../../../styles/pages/app/user/portfolio/OpportunityRadarPage.module.css'

export default function OpportunityRadarPage() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    aiAPI.opportunityRadar()
      .then((res) => setData(res.data))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="page-wrapper animate-fadeIn">
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.pageTitle}>OPPORTUNITY RADAR</h1>
          <p className={styles.pageSubtitle}>Scanning real-time NSE data for high-conviction signals</p>
        </div>
      </div>

      {loading && (
        <div className={styles.radarScannerContainer}>
          <div className={styles.radarScanner} />
          <h2 className={styles.scanningTitle}>SCANNING MARKETS...</h2>
          <p className={styles.scanningSubtitle}>AI agents are currently analyzing institutional order flow and technical structures.</p>
        </div>
      )}

      {!loading && (
        <>
          <div className={styles.metricsGrid}>
            {[
              { title: 'TOTAL SIGNALS', val: data?.signals?.length || 0, icon: '📡', bg: '#C4FF00' },
              { title: 'ACTIVE SECTORS', val: new Set(data?.signals?.map(s => s.sector).filter(Boolean)).size || 0, icon: '🏢', bg: '#FF6AC1' },
              { title: 'AVG CONFIDENCE', val: `${Math.round((data?.signals?.reduce((a, b) => a + b.confidence_score, 0) || 0) / (data?.signals?.length || 1))}%`, icon: '🎯', bg: '#FFDD55' },
            ].map((m) => (
              <div key={m.title} className={styles.metricCard} style={{ background: m.bg }}>
                <div className={styles.metricHeader}>
                  <div className={styles.metricLabel}>{m.title}</div>
                  <span style={{ fontSize: '1.2rem' }}>{m.icon}</span>
                </div>
                <div className={styles.metricValue}>{m.val}</div>
              </div>
            ))}
          </div>

          <div className={styles.signalsList}>
            {data?.signals?.map((signal, i) => (
              <div key={i} className={styles.signalItem}>
                <div className={styles.signalSidebar}>
                  <div className={styles.signalSymbol}>
                    <Link to={`/stocks/${signal.symbol}`}>{signal.symbol}</Link>
                  </div>
                  <div className={styles.signalType}>{signal.type}</div>
                  <div className={`${styles.sentimentBadge} ${signal.sentiment === 'Bullish' ? 'badge-success' : 'badge-danger'}`}>
                    {signal.sentiment?.toUpperCase()}
                  </div>
                   <div className={styles.confidenceContainer}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                      <div className={styles.confidenceLabel}>AGENT CONFIDENCE</div>
                      <span className="badge badge-yellow" style={{ fontSize: '10px' }}>{signal.success_probability} SUCCESS RATE</span>
                    </div>
                    <div className={styles.confidenceBarWrapper}>
                      <div className={styles.confidenceBarBg}>
                        <div className={styles.confidenceBarFill} style={{ width: `${signal.confidence}%` }} />
                        <span className={styles.confidenceText}>{signal.confidence}%</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className={styles.signalMain}>
                  <div>
                    <p className={styles.signalDescription}>
                      {signal.description}
                    </p>
                    <div className={styles.signalTags}>
                      {signal.sources?.map((src, j) => (
                        <span key={j} className={`badge ${styles.tagSource}`}>
                          📋 {src?.toUpperCase()}
                        </span>
                      ))}
                      {signal.catalysts?.map((cat, j) => (
                        <span key={j} className={`badge ${styles.tagCatalyst}`}>
                          ⚡ {cat?.toUpperCase()}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className={styles.signalFooter}>
                    <div className={styles.footerMetrics}>
                      <div>
                        <div className={styles.footerMetricLabel}>TARGET</div>
                        <div className={styles.footerMetricValue}>₹{signal.target_price}</div>
                      </div>
                      <div>
                        <div className={styles.footerMetricLabel}>STOP LOSS</div>
                        <div className={styles.footerMetricValue}>₹{signal.stop_loss}</div>
                      </div>
                      <div>
                        <div className={styles.footerMetricLabel}>R:R RATIO</div>
                        <div className={styles.footerMetricValue}>{signal.risk_reward}</div>
                      </div>
                      <div>
                        <div className={styles.footerMetricLabel}>TIMEFRAME</div>
                        <div className={styles.footerMetricValue}>{signal.timeframe?.toUpperCase()}</div>
                      </div>
                    </div>

                    <Link to={`/stocks/${signal.symbol}`} className={`btn btn-primary ${styles.viewBtn}`}>
                      VIEW DETAIL →
                    </Link>
                  </div>
                </div>
              </div>
            ))}
            {data?.signals?.length === 0 && (
              <div className={styles.noSignals}>
                <div className={styles.noSignalsIcon}>📡</div>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 950, textTransform: 'uppercase', marginBottom: 8 }}>NO HIGH-CONFIDENCE SIGNALS</h3>
                <p style={{ color: '#444', fontWeight: 700, fontSize: '0.85rem' }}>The radar is scanning the market. Check back soon for new opportunities.</p>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  )
}
