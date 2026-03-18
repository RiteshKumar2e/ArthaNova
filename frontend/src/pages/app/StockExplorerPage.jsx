import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { stocksAPI } from '../../api/client'
import styles from '../../styles/pages/app/StockExplorerPage.module.scss'

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
      setStocks(res.data.items)
      setTotal(res.data.total)
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
      <div className="card" style={{ marginBottom: 20 }}>
        <div style={{ display: 'flex', gap: 16, alignItems: 'center', flexWrap: 'wrap' }}>
          <div style={{ flex: 1, minWidth: 240 }}>
            <input className="form-control" placeholder="🔍 Search by name or symbol..." value={search}
              onChange={(e) => setSearch(e.target.value)} />
          </div>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {SECTORS.map((s) => (
              <button key={s} className={`chip ${sector === s ? 'active' : ''}`}
                onClick={() => { setSector(s); setPage(1) }}>
                {s}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="card" style={{ padding: 0 }}>
        <div className="table-wrapper">
          <table className="data-table">
            <thead>
              <tr>
                <th>Symbol</th>
                <th>Company</th>
                <th>Sector</th>
                <th style={{ textAlign: 'right' }}>LTP</th>
                <th style={{ textAlign: 'right' }}>Change</th>
                <th style={{ textAlign: 'right' }}>Change %</th>
                <th style={{ textAlign: 'right' }}>Volume</th>
                <th style={{ textAlign: 'right' }}>Market Cap (Cr)</th>
                <th style={{ textAlign: 'right' }}>P/E</th>
                <th>AI Signal</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                Array.from({ length: 10 }).map((_, i) => (
                  <tr key={i}>
                    {Array.from({ length: 10 }).map((_, j) => (
                      <td key={j}><div className="skeleton" style={{ height: 16 }} /></td>
                    ))}
                  </tr>
                ))
              ) : stocks.map((stock) => (
                <tr key={stock.symbol}>
                  <td><strong style={{ color: '#0052CC' }}><Link to={`/stocks/${stock.symbol}`} style={{ color: '#0052CC', textDecoration: 'none' }}>{stock.symbol}</Link></strong></td>
                  <td style={{ maxWidth: 180, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{stock.company_name}</td>
                  <td><span className="chip" style={{ fontSize: '0.65rem' }}>{stock.sector}</span></td>
                  <td style={{ textAlign: 'right', fontWeight: 600 }}>₹{stock.ltp?.toLocaleString()}</td>
                  <td style={{ textAlign: 'right' }} className={stock.change >= 0 ? 'change-positive' : 'change-negative'}>
                    {stock.change >= 0 ? '+' : ''}{stock.change?.toFixed(2)}
                  </td>
                  <td style={{ textAlign: 'right' }} className={stock.change_pct >= 0 ? 'change-positive' : 'change-negative'}>
                    {stock.change_pct >= 0 ? '▲' : '▼'} {Math.abs(stock.change_pct)}%
                  </td>
                  <td style={{ textAlign: 'right', fontSize: '0.75rem' }}>{(stock.volume / 1000000).toFixed(2)}M</td>
                  <td style={{ textAlign: 'right', fontSize: '0.75rem' }}>₹{(stock.market_cap / 1000).toFixed(0)}K</td>
                  <td style={{ textAlign: 'right', fontSize: '0.75rem' }}>{stock.pe_ratio}</td>
                  <td>
                    <span className={`badge ${['Buy','Strong Buy'].includes(stock.ai_insight?.signal) ? 'badge-success' : stock.ai_insight?.signal === 'Hold' ? 'badge-warning' : 'badge-danger'}`} style={{ fontSize: '0.65rem' }}>
                      {stock.ai_insight?.signal || 'N/A'}
                    </span>
                  </td>
                  <td>
                    <Link to={`/stocks/${stock.symbol}`} className="btn btn-secondary btn-sm" style={{ padding: '4px 10px', fontSize: '0.7rem' }}>
                      View →
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
