import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { aiAPI } from '../../api/client'
import styles from '../../styles/pages/app/OpportunityRadarPage.module.css'

export default function OpportunityRadarPage() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    aiAPI.opportunityRadar()
      .then((res) => setData(res.data))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <div className="page-wrapper"><div className="spinner" style={{ margin: '60px auto' }} /></div>

  return (
    <div className="page-wrapper animate-fadeIn">
      <div className="page-header">
        <div>
          <h1 className="page-title">Opportunity Radar 🎯</h1>
          <p className="page-subtitle">AI-curated high-confidence setups from technicals, fundamentals, and insider activity</p>
        </div>
        <div style={{ display: 'flex', gap: 12 }}>
          <span className="badge badge-info" style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
            <span>Last scanned:</span> <strong>{data?.last_scanned ? new Date(data.last_scanned).toLocaleTimeString() : 'Now'}</strong>
          </span>
          <button className="btn btn-secondary btn-sm">⚙️ Filters</button>
        </div>
      </div>

      <div className="grid-3" style={{ marginBottom: 30 }}>
        {[
          { title: 'Total Signals', val: data?.signals?.length || 0, icon: '📡', bg: 'var(--color-primary-light)' },
          { title: 'Active Sectors', val: new Set(data?.signals?.map(s => s.sector).filter(Boolean)).size || 0, icon: '🏢', bg: 'var(--color-secondary-light)' },
          { title: 'Avg Confidence', val: `${Math.round((data?.signals?.reduce((a, b) => a + b.confidence_score, 0) || 0) / (data?.signals?.length || 1))}%`, icon: '🎯', bg: 'var(--color-yellow)' },
        ].map((m) => (
          <div key={m.title} className="metric-card" style={{ border: '4px solid #000', boxShadow: '6px 6px 0px #000', background: m.bg }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
              <div className="metric-label" style={{ fontWeight: 900, textTransform: 'uppercase', color: '#000' }}>{m.title}</div>
              <span style={{ fontSize: '1.5rem' }}>{m.icon}</span>
            </div>
            <div className="metric-value" style={{ fontSize: '2.5rem', fontWeight: 900, color: '#000' }}>{m.val}</div>
          </div>
        ))}
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
        {data?.signals?.map((signal, i) => (
          <div key={i} className="card" style={{ display: 'flex', gap: 30, padding: 30, border: '4px solid #000', boxShadow: '10px 10px 0px #000', background: 'white' }}>
            <div style={{ width: 160, flexShrink: 0, textAlign: 'center', paddingRight: 30, borderRight: '4px solid #000' }}>
              <div style={{ fontSize: '1.8rem', fontWeight: 900, color: '#000', marginBottom: 10, textTransform: 'uppercase' }}>
                <Link to={`/stocks/${signal.symbol}`} style={{ color: 'inherit', textDecoration: 'none' }}>{signal.symbol}</Link>
              </div>
              <div style={{ fontSize: '0.8rem', fontWeight: 900, color: '#000', textTransform: 'uppercase', marginBottom: 15, background: '#eee', padding: '4px', border: '2px solid #000' }}>{signal.type}</div>
              <div className={`badge ${signal.sentiment === 'Bullish' ? 'badge-success' : 'badge-danger'}`} style={{ display: 'block', padding: '10px 0', border: '2px solid #000', fontSize: '0.9rem', fontWeight: 900, boxShadow: '4px 4px 0px #000' }}>
                {signal.sentiment}
              </div>
              <div style={{ marginTop: 20 }}>
                <div style={{ fontSize: '0.75rem', fontWeight: 900, textTransform: 'uppercase', marginBottom: 8, color: '#000' }}>Confidence</div>
                <div style={{ padding: '4px', background: '#000', border: '2px solid #000' }}>
                  <div style={{ height: 12, width: '100%', background: '#fff', position: 'relative' }}>
                    <div style={{ height: '100%', width: `${signal.confidence}%`, background: 'var(--color-primary)' }} />
                    <span style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', fontSize: '9px', fontWeight: 900, color: '#000' }}>{signal.confidence}%</span>
                  </div>
                </div>
              </div>
            </div>

            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <p style={{ fontSize: '1.1rem', fontWeight: 700, color: '#000', lineHeight: 1.6, marginBottom: 20 }}>
                  {signal.description}
                </p>
                <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                  {signal.sources?.map((src, j) => (
                    <span key={j} className="badge" style={{ fontSize: '0.75rem', background: 'var(--color-accent-light)' }}>
                      📋 {src}
                    </span>
                  ))}
                  {signal.catalysts?.map((cat, j) => (
                    <span key={j} className="badge" style={{ fontSize: '0.75rem', background: 'var(--color-primary-light)' }}>
                      ⚡ {cat}
                    </span>
                  ))}
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginTop: 20, paddingTop: 20, borderTop: '2px solid #eee' }}>
                <div style={{ display: 'flex', gap: 30 }}>
                  <div style={{ padding: '10px', background: 'var(--color-primary-light)', border: '2px solid #000', boxShadow: '3px 3px 0px #000' }}>
                    <div style={{ fontSize: '0.75rem', fontWeight: 900, textTransform: 'uppercase', marginBottom: 4 }}>Target</div>
                    <div style={{ fontSize: '1.2rem', fontWeight: 900, color: '#000' }}>₹{signal.target_price}</div>
                  </div>
                  <div style={{ padding: '10px', background: 'var(--color-secondary-light)', border: '2px solid #000', boxShadow: '3px 3px 0px #000' }}>
                    <div style={{ fontSize: '0.75rem', fontWeight: 900, textTransform: 'uppercase', marginBottom: 4 }}>Stop Loss</div>
                    <div style={{ fontSize: '1.2rem', fontWeight: 900, color: '#000' }}>₹{signal.stop_loss}</div>
                  </div>
                  <div>
                    <div style={{ fontSize: '0.75rem', fontWeight: 900, textTransform: 'uppercase', marginBottom: 2 }}>R:R Ratio</div>
                    <div style={{ fontSize: '1.2rem', fontWeight: 900, color: '#000' }}>{signal.risk_reward}</div>
                  </div>
                  <div>
                    <div style={{ fontSize: '0.75rem', fontWeight: 900, textTransform: 'uppercase', marginBottom: 2 }}>Timeframe</div>
                    <div style={{ fontSize: '1.2rem', fontWeight: 900, color: '#000' }}>{signal.timeframe}</div>
                  </div>
                </div>

                <Link to={`/stocks/${signal.symbol}`} className="btn btn-primary">
                  VIEW DETAIL →
                </Link>
              </div>
            </div>
          </div>
        ))}
        {data?.signals?.length === 0 && (
          <div className="card" style={{ textAlign: 'center', padding: 80, border: '4px solid #000', boxShadow: '10px 10px 0px #000' }}>
            <div style={{ fontSize: '4rem', marginBottom: 20 }}>📡</div>
            <h3 style={{ fontSize: '2rem', fontWeight: 900, textTransform: 'uppercase', marginBottom: 10 }}>No High-Confidence Signals</h3>
            <p style={{ color: '#000', fontWeight: 700, fontSize: '1.1rem' }}>The radar is scanning the market. Check back soon for new opportunities.</p>
          </div>
        )}
      </div>

    </div>
  )
}
