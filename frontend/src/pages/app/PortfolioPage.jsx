import { useState, useEffect } from 'react'
import { portfolioAPI } from '../../api/client'
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts'
import toast from 'react-hot-toast'
import styles from '../../styles/pages/app/PortfolioPage.module.scss'

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
        <div className="card" style={{ marginBottom: 20 }}>
          <h3 style={{ fontSize: '1rem', marginBottom: 16 }}>Add Holding</h3>
          <form onSubmit={handleAdd} style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 12 }}>
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
            <div className="form-group" style={{ marginBottom: 0, display: 'flex', alignItems: 'flex-end', gap: 8 }}>
              <div style={{ flex: 1 }}>
                <label className="form-label">Exchange</label>
                <select className="form-control" value={form.exchange} onChange={(e) => setForm((p) => ({ ...p, exchange: e.target.value }))}>
                  <option>NSE</option>
                  <option>BSE</option>
                </select>
              </div>
              <button type="submit" className="btn btn-primary">Add</button>
              <button type="button" className="btn btn-ghost" onClick={() => setShowAdd(false)}>Cancel</button>
            </div>
          </form>
        </div>
      )}

      {/* Summary Cards */}
      {portfolio && (
        <>
          <div className="grid-4" style={{ marginBottom: 24 }}>
            <div className="metric-card">
              <div className="metric-label">Total Invested</div>
              <div className="metric-value">₹{portfolio.total_invested?.toLocaleString()}</div>
            </div>
            <div className="metric-card">
              <div className="metric-label">Current Value</div>
              <div className="metric-value">₹{portfolio.current_value?.toLocaleString()}</div>
              <div className={`metric-change ${portfolio.total_pnl >= 0 ? 'positive' : 'negative'}`}>
                {portfolio.total_pnl >= 0 ? '▲' : '▼'} {Math.abs(portfolio.total_pnl_pct)}%
              </div>
            </div>
            <div className="metric-card">
              <div className="metric-label">Total P&L</div>
              <div className="metric-value" style={{ color: portfolio.total_pnl >= 0 ? '#00875A' : '#DE350B' }}>
                {portfolio.total_pnl >= 0 ? '+' : ''}₹{portfolio.total_pnl?.toLocaleString()}
              </div>
            </div>
            <div className="metric-card">
              <div className="metric-label">Risk Score</div>
              <div className="metric-value">{portfolio.risk_score} / 10</div>
              <div className="metric-change" style={{ color: '#FF991F' }}>Moderate</div>
            </div>
          </div>

          <div className="grid-2" style={{ marginBottom: 24 }}>
            {/* Sector Allocation Pie */}
            <div className="card">
              <div className="card-header"><h3 style={{ fontSize: '1rem' }}>Sector Allocation</h3></div>
              {portfolio.sector_allocation?.length > 0 ? (
                <ResponsiveContainer width="100%" height={220}>
                  <PieChart>
                    <Pie data={portfolio.sector_allocation} cx="50%" cy="50%" innerRadius={60} outerRadius={90}
                      dataKey="value" nameKey="sector" paddingAngle={3}>
                      {portfolio.sector_allocation.map((_, i) => (
                        <Cell key={i} fill={COLORS[i % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(v) => [`₹${v.toLocaleString()}`, 'Value']} contentStyle={{ borderRadius: 8, fontSize: 12 }} />
                    <Legend formatter={(v) => <span style={{ fontSize: '0.75rem' }}>{v}</span>} />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="empty-state">
                  <div className="empty-icon">📊</div>
                  <div className="empty-title">No holdings yet</div>
                </div>
              )}
            </div>

            {/* AI Recommendations */}
            <div className="card">
              <div className="card-header"><h3 style={{ fontSize: '1rem' }}>🤖 AI Portfolio Insights</h3></div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {portfolio.holdings?.length > 0 ? (
                  <div style={{ padding: '20px', textAlign: 'center', background: '#F4F5F7', borderRadius: 8 }}>
                    <div style={{ fontSize: '1.5rem', marginBottom: 8 }}>🧠</div>
                    <p style={{ fontSize: '0.85rem', color: '#172B4D', fontWeight: 500 }}>AI is analyzing your {portfolio.holdings.length} holdings...</p>
                    <p style={{ fontSize: '0.75rem', color: '#5E6C84', marginTop: 4 }}>Deep insights on sector concentration and risk will appear here shortly.</p>
                  </div>
                ) : (
                  <div style={{ padding: '20px', textAlign: 'center', background: '#F4F5F7', borderRadius: 8 }}>
                    <p style={{ fontSize: '0.8rem', color: '#5E6C84' }}>No data for AI analysis. Add some holdings to receive personalized insights.</p>
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
