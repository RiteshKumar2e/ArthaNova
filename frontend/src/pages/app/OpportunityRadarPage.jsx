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
          <h1 className="page-title">OPPORTUNITY RADAR 🎯</h1>
          <p className="page-subtitle">AI-curated high-confidence setups from technicals, fundamentals, and insider activity</p>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <span className="badge badge-info" style={{ display: 'flex', gap: 6, alignItems: 'center', padding: '10px 14px', border: '3px solid #000' }}>
            <span>LAST SCANNED:</span> <strong>{data?.last_scanned ? new Date(data.last_scanned).toLocaleTimeString() : 'NOW'}</strong>
          </span>
          <button className="btn btn-secondary btn-sm" style={{ border: '3px solid #000' }}>⚙️ FILTERS</button>
        </div>
      </div>

      <div className="grid-3" style={{ marginBottom: 24, display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
        {[
          { title: 'TOTAL SIGNALS', val: data?.signals?.length || 0, icon: '📡', bg: '#C4FF00' },
          { title: 'ACTIVE SECTORS', val: new Set(data?.signals?.map(s => s.sector).filter(Boolean)).size || 0, icon: '🏢', bg: '#FF6AC1' },
          { title: 'AVG CONFIDENCE', val: `${Math.round((data?.signals?.reduce((a, b) => a + b.confidence_score, 0) || 0) / (data?.signals?.length || 1))}%`, icon: '🎯', bg: '#FFDD55' },
        ].map((m) => (
          <div key={m.title} className="metric-card" style={{ border: '4px solid #000', boxShadow: '4px 4px 0px #000', background: m.bg, padding: '16px 20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
              <div className="metric-label" style={{ fontWeight: 950, textTransform: 'uppercase', color: '#000', fontSize: '0.65rem' }}>{m.title}</div>
              <span style={{ fontSize: '1.2rem' }}>{m.icon}</span>
            </div>
            <div className="metric-value" style={{ fontSize: '1.4rem', fontWeight: 950, color: '#000' }}>{m.val}</div>
          </div>
        ))}
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
        {data?.signals?.map((signal, i) => (
          <div key={i} className="card" style={{ display: 'flex', gap: 24, padding: 20, border: '4px solid #000', boxShadow: '6px 6px 0px #000', background: 'white' }}>
            <div style={{ width: 140, flexShrink: 0, textAlign: 'center', paddingRight: 20, borderRight: '3px solid #000' }}>
              <div style={{ fontSize: '1.2rem', fontWeight: 950, color: '#000', marginBottom: 6, textTransform: 'uppercase' }}>
                <Link to={`/stocks/${signal.symbol}`} style={{ color: 'inherit', textDecoration: 'none' }}>{signal.symbol}</Link>
              </div>
              <div style={{ fontSize: '0.65rem', fontWeight: 950, color: '#000', textTransform: 'uppercase', marginBottom: 12, background: '#eee', padding: '2px', border: '2px solid #000' }}>{signal.type}</div>
              <div className={`badge ${signal.sentiment === 'Bullish' ? 'badge-success' : 'badge-danger'}`} style={{ display: 'block', padding: '8px 0', border: '2px solid #000', fontSize: '0.8rem', fontWeight: 950, boxShadow: '3px 3px 0px #000' }}>
                {signal.sentiment?.toUpperCase()}
              </div>
              <div style={{ marginTop: 16 }}>
                <div style={{ fontSize: '0.6rem', fontWeight: 950, textTransform: 'uppercase', marginBottom: 6, color: '#000' }}>CONFIDENCE</div>
                <div style={{ padding: '2px', background: '#000', border: '2px solid #000' }}>
                  <div style={{ height: 10, width: '100%', background: '#fff', position: 'relative' }}>
                    <div style={{ height: '100%', width: `${signal.confidence}%`, background: '#C4FF00' }} />
                    <span style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', fontSize: '7px', fontWeight: 950, color: '#000' }}>{signal.confidence}%</span>
                  </div>
                </div>
              </div>
            </div>

            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <p style={{ fontSize: '0.9rem', fontWeight: 700, color: '#000', lineHeight: 1.5, marginBottom: 16 }}>
                  {signal.description}
                </p>
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                  {signal.sources?.map((src, j) => (
                    <span key={j} className="badge" style={{ fontSize: '0.65rem', background: '#E0E7FF', border: '2px solid #000', fontWeight: 950 }}>
                      📋 {src?.toUpperCase()}
                    </span>
                  ))}
                  {signal.catalysts?.map((cat, j) => (
                    <span key={j} className="badge" style={{ fontSize: '0.65rem', background: '#C4FF00', border: '2px solid #000', fontWeight: 950 }}>
                      ⚡ {cat?.toUpperCase()}
                    </span>
                  ))}
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginTop: 16, paddingTop: 16, borderTop: '2px solid #eee' }}>
                <div style={{ display: 'flex', gap: 20 }}>
                  <div>
                    <div style={{ fontSize: '0.65rem', fontWeight: 950, textTransform: 'uppercase', marginBottom: 2, color: '#666' }}>TARGET</div>
                    <div style={{ fontSize: '1.1rem', fontWeight: 950, color: '#000' }}>₹{signal.target_price}</div>
                  </div>
                  <div>
                    <div style={{ fontSize: '0.65rem', fontWeight: 950, textTransform: 'uppercase', marginBottom: 2, color: '#666' }}>STOP LOSS</div>
                    <div style={{ fontSize: '1.1rem', fontWeight: 950, color: '#000' }}>₹{signal.stop_loss}</div>
                  </div>
                  <div>
                    <div style={{ fontSize: '0.65rem', fontWeight: 950, textTransform: 'uppercase', marginBottom: 2, color: '#666' }}>R:R RATIO</div>
                    <div style={{ fontSize: '1.1rem', fontWeight: 950, color: '#000' }}>{signal.risk_reward}</div>
                  </div>
                  <div>
                    <div style={{ fontSize: '0.65rem', fontWeight: 950, textTransform: 'uppercase', marginBottom: 2, color: '#666' }}>TIMEFRAME</div>
                    <div style={{ fontSize: '1.1rem', fontWeight: 950, color: '#000' }}>{signal.timeframe?.toUpperCase()}</div>
                  </div>
                </div>

                <Link to={`/stocks/${signal.symbol}`} className="btn btn-primary" style={{ padding: '8px 16px', fontSize: '0.75rem', fontWeight: 950, border: '3px solid #000', boxShadow: '4px 4px 0px #000' }}>
                  VIEW DETAIL →
                </Link>
              </div>
            </div>
          </div>
        ))}
        {data?.signals?.length === 0 && (
          <div className="card" style={{ textAlign: 'center', padding: 60, border: '4px solid #000', boxShadow: '8px 8px 0px #000', background: '#fff' }}>
            <div style={{ fontSize: '3rem', marginBottom: 16 }}>📡</div>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 950, textTransform: 'uppercase', marginBottom: 8 }}>NO HIGH-CONFIDENCE SIGNALS</h3>
            <p style={{ color: '#444', fontWeight: 700, fontSize: '0.85rem' }}>The radar is scanning the market. Check back soon for new opportunities.</p>
          </div>
        )}
      </div>
    </div>
  )
}
