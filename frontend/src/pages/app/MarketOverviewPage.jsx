import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { stocksAPI } from '../../api/client'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts'
import styles from '../../styles/pages/app/MarketOverviewPage.module.css'

export default function MarketOverviewPage() {
  const [data, setData] = useState(null)
  const [sectors, setSectors] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([stocksAPI.marketOverview(), stocksAPI.sectors()])
      .then(([mkt, sec]) => { setData(mkt.data); setSectors(sec.data.sectors) })
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="page-wrapper animate-fadeIn">
      <div className="page-header">
        <div>
          <h1 className="page-title">Market Overview</h1>
          <p className="page-subtitle">Real-time snapshot of Indian equity markets</p>
        </div>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <span className="badge badge-success">NSE Open</span>
          <span style={{ fontSize: '0.75rem', color: '#5E6C84' }}>Updated: {new Date().toLocaleTimeString()}</span>
        </div>
      </div>

      {loading ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 20 }}>
          {[1,2,3,4,5,6].map(i => <div key={i} className="skeleton" style={{ height: 120, background: '#eee' }} />)}
        </div>
      ) : (
        <>
          {/* Indices */}
          <div className="grid-3" style={{ marginBottom: 30 }}>
            {data?.indices?.map((idx) => (
              <div key={idx.name} className="metric-card" style={{ border: '4px solid #000', boxShadow: '6px 6px 0px #000', background: 'white' }}>
                <div className="metric-label" style={{ fontWeight: 900, textTransform: 'uppercase', color: '#000' }}>{idx.name}</div>
                <div className="metric-value" style={{ fontSize: '2rem', fontWeight: 900, color: '#000' }}>{idx.value?.toLocaleString()}</div>
                <div className={`badge ${idx.change_pct >= 0 ? 'badge-success' : 'badge-danger'}`} style={{ marginTop: 8, fontSize: '0.9rem', border: '2px solid #000' }}>
                  {idx.change_pct >= 0 ? '▲' : '▼'} {Math.abs(idx.change_pct)}%
                </div>
              </div>
            ))}
          </div>

          <div className="grid-2" style={{ marginBottom: 30 }}>
            {/* FII/DII */}
            <div className="card" style={{ border: '4px solid #000', boxShadow: '8px 8px 0px #000' }}>
              <div className="card-header" style={{ borderBottom: '3px solid #000', marginBottom: 20 }}>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 900, textTransform: 'uppercase' }}>FII / DII Activity</h3>
              </div>
              {data?.fii_dii && (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 15 }}>
                  {[
                    { label: 'FII Buy', val: data.fii_dii.fii_buy, color: '#000', bg: 'var(--color-primary-light)' },
                    { label: 'FII Sell', val: data.fii_dii.fii_sell, color: '#000', bg: 'var(--color-secondary-light)' },
                    { label: 'DII Buy', val: data.fii_dii.dii_buy, color: '#000', bg: 'var(--color-accent-light)' },
                    { label: 'DII Sell', val: data.fii_dii.dii_sell, color: '#000', bg: 'var(--color-yellow)' },
                  ].map((item) => (
                    <div key={item.label} style={{ background: item.bg, border: '2px solid #000', padding: '15px', boxShadow: '4px 4px 0px #000' }}>
                      <div style={{ fontSize: '0.75rem', color: '#000', fontWeight: 900, textTransform: 'uppercase', marginBottom: 5 }}>{item.label}</div>
                      <div style={{ fontSize: '1.2rem', fontWeight: 900, color: item.color }}>₹{item.val?.toFixed(0)}Cr</div>
                    </div>
                  ))}
                </div>
              )}
              <div style={{ marginTop: 20, padding: '12px', background: '#000', border: '2px solid #000' }}>
                <span style={{ fontSize: '1rem', fontWeight: 900, color: 'white', textTransform: 'uppercase' }}>
                  FII Net: {data?.fii_dii?.fii_net >= 0 ? '+' : ''}₹{data?.fii_dii?.fii_net?.toFixed(0)}Cr
                </span>
              </div>
            </div>

            {/* Advance/Decline */}
            <div className="card" style={{ border: '4px solid #000', boxShadow: '8px 8px 0px #000' }}>
              <div className="card-header" style={{ borderBottom: '3px solid #000', marginBottom: 20 }}>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 900, textTransform: 'uppercase' }}>Market Breadth</h3>
                <span className={`badge ${data?.market_breadth === 'Bullish' ? 'badge-success' : 'badge-danger'}`} style={{ border: '2px solid #000', boxShadow: '3px 3px 0px #000' }}>
                  {data?.market_breadth}
                </span>
              </div>
              {data?.advance_decline && (
                <>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 12, marginBottom: 20 }}>
                    <div style={{ textAlign: 'center', padding: 15, background: 'var(--color-primary-light)', border: '2px solid #000', boxShadow: '4px 4px 0px #000' }}>
                      <div style={{ fontSize: '1.8rem', fontWeight: 900, color: '#000' }}>{data.advance_decline.advances}</div>
                      <div style={{ fontSize: '0.75rem', fontWeight: 900, textTransform: 'uppercase' }}>Advances</div>
                    </div>
                    <div style={{ textAlign: 'center', padding: 15, background: 'var(--color-secondary-light)', border: '2px solid #000', boxShadow: '4px 4px 0px #000' }}>
                      <div style={{ fontSize: '1.8rem', fontWeight: 900, color: '#000' }}>{data.advance_decline.declines}</div>
                      <div style={{ fontSize: '0.75rem', fontWeight: 900, textTransform: 'uppercase' }}>Declines</div>
                    </div>
                    <div style={{ textAlign: 'center', padding: 15, background: '#eee', border: '2px solid #000', boxShadow: '4px 4px 0px #000' }}>
                      <div style={{ fontSize: '1.8rem', fontWeight: 900, color: '#000' }}>{data.advance_decline.unchanged}</div>
                      <div style={{ fontSize: '0.75rem', fontWeight: 900, textTransform: 'uppercase' }}>Fixed</div>
                    </div>
                  </div>
                  <div style={{ fontSize: '0.9rem', fontWeight: 800, padding: '10px', background: 'var(--color-yellow)', border: '2px solid #000' }}>
                    INDIA VIX: <strong style={{ fontSize: '1.1rem' }}>{data?.vix}</strong> — {data?.vix < 15 ? 'LOW VOLATILITY' : data?.vix < 20 ? 'MODERATE' : 'HIGH VOLATILITY'}
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Sector Heatmap */}
          <div className="card" style={{ border: '4px solid #000', boxShadow: '8px 8px 0px #000', padding: '30px' }}>
            <div className="card-header" style={{ marginBottom: 30 }}><h3 style={{ fontSize: '1.5rem', fontWeight: 900, textTransform: 'uppercase' }}>Sector Performance (%)</h3></div>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={sectors} margin={{ top: 0, right: 0, bottom: 0, left: 0 }}>
                <XAxis dataKey="name" tick={{ fontSize: 12, fontWeight: 900, fill: '#000' }} tickLine={true} axisLine={true} />
                <YAxis tick={{ fontSize: 12, fontWeight: 900, fill: '#000' }} tickLine={true} axisLine={true} tickFormatter={(v) => `${v}%`} />
                <Tooltip 
                  cursor={{ fill: 'transparent' }}
                  contentStyle={{ background: '#000', border: 'none', color: '#fff', fontWeight: 900, boxShadow: '5px 5px 0px var(--color-primary)' }} 
                />
                <Bar dataKey="change_pct" stroke="#000" strokeWidth={2}>
                  {sectors.map((entry, index) => (
                    <Cell key={index} fill={entry.change_pct >= 0 ? 'var(--color-primary)' : 'var(--color-secondary)'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </>
      )}
    </div>
  )
}

