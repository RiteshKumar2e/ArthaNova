import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { aiAPI } from '../../api/client'
import styles from '../../styles/pages/app/OpportunityRadarPage.module.scss'

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

      <div className="grid-3" style={{ marginBottom: 24 }}>
        {[
          { title: 'Total Signals', val: data?.signals?.length || 0, icon: '📡' },
          { title: 'Active Sectors', val: '4', icon: '🏢' },
          { title: 'Avg Confidence', val: `${Math.round((data?.signals?.reduce((a, b) => a + b.confidence, 0) || 0) / (data?.signals?.length || 1))}%`, icon: '🎯' },
        ].map((m) => (
          <div key={m.title} className="metric-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div className="metric-label">{m.title}</div>
              <span style={{ fontSize: '1.2rem' }}>{m.icon}</span>
            </div>
            <div className="metric-value">{m.val}</div>
          </div>
        ))}
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        {data?.signals?.map((signal, i) => (
          <div key={i} className="card" style={{ display: 'flex', gap: 24, padding: 24 }}>
            <div style={{ width: 140, flexShrink: 0, textAlign: 'center', paddingRight: 24, borderRight: '1px solid #DFE1E6' }}>
              <div style={{ fontSize: '1.25rem', fontWeight: 700, color: '#0052CC', marginBottom: 4 }}>
                <Link to={`/stocks/${signal.symbol}`} style={{ color: 'inherit', textDecoration: 'none' }}>{signal.symbol}</Link>
              </div>
              <div style={{ fontSize: '0.75rem', color: '#5E6C84', marginBottom: 12 }}>{signal.type}</div>
              <div className={`badge ${signal.sentiment === 'Bullish' ? 'badge-success' : 'badge-danger'}`} style={{ display: 'block', padding: '6px 0' }}>
                {signal.sentiment}
              </div>
              <div style={{ marginTop: 12 }}>
                <div style={{ fontSize: '0.7rem', color: '#5E6C84', marginBottom: 4 }}>Confidence</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, justifyContent: 'center' }}>
                  <div style={{ height: 6, width: 40, background: '#DFE1E6', borderRadius: 999 }}>
                    <div style={{ height: '100%', width: `${signal.confidence}%`, background: '#00875A', borderRadius: 999 }} />
                  </div>
                  <span style={{ fontSize: '0.8rem', fontWeight: 600 }}>{signal.confidence}%</span>
                </div>
              </div>
            </div>

            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <p style={{ fontSize: '0.9rem', color: '#172B4D', lineHeight: 1.6, marginBottom: 16 }}>
                  {signal.description}
                </p>
                <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                  {signal.sources?.map((src, j) => (
                    <span key={j} className="chip" style={{ fontSize: '0.7rem', background: '#EAE6FF', color: '#403294', borderColor: 'transparent' }}>
                      📋 {src}
                    </span>
                  ))}
                  {signal.catalysts?.map((cat, j) => (
                    <span key={j} className="chip" style={{ fontSize: '0.7rem', background: '#E3FCEF', color: '#006644', borderColor: 'transparent' }}>
                      ⚡ {cat}
                    </span>
                  ))}
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginTop: 16 }}>
                <div style={{ display: 'flex', gap: 24 }}>
                  <div>
                    <div style={{ fontSize: '0.7rem', color: '#5E6C84', marginBottom: 2 }}>Target</div>
                    <div style={{ fontSize: '0.9rem', fontWeight: 600, color: '#00875A' }}>₹{signal.target_price}</div>
                  </div>
                  <div>
                    <div style={{ fontSize: '0.7rem', color: '#5E6C84', marginBottom: 2 }}>Stop Loss</div>
                    <div style={{ fontSize: '0.9rem', fontWeight: 600, color: '#DE350B' }}>₹{signal.stop_loss}</div>
                  </div>
                  <div>
                    <div style={{ fontSize: '0.7rem', color: '#5E6C84', marginBottom: 2 }}>Risk/Reward</div>
                    <div style={{ fontSize: '0.9rem', fontWeight: 600, color: '#172B4D' }}>{signal.risk_reward}</div>
                  </div>
                  <div>
                    <div style={{ fontSize: '0.7rem', color: '#5E6C84', marginBottom: 2 }}>Timeframe</div>
                    <div style={{ fontSize: '0.9rem', fontWeight: 600, color: '#172B4D' }}>{signal.timeframe}</div>
                  </div>
                </div>

                <Link to={`/stocks/${signal.symbol}`} className="btn btn-secondary btn-sm">
                  View Detail →
                </Link>
              </div>
            </div>
          </div>
        ))}
        {data?.signals?.length === 0 && (
          <div className="card" style={{ textAlign: 'center', padding: 60 }}>
            <div style={{ fontSize: '3rem', marginBottom: 16 }}>📡</div>
            <h3 style={{ fontSize: '1.25rem', marginBottom: 8 }}>No High-Confidence Signals</h3>
            <p style={{ color: '#5E6C84' }}>The radar is scanning the market. Check back soon for new opportunities.</p>
          </div>
        )}
      </div>
    </div>
  )
}
