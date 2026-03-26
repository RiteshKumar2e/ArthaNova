import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import toast from 'react-hot-toast'
import { stocksAPI } from '../../../../api/client'
import styles from '../../../../styles/pages/app/user/market/StockExplorerPage.module.css'

const SECTORS = ['All', 'IT', 'Banking', 'Pharma', 'FMCG', 'Auto', 'Energy', 'Metals']

export default function StockExplorerPage() {
  const [stocks, setStocks] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [sector, setSector] = useState('All')
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [total, setTotal] = useState(0)

  const fetchStocks = async () => {
    setLoading(true)
    setError(null)
    try {
      const params = { page, per_page: 20 }
      if (search) params.q = search
      if (sector !== 'All') params.sector = sector
      const res = await stocksAPI.list(params)
      setStocks(res.data?.items || [])
      setTotal(res.data?.total || 0)
    } catch (err) {
      const errorMsg = err.code === 'ECONNABORTED' 
        ? 'Request timed out. Server is slow. Please try again.'
        : err.message || 'Failed to fetch stocks'
      setError(errorMsg)
      toast.error('❌ ' + errorMsg)
      console.error('Stock fetch error:', err)
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
    <div className={styles.explorerContainer + " animate-fadeIn"}>
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.pageTitle}>STOCK EXPLORER</h1>
          <p className={styles.pageTitleSub}>Discover and screen {total}+ NSE stocks with AI insights</p>
        </div>
        <Link to="/technical" className={styles.techAnalysisBtn}>
          📈 TECHNICAL ANALYSIS
        </Link>
      </div>

      {/* Filters & Search */}
      <div className={styles.filterCard}>
        <div className={styles.filterBar}>
          <div className={styles.searchWrapper}>
            <input 
              className={styles.searchInput} 
              placeholder="🔍 Search stock symbol or company..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)} 
            />
          </div>
          <div className={styles.sectorFilters}>
            {SECTORS.map((s) => (
              <button 
                key={s} 
                className={`${styles.filterBtn} ${sector === s ? styles.active : ''}`}
                onClick={() => { setSector(s); setPage(1) }}
              >
                {s.toUpperCase()}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Stocks Table */}
      <div className={styles.stockTableCard}>
        {/* Error Message */}
        {error && (
          <div style={{
            padding: '20px',
            marginBottom: '20px',
            background: '#FFE5E5',
            border: '2px solid #FF4444',
            borderRadius: '4px',
            color: '#CC0000',
            fontWeight: 900,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <span>❌ {error}</span>
            <button 
              onClick={() => fetchStocks()}
              style={{
                padding: '8px 16px',
                background: '#FF4444',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                fontWeight: 900,
                cursor: 'pointer'
              }}
            >
              RETRY
            </button>
          </div>
        )}
        
        <div className={styles.tableWrapper}>
          <table className={styles.explorerTable}>
            <thead>
              <tr>
                <th>SYMBOL</th>
                <th>COMPANY</th>
                <th>SECTOR</th>
                <th style={{ textAlign: 'right' }}>LTP</th>
                <th style={{ textAlign: 'right' }}>CHANGE (%)</th>
                <th style={{ textAlign: 'right' }}>P/E RATIO</th>
                <th>AI SIGNAL</th>
                <th>ACTION</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                Array.from({ length: 10 }).map((_, i) => (
                  <tr key={i}>
                    {Array.from({ length: 8 }).map((_, j) => (
                      <td key={j}><div className="skeleton" style={{ height: 24, border: '2px solid #eee' }} /></td>
                    ))}
                  </tr>
                ))
              ) : stocks.length === 0 ? (
                <tr>
                  <td colSpan="8" style={{ textAlign: 'center', padding: '4rem', fontWeight: 900, textTransform: 'uppercase', color: '#888' }}>
                    No stocks found matching your criteria.
                  </td>
                </tr>
              ) : stocks.map((stock) => (
                <tr key={stock.symbol}>
                  <td className={styles.symbolCell}>{stock.symbol}</td>
                  <td className={styles.companyCell}>{stock.company_name}</td>
                  <td>
                    <span className="badge" style={{ background: '#FFDD55', border: '2px solid #000', fontSize: '0.65rem' }}>
                      {stock.sector?.toUpperCase()}
                    </span>
                  </td>
                  <td className={styles.priceCell}>₹{stock.ltp?.toLocaleString()}</td>
                  <td className={styles.changeCell}>
                    <span className={`badge ${stock.change_pct >= 0 ? 'badge-success' : 'badge-danger'}`} style={{ border: '2px solid #000' }}>
                      {stock.change_pct >= 0 ? '▲' : '▼'} {Math.abs(stock.change_pct)}%
                    </span>
                  </td>
                  <td style={{ textAlign: 'right' }}>{stock.pe_ratio || '—'}</td>
                  <td>
                    <span className={`badge ${['Buy','Strong Buy'].includes(stock.ai_insight?.signal) ? 'badge-success' : stock.ai_insight?.signal === 'Hold' ? 'badge-warning' : 'badge-danger'}`} style={{ border: '2px solid #000' }}>
                      {stock.ai_insight?.signal?.toUpperCase() || 'N/A'}
                    </span>
                  </td>
                  <td>
                    <Link to={`/stocks/${stock.symbol}`} className={styles.actionBtn}>
                      VIEW DETAILS
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

