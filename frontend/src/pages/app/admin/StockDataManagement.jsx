import React from 'react';
import styles from '../../../styles/pages/app/admin/StockDataManagement.module.css';

export default function StockDataManagement() {
  const DATASETS = [
    { name: 'NIFTY 50 HISTORICAL', status: 'HEALTHY', lastSync: 'YESTERDAY', sources: 'NSE, YAHOO', count: '1.2M ROWS' },
    { name: 'LIVE MARKET QUOTES', status: 'SYNCING', lastSync: '10S AGO', sources: 'UPSTOX, INTRINIO', count: 'LIVE STREAM' },
    { name: 'COMPANY FILINGS (PDF)', status: 'SYNCING', lastSync: '2M AGO', sources: 'BSE, SEC', count: '45,210 DOCS' },
    { name: 'INSIDER ACTIVITY FEED', status: 'ERROR', lastSync: '2H AGO', sources: 'BSE CORPORATE', count: '890 ROWS' },
  ];

  const getStatusClass = (status) => {
    if (status === 'HEALTHY') return styles.statCardHealthy;
    if (status === 'SYNCING') return styles.statCardSyncing;
    return styles.statCardError;
  };

  const getProgressClass = (status) => {
    if (status === 'HEALTHY') return styles.progressHealthy;
    if (status === 'SYNCING') return styles.progressSyncing;
    return styles.progressError;
  };

  const getBadgeClass = (status) => {
    if (status === 'HEALTHY') return styles.badgeHealthy;
    if (status === 'SYNCING') return styles.badgeSyncing;
    return styles.badgeError;
  };

  return (
    <div className={styles.container + " animate-fadeIn"}>
      <div className="page-header">
        <div>
          <h1 className="page-title">STOCK & DATA MANAGEMENT 💾</h1>
          <p className="page-subtitle">CONTROL INGESTION PIPELINES, DATA SOURCES, AND HISTORICAL DATASETS.</p>
        </div>
        <div style={{ display: 'flex', gap: 12 }}>
          <button className="btn btn-secondary btn-sm">🛠️ REPAIR SOURCE</button>
          <button className="btn btn-primary btn-sm">🔄 MASTER SYS REFRESH</button>
        </div>
      </div>

      <div className={styles.statsGrid}>
        {DATASETS.map(ds => (
          <div key={ds.name} className={`${styles.statCard} ${getStatusClass(ds.status)}`}>
            <div className={styles.statusText} style={{ color: ds.status === 'HEALTHY' ? '#14a800' : (ds.status === 'SYNCING' ? '#00A8FF' : '#FF3131') }}>
               {ds.status}
            </div>
            <div className={styles.label}>{ds.name}</div>
            <div className={styles.value}>{ds.count}</div>
            <div className={styles.syncText}>LAST SYNC: {ds.lastSync}</div>
          </div>
        ))}
      </div>

      <div className={styles.card}>
        <div className={styles.cardHeader}>
          <h3>INGESTION PIPELINES</h3>
        </div>
        <div className="table-responsive">
          <table className={styles.pipelineTable}>
            <thead>
              <tr>
                <th>DATASET NAME</th>
                <th>SOURCES</th>
                <th>SYNC STATUS</th>
                <th>HEALTH SCORE</th>
                <th style={{ textAlign: 'center' }}>CONTROL</th>
              </tr>
            </thead>
            <tbody>
              {DATASETS.map(ds => (
                <tr key={ds.name}>
                  <td><strong className="text-upper" style={{ fontSize: '0.75rem' }}>{ds.name}</strong></td>
                  <td><span style={{ fontWeight: 800, fontSize: '0.7rem' }}>{ds.sources}</span></td>
                  <td>
                    <span className={`${styles.badge} ${getBadgeClass(ds.status)}`}>
                      {ds.status}
                    </span>
                  </td>
                  <td>
                    <div className={styles.progressRoot}>
                      <div 
                        className={`${styles.progressBar} ${getProgressClass(ds.status)}`}
                        style={{ width: ds.status === 'HEALTHY' ? '100%' : (ds.status === 'SYNCING' ? '70%' : '25%') }}
                      />
                    </div>
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: 8, justifyContent: 'center' }}>
                      <button className="btn btn-sm btn-secondary" style={{ padding: '6px 14px', fontSize: '0.65rem' }}>LOGS</button>
                      <button className="btn btn-sm btn-primary" style={{ padding: '6px 14px', fontSize: '0.65rem' }}>REFRESH</button>
                    </div>
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
