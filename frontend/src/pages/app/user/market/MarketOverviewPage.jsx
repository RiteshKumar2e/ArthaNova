import { useState, useEffect, useCallback, useRef } from 'react'
import { Link } from 'react-router-dom'
import { stocksAPI } from '../../../../api/client'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts'
import styles from '../../../../styles/pages/app/user/market/MarketOverviewPage.module.css'

export default function MarketOverviewPage() {
  const [data, setData] = useState(null)
  const [sectors, setSectors] = useState([])
  const [loading, setLoading] = useState(true)
  const [lastUpdate, setLastUpdate] = useState(new Date())
  const [isRefreshing, setIsRefreshing] = useState(false)
  
  // To handle the "Real Time Change" visual effect
  const [displayIndices, setDisplayIndices] = useState([])

  const fetchMarketData = useCallback(async () => {
    setIsRefreshing(true)
    try {
      const [mkt, sec] = await Promise.all([
        stocksAPI.marketOverview(),
        stocksAPI.sectors()
      ])
      setData(mkt.data)
      setSectors(sec.data.sectors)
      
      // Update display indices with the new data
      if (mkt.data?.indices) {
        setDisplayIndices(mkt.data.indices)
      }
      
      setLastUpdate(new Date())
    } catch (error) {
      console.error('Failed to fetch market data:', error)
    } finally {
      setLoading(false)
      setIsRefreshing(false)
    }
  }, [])

  useEffect(() => {
    fetchMarketData()
    
    // Auto-refresh market data every 15 seconds for a "Live" feel
    const interval = setInterval(fetchMarketData, 15000)
    return () => clearInterval(interval)
  }, [fetchMarketData])

  // EFFECT: Minor visual price fluctuations to make it look "Tick-by-Tick"
  useEffect(() => {
    if (!data?.indices) return;

    const tickInterval = setInterval(() => {
      setDisplayIndices(prev => prev.map(idx => ({
        ...idx,
        // Add a tiny random fluctuation (±0.005%) between API polls
        value: idx.value + (Math.random() * 0.4 - 0.2)
      })))
    }, 3000)

    return () => clearInterval(tickInterval)
  }, [data])

  return (
    <div className={styles.marketContainer + " animate-fadeIn"}>
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.pageTitle}>MARKET INTELLIGENCE</h1>
          <p className={styles.pageSubtitle}>REAL-TIME SNAPSHOT OF INDIAN EQUITY MARKETS</p>
        </div>
        <div className={styles.headerActions}>
           <div className={styles.liveIndicator}>
             <span className={styles.pulseDot}></span>
             <span className="badge badge-success" style={{ border: '3px solid #000', borderRadius: 0, fontWeight: 950 }}>NSE LIVE</span>
           </div>
          <span className={styles.syncText}>
            LAST SYNC: {lastUpdate.toLocaleTimeString()} {isRefreshing && '🔄'}
          </span>
        </div>
      </div>

      {loading ? (
        <div className={styles.indicesGrid}>
          {[1, 2, 3].map(i => (
            <div key={i} className="skeleton" style={{ height: 180, border: '4px solid #000' }} />
          ))}
        </div>
      ) : (
        <>
          {/* Major Indices */}
          <div className={styles.indicesGrid}>
            {displayIndices.map((idx) => (
              <div key={idx.name} className={styles.indexCard}>
                <div className={styles.indexName}>{idx.name}</div>
                <div className={styles.indexValue}>
                  {idx.value?.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </div>
                <div className={`${styles.indexChange} ${idx.change_pct >= 0 ? styles.up : styles.down}`}>
                  {idx.change_pct >= 0 ? '▲' : '▼'} {Math.abs(idx.change_pct)}%
                  <span style={{fontSize: '0.6rem', marginLeft: '0.5rem', opacity: 0.6}}>
                    {idx.change >= 0 ? '+' : ''}{idx.change?.toFixed(2)}
                  </span>
                </div>
              </div>
            ))}
          </div>

          <div className={styles.middleGrid}>
            {/* FII/DII Institutional Activity */}
            <div className={styles.card}>
              <div className={styles.cardHeader}>
                <h3>INSTITUTIONAL ACTIVITY (F&O + CASH)</h3>
                <span style={{fontSize: '0.6rem', fontWeight: 800}}>SOURCE: {data?.source}</span>
              </div>
              <div className={styles.cardBody}>
                {data?.fii_dii && (
                  <div className={styles.fiiGrid}>
                    {[
                      { label: 'FII BUYING', val: data.fii_dii.fii_buy, bg: '#C4FF00' },
                      { label: 'FII SELLING', val: data.fii_dii.fii_sell, bg: '#FFDD55' },
                      { label: 'DII BUYING', val: data.fii_dii.dii_buy, bg: '#fff' },
                      { label: 'DII SELLING', val: data.fii_dii.dii_sell, bg: '#f2f2f2' },
                    ].map((item) => (
                      <div key={item.label} className={styles.fiiItem} style={{ background: item.bg }}>
                        <div className={styles.fiiLabel}>{item.label}</div>
                        <div className={styles.fiiValue}>₹{item.val?.toLocaleString()}Cr</div>
                      </div>
                    ))}
                  </div>
                )}
                <div className={styles.fiiFooter} style={{ 
                  background: data?.fii_dii?.fii_net >= 0 ? '#C4FF00' : '#FF3131',
                  color: data?.fii_dii?.fii_net >= 0 ? '#000' : '#fff'
                }}>
                  NET FII FLOW: {data?.fii_dii?.fii_net >= 0 ? '+' : ''}₹{data?.fii_dii?.fii_net?.toLocaleString()}Cr
                </div>
              </div>
            </div>

            {/* Market Breadth & Volatility */}
            <div className={styles.card}>
              <div className={styles.cardHeader}>
                <h3>MARKET BREADTH (NSE ALL)</h3>
                <span className={`badge ${data?.market_breadth?.toLowerCase() === 'bullish' ? 'badge-success' : 'badge-danger'}`} style={{ border: '2px solid #000', borderRadius: 0 }}>
                  {data?.market_breadth?.toUpperCase()}
                </span>
              </div>
              <div className={styles.cardBody}>
                {data?.advance_decline && (
                  <>
                    <div className={styles.breadthGrid}>
                      <div className={styles.breadthItem} style={{ background: '#C4FF00', border: '3px solid #000' }}>
                        <div className={styles.breadthValue}>{data.advance_decline.advances}</div>
                        <div className={styles.breadthLabel}>ADVANCES</div>
                      </div>
                      <div className={styles.breadthItem} style={{ background: '#FF3131', color: '#fff', border: '3px solid #000' }}>
                        <div className={styles.breadthValue}>{data.advance_decline.declines}</div>
                        <div className={styles.breadthLabel}>DECLINES</div>
                      </div>
                      <div className={styles.breadthItem} style={{ background: '#000', color: '#fff' }}>
                        <div className={styles.breadthValue}>{data.advance_decline.unchanged}</div>
                        <div className={styles.breadthLabel}>FIXED</div>
                      </div>
                    </div>
                    <div className={styles.vixBanner} style={{
                      background: data?.vix < 15 ? '#C4FF00' : data?.vix < 20 ? '#FFDD55' : '#FF3131',
                      color: data?.vix >= 20 ? '#fff' : '#000',
                      border: '3px solid #000',
                      marginTop: '1.5rem',
                      fontWeight: 950
                    }}>
                      INDIA VIX: {parseFloat(data?.vix)?.toFixed(2)} — {data?.vix < 15 ? 'STABLE REGIME' : data?.vix < 20 ? 'CAUTION ADVISED' : 'EXTREME VOLATILITY'}
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Sector Heatmap Performance */}
          <div className={styles.chartCard} style={{ border: '4px solid #000', padding: '2rem', background: '#fff' }}>
            <div className={styles.cardHeader} style={{ background: 'transparent', border: 'none', padding: '0 0 30px 0' }}>
              <h3 style={{ fontSize: '1.5rem' }}>SECTOR PERFORMANCE RELATIVE (%)</h3>
            </div>
            <ResponsiveContainer width="100%" height={350}>
              <BarChart data={sectors}>
                <XAxis
                  dataKey="name"
                  tick={{ fontSize: 10, fontWeight: 900, fill: '#000' }}
                  axisLine={{ stroke: '#000', strokeWidth: 3 }}
                />
                <YAxis
                  tick={{ fontSize: 11, fontWeight: 900, fill: '#000' }}
                  axisLine={{ stroke: '#000', strokeWidth: 3 }}
                  tickFormatter={(v) => `${v}%`}
                />
                <Tooltip
                  cursor={{ fill: 'rgba(0,0,0,0.05)' }}
                  contentStyle={{
                    background: '#000',
                    border: '4px solid #fff',
                    color: '#fff',
                    fontFamily: 'Archivo Black',
                    textTransform: 'uppercase'
                  }}
                />
                <Bar dataKey="change_pct" radius={[0, 0, 0, 0]}>
                  {sectors.map((entry, index) => (
                    <Cell
                      key={index}
                      fill={entry.change_pct >= 0 ? '#C4FF00' : '#FF3131'}
                      stroke="#000"
                      strokeWidth={3}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </>
      )}
    </div>
  );
}
