import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'
import { stocksAPI } from '../../../api/client'
import HighConvictionTrades from '../../../components/HighConvictionTrades'
import RiskAlerts from '../../../components/RiskAlerts'
import styles from '../../../styles/pages/app/DashboardPage.module.css'

// Quick statistics
const QUICK_STATS = [
  { label: 'Portfolio Value', value: '₹0.00', change: '--%', positive: null, icon: '💼' },
  { label: "Today's P&L", value: '₹0.00', change: '--%', positive: null, icon: '📈' },
  { label: 'Total Returns', value: '₹0.00', change: '--%', positive: null, icon: '💰' },
  { label: 'Risk Score', value: '0 / 10', change: 'Calculating', positive: null, icon: '🛡️' },
]

const AI_SIGNALS = []

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
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.pageTitle}>
            Good {new Date().getHours() < 12 ? 'morning' : new Date().getHours() < 17 ? 'afternoon' : 'evening'}, {user?.full_name?.split(' ')[0] || 'Investor'} 👋
          </h1>
          <p className={styles.pageTitleSub}>Here's your market intelligence snapshot for today.</p>
        </div>
        <div style={{ display: 'flex', gap: 12 }}>
          <Link to="/ai-chat" className="btn btn-secondary btn-sm">🤖 Ask AI</Link>
          <Link to="/radar" className="btn btn-primary btn-sm">🎯 Opportunity Radar</Link>
        </div>
      </div>

      {/* Quick Stats */}
      <div className={styles.statsRow} style={{ marginBottom: 24 }}>
        {QUICK_STATS.map((stat) => (
          <div key={stat.label} className={styles.stat}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
              <div className={styles.statLabel}>{stat.label}</div>
              <span style={{ fontSize: '1.2rem' }}>{stat.icon}</span>
            </div>
            <div className={styles.statValue}>{stat.value}</div>
            <div className={`${styles.statChange} ${stat.positive === true ? styles.up : stat.positive === false ? styles.down : ''}`}>
              {stat.positive === true ? '▲' : stat.positive === false ? '▼' : ''} {stat.change}
            </div>
          </div>
        ))}
      </div>

      <div className={styles.mainGrid}>
        <div className={styles.gridItem} style={{ gridColumn: 'span 2' }}>
          <div className={styles.gridItemTitle}>Portfolio Performance (30D)</div>
          <div style={{ padding: '20px', textAlign: 'center' }}>
            <div style={{ fontSize: '2.5rem', marginBottom: 12 }}>📈</div>
            <p style={{ color: '#5E6C84' }}>No performance data available yet. Start by adding holdings to your portfolio.</p>
            <Link to="/portfolio" className="btn btn-secondary btn-sm" style={{ marginTop: 12 }}>Build Portfolio &rarr;</Link>
          </div>
        </div>

        <div className={styles.gridItem}>
          <div className={styles.gridItemTitle}>🎯 AI Opportunity Signals</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {AI_SIGNALS.length > 0 ? (
              AI_SIGNALS.map((signal) => (
                <div key={signal.symbol} className={styles.signalRow}>
                  <div className={styles.signalLeft}>
                    <div className={styles.signalSymbol}>{signal.symbol}</div>
                    <div className={styles.signalType}>{signal.type}</div>
                  </div>
                  <div className={styles.signalRight}>
                    <span className="badge badge-success">{signal.sentiment}</span>
                  </div>
                </div>
              ))
            ) : (
              <div style={{ textAlign: 'center', padding: '16px 0' }}>
                <p style={{ fontSize: '0.85rem', color: '#5E6C84' }}>Scanning markets for high-conviction signals...</p>
                <Link to="/radar" style={{ fontSize: '0.75rem', color: '#0052CC', textDecoration: 'none', display: 'block', marginTop: 8 }}>View Radar &rarr;</Link>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* High-Conviction Trades Section */}
      <div style={{ marginTop: 32 }}>
        <HighConvictionTrades />
      </div>

      {/* Risk Alerts Section */}
      <div style={{ marginTop: 32, marginBottom: 32 }}>
        <RiskAlerts />
      </div>
    </div>
  )
}
