import React from 'react';

export default function ReportsAnalytics() {
  const KPIS = [
    { label: 'Active Users (MAU)', value: '14,250', change: '+12%', positive: true },
    { label: 'Avg. Session Time', value: '8m 22s', change: '+5%', positive: true },
    { label: 'Signal Engagement', value: '42%', change: '-3%', positive: false },
    { label: 'Video Plays', value: '4,821', change: '+24%', positive: true },
  ];

  return (
    <div className="animate-fadeIn">
      <div className="page-header">
        <div>
          <h1 className="page-title">Reports & Analytics 📈</h1>
          <p className="page-subtitle">Platform usage, engagement metrics, and financial reporting across all user tiers.</p>
        </div>
        <div style={{ display: 'flex', gap: 12 }}>
          <button className="btn btn-secondary">📅 Select Range</button>
          <button className="btn btn-primary">📥 Export CSV/PDF</button>
        </div>
      </div>

      <div className="grid-4" style={{ marginBottom: 24 }}>
        {KPIS.map(kpi => (
          <div key={kpi.label} className="metric-card">
            <div className="metric-label">{kpi.label}</div>
            <div className="metric-value">{kpi.value}</div>
            <div className={`metric-change ${kpi.positive ? 'positive' : 'negative'}`}>
               {kpi.change} (vs last month)
            </div>
          </div>
        ))}
      </div>

      <div className="grid-2">
         <div className="card">
            <div className="card-header">
               <h3>Most Active Stocks (24h)</h3>
            </div>
            <div className="table-responsive">
              <table className="table">
                 <thead>
                    <tr>
                       <th>Stock</th>
                       <th>Unique Users</th>
                       <th>Engagements</th>
                       <th>Sentiment</th>
                    </tr>
                 </thead>
                 <tbody>
                    {[
                      { symbol: 'RELIANCE', users: '4,210', engagement: '18K', sentiment: 'Bullish' },
                      { symbol: 'HDFCBANK', users: '3,892', engagement: '15K', sentiment: 'Moderate' },
                      { symbol: 'TCS', users: '2,901', engagement: '12K', sentiment: 'Bearish' },
                      { symbol: 'ZOMATO', users: '2,402', engagement: '11K', sentiment: 'Bullish' },
                    ].map(stock => (
                      <tr key={stock.symbol}>
                         <td><strong>{stock.symbol}</strong></td>
                         <td>{stock.users}</td>
                         <td>{stock.engagement}</td>
                         <td>
                            <span className={`badge ${stock.sentiment === 'Bullish' ? 'badge-success' : stock.sentiment === 'Bearish' ? 'badge-danger' : 'badge-warning'}`}>
                               {stock.sentiment}
                            </span>
                         </td>
                      </tr>
                    ))}
                 </tbody>
              </table>
            </div>
         </div>

         <div className="card">
            <div className="card-header">
               <h3>User Tier Distribution</h3>
            </div>
            <div style={{ padding: 24, display: 'flex', justifyContent: 'center', position: 'relative' }}>
               <div style={{ height: 180, width: 180, borderRadius: '50%', background: 'conic-gradient(#0052CC 0% 65%, #00875A 65% 85%, #FF991F 85% 100%)', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}></div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-around', paddingBottom: 16 }}>
               <div style={{ fontSize: '0.8rem' }}><span style={{ color: '#0052CC' }}>■</span> Free (65%)</div>
               <div style={{ fontSize: '0.8rem' }}><span style={{ color: '#00875A' }}>■</span> Pro (20%)</div>
               <div style={{ fontSize: '0.8rem' }}><span style={{ color: '#FF991F' }}>■</span> Institutional (15%)</div>
            </div>
         </div>
      </div>
    </div>
  );
}
