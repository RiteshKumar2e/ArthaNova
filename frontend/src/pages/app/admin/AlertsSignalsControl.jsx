import React from 'react';

export default function AlertsSignalsControl() {
  const SIGNALS = [
    { id: 'sig-001', symbol: 'RELIANCE', type: 'Bullish Hammer', confidence: '88%', status: 'Override Pending', time: '10:15 AM' },
    { id: 'sig-002', symbol: 'HDFCBANK', type: 'Breakout Confirm', confidence: '92%', status: 'Active', time: '10:30 AM' },
    { id: 'sig-003', symbol: 'TCS', type: 'MACD Divergence', confidence: '75%', status: 'Flagged', time: 'Yesterday' },
  ];

  return (
    <div className="animate-fadeIn">
      <div className="page-header">
        <div>
          <h1 className="page-title">Alerts & Signals Control ⚠️</h1>
          <p className="page-subtitle">Monitor and override AI-generated signals before they reach users.</p>
        </div>
        <button className="btn btn-danger">🚫 Disable All Alerts</button>
      </div>

      <div className="grid-2" style={{ marginBottom: 24 }}>
        <div className="card">
          <div className="card-header">
            <h3>AI Logic Switchboard</h3>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
             {[
               { label: 'Technical Pattern Alerts', status: true },
               { label: 'Fundamental Divergence Alerts', status: true },
               { label: 'Sentiment Spike Alerts', status: false },
               { label: 'Portfolio Risk Alerts', status: true },
               { label: 'IPO Opportunity Alerts', status: true },
             ].map(logic => (
               <div key={logic.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: 12, borderBottom: '1px solid #DFE1E6' }}>
                  <span>{logic.label}</span>
                  <div style={{ color: logic.status ? '#00875A' : '#DE350B', fontWeight: 600 }}>{logic.status ? '● ON' : '○ OFF'}</div>
               </div>
             ))}
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <h3>Signal Performance</h3>
          </div>
          <div style={{ padding: 16, height: 150, display: 'flex', alignItems: 'flex-end', gap: 12, justifyContent: 'space-between' }}>
            {[45, 67, 89, 56, 78, 92, 65, 88].map((h, i) => (
               <div key={i} style={{ flex: 1, background: '#0052CC', borderRadius: 4, height: `${h}%` }}></div>
            ))}
          </div>
          <p style={{ textAlign: 'center', fontSize: '0.75rem', color: '#5E6C84' }}>Accuracy Trends (Last 8 Days)</p>
        </div>
      </div>

      <div className="card">
         <div className="card-header">
            <h3>Pending Signals for Approval</h3>
         </div>
         <div className="table-responsive">
            <table className="table">
               <thead>
                  <tr>
                     <th>Signal ID</th>
                     <th>Stock</th>
                     <th>Pattern</th>
                     <th>Confidence</th>
                     <th>Status</th>
                     <th>Action</th>
                  </tr>
               </thead>
               <tbody>
                  {SIGNALS.map(sig => (
                     <tr key={sig.id}>
                        <td>{sig.id}</td>
                        <td><strong>{sig.symbol}</strong></td>
                        <td>{sig.type}</td>
                        <td><span className="badge badge-success">{sig.confidence}</span></td>
                        <td>
                           <span className={`badge ${sig.status === 'Active' ? 'badge-success' : sig.status === 'Override Pending' ? 'badge-warning' : 'badge-danger'}`}>
                              {sig.status}
                           </span>
                        </td>
                        <td>
                           <div style={{ display: 'flex', gap: 8 }}>
                              <button className="btn btn-sm btn-primary">Approve</button>
                              <button className="btn btn-sm btn-danger">Override</button>
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
