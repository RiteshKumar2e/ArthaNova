import { useState, useEffect } from 'react'
import { backtestAPI, stocksAPI } from '../../api/client'
import styles from '../../styles/pages/app/BacktestingPage.module.scss'
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  AreaChart, Area
} from 'recharts'
import toast from 'react-hot-toast'

const STRATEGIES = [
  { id: 'ema_crossover', name: 'EMA Crossover (20/50)', desc: 'Buy when 20-EMA crosses above 50-EMA. Sell when it crosses below.' },
  { id: 'bollinger_breakout', name: 'Bollinger Band Breakout', desc: 'Buy when price breaks above upper band. Sell when it hits middle band.' },
  { id: 'rsi_mean_reversion', name: 'RSI Mean Reversion', desc: 'Buy when RSI < 30. Sell when RSI > 70.' },
]

export default function BacktestingPage() {
  const [loading, setLoading] = useState(false)
  const [results, setResults] = useState(null)
  const [history, setHistory] = useState([])
  const [stocks, setStocks] = useState([])
  
  const [params, setParams] = useState({
    symbol: 'RELIANCE',
    strategy_name: 'EMA Crossover (20/50)',
    start_date: '2024-01-01',
    end_date: '2025-01-01',
    initial_capital: 100000,
    parameters: { ema_short: 20, ema_long: 50 }
  })

  useEffect(() => {
    fetchHistory()
    fetchStocks()
  }, [])

  const fetchHistory = async () => {
    try {
      const resp = await backtestAPI.history()
      setHistory(resp.data)
    } catch (err) {
      console.error('Failed to fetch history', err)
    }
  }

  const fetchStocks = async () => {
    try {
      const resp = await stocksAPI.list({ limit: 50 })
      setStocks(resp.data.stocks || [])
    } catch (err) {
      console.error('Failed to fetch stocks', err)
    }
  }

  const handleRunBacktest = async (e) => {
    if (e) e.preventDefault()
    setLoading(true)
    setResults(null)
    
    try {
      const resp = await backtestAPI.run(params)
      setResults(resp.data)
      toast.success('Backtest completed successfully')
      fetchHistory()
    } catch (err) {
      toast.error('Backtest failed. Please try again.')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  // Generate mock equity curve data from results
  const equityCurveData = results?.trade_log?.reduce((acc, trade, idx) => {
    const lastBalance = idx === 0 ? params.initial_capital : acc[idx-1].balance
    const newBalance = lastBalance + trade.pnl
    acc.push({
      name: `Trade ${trade.trade}`,
      balance: newBalance,
      pnl: trade.pnl,
      pnl_pct: trade.pnl_pct
    })
    return acc
  }, [{ name: 'Initial', balance: params.initial_capital, pnl: 0, pnl_pct: 0 }]) || []

  return (
    <div className="page-wrapper animate-fadeIn">
      <header className="page-header">
        <div>
          <h1 className="page-title">🔄 Backtesting Engine</h1>
          <p className="page-subtitle">Simulate trading strategies on historical NSE data with institutional precision.</p>
        </div>
        <div className={styles.historyOverview}>
          <div className={styles.histStat}>
            <span className={styles.histLabel}>Recent Runs</span>
            <span className={styles.histValue}>{history.length}</span>
          </div>
        </div>
      </header>

      <div className={styles.contentLayout}>
        {/* Sidebar Controls */}
        <aside className={styles.controls}>
          <div className="card">
            <h3 className={styles.cardTitle}>Sim Parameters</h3>
            <form onSubmit={handleRunBacktest} className={styles.form}>
              <div className={styles.formGroup}>
                <label>Strategy</label>
                <select 
                  value={params.strategy_name}
                  onChange={(e) => setParams({...params, strategy_name: e.target.value})}
                >
                  {STRATEGIES.map(s => <option key={s.id} value={s.name}>{s.name}</option>)}
                </select>
              </div>

              <div className={styles.formGroup}>
                <label>Symbol</label>
                <select 
                  value={params.symbol}
                  onChange={(e) => setParams({...params, symbol: e.target.value})}
                >
                  {stocks.map(s => <option key={s.symbol} value={s.symbol}>{s.symbol} — {s.name}</option>)}
                  {stocks.length === 0 && <option value="RELIANCE">RELIANCE</option>}
                </select>
              </div>

              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label>Start Date</label>
                  <input 
                    type="date" 
                    value={params.start_date}
                    onChange={(e) => setParams({...params, start_date: e.target.value})}
                  />
                </div>
                <div className={styles.formGroup}>
                  <label>End Date</label>
                  <input 
                    type="date" 
                    value={params.end_date}
                    onChange={(e) => setParams({...params, end_date: e.target.value})}
                  />
                </div>
              </div>

              <div className={styles.formGroup}>
                <label>Initial Capital (₹)</label>
                <input 
                  type="number" 
                  value={params.initial_capital}
                  onChange={(e) => setParams({...params, initial_capital: parseInt(e.target.value)})}
                />
              </div>

              <button 
                type="submit" 
                className={`btn btn-primary ${styles.runBtn}`}
                disabled={loading}
              >
                {loading ? 'Processing...' : 'Run Simulation'}
              </button>
            </form>
          </div>

          <div className={`card ${styles.recentHistory}`}>
            <h3 className={styles.cardTitle}>Job History</h3>
            <div className={styles.histList}>
              {history.map(run => (
                <div key={run.id} className={styles.histItem}>
                  <div className={styles.histItemMain}>
                    <span className={styles.histSymbol}>{run.symbol}</span>
                    <span className={styles.histStrategy}>{run.strategy_name}</span>
                  </div>
                  <div className={run.total_return_pct >= 0 ? styles.posReturn : styles.negReturn}>
                    {run.total_return_pct > 0 ? '+' : ''}{run.total_return_pct}%
                  </div>
                </div>
              ))}
              {history.length === 0 && <p className={styles.emptyHist}>No recent runs found.</p>}
            </div>
          </div>
        </aside>

        {/* Main Results Area */}
        <main className={styles.resultsMain}>
          {!results && !loading && (
            <div className={styles.idleState}>
              <div className={styles.idleIcon}>📊</div>
              <h2>Ready for Simulation</h2>
              <p>Select a strategy and a stock to begin your institutional-grade backtest. We use exact tick data for high-fidelity results.</p>
            </div>
          )}

          {loading && (
            <div className={styles.loadingState}>
              <div className={styles.spinner}></div>
              <h2>Analyzing historical candles...</h2>
              <p>Fetching 5,000+ data points from NSE and applying your {params.strategy_name} logic.</p>
            </div>
          )}

          {results && (
            <>
              {/* Summary Stats */}
              <div className={styles.statsGrid}>
                <div className={styles.statCard}>
                  <span className={styles.statLabel}>Total Return</span>
                  <span className={`${styles.statValue} ${results.total_return_pct >= 0 ? styles.positiveText : styles.negativeText}`}>
                    {results.total_return_pct > 0 ? '+' : ''}{results.total_return_pct}%
                  </span>
                  <div className={styles.progressBar}><div className={styles.progressFill} style={{width: '75%', background: results.total_return_pct >= 0 ? '#00875A' : '#DE350B'}}></div></div>
                </div>
                <div className={styles.statCard}>
                  <span className={styles.statLabel}>Sharpe Ratio</span>
                  <span className={styles.statValue}>{results.sharpe_ratio}</span>
                  <span className={styles.statSub}>Risk-adjusted return</span>
                </div>
                <div className={styles.statCard}>
                  <span className={styles.statLabel}>Max Drawdown</span>
                  <span className={`${styles.statValue} ${styles.negativeText}`}>{results.max_drawdown_pct}%</span>
                  <span className={styles.statSub}>Peak-to-trough decline</span>
                </div>
                <div className={styles.statCard}>
                  <span className={styles.statLabel}>Win Rate</span>
                  <span className={styles.statValue}>{results.win_rate}%</span>
                  <span className={styles.statSub}>{results.total_trades} total trades</span>
                </div>
              </div>

              {/* Equity Curve Chart */}
              <div className={`card ${styles.chartCard}`}>
                <h3 className={styles.cardTitle}>Equity Curve (Growth of ₹{params.initial_capital.toLocaleString()})</h3>
                <div className={styles.chartWrapper}>
                  <ResponsiveContainer width="100%" height={300}>
                    <AreaChart data={equityCurveData}>
                      <defs>
                        <linearGradient id="colorBalance" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#0052CC" stopOpacity={0.1}/>
                          <stop offset="95%" stopColor="#0052CC" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(0,0,0,0.05)" />
                      <XAxis dataKey="name" hide />
                      <YAxis 
                        domain={['auto', 'auto']} 
                        tickFormatter={(val) => `₹${(val / 1000).toFixed(0)}k`}
                        orientation="right"
                        stroke="#97A0AF"
                        fontSize={12}
                      />
                      <Tooltip 
                        contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                        formatter={(val) => [`₹${val.toLocaleString()}`, 'Capital']}
                      />
                      <Area 
                        type="monotone" 
                        dataKey="balance" 
                        stroke="#0052CC" 
                        strokeWidth={3}
                        fillOpacity={1} 
                        fill="url(#colorBalance)" 
                        animationDuration={1500}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Trade Log */}
              <div className="card">
                <h3 className={styles.cardTitle}>Execution Log (Last 20 Trades)</h3>
                <div className={styles.tableWrapper}>
                  <table className={styles.tradeTable}>
                    <thead>
                      <tr>
                        <th>Trade</th>
                        <th>Action</th>
                        <th>Price</th>
                        <th>Quantity</th>
                        <th>P&L</th>
                        <th>Return %</th>
                      </tr>
                    </thead>
                    <tbody>
                      {results.trade_log.map((trade, i) => (
                        <tr key={i}>
                          <td>#{trade.trade}</td>
                          <td>
                            <span className={`${styles.badge} ${trade.action === 'Buy' ? styles.buyBadge : styles.sellBadge}`}>
                              {trade.action}
                            </span>
                          </td>
                          <td className={styles.monoFont}>₹{trade.price.toLocaleString()}</td>
                          <td>{trade.quantity}</td>
                          <td className={`${styles.monoFont} ${trade.pnl >= 0 ? styles.posText : styles.negText}`}>
                            {trade.pnl >= 0 ? '+' : ''}{trade.pnl.toLocaleString()}
                          </td>
                          <td className={`${styles.monoFont} ${trade.pnl_pct >= 0 ? styles.posText : styles.negText}`}>
                            {trade.pnl_pct >= 0 ? '+' : ''}{trade.pnl_pct}%
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}
        </main>
      </div>
    </div>
  )
}
