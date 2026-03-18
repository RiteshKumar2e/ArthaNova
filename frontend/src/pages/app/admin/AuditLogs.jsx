import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuthStore } from '../../../store/authStore';

export default function AuditLogs() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
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
      } finally {
        setLoading(false);
      }
    };
    fetchLogs();
  }, [accessToken]);

  return (
    <div className="animate-fadeIn">
      <div className="page-header">
        <div>
          <h1 className="page-title">Audit Logs & Activity Tracking 📋</h1>
          <p className="page-subtitle">Historical record of all system modifications, API requests, and user activities.</p>
        </div>
        <div style={{ display: 'flex', gap: 12 }}>
          <button className="btn btn-secondary">🔍 Filter Logs</button>
          <button className="btn btn-primary">📤 Export Archive</button>
        </div>
      </div>

      <div className="card" style={{ marginBottom: 24 }}>
        <div style={{ padding: 16, borderBottom: '1px solid #DFE1E6', display: 'flex', gap: 16 }}>
           <input type="text" className="form-control" placeholder="Filter by User, IP, or Event ID..." style={{ flex: 1 }} />
           <select className="form-control" style={{ width: 180 }}>
              <option>Any Type</option>
              <option>Auth Events</option>
              <option>Settings Update</option>
              <option>Admin Action</option>
              <option>System Error</option>
           </select>
        </div>

        <div className="table-responsive">
          <table className="table">
            <thead>
              <tr>
                <th>Timestamp</th>
                <th>Principal / User</th>
                <th>Operation</th>
                <th>Details</th>
                <th>Source IP</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan="6" style={{ textAlign: 'center', padding: 40 }}>Loading audit trail...</td></tr>
              ) : logs.map(log => (
                <tr key={log.id}>
                  <td><code style={{ fontSize: '0.75rem' }}>{new Date(log.timestamp).toLocaleString()}</code></td>
                  <td><strong>{log.user}</strong></td>
                  <td><span className="badge badge-secondary">{log.action}</span></td>
                  <td><div style={{ maxWidth: 350, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{log.details}</div></td>
                  <td>{log.ip}</td>
                  <td><span className="badge badge-success">OK</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div style={{ padding: 16, borderTop: '1px solid #DFE1E6', display: 'flex', justifyContent: 'center' }}>
           <button className="btn btn-sm btn-secondary">Load Older Logs</button>
        </div>
      </div>
    </div>
  );
}
