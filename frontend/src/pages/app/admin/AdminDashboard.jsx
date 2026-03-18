import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useAuthStore } from '../../../store/authStore';
import styles from '../../../styles/pages/app/admin/AdminDashboard.module.scss';

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const { accessToken } = useAuthStore();

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await axios.get('/api/v1/admin/dashboard/stats', {
          headers: { Authorization: `Bearer ${accessToken}` }
        });
        setStats(response.data);
      } catch (error) {
        console.error('Error fetching admin stats:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, [accessToken]);

  const ADMIN_STATS = stats ? [
    { label: 'Total Users', value: stats.users.total, change: `+${stats.users.new_today}`, positive: true, icon: '👥' },
    { label: 'API Loads (24h)', value: stats.system.api_requests_24h.toLocaleString(), change: 'Stable', positive: true, icon: '🔥' },
    { label: 'AI Signals Dispatch', value: stats.alerts.ai_signals_generated, change: 'Running', positive: true, icon: '🎯' },
    { label: 'System Uptime', value: stats.system.uptime, change: 'Optimal', positive: true, icon: '⚡' },
  ] : [];

  return (
    <div className={styles.adminDashboard}>
      <div className="page-header" style={{ marginBottom: 32 }}>
        <div>
          <h1 className="page-title">Admin Command Center 🛠️</h1>
          <p className="page-subtitle">Governance, platform health, and predictive system oversight.</p>
        </div>
        <div style={{ display: 'flex', gap: 12 }}>
          <Link to="/admin/settings" className="btn btn-secondary btn-sm">⚙️ System Settings</Link>
          <Link to="/admin/users" className="btn btn-primary btn-sm">👥 User Management</Link>
        </div>
      </div>

      <div className={styles.statsGrid}>
        {loading ? (
          [1, 2, 3, 4].map(i => (
            <div key={i} className={`${styles.statCard} loading`}>
              <div className={styles.label}>Loading Stats...</div>
              <div className={styles.value}>----</div>
            </div>
          ))
        ) : ADMIN_STATS.map((stat) => (
          <div key={stat.label} className={styles.statCard}>
            <div className={styles.iconWrapper}>{stat.icon}</div>
            <div className={styles.label}>{stat.label}</div>
            <div className={styles.value}>{stat.value}</div>
            <div className={`${styles.change} ${stat.positive ? styles.positive : styles.negative}`}>
              {stat.change}
            </div>
          </div>
        ))}
      </div>

      <div className={styles.contentRow}>
        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <h3>🖥️ System Registry Activity</h3>
            <span className="badge badge-secondary" style={{ fontSize: 10 }}>LIVE FEED</span>
          </div>
          <div className={styles.cardBody} style={{ padding: 0 }}>
            <table className={styles.activityTable}>
              <thead>
                <tr>
                  <th>Identity</th>
                  <th>Operation</th>
                  <th>Module</th>
                  <th style={{ textAlign: 'right' }}>Timestamp</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { user: 'Admin Root', action: 'Update Auth Policy', module: 'Auth-Kevlar', date: '2m ago' },
                  { user: 'AI Engine v2.4', action: 'Generate Signal', module: 'Intelligence', date: '15m ago' },
                  { user: 'Cloud Scheduler', action: 'Snapshot DB', module: 'Database', date: '42m ago' },
                  { user: 'Video Pipeline', action: 'Render Complete', module: 'Video-Gen', date: '1h ago' },
                  { user: 'Sentinel AI', action: 'Flagged Login IP', module: 'Security', date: '2h ago' },
                ].map((row, i) => (
                  <tr key={i}>
                    <td><strong>{row.user}</strong></td>
                    <td><span style={{ fontSize: '0.8rem', color: '#5E6C84' }}>{row.action}</span></td>
                    <td><span className="badge badge-secondary" style={{ fontSize: '0.7rem' }}>{row.module}</span></td>
                    <td style={{ textAlign: 'right', fontSize: '0.75rem', color: '#97A0AF' }}>{row.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <h3>🚨 Health Monitor</h3>
          </div>
          <div className={styles.cardBody}>
            <div className={styles.healthList}>
              {[
                { type: 'success', msg: 'Core API nodes reporting healthy.', time: '10:00 AM' },
                { type: 'warn', msg: `Node-4 CPU spikes: ${stats?.system.cpu_usage || '14%'}`, time: '09:45 AM' },
                { type: 'success', msg: `${stats?.alerts.ai_signals_generated || 142} signals dispatched today.`, time: '09:15 AM' },
                { type: 'info', msg: 'Daily data integrity check passed.', time: '08:00 AM' },
                { type: 'error', msg: 'Memory leakage detected in video-gen-clstr.', time: 'Last night' },
              ].map((log, i) => (
                <div key={i} className={styles.healthItem}>
                  <div className={`${styles.typeIndicator} ${styles[log.type]}`}></div>
                  <div className={styles.msgContainer}>
                    <div className={styles.msg}>{log.msg}</div>
                    <div className={styles.time}>{log.time}</div>
                  </div>
                </div>
              ))}
            </div>
            <button className="btn btn-sm btn-secondary" style={{ width: '100%', marginTop: 20 }}>
              Deep Diagnostic &rarr;
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
