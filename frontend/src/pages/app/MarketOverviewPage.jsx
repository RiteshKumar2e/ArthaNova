import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { stocksAPI } from '../../api/client'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts'
import styles from '../../styles/pages/app/MarketOverviewPage.module.scss'

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
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 16 }}>
          {[1,2,3,4,5,6].map(i => <div key={i} className="skeleton" style={{ height: 100 }} />)}
        </div>
      ) : (
        <>
          {/* Indices */}
          <div className="grid-3" style={{ marginBottom: 24 }}>
            {data?.indices?.map((idx) => (
              <div key={idx.name} className="metric-card">
                <div className="metric-label">{idx.name}</div>
                <div className="metric-value">{idx.value?.toLocaleString()}</div>
                <div className={`metric-change ${idx.change_pct >= 0 ? 'positive' : 'negative'}`}>
                  {idx.change_pct >= 0 ? '▲' : '▼'} {Math.abs(idx.change_pct)}% ({idx.change >= 0 ? '+' : ''}{idx.change?.toFixed(1)})
                </div>
              </div>
            ))}
          </div>

          <div className="grid-2" style={{ marginBottom: 24 }}>
            {/* FII/DII */}
            <div className="card">
              <div className="card-header"><h3 style={{ fontSize: '1rem' }}>FII / DII Activity</h3></div>
              {data?.fii_dii && (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                  {[
                    { label: 'FII Buy', val: data.fii_dii.fii_buy, color: '#00875A' },
                    { label: 'FII Sell', val: data.fii_dii.fii_sell, color: '#DE350B' },
                    { label: 'DII Buy', val: data.fii_dii.dii_buy, color: '#0052CC' },
                    { label: 'DII Sell', val: data.fii_dii.dii_sell, color: '#FF6B35' },
                  ].map((item) => (
                    <div key={item.label} style={{ background: '#F4F5F7', borderRadius: 8, padding: '12px 14px' }}>
                      <div style={{ fontSize: '0.7rem', color: '#5E6C84', marginBottom: 4 }}>{item.label}</div>
                      <div style={{ fontSize: '1rem', fontWeight: 700, color: item.color }}>₹{item.val?.toFixed(0)}Cr</div>
                    </div>
                  ))}
                </div>
              )}
              <div style={{ marginTop: 12, padding: '8px 12px', background: data?.fii_dii?.fii_net >= 0 ? '#E3FCEF' : '#FFEBE6', borderRadius: 8 }}>
                <span style={{ fontSize: '0.75rem', fontWeight: 600, color: data?.fii_dii?.fii_net >= 0 ? '#00875A' : '#DE350B' }}>
                  FII Net: {data?.fii_dii?.fii_net >= 0 ? '+' : ''}₹{data?.fii_dii?.fii_net?.toFixed(0)}Cr
                </span>
              </div>
            </div>

            {/* Advance/Decline */}
            <div className="card">
              <div className="card-header">
                <h3 style={{ fontSize: '1rem' }}>Market Breadth</h3>
                <span className={`badge ${data?.market_breadth === 'Bullish' ? 'badge-success' : 'badge-danger'}`}>
                  {data?.market_breadth}
                </span>
              </div>
              {data?.advance_decline && (
                <>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 8, marginBottom: 16 }}>
                    <div style={{ textAlign: 'center', padding: 12, background: '#E3FCEF', borderRadius: 8 }}>
                      <div style={{ fontSize: '1.25rem', fontWeight: 700, color: '#00875A' }}>{data.advance_decline.advances}</div>
                      <div style={{ fontSize: '0.7rem', color: '#5E6C84' }}>Advances</div>
                    </div>
                    <div style={{ textAlign: 'center', padding: 12, background: '#FFEBE6', borderRadius: 8 }}>
                      <div style={{ fontSize: '1.25rem', fontWeight: 700, color: '#DE350B' }}>{data.advance_decline.declines}</div>
                      <div style={{ fontSize: '0.7rem', color: '#5E6C84' }}>Declines</div>
                    </div>
                    <div style={{ textAlign: 'center', padding: 12, background: '#F4F5F7', borderRadius: 8 }}>
                      <div style={{ fontSize: '1.25rem', fontWeight: 700, color: '#5E6C84' }}>{data.advance_decline.unchanged}</div>
                      <div style={{ fontSize: '0.7rem', color: '#5E6C84' }}>Unchanged</div>
                    </div>
                  </div>
                  <div style={{ fontSize: '0.8rem', color: '#5E6C84' }}>
                    India VIX: <strong style={{ color: '#172B4D' }}>{data?.vix}</strong> ({data?.vix < 15 ? 'Low Volatility' : data?.vix < 20 ? 'Moderate' : 'High Volatility'})
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Sector Heatmap */}
          <div className="card">
            <div className="card-header"><h3 style={{ fontSize: '1rem' }}>Sector Performance</h3></div>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={sectors} margin={{ top: 4, right: 8, bottom: 4, left: 0 }}>
                <XAxis dataKey="name" tick={{ fontSize: 10, fill: '#97A0AF' }} tickLine={false} axisLine={false} />
                <YAxis tick={{ fontSize: 10, fill: '#97A0AF' }} tickLine={false} axisLine={false} tickFormatter={(v) => `${v}%`} />
                <Tooltip formatter={(v) => [`${v}%`, 'Change']} contentStyle={{ borderRadius: 8, fontSize: 12 }} />
                <Bar dataKey="change_pct" radius={[4, 4, 0, 0]}>
                  {sectors.map((entry, index) => (
                    <Cell key={index} fill={entry.change_pct >= 0 ? '#00875A' : '#DE350B'} />
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
