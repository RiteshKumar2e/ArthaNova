import { useState, useEffect } from 'react'
import { portfolioAPI } from '../../api/client'
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts'
import toast from 'react-hot-toast'
import styles from '../../styles/pages/app/PortfolioPage.module.css'

const COLORS = ['#0052CC', '#00875A', '#FF6B35', '#9333EA', '#FF991F', '#0065FF', '#DE350B', '#34D399']

export default function PortfolioPage() {
  const [portfolio, setPortfolio] = useState(null)
  const [loading, setLoading] = useState(true)
  const [showAdd, setShowAdd] = useState(false)
  const [form, setForm] = useState({ symbol: '', company_name: '', quantity: '', avg_buy_price: '', sector: '', exchange: 'NSE' })

  const load = () => {
    setLoading(true)
    portfolioAPI.get().then((res) => setPortfolio(res.data)).catch(() => {}).finally(() => setLoading(false))
  }

  useEffect(() => { load() }, [])

  const handleAdd = async (e) => {
    e.preventDefault()
    try {
      await portfolioAPI.addHolding({ ...form, quantity: parseFloat(form.quantity), avg_buy_price: parseFloat(form.avg_buy_price) })
      toast.success(`${form.symbol} added to portfolio`)
      setShowAdd(false)
      setForm({ symbol: '', company_name: '', quantity: '', avg_buy_price: '', sector: '', exchange: 'NSE' })
      load()
    } catch (err) {
      toast.error(err.response?.data?.detail || 'Failed to add holding')
    }
  }

  const handleRemove = async (id, symbol) => {
    if (!confirm(`Remove ${symbol} from portfolio?`)) return
    try {
      await portfolioAPI.removeHolding(id)
      toast.success(`${symbol} removed`)
      load()
    } catch {
      toast.error('Failed to remove holding')
    }
  }

  if (loading) return <div className="page-wrapper"><div className="spinner" style={{ margin: '60px auto' }} /></div>

  return (
    <div className="page-wrapper animate-fadeIn">
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.pageTitle}>PORTFOLIO MANAGER</h1>
          <p className={styles.pageSubtitle}>Track holdings, analyze performance, and get AI recommendations</p>
        </div>
        <button 
          className="btn btn-primary btn-sm" 
          style={{ borderRadius: 0, fontWeight: 950, border: '3px solid #000', fontSize: '0.75rem', padding: '10px 16px' }}
          onClick={() => setShowAdd(!showAdd)} 
          id="add-holding-btn"
        >
          + ADD HOLDING
        </button>
      </div>

      {/* Add Form */}
      {showAdd && (
        <div className="card" style={{ marginBottom: 24, background: '#FFDD55', border: '4px solid #000', boxShadow: '8px 8px 0px #000', padding: '24px' }}>
          <h3 style={{ fontSize: '1rem', marginBottom: 16, fontWeight: 950, textTransform: 'uppercase' }}>ADD NEW HOLDING</h3>
          <form onSubmit={handleAdd} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 16 }}>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label" style={{ fontSize: '0.65rem', fontWeight: 950 }}>SYMBOL</label>
              <input className="form-control" placeholder="RELIANCE" value={form.symbol}
                onChange={(e) => setForm((p) => ({ ...p, symbol: e.target.value.toUpperCase() }))} required />
            </div>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label" style={{ fontSize: '0.65rem', fontWeight: 950 }}>COMPANY NAME</label>
              <input className="form-control" placeholder="Reliance Industries" value={form.company_name}
                onChange={(e) => setForm((p) => ({ ...p, company_name: e.target.value }))} required />
            </div>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label" style={{ fontSize: '0.65rem', fontWeight: 950 }}>QUANTITY</label>
              <input className="form-control" type="number" placeholder="100" value={form.quantity}
                onChange={(e) => setForm((p) => ({ ...p, quantity: e.target.value }))} required min="0.01" step="0.01" />
            </div>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label" style={{ fontSize: '0.65rem', fontWeight: 950 }}>AVG BUY PRICE (₹)</label>
              <input className="form-control" type="number" placeholder="2500.00" value={form.avg_buy_price}
                onChange={(e) => setForm((p) => ({ ...p, avg_buy_price: e.target.value }))} required min="0.01" step="0.01" />
            </div>
            <div style={{ display: 'flex', alignItems: 'flex-end', gap: 10 }}>
              <button type="submit" className="btn btn-primary" style={{ flex: 1, fontWeight: 950, textTransform: 'uppercase', border: '3px solid #000', padding: '10px' }}>ADD</button>
              <button type="button" className="btn btn-ghost" style={{ border: '3px solid #000' }} onClick={() => setShowAdd(false)}>✕</button>
            </div>
          </form>
        </div>
      )}

      {/* Summary Cards */}
      {portfolio && (
        <div className={styles.portfolioContainer}>
          <div className={styles.summaryCards}>
            <div className={styles.summaryCard} style={{ background: '#fff' }}>
              <div className={styles.statLabel}>TOTAL INVESTED</div>
              <div className={styles.statValue}>₹{portfolio.total_invested?.toLocaleString()}</div>
            </div>
            <div className={styles.summaryCard} style={{ background: '#C4FF00' }}>
              <div className={styles.statLabel}>CURRENT VALUE</div>
              <div className={styles.statValue}>₹{portfolio.current_value?.toLocaleString()}</div>
            </div>
            <div className={styles.summaryCard} style={{ background: portfolio.total_pnl >= 0 ? '#C4FF00' : '#FF3131' }}>
              <div className={styles.statLabel}>TOTAL P&L</div>
              <div className={styles.statValue}>
                {portfolio.total_pnl >= 0 ? '+' : ''}₹{portfolio.total_pnl?.toLocaleString()}
              </div>
              <span style={{ fontSize: '0.65rem', fontWeight: 950 }}>
                {portfolio.total_pnl >= 0 ? '▲' : '▼'} {Math.abs(portfolio.total_pnl_pct)}%
              </span>
            </div>
            <div className={styles.summaryCard} style={{ background: '#FFDD55' }}>
              <div className={styles.statLabel}>RISK SCORE</div>
              <div className={styles.statValue}>{portfolio.risk_score} / 10</div>
            </div>
          </div>

          <div className={styles.portfolioGrid}>
            {/* Holdings Table */}
            <div className={styles.holdingsCard}>
              <div className={styles.holdingsHeader}>
                <h3>HOLDINGS ({portfolio.holdings_count})</h3>
                <span style={{ fontSize: '0.65rem', fontWeight: 950, color: 'rgba(0,0,0,0.5)' }}>NSE / BSE</span>
              </div>
              <div className={styles.tableWrapper}>
                <table className={styles.holdingsTable}>
                  <thead>
                    <tr>
                      <th>SYMBOL</th>
                      <th>COMPANY</th>
                      <th style={{ textAlign: 'right' }}>QTY</th>
                      <th style={{ textAlign: 'right' }}>PRICE</th>
                      <th style={{ textAlign: 'right' }}>LTP</th>
                      <th style={{ textAlign: 'right' }}>P&L</th>
                      <th style={{ textAlign: 'right' }}>%</th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    {portfolio.holdings?.length === 0 ? (
                      <tr>
                        <td colSpan={8} style={{ textAlign: 'center', padding: 40, fontWeight: 950, color: '#888', textTransform: 'uppercase' }}>
                          No holdings yet. Add your first stock!
                        </td>
                      </tr>
                    ) : (
                      portfolio.holdings?.map((h) => (
                        <tr key={h.id}>
                          <td><span className={styles.symbol}>{h.symbol}</span></td>
                          <td><div className={styles.company}>{h.company_name}</div></td>
                          <td style={{ textAlign: 'right' }}>{h.quantity}</td>
                          <td style={{ textAlign: 'right' }}>₹{h.avg_buy_price?.toLocaleString()}</td>
                          <td style={{ textAlign: 'right', fontWeight: 950 }}>₹{h.current_price?.toLocaleString()}</td>
                          <td style={{ textAlign: 'right' }} className={h.pnl >= 0 ? 'change-positive' : 'change-negative'}>
                            <span className={`${styles.change} ${h.pnl >= 0 ? styles.up : styles.down}`}>
                              {h.pnl >= 0 ? '+' : '-'}₹{Math.abs(h.pnl)?.toLocaleString()}
                            </span>
                          </td>
                          <td style={{ textAlign: 'right', fontWeight: 950 }} className={h.pnl_pct >= 0 ? 'change-positive' : 'change-negative'}>
                            {h.pnl_pct >= 0 ? '▲' : '▼'}{Math.abs(h.pnl_pct)}%
                          </td>
                          <td>
                            <button className="btn btn-danger btn-sm" style={{ padding: '4px 8px', borderRadius: 0, border: '2px solid #000' }}
                              onClick={() => handleRemove(h.id, h.symbol)}>
                              ✕
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* AI Insights & Allocation */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
              <div className="card" style={{ background: '#fff', border: '4px solid #000', boxShadow: '6px 6px 0px #000', padding: '20px' }}>
                <h3 style={{ fontSize: '0.85rem', fontWeight: 950, textTransform: 'uppercase', marginBottom: 16 }}>SECTOR ALLOCATION</h3>
                {portfolio.sector_allocation?.length > 0 ? (
                  <ResponsiveContainer width="100%" height={200}>
                    <PieChart>
                      <Pie data={portfolio.sector_allocation} cx="50%" cy="50%" innerRadius={50} outerRadius={70}
                        dataKey="value" nameKey="sector" paddingAngle={4}>
                        {portfolio.sector_allocation.map((_, i) => (
                          <Cell key={i} fill={COLORS[i % COLORS.length]} stroke="#000" strokeWidth={2} />
                        ))}
                      </Pie>
                      <Tooltip 
                        contentStyle={{ background: '#fff', border: '3px solid #000', borderRadius: '0', boxShadow: '4px 4px 0px #000', fontWeight: 950, fontSize: '0.7rem' }} 
                      />
                    </PieChart>
                  </ResponsiveContainer>
                ) : (
                  <div style={{ textAlign: 'center', padding: '20px', fontWeight: 950, color: '#888' }}>NO DATA</div>
                )}
              </div>

              <div className="card" style={{ background: '#fff', border: '4px solid #000', boxShadow: '6px 6px 0px #000', padding: '20px' }}>
                <h3 style={{ fontSize: '0.85rem', fontWeight: 950, textTransform: 'uppercase', marginBottom: 16 }}>🤖 AI PORTFOLIO INSIGHTS</h3>
                <div style={{ padding: '16px', textAlign: 'center', background: '#f8f8f8', border: '3px solid #000', boxShadow: '4px 4px 0px #000' }}>
                  <div style={{ fontSize: '2rem', marginBottom: 8 }}>🧠</div>
                  <p style={{ fontSize: '0.75rem', fontWeight: 950, textTransform: 'uppercase' }}>ANALYSIS IN PROGRESS</p>
                  <p style={{ fontSize: '0.65rem', color: '#555', marginTop: 4, fontWeight: 700 }}>Scanning {portfolio.holdings?.length} items...</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
