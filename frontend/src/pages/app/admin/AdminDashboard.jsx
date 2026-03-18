import React from 'react';
import { Link } from 'react-router-dom';
import styles from '../../../styles/pages/app/DashboardPage.module.scss';

const ADMIN_STATS = [
  { label: 'Total Users', value: '1,248', change: '+24', positive: true, icon: '👥' },
  { label: 'Active Sessions', value: '82', change: 'Current', positive: true, icon: '🔥' },
  { label: 'Signals Sent', value: '3,820', change: '+124', positive: true, icon: '🎯' },
  { label: 'System Uptime', value: '99.98%', change: 'Optimal', positive: true, icon: '⚡' },
];

const RECENT_USERS = [
  { id: 101, user: 'Arun Kumar', email: 'arun@example.com', role: 'user', date: '2m ago' },
  { id: 102, user: 'Sita Sharma', email: 'sita@example.com', role: 'analyst', date: '15m ago' },
  { id: 103, user: 'Rahul Verma', email: 'rahul@example.com', role: 'user', date: '42m ago' },
];

export default function AdminDashboard({ user }) {
  return (
    <div className="animate-fadeIn">
      <div className="page-header">
        <div>
          <h1 className="page-title">Admin Command Center 🛠️</h1>
          <p className="page-subtitle">Welcome, Chief. System health and user metrics at a glance.</p>
        </div>
        <div style={{ display: 'flex', gap: 12 }}>
          <Link to="/settings" className="btn btn-secondary btn-sm">⚙️ System Settings</Link>
          <Link to="/admin" className="btn btn-primary btn-sm">👥 User Management</Link>
        </div>
      </div>

      <div className="grid-4" style={{ marginBottom: 24 }}>
        {ADMIN_STATS.map((stat) => (
          <div key={stat.label} className="metric-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
              <div className="metric-label">{stat.label}</div>
              <span>{stat.icon}</span>
            </div>
            <div className="metric-value">{stat.value}</div>
            <div className={`metric-change ${stat.positive ? 'positive' : ''}`}>
              {stat.change}
            </div>
          </div>
        ))}
      </div>

      <div className="grid-2">
        <div className="card">
          <div className="card-header">
            <h3>👥 Recent User Registrations</h3>
          </div>
          <div className="table-responsive">
            <table className="table">
              <thead>
                <tr>
                  <th>User</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Registration</th>
                </tr>
              </thead>
              <tbody>
                {RECENT_USERS.map(row => (
                  <tr key={row.id}>
                    <td><strong>{row.user}</strong></td>
                    <td>{row.email}</td>
                    <td><span className={`badge ${row.role === 'analyst' ? 'badge-primary' : 'badge-secondary'}`}>{row.role}</span></td>
                    <td>{row.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <h3>🚨 System Activity Log</h3>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {[
              { type: 'Info', msg: 'System backup completed successfully.', time: '10:00 AM' },
              { type: 'Warn', msg: 'High load detected on API node-4.', time: '09:45 AM' },
              { type: 'Success', msg: '34 Opportunity Signals dispatched.', time: '09:15 AM' },
              { type: 'Info', msg: 'Database migration complete.', time: 'Yesterday' },
            ].map((log, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #DFE1E6', paddingBottom: 8 }}>
                <div style={{ fontSize: '0.8rem' }}>
                  <span className={`badge ${log.type === 'Warn' ? 'badge-warning' : 'badge-success'}`}>{log.type}</span>
                  <span style={{ marginLeft: 8 }}>{log.msg}</span>
                </div>
                <div style={{ fontSize: '0.7rem', color: '#5E6C84' }}>{log.time}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
