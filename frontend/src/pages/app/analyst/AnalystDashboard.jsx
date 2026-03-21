import React from 'react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { Link } from 'react-router-dom';
import styles from '../../../styles/pages/app/DashboardPage.module.scss';

const ANALYST_STATS = [
  { label: 'Active Signals', value: '0', change: '--%', positive: null, icon: '🎯' },
  { label: 'Success Rate', value: '0.0%', change: '--%', positive: null, icon: '🏆' },
  { label: 'Backtests Run', value: '0', change: 'This week', positive: null, icon: '🔁' },
  { label: 'System Health', value: 'Optimal', change: 'Online', positive: true, icon: '⚡' },
];

export default function AnalystDashboard({ user }) {
  return (
    <div className="animate-fadeIn">
      <div className="page-header">
        <div>
          <h1 className="page-title">Analyst Terminal 🏛️</h1>
          <p className="page-subtitle">Welcome back, {user?.full_name}. Advanced market intelligence at your fingertips.</p>
        </div>
        <div style={{ display: 'flex', gap: 12 }}>
          <Link to="/backtest" className="btn btn-secondary btn-sm">🔁 New Backtest</Link>
          <Link to="/radar" className="btn btn-primary btn-sm">🎯 Signal Lab</Link>
        </div>
      </div>

      <div className="grid-4" style={{ marginBottom: 24 }}>
        {ANALYST_STATS.map((stat) => (
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
            <h3>📈 Strategy Performance</h3>
          </div>
          <div style={{ height: 250, display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: 40 }}>
            <div>
              <div style={{ fontSize: '2rem', marginBottom: 12 }}>🕯️</div>
              <p style={{ color: '#5E6C84' }}>No performance data available. Deploy a strategy to see real-time performance tracking.</p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <h3>🧪 Recent Backtests</h3>
          </div>
          <div className="table-responsive">
            <table className="table">
              <thead>
                <tr>
                  <th>Strategy</th>
                  <th>Symbol</th>
                  <th>Result</th>
                  <th>Time</th>
                </tr>
              </thead>
              <tbody>
                {
                  <tr>
                    <td colSpan="4" style={{ textAlign: 'center', padding: 40, color: '#97A0AF' }}>
                      No backtest history found. Run a new simulation to begin.
                    </td>
                  </tr>
                }
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
