import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'
import { stocksAPI } from '../../../../api/client'
import { usePortfolio } from '../../../../hooks/usePortfolio'
import HighConvictionTrades from '../../../../components/HighConvictionTrades'
import RiskAlerts from '../../../../components/RiskAlerts'
import styles from '../../../../styles/pages/app/user/dashboard/DashboardPage.module.css'

const AI_SIGNALS = []

export default function UserDashboard({ user }) {
  const [marketData, setMarketData] = useState(null)
  const [loading, setLoading] = useState(true)
  
  // Real-time portfolio data with auto-refresh every 30 seconds
  const { portfolio, analytics: portfolioAnalytics, lastUpdate } = usePortfolio(30000)

  useEffect(() => {
    stocksAPI.marketOverview()
      .then((res) => setMarketData(res.data))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  // Build quick stats from real portfolio data
  const getQuickStats = () => {
    if (!portfolio || !portfolioAnalytics) {
      return [
        { label: 'Portfolio Value', value: '₹0.00', change: '--%', positive: null, icon: '💼' },
        { label: "Today's P&L", value: '₹0.00', change: '--%', positive: null, icon: '📈' },
        { label: 'Total Returns', value: '₹0.00', change: '--%', positive: null, icon: '💰' },
        { label: 'Risk Score', value: '0 / 10', change: 'Calculating', positive: null, icon: '🛡️' },
      ]
    }

    const currentValue = portfolio?.current_value ?? 0
    const totalPnl = portfolio?.total_pnl ?? 0
    const totalPnlPct = portfolio?.total_pnl_pct ?? 0
    const dayChange = portfolioAnalytics?.day_change ?? 0
    const dayChangePct = portfolioAnalytics?.day_change_pct ?? 0
    const riskScore = portfolioAnalytics?.risk_score ?? 0
    const holdingsCount = portfolio?.holdings_count ?? 0

    return [
      {
        label: 'Portfolio Value',
        value: `₹${(currentValue / 100000).toFixed(2)}L`,
        change: `${totalPnlPct > 0 ? '+' : ''}${totalPnlPct.toFixed(1)}%`,
        positive: totalPnlPct >= 0,
        icon: '💼',
      },
      {
        label: "Today's P&L",
        value: `${dayChange >= 0 ? '+' : ''}₹${(dayChange / 1000).toFixed(1)}K`,
        change: `${dayChangePct > 0 ? '+' : ''}${dayChangePct.toFixed(2)}%`,
        positive: dayChangePct >= 0,
        icon: '📈',
      },
      {
        label: 'Total Returns',
        value: `${totalPnl >= 0 ? '+' : ''}₹${(totalPnl / 1000).toFixed(1)}K`,
        change: `${totalPnlPct > 0 ? '+' : ''}${totalPnlPct.toFixed(2)}%`,
        positive: totalPnl >= 0,
        icon: '💰',
      },
      {
        label: 'Risk Score',
        value: `${riskScore.toFixed(1)} / 10`,
        change: holdingsCount > 0 ? `${holdingsCount} Holdings` : 'No Holdings',
        positive: riskScore < 7,
        icon: '🛡️',
      },
    ]
  }

  const QUICK_STATS = getQuickStats()

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
          <div className={styles.gridItemTitle}>📊 Top Holdings</div>
          {portfolio?.holdings_count === 0 ? (
            <div style={{ padding: '20px', textAlign: 'center' }}>
              <div style={{ fontSize: '2.5rem', marginBottom: 12 }}>📈</div>
              <p style={{ color: '#5E6C84' }}>No holdings yet. Start building your portfolio to see performance here.</p>
              <Link to="/portfolio" className="btn btn-secondary btn-sm" style={{ marginTop: 12 }}>Add Holdings &rarr;</Link>
            </div>
          ) : (
            <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: 12 }}>
              {portfolio?.holdings?.slice(0, 5).map((h) => {
                const pnl = h?.pnl ?? 0
                const pnlPct = h?.pnl_pct ?? 0
                const avgPrice = h?.avg_buy_price ?? 0
                const qty = h?.quantity ?? 0
                
                return (
                  <div key={h.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px', border: '2px solid #000', background: pnl >= 0 ? 'rgba(196, 255, 0, 0.1)' : 'rgba(255, 49, 49, 0.05)' }}>
                    <div>
                      <div style={{ fontWeight: 950, fontSize: '0.85rem' }}>{h.symbol || 'N/A'}</div>
                      <div style={{ fontSize: '0.7rem', color: '#666' }}>{qty} @ ₹{avgPrice.toFixed(0)}</div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontWeight: 950, fontSize: '0.85rem' }}>{pnl >= 0 ? '+' : ''}₹{(pnl / 1000).toFixed(1)}K</div>
                      <div style={{ fontSize: '0.7rem', color: pnlPct >= 0 ? '#00A300' : '#D00000', fontWeight: 950 }}>{pnlPct >= 0 ? '▲' : '▼'} {Math.abs(pnlPct).toFixed(1)}%</div>
                    </div>
                  </div>
                )
              })}
              <Link to="/portfolio" style={{ fontSize: '0.75rem', color: '#0052CC', textDecoration: 'none', textAlign: 'center', marginTop: 8, fontWeight: 950 }}>View Full Portfolio ➜</Link>
            </div>
          )}
        </div>

        <div className={styles.gridItem}>
          <div className={styles.gridItemTitle}>⚡ Live Updates</div>
          <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: 8 }}>
            <div style={{ padding: '8px', background: '#C4FF00', border: '2px solid #000', fontSize: '0.7rem', fontWeight: 950 }}>
              ✓ Last Update: {lastUpdate?.toLocaleTimeString()}
            </div>
            <div style={{ padding: '8px', background: '#fff', border: '2px solid #000', fontSize: '0.7rem' }}>
              <strong>Portfolio Status:</strong> {portfolio?.holdings_count || 0} Holdings
            </div>
            <div style={{ padding: '8px', background: '#fff', border: '2px solid #000', fontSize: '0.7rem' }}>
              <strong>Risk Level:</strong> {portfolioAnalytics?.risk_score < 4 ? 'Low' : portfolioAnalytics?.risk_score < 7 ? 'Medium' : 'High'}
            </div>
            {portfolioAnalytics?.sector_allocation?.length > 0 && (
              <div style={{ padding: '8px', background: '#f5f5f5', border: '2px solid #000', fontSize: '0.7rem' }}>
                <strong>Top Sector:</strong> {portfolioAnalytics.sector_allocation[0]?.sector} ({portfolioAnalytics.sector_allocation[0]?.value?.toFixed(1)}%)
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
