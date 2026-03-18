import React from 'react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { Link } from 'react-router-dom';
import styles from '../../../styles/pages/app/DashboardPage.module.scss';

const ANALYST_STATS = [
  { label: 'Active Signals', value: '42', change: '+12%', positive: true, icon: '🎯' },
  { label: 'Success Rate', value: '74.2%', change: '+2.1%', positive: true, icon: '🏆' },
  { label: 'Backtests Run', value: '156', change: 'This week', positive: null, icon: '🔁' },
  { label: 'System Health', value: 'Optimal', change: '99.9% Up', positive: true, icon: '⚡' },
];

const RECENT_BACKTESTS = [
  { id: 1, strategy: 'RSI Mean Reversion', symbol: 'RELIANCE', result: '+14.2%', date: '2h ago' },
  { id: 2, strategy: 'MACD Crossover', symbol: 'TCS', result: '+8.4%', date: '5h ago' },
  { id: 3, strategy: 'EMA Breakout', symbol: 'HDFCBANK', result: '-2.1%', date: 'Yesterday' },
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
          <div style={{ height: 250 }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={[{d:1, v:20}, {d:2, v:45}, {d:3, v:38}, {d:4, v:65}]}>
                <Area type="monotone" dataKey="v" stroke="#0052CC" fill="#E8F0FE" />
                <XAxis dataKey="d" hide />
                <YAxis hide />
              </AreaChart>
            </ResponsiveContainer>
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
                {RECENT_BACKTESTS.map(bt => (
                  <tr key={bt.id}>
                    <td>{bt.strategy}</td>
                    <td><strong>{bt.symbol}</strong></td>
                    <td className={bt.result.startsWith('+') ? 'text-success' : 'text-danger'}>
                      {bt.result}
                    </td>
                    <td>{bt.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
