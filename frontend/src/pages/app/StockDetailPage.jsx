import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { stocksAPI, aiAPI } from '../../api/client'
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'
import styles from '../../styles/pages/app/StockDetailPage.module.scss'

const PERIODS = ['1d', '1w', '1m', '3m', '6m', '1y', '5y']

export default function StockDetailPage() {
  const { symbol } = useParams()
  const [stock, setStock] = useState(null)
  const [ohlcv, setOhlcv] = useState([])
  const [patterns, setPatterns] = useState(null)
  const [period, setPeriod] = useState('1m')
  const [loading, setLoading] = useState(true)
  const [tab, setTab] = useState('overview')

  useEffect(() => {
    setLoading(true)
    Promise.all([
      stocksAPI.getDetail(symbol),
      stocksAPI.getOHLCV(symbol, period),
      aiAPI.chartPatterns(symbol),
    ]).then(([detail, ohlcvRes, patternsRes]) => {
      setStock(detail.data)
      setOhlcv(ohlcvRes.data.data)
      setPatterns(patternsRes.data)
    }).finally(() => setLoading(false))
  }, [symbol, period])

  if (loading) return <div className="page-wrapper"><div className="spinner" style={{ margin: '60px auto' }} /></div>
  if (!stock) return <div className="page-wrapper"><p>Stock not found</p></div>

  const isPositive = stock.change >= 0

  return (
    <div className="page-wrapper animate-fadeIn">
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20, flexWrap: 'wrap', gap: 16 }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 4 }}>
            <h1 style={{ fontSize: '1.5rem', fontWeight: 700 }}>{stock.symbol}</h1>
            <span className="badge badge-primary">{stock.exchange}</span>
            <span className="chip">{stock.sector}</span>
          </div>
          <p style={{ color: '#5E6C84' }}>{stock.company_name}</p>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: '2rem', fontWeight: 700 }}>₹{stock.ltp?.toLocaleString()}</div>
          <div className={isPositive ? 'change-positive' : 'change-negative'} style={{ fontWeight: 600 }}>
            {isPositive ? '▲' : '▼'} ₹{Math.abs(stock.change)} ({Math.abs(stock.change_pct)}%)
          </div>
        </div>
      </div>

      {/* Quick Metrics */}
      <div className="grid-4" style={{ marginBottom: 20 }}>
        {[
          { label: 'Open', value: `₹${stock.open}` },
          { label: "Day's High", value: `₹${stock.high}` },
          { label: "Day's Low", value: `₹${stock.low}` },
          { label: 'Prev Close', value: `₹${stock.prev_close}` },
          { label: '52W High', value: `₹${stock['52w_high']}` },
          { label: '52W Low', value: `₹${stock['52w_low']}` },
          { label: 'P/E Ratio', value: stock.pe_ratio },
          { label: 'Market Cap', value: `₹${(stock.market_cap / 1000).toFixed(0)}K Cr` },
        ].map((m) => (
          <div key={m.label} style={{ background: '#F4F5F7', borderRadius: 8, padding: '10px 14px' }}>
            <div style={{ fontSize: '0.7rem', color: '#5E6C84', marginBottom: 2 }}>{m.label}</div>
            <div style={{ fontSize: '0.9rem', fontWeight: 600, color: '#172B4D' }}>{m.value}</div>
          </div>
        ))}
      </div>

      {/* Chart */}
      <div className="card" style={{ marginBottom: 20 }}>
        <div className="card-header">
          <h3 style={{ fontSize: '1rem' }}>Price Chart</h3>
          <div style={{ display: 'flex', gap: 6 }}>
            {PERIODS.map((p) => (
              <button key={p} className={`chip ${period === p ? 'active' : ''}`} style={{ fontSize: '0.7rem' }}
                onClick={() => setPeriod(p)}>{p.toUpperCase()}</button>
            ))}
          </div>
        </div>
        <ResponsiveContainer width="100%" height={280}>
          <AreaChart data={ohlcv} margin={{ top: 4, right: 4, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="colorClose" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={isPositive ? '#00875A' : '#DE350B'} stopOpacity={0.15} />
                <stop offset="95%" stopColor={isPositive ? '#00875A' : '#DE350B'} stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis dataKey="date" tick={{ fontSize: 10, fill: '#97A0AF' }} tickLine={false} axisLine={false}
              interval={Math.floor(ohlcv.length / 6)} />
            <YAxis tick={{ fontSize: 10, fill: '#97A0AF' }} tickLine={false} axisLine={false}
              domain={['auto', 'auto']} tickFormatter={(v) => `₹${v}`} width={70} />
            <Tooltip formatter={(v) => [`₹${v.toLocaleString()}`, 'Price']} contentStyle={{ borderRadius: 8, fontSize: 12 }} />
            <Area type="monotone" dataKey="close" stroke={isPositive ? '#00875A' : '#DE350B'}
              strokeWidth={2} fill="url(#colorClose)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 4, marginBottom: 16, borderBottom: '2px solid #DFE1E6', paddingBottom: 0 }}>
        {['overview', 'technicals', 'fundamentals', 'ai_analysis', 'patterns'].map((t) => (
          <button key={t} onClick={() => setTab(t)}
            style={{ padding: '8px 16px', border: 'none', background: 'none', fontFamily: 'Inter, sans-serif',
              fontSize: '0.875rem', fontWeight: 600, cursor: 'pointer', borderBottom: tab === t ? '2px solid #0052CC' : '2px solid transparent',
              color: tab === t ? '#0052CC' : '#5E6C84', textTransform: 'capitalize', marginBottom: -2 }}>
            {t.replace('_', ' ')}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {tab === 'overview' && (
        <div className="grid-2">
          <div className="card">
            <h3 style={{ fontSize: '1rem', marginBottom: 12 }}>Company Overview</h3>
            <p style={{ fontSize: '0.875rem', lineHeight: 1.7 }}>{stock.description}</p>
            <div style={{ marginTop: 16, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
              {[
                { label: 'ROE', value: `${stock.roe}%` },
                { label: 'ROCE', value: `${stock.roce}%` },
                { label: 'D/E Ratio', value: stock.debt_to_equity },
                { label: 'EPS', value: `₹${stock.eps}` },
              ].map((m) => (
                <div key={m.label} style={{ background: '#F4F5F7', borderRadius: 6, padding: '8px 12px' }}>
                  <div style={{ fontSize: '0.7rem', color: '#5E6C84' }}>{m.label}</div>
                  <div style={{ fontSize: '0.875rem', fontWeight: 600 }}>{m.value}</div>
                </div>
              ))}
            </div>
          </div>
          <div className="card">
            <h3 style={{ fontSize: '1rem', marginBottom: 12 }}>Shareholding Pattern</h3>
            {[
              { label: 'Promoters', val: stock.promoter_holding, color: '#0052CC' },
              { label: 'FII', val: stock.fii_holding, color: '#00875A' },
              { label: 'DII', val: stock.dii_holding, color: '#FF6B35' },
              { label: 'Public', val: stock.public_holding, color: '#9333EA' },
            ].map((sh) => (
              <div key={sh.label} style={{ marginBottom: 10 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4, fontSize: '0.8rem' }}>
                  <span style={{ color: '#5E6C84' }}>{sh.label}</span>
                  <span style={{ fontWeight: 600 }}>{sh.val}%</span>
                </div>
                <div style={{ height: 6, background: '#DFE1E6', borderRadius: 999, overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: `${sh.val}%`, background: sh.color, borderRadius: 999 }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {tab === 'technicals' && stock.technical && (
        <div className="grid-3">
          {[
            { label: 'RSI (14)', value: stock.technical.rsi_14, status: stock.technical.rsi_14 > 70 ? 'Overbought' : stock.technical.rsi_14 < 30 ? 'Oversold' : 'Neutral' },
            { label: 'MACD', value: stock.technical.macd?.toFixed(2), status: stock.technical.macd > stock.technical.macd_signal ? 'Bullish' : 'Bearish' },
            { label: 'EMA 20', value: `₹${stock.technical.ema_20}`, status: stock.ltp > stock.technical.ema_20 ? 'Above' : 'Below' },
            { label: 'EMA 50', value: `₹${stock.technical.ema_50}`, status: stock.ltp > stock.technical.ema_50 ? 'Above' : 'Below' },
            { label: 'Support', value: `₹${stock.technical.support}`, status: 'Key Level' },
            { label: 'Resistance', value: `₹${stock.technical.resistance}`, status: 'Key Level' },
          ].map((t) => (
            <div key={t.label} className="card" style={{ padding: 16 }}>
              <div style={{ fontSize: '0.7rem', color: '#5E6C84', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{t.label}</div>
              <div style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: 4 }}>{t.value}</div>
              <span className={`badge ${t.status.includes('Bull') || t.status === 'Above' ? 'badge-success' : t.status.includes('Bear') || t.status === 'Below' ? 'badge-danger' : 'badge-info'}`}>
                {t.status}
              </span>
            </div>
          ))}
        </div>
      )}

      {tab === 'ai_analysis' && stock.ai_insight && (
        <div className="card">
          <div style={{ display: 'flex', gap: 24, alignItems: 'flex-start', flexWrap: 'wrap' }}>
            <div style={{ flex: 1, minWidth: 240 }}>
              <div style={{ fontSize: '0.7rem', color: '#5E6C84', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 8 }}>AI Recommendation</div>
              <div style={{ fontSize: '2rem', fontWeight: 800, color: ['Strong Buy','Buy'].includes(stock.ai_insight.signal) ? '#00875A' : stock.ai_insight.signal === 'Hold' ? '#FF991F' : '#DE350B' }}>
                {stock.ai_insight.signal}
              </div>
              <div style={{ marginTop: 8 }}>
                <span className={`badge ${stock.ai_insight.sentiment.includes('Bull') ? 'badge-success' : 'badge-warning'}`}>{stock.ai_insight.sentiment}</span>
              </div>
              <div style={{ marginTop: 12 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', marginBottom: 4 }}>
                  <span>Confidence</span><strong>{stock.ai_insight.confidence}%</strong>
                </div>
                <div style={{ height: 8, background: '#DFE1E6', borderRadius: 999, overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: `${stock.ai_insight.confidence}%`, background: 'linear-gradient(135deg, #0052CC, #00875A)', borderRadius: 999 }} />
                </div>
              </div>
            </div>
            <div style={{ flex: 2 }}>
              <div style={{ fontSize: '0.7rem', color: '#5E6C84', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 8 }}>AI Analysis</div>
              <p style={{ fontSize: '0.875rem', lineHeight: 1.8, color: '#172B4D' }}>{stock.ai_insight.summary}</p>
            </div>
          </div>
        </div>
      )}

      {tab === 'patterns' && patterns && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div style={{ display: 'flex', gap: 16, alignItems: 'center', marginBottom: 4 }}>
            <h3 style={{ fontSize: '1rem' }}>Detected Patterns</h3>
            <span className={`badge ${patterns.overall_signal === 'Buy' ? 'badge-success' : patterns.overall_signal === 'Sell' ? 'badge-danger' : 'badge-warning'}`}>
              Overall: {patterns.overall_signal}
            </span>
            <span style={{ fontSize: '0.8rem', color: '#5E6C84' }}>Historical Win Rate: {patterns.backtest_win_rate}%</span>
          </div>
          {patterns.patterns?.map((p, i) => (
            <div key={i} className="card" style={{ padding: 16 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <div style={{ fontWeight: 700, marginBottom: 4 }}>{p.name}</div>
                  <p style={{ fontSize: '0.875rem', color: '#5E6C84', lineHeight: 1.6 }}>{p.description}</p>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 4, alignItems: 'flex-end', flexShrink: 0 }}>
                  <span className={`badge ${p.type === 'Bullish' ? 'badge-success' : 'badge-danger'}`}>{p.type}</span>
                  <span style={{ fontSize: '0.7rem', color: '#5E6C84' }}>{p.confidence}% confidence</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
