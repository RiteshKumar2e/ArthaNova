import React, { useState } from 'react';
import styles from '../../../styles/pages/app/admin/ReportsAnalytics.module.css';

export default function ReportsAnalytics() {
  const [range, setRange] = useState('LAST 30 DAYS');
  
  const KPIS = [
    { label: 'ACTIVE USERS (MAU)', value: '14,250', change: '+12%', positive: true },
    { label: 'AVG. SESSION TIME', value: '8M 22S', change: '+5%', positive: true },
    { label: 'SIGNAL ENGAGEMENT', value: '42%', change: '-3%', positive: false },
    { label: 'VIDEO PLAYS', value: '4,821', change: '+24%', positive: true },
  ];

  const STOCKS = [
    { symbol: 'RELIANCE', users: '4,210', engagement: '18K', sentiment: 'BULLISH' },
    { symbol: 'HDFCBANK', users: '3,892', engagement: '15K', sentiment: 'MODERATE' },
    { symbol: 'TCS', users: '2,901', engagement: '12K', sentiment: 'BEARISH' },
    { symbol: 'ZOMATO', users: '2,402', engagement: '11K', sentiment: 'BULLISH' },
  ];

  const handleExport = (format) => {
    alert(`GENERATING ${format} REPORT FOR ${range}...`);
    setTimeout(() => {
      alert(`${format} REPORT EXPORTED SUCCESSFULLY.`);
    }, 1500);
  };

  const handleRangeToggle = () => {
    const nextRange = range === 'LAST 30 DAYS' ? 'LAST 7 DAYS' : (range === 'LAST 7 DAYS' ? 'TODAY' : 'LAST 30 DAYS');
    setRange(nextRange);
    alert(`UPDATING REPORTS FOR: ${nextRange}`);
  };

  return (
    <div className={styles.container + " animate-fadeIn"}>
      <div className="page-header">
        <div>
          <h1 className="page-title">REPORTS & ANALYTICS 📈</h1>
          <p className="page-subtitle">PLATFORM USAGE, ENGAGEMENT METRICS, AND FINANCIAL REPORTING ACROSS ALL USER TIERS.</p>
        </div>
        <div style={{ display: 'flex', gap: 12 }}>
          <button className="btn btn-secondary btn-sm" onClick={handleRangeToggle}>📅 {range}</button>
          <button className="btn btn-primary btn-sm" onClick={() => handleExport('PDF')}>📥 EXPORT PDF</button>
        </div>
      </div>

      <div className={styles.kpiGrid}>
        {KPIS.map(kpi => (
          <div key={kpi.label} className={styles.kpiCard}>
            <div className={styles.kpiLabel}>{kpi.label}</div>
            <div className={styles.kpiValue}>{kpi.value}</div>
            <div className={styles.kpiChange} style={{ color: kpi.positive ? '#14a800' : '#FF3131' }}>
               {kpi.change} (VS LAST MONTH)
            </div>
          </div>
        ))}
      </div>

      <div className={styles.reportGrid}>
         <div className={styles.card}>
            <div className={styles.cardHeader}>
               <h3>MOST ACTIVE STOCKS (24H)</h3>
            </div>
            <div className="table-responsive">
              <table className={styles.stockTable}>
                 <thead>
                    <tr>
                       <th>STOCK</th>
                       <th>USERS</th>
                       <th>ENGAGEMENT</th>
                       <th style={{ textAlign: 'center' }}>SENTIMENT</th>
                    </tr>
                 </thead>
                 <tbody>
                    {STOCKS.map(stock => (
                      <tr key={stock.symbol}>
                         <td><strong className="text-upper">{stock.symbol}</strong></td>
                         <td><span style={{ fontWeight: 800 }}>{stock.users}</span></td>
                         <td><span style={{ fontSize: '0.6rem', fontWeight: 950 }}>{stock.engagement}</span></td>
                         <td>
                            <div style={{ display: 'flex', justifyContent: 'center' }}>
                               <button className={`${styles.sentimentBtn} ${stock.sentiment === 'BULLISH' ? styles.bullish : stock.sentiment === 'BEARISH' ? styles.bearish : styles.moderate}`}>
                                  {stock.sentiment}
                               </button>
                            </div>
                         </td>
                      </tr>
                    ))}
                 </tbody>
              </table>
            </div>
         </div>

         <div className={styles.card}>
            <div className={styles.cardHeader}>
               <h3>USER TIER DISTRIBUTION</h3>
            </div>
            <div className={styles.chartArea}>
               <div className={styles.pie} />
               <div className={styles.legend}>
                  <div className={styles.legendItem}><span style={{ color: '#0052CC', fontSize: '1.2rem' }}>■</span> FREE (65%)</div>
                  <div className={styles.legendItem}><span style={{ color: '#00875A', fontSize: '1.2rem' }}>■</span> PRO (20%)</div>
                  <div className={styles.legendItem}><span style={{ color: '#FF991F', fontSize: '1.2rem' }}>■</span> INSTITUTIONAL (15%)</div>
               </div>
            </div>
            <button className="btn btn-sm btn-secondary btn-full" style={{ borderTop: '4px solid #000' }} onClick={() => alert('VIEWING TIER REVENUE ANALYSIS...')}>VIEW REVENUE BREAKDOWN</button>
         </div>
      </div>
    </div>
  );
}
