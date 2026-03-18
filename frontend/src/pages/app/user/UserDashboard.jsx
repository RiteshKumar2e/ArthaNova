import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'
import { stocksAPI } from '../../../api/client'
import styles from '../../../styles/pages/app/DashboardPage.module.scss'

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

const AI_SIGNALS = [
  { symbol: 'SUNPHARMA', type: 'Breakout Setup', sentiment: 'Bullish', confidence: 84, timeframe: '2-4 weeks' },
  { symbol: 'HDFCBANK', type: 'Insider Accumulation', sentiment: 'Very Bullish', confidence: 78, timeframe: '1-3 months' },
  { symbol: 'LT', type: 'Earnings Catalyst', sentiment: 'Bullish', confidence: 71, timeframe: '1 month' },
]

export default function UserDashboard({ user }) {
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
    <div className="animate-fadeIn">
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

      <div className={styles.mainGrid}>
        <div className="card" style={{ gridColumn: 'span 2' }}>
          <div className="card-header">
            <h3>Portfolio Performance (30D)</h3>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={CHART_DATA}>
              <XAxis dataKey="day" axisLine={false} tickLine={false} hide />
              <YAxis tickFormatter={formatCurrency} axisLine={false} tickLine={false} width={80} />
              <Tooltip formatter={(v) => [`₹${v.toLocaleString()}`, 'Value']} />
              <Area type="monotone" dataKey="value" stroke="#0052CC" fill="#E8F0FE" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="card">
          <div className="card-header">
            <h3>🎯 AI Opportunity Signals</h3>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {AI_SIGNALS.map((signal) => (
              <div key={signal.symbol} className={styles.signalRow}>
                <div className={styles.signalLeft}>
                  <div className={styles.signalSymbol}>{signal.symbol}</div>
                  <div className={styles.signalType}>{signal.type}</div>
                </div>
                <div className={styles.signalRight}>
                  <span className="badge badge-success">{signal.sentiment}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
