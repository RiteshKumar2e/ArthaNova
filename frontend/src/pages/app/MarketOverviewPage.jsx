import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { stocksAPI } from '../../api/client'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts'
import styles from '../../styles/pages/app/MarketOverviewPage.module.css'

export default function MarketOverviewPage() {
  const [data, setData] = useState(null)
  const [sectors, setSectors] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([stocksAPI.marketOverview(), stocksAPI.sectors()])
      .then(([mkt, sec]) => { setData(mkt.data); setSectors(sec.data.sectors) })
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className={styles.marketContainer + " animate-fadeIn"}>
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.pageTitle}>MARKET INTELLIGENCE</h1>
          <p className={styles.pageSubtitle}>REAL-TIME SNAPSHOT OF INDIAN EQUITY MARKETS</p>
        </div>
        <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
          <span className="badge badge-success" style={{ border: '3px solid #000' }}>NSE OPEN</span>
          <span style={{ fontSize: '0.7rem', fontWeight: 900, color: '#000', textTransform: 'uppercase' }}>
            LAST SYNC: {new Date().toLocaleTimeString()}
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
            {data?.indices?.map((idx) => (
              <div key={idx.name} className={styles.indexCard}>
                <div className={styles.indexName}>{idx.name}</div>
                <div className={styles.indexValue}>{idx.value?.toLocaleString()}</div>
                <div className={`${styles.indexChange} ${idx.change_pct >= 0 ? styles.up : styles.down}`}>
                  {idx.change_pct >= 0 ? '▲' : '▼'} {Math.abs(idx.change_pct)}%
                </div>
              </div>
            ))}
          </div>

          <div className={styles.middleGrid}>
            {/* FII/DII Institutional Activity */}
            <div className={styles.card}>
              <div className={styles.cardHeader}>
                <h3>INSTITUTIONAL ACTIVITY</h3>
              </div>
              <div className={styles.cardBody}>
                {data?.fii_dii && (
                  <div className={styles.fiiGrid}>
                    {[
                      { label: 'FII BUYING', val: data.fii_dii.fii_buy, color: '#000', bg: '#C4FF00', sign: '+' },
                      { label: 'FII SELLING', val: data.fii_dii.fii_sell, color: '#000', bg: '#FFDD55', sign: '-' },
                      { label: 'DII BUYING', val: data.fii_dii.dii_buy, color: '#000', bg: '#fff', sign: '+' },
                      { label: 'DII SELLING', val: data.fii_dii.dii_sell, color: '#000', bg: '#f2f2f2', sign: '-' },
                    ].map((item) => (
                      <div key={item.label} className={styles.fiiItem} style={{ background: item.bg }}>
                        <div className={styles.fiiLabel}>{item.label}</div>
                        <div className={styles.fiiValue}>₹{item.val?.toLocaleString()}Cr</div>
                      </div>
                    ))}
                  </div>
                )}
                <div className={styles.fiiFooter}>
                  NET FII FLOW: {data?.fii_dii?.fii_net >= 0 ? '+' : ''}₹{data?.fii_dii?.fii_net?.toLocaleString()}Cr
                </div>
              </div>
            </div>

            {/* Market Breadth & Volatility */}
            <div className={styles.card}>
              <div className={styles.cardHeader}>
                <h3>MARKET BREADTH</h3>
                <span className={`badge ${data?.market_breadth === 'Bullish' ? 'badge-success' : 'badge-danger'}`} style={{ border: '2px solid #000' }}>
                  {data?.market_breadth?.toUpperCase()}
                </span>
              </div>
              <div className={styles.cardBody}>
                {data?.advance_decline && (
                  <>
                    <div className={styles.breadthGrid}>
                      <div className={styles.breadthItem} style={{ background: '#C4FF00' }}>
                        <div className={styles.breadthValue}>{data.advance_decline.advances}</div>
                        <div className={styles.breadthLabel}>ADVANCES</div>
                      </div>
                      <div className={styles.breadthItem} style={{ background: '#FF3131', color: '#fff' }}>
                        <div className={styles.breadthValue}>{data.advance_decline.declines}</div>
                        <div className={styles.breadthLabel}>DECLINES</div>
                      </div>
                      <div className={styles.breadthItem} style={{ background: '#eee' }}>
                        <div className={styles.breadthValue}>{data.advance_decline.unchanged}</div>
                        <div className={styles.breadthLabel}>FIXED</div>
                      </div>
                    </div>
                    <div className={styles.vixBanner} style={{
                      background: data?.vix < 15 ? '#C4FF00' : data?.vix < 20 ? '#FFDD55' : '#FF3131',
                      color: data?.vix >= 20 ? '#fff' : '#000'
                    }}>
                      INDIA VIX: {data?.vix} — {data?.vix < 15 ? 'STABLE REGIME' : data?.vix < 20 ? 'CAUTION ADVISED' : 'EXTREME VOLATILITY'}
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Sector Heatmap Performance */}
          <div className={styles.chartCard}>
            <div className={styles.cardHeader} style={{ background: 'transparent', border: 'none', padding: '0 0 20px 0' }}>
              <h3>SECTOR PERFORMANCE RELATIVE (%)</h3>
            </div>
            <ResponsiveContainer width="100%" height={300}>
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
                <Bar dataKey="change_pct" radius={[4, 4, 0, 0]}>
                  {sectors.map((entry, index) => (
                    <Cell
                      key={index}
                      fill={entry.change_pct >= 0 ? '#C4FF00' : '#FF3131'}
                      stroke="#000"
                      strokeWidth={2}
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

