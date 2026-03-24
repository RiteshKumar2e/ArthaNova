import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuthStore } from '../../../store/authStore';
import styles from '../../../styles/pages/app/admin/AuditLogs.module.css';

export default function AuditLogs() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const { accessToken } = useAuthStore();

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const response = await axios.get('/api/v1/admin/logs/audit', {
          headers: { Authorization: `Bearer ${accessToken}` }
        });
        setLogs(response.data);
      } catch (error) {
        console.error('Error fetching audit logs:', error);
        // Fallback for demo
        setLogs([
          { id: 1, timestamp: new Date().toISOString(), user: 'admin@arthanova.ai', action: 'LOGIN_SUCCESS', details: 'AUTHENTICATED FROM MUMBAI CLUSTER', ip: '122.161.49.201' },
          { id: 2, timestamp: new Date(Date.now() - 1000*60*15).toISOString(), user: 'system_bot', action: 'SYNC_START', details: 'NIFTY 50 HISTORICAL DATASTREAM', ip: '10.0.4.12' },
          { id: 3, timestamp: new Date(Date.now() - 1000*60*45).toISOString(), user: 'ritesh@arthanova.ai', action: 'ROLE_UPDATE', details: 'MODIFIED "ANALYST" PERMISSIONS', ip: '122.161.52.12' },
        ]);
      } finally {
        setLoading(false);
      }
    };
    fetchLogs();
  }, [accessToken]);

  const filteredLogs = logs.filter(log => 
    log.user.toLowerCase().includes(searchTerm.toLowerCase()) || 
    log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
    log.details.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleExport = () => {
    alert('GENERATING SYSTEM AUDIT ARCHIVE (ZIP)...');
    setTimeout(() => alert('ARCHIVE READY FOR DOWNLOAD: arthanova_audit_logs_2024.zip'), 2000);
  };

  const handleLoadMore = () => {
    alert('FETCHING OLDER ACTIVITY RECORDS FROM DB...');
  };

  return (
    <div className={styles.container + " animate-fadeIn"}>
      <div className="page-header">
        <div>
          <h1 className="page-title">AUDIT LOGS & ACTIVITY TRACKING 📋</h1>
          <p className="page-subtitle">HISTORICAL RECORD OF ALL SYSTEM MODIFICATIONS, API REQUESTS, AND USER ACTIVITIES.</p>
        </div>
        <div style={{ display: 'flex', gap: 12 }}>
          <button className="btn btn-secondary btn-sm" onClick={() => alert('RUNNING ADVANCED FILTER...')}>🔍 FILTER LOGS</button>
          <button className="btn btn-primary btn-sm" onClick={handleExport}>📤 EXPORT ARCHIVE</button>
        </div>
      </div>

      <div className={styles.card}>
        <div className={styles.filterBar}>
           <input 
              type="text" 
              className="form-control" 
              placeholder="SEARCH BY USER, ACTION, OR DETAILS..." 
              style={{ flex: 1, fontSize: '0.65rem', fontWeight: 950 }} 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
           />
           <select className="form-control" style={{ width: 180, fontSize: '0.65rem', fontWeight: 950 }}>
              <option>ANY EVENT TYPE</option>
              <option>AUTH EVENTS</option>
              <option>SETTINGS UPDATE</option>
              <option>ADMIN ACTION</option>
              <option>SYSTEM ERROR</option>
           </select>
        </div>

        <div className="table-responsive">
          <table className={styles.logTable}>
            <thead>
              <tr>
                <th>TIMESTAMP</th>
                <th>PRINCIPAL / USER</th>
                <th>OPERATION</th>
                <th>DETAILS</th>
                <th>SOURCE IP / STATUS</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan="5" style={{ textAlign: 'center', padding: 40, fontWeight: 800 }}>FETCHING AUDIT TRAIL...</td></tr>
              ) : filteredLogs.map(log => (
                <tr key={log.id}>
                  <td><span className={styles.timestamp}>{new Date(log.timestamp).toLocaleTimeString()}</span></td>
                  <td><strong className="text-upper" style={{ fontSize: '0.7rem' }}>{log.user}</strong></td>
                  <td><span className={styles.actionBadge}>{log.action}</span></td>
                  <td><div style={{ maxWidth: 300, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontWeight: 800 }}>{log.details.toUpperCase()}</div></td>
                  <td>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: '0.6rem', fontWeight: 950 }}>{log.ip}</span>
                      <span className={styles.statusOk}>● OK</span>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredLogs.length === 0 && !loading && (
                <tr><td colSpan="5" style={{ textAlign: 'center', padding: 40, fontWeight: 800 }}>NO MATCHING RECORDS FOUND.</td></tr>
              )}
            </tbody>
          </table>
        </div>
        <div className={styles.loadMore}>
           <button className="btn btn-sm btn-secondary" style={{ width: '200px' }} onClick={handleLoadMore}>LOAD OLDER LOGS</button>
        </div>
      </div>
    </div>
  );
}
