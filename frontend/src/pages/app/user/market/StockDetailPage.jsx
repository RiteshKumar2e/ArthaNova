import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { stocksAPI, aiAPI } from '../../../../api/client'
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'
import styles from '../../../../styles/pages/app/user/market/StockDetailPage.module.css'

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
      <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: 24, marginBottom: 32, padding: '24px', background: 'white', border: '4px solid #000', boxShadow: '8px 8px 0px #000' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 8 }}>
            <h1 style={{ fontSize: '2.5rem', fontWeight: 900, textTransform: 'uppercase' }}>{stock.symbol}</h1>
            <span className="badge badge-primary" style={{ fontSize: '14px' }}>{stock.exchange}</span>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <span className="badge" style={{ background: 'var(--color-yellow)' }}>{stock.sector}</span>
          </div>
          <p style={{ color: '#000', fontWeight: 800, marginTop: 12, fontSize: '1.2rem' }}>{stock.company_name}</p>
        </div>
        <div style={{ textAlign: 'right', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <div style={{ fontSize: '3rem', fontWeight: 900, lineHeight: 1 }}>₹{stock.ltp?.toLocaleString()}</div>
          <div className={isPositive ? 'badge badge-success' : 'badge badge-danger'} style={{ marginTop: 12, fontSize: '1rem', alignSelf: 'flex-end' }}>
            {isPositive ? '▲' : '▼'} ₹{Math.abs(stock.change)} ({Math.abs(stock.change_pct)}%)
          </div>
        </div>
      </div>

      {/* Quick Metrics */}
      <div className="grid-4" style={{ marginBottom: 32 }}>
        {[
          { label: 'Open', value: `₹${stock.open}` },
          { label: "Day's High", value: `₹${stock.high}`, bg: 'var(--color-primary-light)' },
          { label: "Day's Low", value: `₹${stock.low}`, bg: 'var(--color-secondary-light)' },
          { label: 'Prev Close', value: `₹${stock.prev_close}` },
          { label: '52W High', value: `₹${stock['52w_high']}`, bg: 'var(--color-primary)' },
          { label: '52W Low', value: `₹${stock['52w_low']}`, bg: 'var(--color-secondary)' },
          { label: 'P/E Ratio', value: stock.pe_ratio, bg: 'var(--color-yellow)' },
          { label: 'Market Cap', value: `₹${(stock.market_cap / 1000).toFixed(0)}K Cr`, bg: 'var(--color-accent-light)' },
        ].map((m) => (
          <div key={m.label} className="metric-card" style={{ background: m.bg || 'white' }}>
            <div className="metric-label" style={{ opacity: 0.7 }}>{m.label}</div>
            <div className="metric-value" style={{ fontSize: '1.4rem' }}>{m.value}</div>
          </div>
        ))}
      </div>

      {/* Chart */}
      <div className="card" style={{ marginBottom: 32, padding: '32px' }}>
        <div className="card-header" style={{ marginBottom: 24 }}>
          <h3 style={{ fontSize: '1.2rem', fontWeight: 900 }}>Market performance</h3>
          <div style={{ display: 'flex', gap: 10 }}>
            {PERIODS.map((p) => (
              <button key={p} className={`btn btn-sm ${period === p ? 'btn-primary' : 'btn-ghost'}`}
                onClick={() => setPeriod(p)}>{p.toUpperCase()}</button>
            ))}
          </div>
        </div>
        <ResponsiveContainer width="100%" height={320}>
          <AreaChart data={ohlcv} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
            <XAxis dataKey="date" tick={{ fontSize: 11, fontWeight: 800, fill: '#000' }} tickLine={{ stroke: '#000', strokeWidth: 2 }} axisLine={{ stroke: '#000', strokeWidth: 2 }}
              interval={Math.floor(ohlcv.length / 8)} />
            <YAxis tick={{ fontSize: 11, fontWeight: 800, fill: '#000' }} tickLine={{ stroke: '#000', strokeWidth: 2 }} axisLine={{ stroke: '#000', strokeWidth: 2 }}
              domain={['auto', 'auto']} tickFormatter={(v) => `₹${v}`} width={80} />
            <Tooltip 
              contentStyle={{ background: '#fff', border: '3px solid #000', borderRadius: '0', boxShadow: '6px 6px 0px #000', fontWeight: 900 }}
              formatter={(v) => [`₹${v.toLocaleString()}`, 'Price']} 
            />
            <Area type="stepAfter" dataKey="close" stroke="#000" strokeWidth={4} fill={isPositive ? 'var(--color-primary)' : 'var(--color-secondary)'} fillOpacity={0.6} />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 10, marginBottom: 24, flexWrap: 'wrap' }}>
        {['overview', 'technicals', 'fundamentals', 'ai_analysis', 'patterns'].map((t) => (
          <button key={t} onClick={() => setTab(t)}
            className={`btn btn-sm ${tab === t ? 'btn-primary' : 'btn-ghost'}`}
            style={{ flex: 1, minWidth: '120px' }}>
            {t.replace('_', ' ')}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {tab === 'overview' && (
        <div className="grid-2" style={{ gap: 32 }}>
          <div className="card" style={{ background: 'white' }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 900, marginBottom: 20, textTransform: 'uppercase' }}>Company Profile</h3>
            <p style={{ fontSize: '1rem', fontWeight: 700, lineHeight: 1.8, marginBottom: 24 }}>{stock.description}</p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              {[
                { label: 'ROE', value: `${stock.roe}%`, bg: 'var(--color-primary-light)' },
                { label: 'ROCE', value: `${stock.roce}%`, bg: 'var(--color-accent-light)' },
                { label: 'D/E Ratio', value: stock.debt_to_equity, bg: 'var(--color-yellow)' },
                { label: 'EPS', value: `₹${stock.eps}`, bg: 'white' },
              ].map((m) => (
                <div key={m.label} style={{ background: m.bg, border: '3px solid #000', padding: '12px 16px', boxShadow: '3px 3px 0px #000' }}>
                  <div style={{ fontSize: '11px', fontWeight: 900, textTransform: 'uppercase' }}>{m.label}</div>
                  <div style={{ fontSize: '1.1rem', fontWeight: 900 }}>{m.value}</div>
                </div>
              ))}
            </div>
          </div>
          <div className="card" style={{ background: 'var(--color-accent-light)' }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 900, marginBottom: 20, textTransform: 'uppercase' }}>Shareholding</h3>
            {[
              { label: 'Promoters', val: stock.promoter_holding, color: 'var(--color-primary)' },
              { label: 'FII', val: stock.fii_holding, color: 'var(--color-secondary)' },
              { label: 'DII', val: stock.dii_holding, color: 'var(--color-yellow)' },
              { label: 'Public', val: stock.public_holding, color: 'white' },
            ].map((sh) => (
              <div key={sh.label} style={{ marginBottom: 15 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                  <span style={{ fontWeight: 900, textTransform: 'uppercase', fontSize: '12px' }}>{sh.label}</span>
                  <span style={{ fontWeight: 900 }}>{sh.val}%</span>
                </div>
                <div style={{ height: 16, background: 'white', border: '2px solid #000', boxShadow: '2px 2px 0px #000' }}>
                  <div style={{ height: '100%', width: `${sh.val}%`, background: sh.color, borderRight: sh.val > 0 ? '2px solid #000' : 'none' }} />
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
