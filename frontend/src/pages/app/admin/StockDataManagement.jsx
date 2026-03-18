import React from 'react';

export default function StockDataManagement() {
  const DATASETS = [
    { name: 'Nifty 50 Historical', status: 'Healthy', lastSync: 'Yesterday', sources: 'NSE, Yahoo', count: '1.2M Rows' },
    { name: 'Live Market Quotes', status: 'Syncing', lastSync: '10s ago', sources: 'Upstox, Intrinio', count: 'Live Stream' },
    { name: 'Company Filings (PDF)', status: 'Syncing', lastSync: '2m ago', sources: 'BSE, SEC', count: '45,210 Docs' },
    { name: 'Insider Activity Feed', status: 'Critical Error', lastSync: '2h ago', sources: 'BSE Corporate', count: '890 Rows' },
  ];

  return (
    <div className="animate-fadeIn">
      <div className="page-header">
        <div>
          <h1 className="page-title">Stock & Data Management 💾</h1>
          <p className="page-subtitle">Control ingestion pipelines, data sources, and historical datasets.</p>
        </div>
        <div style={{ display: 'flex', gap: 12 }}>
          <button className="btn btn-secondary">🛠️ Repair Source</button>
          <button className="btn btn-primary">🔄 Master Sys Refresh</button>
        </div>
      </div>

      <div className="grid-4" style={{ marginBottom: 24 }}>
        {DATASETS.map(ds => (
          <div key={ds.name} className="metric-card">
            <div className={`metric-change ${ds.status === 'Healthy' ? 'positive' : ds.status === 'Critical Error' ? 'negative' : ''}`}>
               {ds.status}
            </div>
            <div className="metric-label" style={{ marginTop: 8 }}>{ds.name}</div>
            <div className="metric-value" style={{ fontSize: '1.2rem', margin: '4px 0' }}>{ds.count}</div>
            <div style={{ fontSize: '0.75rem', color: '#5E6C84' }}>Last Sync: {ds.lastSync}</div>
          </div>
        ))}
      </div>

      <div className="card">
        <div className="card-header">
          <h3>Ingestion Pipelines</h3>
        </div>
        <div className="table-responsive">
          <table className="table">
            <thead>
              <tr>
                <th>Dataset Name</th>
                <th>Sources</th>
                <th>Status</th>
                <th>Health Score</th>
                <th>Control</th>
              </tr>
            </thead>
            <tbody>
              {DATASETS.map(ds => (
                <tr key={ds.name}>
                  <td><strong>{ds.name}</strong></td>
                  <td>{ds.sources}</td>
                  <td>
                    <span className={`badge ${ds.status === 'Healthy' ? 'badge-success' : ds.status === 'Syncing' ? 'badge-primary' : 'badge-danger'}`}>
                      {ds.status}
                    </span>
                  </td>
                  <td>
                    <div className="progress" style={{ height: 8, width: 100, borderRadius: 4, background: '#F4F5F7' }}>
                      <div style={{ 
                        height: 8, 
                        width: ds.status === 'Healthy' ? '100%' : ds.status === 'Syncing' ? '70%' : '20%', 
                        background: ds.status === 'Healthy' ? '#00875A' : ds.status === 'Syncing' ? '#0052CC' : '#DE350B',
                        borderRadius: 4
                      }}></div>
                    </div>
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: 8 }}>
                      <button className="btn btn-sm btn-secondary">Logs</button>
                      <button className="btn btn-sm btn-primary">Refresh</button>
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
