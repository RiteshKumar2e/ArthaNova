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
      <div className="page-header">
        <div>
          <h1 className="page-title">Portfolio Manager</h1>
          <p className="page-subtitle">Track holdings, analyze performance, and get AI recommendations</p>
        </div>
        <button className="btn btn-primary btn-sm" onClick={() => setShowAdd(!showAdd)} id="add-holding-btn">
          + Add Holding
        </button>
      </div>

      {/* Add Form */}
      {showAdd && (
        <div className="card" style={{ marginBottom: 30, background: 'var(--color-yellow)', border: '4px solid #000' }}>
          <h3 style={{ fontSize: '1.2rem', marginBottom: 20, fontWeight: 900, textTransform: 'uppercase' }}>Add New Holding</h3>
          <form onSubmit={handleAdd} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 20 }}>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Symbol</label>
              <input className="form-control" placeholder="RELIANCE" value={form.symbol}
                onChange={(e) => setForm((p) => ({ ...p, symbol: e.target.value.toUpperCase() }))} required />
            </div>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Company Name</label>
              <input className="form-control" placeholder="Reliance Industries" value={form.company_name}
                onChange={(e) => setForm((p) => ({ ...p, company_name: e.target.value }))} required />
            </div>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Quantity</label>
              <input className="form-control" type="number" placeholder="100" value={form.quantity}
                onChange={(e) => setForm((p) => ({ ...p, quantity: e.target.value }))} required min="0.01" step="0.01" />
            </div>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Avg Buy Price (₹)</label>
              <input className="form-control" type="number" placeholder="2500.00" value={form.avg_buy_price}
                onChange={(e) => setForm((p) => ({ ...p, avg_buy_price: e.target.value }))} required min="0.01" step="0.01" />
            </div>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Sector</label>
              <input className="form-control" placeholder="Energy" value={form.sector}
                onChange={(e) => setForm((p) => ({ ...p, sector: e.target.value }))} />
            </div>
            <div style={{ display: 'flex', alignItems: 'flex-end', gap: 10 }}>
              <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>Add</button>
              <button type="button" className="btn btn-ghost" onClick={() => setShowAdd(false)}>✕</button>
            </div>
          </form>
        </div>
      )}

      {/* Summary Cards */}
      {portfolio && (
        <>
          <div className="grid-4" style={{ marginBottom: 32 }}>
            <div className="metric-card" style={{ background: 'white' }}>
              <div className="metric-label">Total Invested</div>
              <div className="metric-value">₹{portfolio.total_invested?.toLocaleString()}</div>
            </div>
            <div className="metric-card" style={{ background: 'var(--color-primary-light)' }}>
              <div className="metric-label">Current Value</div>
              <div className="metric-value">₹{portfolio.current_value?.toLocaleString()}</div>
              <div className={`badge ${portfolio.total_pnl >= 0 ? 'badge-success' : 'badge-danger'}`} style={{ marginTop: 8 }}>
                {portfolio.total_pnl >= 0 ? '▲' : '▼'} {Math.abs(portfolio.total_pnl_pct)}%
              </div>
            </div>
            <div className="metric-card" style={{ background: portfolio.total_pnl >= 0 ? 'var(--color-primary)' : 'var(--color-secondary)' }}>
              <div className="metric-label">Total P&L</div>
              <div className="metric-value">
                {portfolio.total_pnl >= 0 ? '+' : ''}₹{portfolio.total_pnl?.toLocaleString()}
              </div>
            </div>
            <div className="metric-card" style={{ background: 'var(--color-yellow)' }}>
              <div className="metric-label">Risk Score</div>
              <div className="metric-value">{portfolio.risk_score} / 10</div>
            </div>
          </div>

          <div className="grid-2" style={{ marginBottom: 32 }}>
            {/* Sector Allocation Pie */}
            <div className="card">
              <div className="card-header"><h3 style={{ fontSize: '1.1rem', fontWeight: 900 }}>Sector Allocation</h3></div>
              {portfolio.sector_allocation?.length > 0 ? (
                <ResponsiveContainer width="100%" height={250}>
                  <PieChart>
                    <Pie data={portfolio.sector_allocation} cx="50%" cy="50%" innerRadius={60} outerRadius={90}
                      dataKey="value" nameKey="sector" paddingAngle={5}>
                      {portfolio.sector_allocation.map((_, i) => (
                        <Cell key={i} fill={COLORS[i % COLORS.length]} stroke="#000" strokeWidth={2} />
                      ))}
                    </Pie>
                    <Tooltip 
                       contentStyle={{ background: '#fff', border: '3px solid #000', borderRadius: '0', boxShadow: '4px 4px 0px #000', fontWeight: 900 }} 
                       formatter={(v) => [`₹${v.toLocaleString()}`, 'Value']} 
                    />
                    <Legend verticalAlign="bottom" height={36} />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="empty-state">No holdings yet</div>
              )}
            </div>

            {/* AI Recommendations */}
            <div className="card" style={{ background: 'var(--color-accent-light)' }}>
              <div className="card-header"><h3 style={{ fontSize: '1.1rem', fontWeight: 900 }}>🤖 AI Portfolio Insights</h3></div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 15 }}>
                {portfolio.holdings?.length > 0 ? (
                  <div style={{ padding: '24px', textAlign: 'center', background: 'white', border: '3px solid #000', boxShadow: '5px 5px 0px #000' }}>
                    <div style={{ fontSize: '3rem', marginBottom: 12 }}>🧠</div>
                    <p style={{ fontSize: '1rem', color: '#000', fontWeight: 900, textTransform: 'uppercase' }}>AI Analysis in Progress</p>
                    <p style={{ fontSize: '0.85rem', color: '#333', marginTop: 8, fontWeight: 700 }}>Scanning {portfolio.holdings.length} holdings for risk and concentration...</p>
                  </div>
                ) : (
                  <div style={{ padding: '24px', textAlign: 'center', background: 'white', border: '3px solid #000' }}>
                    <p style={{ fontSize: '0.9rem', color: '#000', fontWeight: 800 }}>Add holdings to unlock AI insights.</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Holdings Table */}
          <div className="card" style={{ padding: 0 }}>
            <div style={{ padding: '16px 20px', borderBottom: '1px solid #DFE1E6' }}>
              <h3 style={{ fontSize: '1rem' }}>Holdings ({portfolio.holdings_count})</h3>
            </div>
            <div className="table-wrapper">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Symbol</th>
                    <th>Company</th>
                    <th>Sector</th>
                    <th style={{ textAlign: 'right' }}>Qty</th>
                    <th style={{ textAlign: 'right' }}>Avg Price</th>
                    <th style={{ textAlign: 'right' }}>LTP</th>
                    <th style={{ textAlign: 'right' }}>Invested</th>
                    <th style={{ textAlign: 'right' }}>Current</th>
                    <th style={{ textAlign: 'right' }}>P&L</th>
                    <th style={{ textAlign: 'right' }}>Return%</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {portfolio.holdings?.length === 0 ? (
                    <tr><td colSpan={11} style={{ textAlign: 'center', padding: 32, color: '#97A0AF' }}>
                      No holdings. Add your first stock to get started!
                    </td></tr>
                  ) : (
                    portfolio.holdings?.map((h) => (
                      <tr key={h.id}>
                        <td><strong style={{ color: '#0052CC' }}>{h.symbol}</strong></td>
                        <td style={{ fontSize: '0.8rem', maxWidth: 160, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{h.company_name}</td>
                        <td>{h.sector ? <span className="chip" style={{ fontSize: '0.65rem' }}>{h.sector}</span> : '—'}</td>
                        <td style={{ textAlign: 'right' }}>{h.quantity}</td>
                        <td style={{ textAlign: 'right' }}>₹{h.avg_buy_price?.toLocaleString()}</td>
                        <td style={{ textAlign: 'right', fontWeight: 600 }}>₹{h.current_price?.toLocaleString()}</td>
                        <td style={{ textAlign: 'right', fontSize: '0.8rem' }}>₹{h.invested_value?.toLocaleString()}</td>
                        <td style={{ textAlign: 'right', fontSize: '0.8rem' }}>₹{h.current_value?.toLocaleString()}</td>
                        <td style={{ textAlign: 'right', fontWeight: 600 }} className={h.pnl >= 0 ? 'change-positive' : 'change-negative'}>
                          {h.pnl >= 0 ? '+' : ''}₹{Math.abs(h.pnl)?.toLocaleString()}
                        </td>
                        <td style={{ textAlign: 'right' }} className={h.pnl_pct >= 0 ? 'change-positive' : 'change-negative'}>
                          {h.pnl_pct >= 0 ? '▲' : '▼'} {Math.abs(h.pnl_pct)}%
                        </td>
                        <td>
                          <button className="btn btn-danger btn-sm" style={{ padding: '4px 8px', fontSize: '0.75rem' }}
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
        </>
      )}
    </div>
  )
}
