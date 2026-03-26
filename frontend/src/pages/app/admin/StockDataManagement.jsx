import React, { useState, useEffect } from 'react';
import { adminAPI } from '../../../api/client';
import { toast } from 'react-hot-toast';
import styles from '../../../styles/pages/app/admin/StockDataManagement.module.css';

export default function StockDataManagement() {
  const [datasets, setDatasets] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPipelines();
    const interval = setInterval(fetchPipelines, 10000);
    return () => clearInterval(interval);
  }, []);

  const fetchPipelines = async () => {
    try {
      const response = await adminAPI.getPipelineStatus();
      setDatasets(response.data || []);
    } catch (error) {
      console.error('Error fetching pipelines:', error);
    } finally {
      setLoading(false);
    }
  };

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

  const handleRefresh = async (id) => {
    try {
      toast.loading('Initializing refresh...');
      await adminAPI.refreshPipeline(id);
      toast.dismiss();
      toast.success('Refresh started');
      fetchPipelines();
    } catch (error) {
      toast.dismiss();
      toast.error('Failed to start refresh');
    }
  };

  const handleMasterRefresh = async () => {
    toast.loading('Master refresh in progress...');
    try {
      for (const ds of datasets) {
        await adminAPI.refreshPipeline(ds.id);
      }
      toast.dismiss();
      toast.success('Master refresh sequence initiated');
      fetchPipelines();
    } catch (error) {
      toast.dismiss();
      toast.error('Master refresh failed');
    }
  };

  return (
    <div className={styles.container + " animate-fadeIn"}>
      <div className="page-header">
        <div>
          <h1 className="page-title">STOCK & DATA MANAGEMENT 💾</h1>
          <p className="page-subtitle">CONTROL INGESTION PIPELINES, DATA SOURCES, AND HISTORICAL DATASETS.</p>
        </div>
        <div style={{ display: 'flex', gap: 12 }}>
          <button className="btn btn-secondary btn-sm" onClick={() => toast.success('Scanning sources...')}>
            🛠️ REPAIR SOURCE
          </button>
          <button 
            className="btn btn-primary btn-sm" 
            onClick={handleMasterRefresh}
            disabled={loading}
          >
            🔄 MASTER SYS REFRESH
          </button>
        </div>
      </div>

      <div className={styles.statsGrid}>
        {datasets.map(ds => (
          <div key={ds.id} className={`${styles.statCard} ${getStatusClass(ds.status)}`} style={{ cursor: 'pointer' }}>
            <div className={styles.statusText} style={{ color: ds.status === 'HEALTHY' ? '#14a800' : (ds.status === 'SYNCING' ? '#00A8FF' : '#FF3131') }}>
               {ds.status}
            </div>
            <div className={styles.label}>{ds.name}</div>
            <div className={styles.value}>{(ds.count || 0).toLocaleString()}</div>
            <div className={styles.syncText}>LAST SYNC: {ds.last_sync ? new Date(ds.last_sync).toLocaleTimeString() : 'NEVER'}</div>
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
              {loading ? (
                <tr><td colSpan="5" style={{ textAlign: 'center', padding: 40, fontWeight: 900 }}>LOADING PIPELINES...</td></tr>
              ) : datasets.length === 0 ? (
                <tr><td colSpan="5" style={{ textAlign: 'center', padding: 40, color: '#999' }}>NO PIPELINES DETECTED.</td></tr>
              ) : datasets.map(ds => (
                <tr key={ds.id}>
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
                      <button className="btn btn-sm btn-secondary" style={{ padding: '6px 14px', fontSize: '0.65rem' }} onClick={() => toast.success(`Viewing logs for ${ds.name}`)}>LOGS</button>
                      <button className="btn btn-sm btn-primary" style={{ padding: '6px 14px', fontSize: '0.65rem' }} onClick={() => handleRefresh(ds.id)}>REFRESH</button>
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
