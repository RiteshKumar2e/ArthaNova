import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuthStore } from '../../store/authStore'
import { stocksAPI, aiAPI } from '../../api/client'
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'
import styles from '../../styles/pages/app/DashboardPage.module.scss'

// Generate mock portfolio chart
const generateChartData = () => {
  let val = 1000000
  return Array.from({ length: 30 }, (_, i) => {
    val *= (1 + (Math.random() - 0.48) * 0.015)
    return {
      day: i + 1,
      value: Math.round(val),
    }
  })
}

const CHART_DATA = generateChartData()

const QUICK_STATS = [
  { label: 'Portfolio Value', value: '₹12,45,820', change: '+18.4%', positive: true, icon: '💼' },
  { label: "Today's P&L", value: '+₹8,240', change: '+0.67%', positive: true, icon: '📈' },
  { label: 'Total Returns', value: '+₹1,92,360', change: 'Since inception', positive: true, icon: '💰' },
  { label: 'Risk Score', value: '6.2 / 10', change: 'Moderate', positive: null, icon: '🛡️' },
]

const TOP_MOVERS = [
  { symbol: 'BAJFINANCE', name: 'Bajaj Finance', price: '7,124', change: '+3.2%', positive: true },
  { symbol: 'SUNPHARMA', name: 'Sun Pharma', price: '1,856', change: '+2.8%', positive: true },
  { symbol: 'TCS', name: 'TCS', price: '4,215', change: '+1.4%', positive: true },
  { symbol: 'TATAMOTORS', name: 'Tata Motors', price: '842', change: '-1.2%', positive: false },
  { symbol: 'WIPRO', name: 'Wipro', price: '524', change: '-0.8%', positive: false },
]

const AI_SIGNALS = [
  { symbol: 'SUNPHARMA', type: 'Breakout Setup', sentiment: 'Bullish', confidence: 84, timeframe: '2-4 weeks' },
  { symbol: 'HDFCBANK', type: 'Insider Accumulation', sentiment: 'Very Bullish', confidence: 78, timeframe: '1-3 months' },
  { symbol: 'LT', type: 'Earnings Catalyst', sentiment: 'Bullish', confidence: 71, timeframe: '1 month' },
]

export default function DashboardPage() {
  const { user } = useAuthStore()
  const [marketData, setMarketData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    stocksAPI.marketOverview()
      .then((res) => setMarketData(res.data))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const formatCurrency = (val) => `₹${(val / 100000).toFixed(2)}L`

  return (
    <div className="page-wrapper animate-fadeIn">
      {/* Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">
            Good {new Date().getHours() < 12 ? 'morning' : new Date().getHours() < 17 ? 'afternoon' : 'evening'}, {user?.full_name?.split(' ')[0] || 'Investor'} 👋
          </h1>
          <p className="page-subtitle">Here's your market intelligence snapshot for today.</p>
        </div>
        <div style={{ display: 'flex', gap: 12 }}>
          <Link to="/ai-chat" className="btn btn-secondary btn-sm">🤖 Ask AI</Link>
          <Link to="/radar" className="btn btn-primary btn-sm">🎯 Opportunity Radar</Link>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid-4" style={{ marginBottom: 24 }}>
        {QUICK_STATS.map((stat) => (
          <div key={stat.label} className="metric-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
              <div className="metric-label">{stat.label}</div>
              <span style={{ fontSize: '1.2rem' }}>{stat.icon}</span>
            </div>
            <div className="metric-value">{stat.value}</div>
            <div className={`metric-change ${stat.positive === true ? 'positive' : stat.positive === false ? 'negative' : ''}`}>
              {stat.positive === true ? '▲' : stat.positive === false ? '▼' : ''} {stat.change}
            </div>
          </div>
        ))}
      </div>

      {/* Main Grid */}
      <div className={styles.mainGrid}>
        {/* Portfolio Chart */}
        <div className="card" style={{ gridColumn: 'span 2' }}>
          <div className="card-header">
            <div>
              <h3 style={{ fontSize: '1rem', marginBottom: 2 }}>Portfolio Performance (30D)</h3>
              <p style={{ fontSize: '0.75rem', color: '#5E6C84' }}>Total value over time</p>
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              {['1W', '1M', '3M', '1Y'].map((p) => (
                <button key={p} className={`chip ${p === '1M' ? 'active' : ''}`} style={{ fontSize: '0.7rem' }}>{p}</button>
              ))}
            </div>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={CHART_DATA} margin={{ top: 4, right: 4, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#0052CC" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#0052CC" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="day" tick={{ fontSize: 11, fill: '#97A0AF' }} tickLine={false} axisLine={false} />
              <YAxis tickFormatter={formatCurrency} tick={{ fontSize: 11, fill: '#97A0AF' }} tickLine={false} axisLine={false} width={70} />
              <Tooltip formatter={(v) => [`₹${v.toLocaleString()}`, 'Value']} contentStyle={{ borderRadius: 8, border: '1px solid #DFE1E6', fontSize: 12 }} />
              <Area type="monotone" dataKey="value" stroke="#0052CC" strokeWidth={2} fill="url(#colorValue)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* AI Signals */}
        <div className="card">
          <div className="card-header">
            <h3 style={{ fontSize: '1rem' }}>🎯 AI Opportunity Signals</h3>
            <Link to="/radar" style={{ fontSize: '0.75rem', color: '#0052CC' }}>View All →</Link>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {AI_SIGNALS.map((signal) => (
              <div key={signal.symbol} className={styles.signalRow}>
                <div className={styles.signalLeft}>
                  <div className={styles.signalSymbol}>{signal.symbol}</div>
                  <div className={styles.signalType}>{signal.type}</div>
                </div>
                <div className={styles.signalRight}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
                    <span className="badge badge-success">{signal.sentiment}</span>
                  </div>
                  <div className={styles.confBar}>
                    <div className={styles.confFill} style={{ width: `${signal.confidence}%` }} />
                  </div>
                  <div style={{ fontSize: '0.7rem', color: '#5E6C84', marginTop: 2 }}>{signal.confidence}% confidence</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Grid */}
      <div className="grid-3" style={{ marginTop: 24 }}>
        {/* Top Movers */}
        <div className="card">
          <div className="card-header">
            <h3 style={{ fontSize: '1rem' }}>📊 Top Movers</h3>
            <Link to="/market" style={{ fontSize: '0.75rem', color: '#0052CC' }}>View All →</Link>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {TOP_MOVERS.map((s) => (
              <Link key={s.symbol} to={`/stocks/${s.symbol}`} className={styles.moverRow}>
                <div className={styles.moverInfo}>
                  <div className={styles.moverSymbol}>{s.symbol}</div>
                  <div className={styles.moverName}>{s.name}</div>
                </div>
                <div>
                  <div className={styles.moverPrice}>₹{s.price}</div>
                  <div className={s.positive ? 'change-positive' : 'change-negative'} style={{ fontSize: '0.75rem', fontWeight: 600, textAlign: 'right' }}>
                    {s.change}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Market Indices */}
        <div className="card">
          <div className="card-header">
            <h3 style={{ fontSize: '1rem' }}>📈 Market Indices</h3>
            <Link to="/market" style={{ fontSize: '0.75rem', color: '#0052CC' }}>Details →</Link>
          </div>
          {loading ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {[1,2,3].map(i => <div key={i} className="skeleton" style={{ height: 40 }} />)}
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {marketData?.indices?.slice(0, 5).map((idx) => (
                <div key={idx.name} className={styles.indexRow}>
                  <div className={styles.indexName}>{idx.name}</div>
                  <div>
                    <div className={styles.indexValue}>{idx.value?.toLocaleString()}</div>
                    <div className={idx.change_pct >= 0 ? 'change-positive' : 'change-negative'} style={{ fontSize: '0.7rem', fontWeight: 600, textAlign: 'right' }}>
                      {idx.change_pct >= 0 ? '▲' : '▼'} {Math.abs(idx.change_pct)}%
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Quick Links */}
        <div className="card">
          <div className="card-header">
            <h3 style={{ fontSize: '1rem' }}>⚡ Quick Actions</h3>
          </div>
          <div className={styles.quickActions}>
            {[
              { icon: '🤖', label: 'AI Chat', to: '/ai-chat', color: '#0052CC' },
              { icon: '📊', label: 'Screener', to: '/stocks', color: '#00875A' },
              { icon: '🚀', label: 'IPO Tracker', to: '/ipo', color: '#FF6B35' },
              { icon: '📰', label: 'News Feed', to: '/news', color: '#9333EA' },
              { icon: '💼', label: 'Portfolio', to: '/portfolio', color: '#FF991F' },
              { icon: '🔁', label: 'Backtest', to: '/backtest', color: '#0065FF' },
            ].map((action) => (
              <Link key={action.label} to={action.to} className={styles.quickAction}>
                <span style={{ fontSize: '1.3rem' }}>{action.icon}</span>
                <span style={{ fontSize: '0.75rem', fontWeight: 500 }}>{action.label}</span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
