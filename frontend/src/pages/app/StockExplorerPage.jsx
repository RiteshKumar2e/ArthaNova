import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { stocksAPI } from '../../api/client'
import styles from '../../styles/pages/app/StockExplorerPage.module.css'

const SECTORS = ['All', 'IT', 'Banking', 'Pharma', 'FMCG', 'Auto', 'Energy', 'Metals']

export default function StockExplorerPage() {
  const [stocks, setStocks] = useState([])
  const [loading, setLoading] = useState(true)
  const [sector, setSector] = useState('All')
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [total, setTotal] = useState(0)

  const fetchStocks = async () => {
    setLoading(true)
    try {
      const params = { page, per_page: 20 }
      if (search) params.q = search
      if (sector !== 'All') params.sector = sector
      const res = await stocksAPI.list(params)
      setStocks(res.data?.items || [])
      setTotal(res.data?.total || 0)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchStocks() }, [page, sector])
  useEffect(() => {
    const timer = setTimeout(() => { setPage(1); fetchStocks() }, 400)
    return () => clearTimeout(timer)
  }, [search])

  return (
    <div className="page-wrapper animate-fadeIn">
      <div className="page-header">
        <div>
          <h1 className="page-title">Stock Explorer</h1>
          <p className="page-subtitle">Discover and screen {total}+ NSE stocks with AI insights</p>
        </div>
        <Link to="/technical" className="btn btn-secondary btn-sm">📈 Technical Analysis</Link>
      </div>

      {/* Filters */}
      <div className="card" style={{ marginBottom: 30, background: 'var(--color-primary-light)' }}>
        <div style={{ display: 'flex', gap: 20, alignItems: 'center', flexWrap: 'wrap' }}>
          <div style={{ flex: 1, minWidth: 280 }}>
            <input className="form-control" style={{ border: '4px solid #000', fontSize: '1.1rem' }} placeholder="🔍 Search stock symbol or company..." value={search}
              onChange={(e) => setSearch(e.target.value)} />
          </div>
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            {SECTORS.map((s) => (
              <button key={s} className={`btn btn-sm ${sector === s ? 'btn-primary' : 'btn-ghost'}`}
                style={{ borderRadius: 0 }}
                onClick={() => { setSector(s); setPage(1) }}>
                {s}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <div className="table-wrapper" style={{ border: 'none', boxShadow: 'none' }}>
          <table className="data-table">
            <thead style={{ background: '#000' }}>
              <tr>
                <th style={{ color: 'white' }}>Symbol</th>
                <th style={{ color: 'white' }}>Company</th>
                <th style={{ color: 'white' }}>Sector</th>
                <th style={{ textAlign: 'right', color: 'white' }}>LTP</th>
                <th style={{ textAlign: 'right', color: 'white' }}>Change (%)</th>
                <th style={{ textAlign: 'right', color: 'white' }}>P/E Ratio</th>
                <th style={{ color: 'white' }}>AI Signal</th>
                <th style={{ color: 'white' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                Array.from({ length: 8 }).map((_, i) => (
                  <tr key={i}>
                    {Array.from({ length: 8 }).map((_, j) => (
                      <td key={j}><div className="skeleton" style={{ height: 20, background: '#eee' }} /></td>
                    ))}
                  </tr>
                ))
              ) : stocks.map((stock) => (
                <tr key={stock.symbol}>
                  <td><strong style={{ color: '#000', fontSize: '1.1rem' }}>{stock.symbol}</strong></td>
                  <td style={{ maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontWeight: 700 }}>{stock.company_name}</td>
                  <td><span className="badge" style={{ background: 'var(--color-yellow)' }}>{stock.sector}</span></td>
                  <td style={{ textAlign: 'right', fontWeight: 900 }}>₹{stock.ltp?.toLocaleString()}</td>
                  <td style={{ textAlign: 'right' }}>
                    <span className={stock.change >= 0 ? 'badge badge-success' : 'badge badge-danger'}>
                      {stock.change_pct >= 0 ? '▲' : '▼'} {Math.abs(stock.change_pct)}%
                    </span>
                  </td>
                  <td style={{ textAlign: 'right', fontWeight: 800 }}>{stock.pe_ratio || '—'}</td>
                  <td>
                    <span className={`badge ${['Buy','Strong Buy'].includes(stock.ai_insight?.signal) ? 'badge-success' : stock.ai_insight?.signal === 'Hold' ? 'badge-warning' : 'badge-danger'}`}>
                      {stock.ai_insight?.signal || 'N/A'}
                    </span>
                  </td>
                  <td>
                    <Link to={`/stocks/${stock.symbol}`} className="btn btn-primary btn-sm">
                      View details
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

