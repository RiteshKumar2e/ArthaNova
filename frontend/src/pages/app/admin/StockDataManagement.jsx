import React, { useState } from 'react';
import styles from '../../../styles/pages/app/admin/StockDataManagement.module.css';

export default function StockDataManagement() {
  const [datasets, setDatasets] = useState([]);

  const [loading, setLoading] = useState(false);

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

  const handleRefresh = (name) => {
    alert(`REFRESHING DATASET: ${name}`);
    setDatasets(prev => prev.map(ds => ds.name === name ? { ...ds, status: 'SYNCING', lastSync: 'JUST NOW' } : ds));
    setTimeout(() => {
      setDatasets(prev => prev.map(ds => ds.name === name ? { ...ds, status: 'HEALTHY' } : ds));
      alert(`${name} REFRESH COMPLETE`);
    }, 2000);
  };

  const handleMasterRefresh = () => {
    setLoading(true);
    alert('INITIALIZING MASTER SYSTEM REFRESH...');
    setTimeout(() => {
      setLoading(false);
      alert('MASTER SYSTEM REFRESH COMPLETE. ALL PIPELINES STABILIZED.');
    }, 3000);
  };

  return (
    <div className={styles.container + " animate-fadeIn"}>
      <div className="page-header">
        <div>
          <h1 className="page-title">STOCK & DATA MANAGEMENT 💾</h1>
          <p className="page-subtitle">CONTROL INGESTION PIPELINES, DATA SOURCES, AND HISTORICAL DATASETS.</p>
        </div>
        <div style={{ display: 'flex', gap: 12 }}>
          <button className="btn btn-secondary btn-sm" onClick={() => alert('SCANNING FOR SOURCE ERRORS...')}>
            🛠️ REPAIR SOURCE
          </button>
          <button 
            className={`btn btn-primary btn-sm ${loading ? 'loading' : ''}`} 
            onClick={handleMasterRefresh}
            disabled={loading}
          >
            {loading ? 'REFRESHING...' : '🔄 MASTER SYS REFRESH'}
          </button>
        </div>
      </div>

      <div className={styles.statsGrid}>
        {datasets.map(ds => (
          <div key={ds.name} className={`${styles.statCard} ${getStatusClass(ds.status)}`} style={{ cursor: 'pointer' }} onClick={() => alert(`VIEWING DETAILS FOR: ${ds.name}`)}>
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
              {datasets.map(ds => (
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
                      <button className="btn btn-sm btn-secondary" style={{ padding: '6px 14px', fontSize: '0.65rem' }} onClick={() => alert(`FETCHING LOGS FOR: ${ds.name}`)}>LOGS</button>
                      <button className="btn btn-sm btn-primary" style={{ padding: '6px 14px', fontSize: '0.65rem' }} onClick={() => handleRefresh(ds.name)}>REFRESH</button>
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
