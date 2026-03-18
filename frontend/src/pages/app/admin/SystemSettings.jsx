import React from 'react';

export default function SystemSettings() {
  const SETTINGS_SECTIONS = [
    { title: 'Core API Configuration', items: [
      { label: 'NSE Market Data API Key', type: 'password', value: '****************' },
      { label: 'OpenAI/LLM Endpoint', type: 'text', value: 'https://api.openai.com/v1' },
      { label: 'Market Data Sync Rate (ms)', type: 'number', value: 1000 },
    ]},
    { title: 'Feature Toggles', items: [
      { label: 'Real-time Video Generation', type: 'toggle', value: true },
      { label: 'AI Sentiment Analysis Feed', type: 'toggle', value: true },
      { label: 'Institutional Order Tracking', type: 'toggle', value: false },
    ]},
    { title: 'System Environment', items: [
      { label: 'Environment Mode', type: 'select', value: 'Production' },
      { label: 'Maintenance Mode', type: 'toggle', value: false },
      { label: 'Debug Verbose Logging', type: 'toggle', value: true },
    ]},
  ];

  return (
    <div className="animate-fadeIn">
      <div className="page-header">
        <div>
          <h1 className="page-title">System Settings ⚙️</h1>
          <p className="page-subtitle">Master configuration, API keys, feature flags, and environment controls.</p>
        </div>
        <div style={{ display: 'flex', gap: 12 }}>
          <button className="btn btn-secondary">💾 Backup Config</button>
          <button className="btn btn-primary">✅ Save Changes</button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(400px, 1fr))', gap: 24 }}>
         {SETTINGS_SECTIONS.map(section => (
           <div key={section.title} className="card">
              <div className="card-header">
                 <h3>{section.title}</h3>
              </div>
              <div style={{ padding: 16 }}>
                 {section.items.map((item, i) => (
                    <div key={i} style={{ marginBottom: 20 }}>
                       <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                          <label style={{ fontSize: '0.875rem', fontWeight: 600 }}>{item.label}</label>
                          {item.type === 'toggle' && (
                             <div 
                                style={{ 
                                   width: 44, 
                                   height: 22, 
                                   borderRadius: 11, 
                                   background: item.value ? '#00875A' : '#C1C7D0',
                                   position: 'relative',
                                   cursor: 'pointer'
                                }}
                             >
                                <div style={{ 
                                   width: 18, 
                                   height: 18, 
                                   borderRadius: 9, 
                                   background: '#FFFFFF',
                                   position: 'absolute',
                                   top: 2,
                                   left: item.value ? 24 : 2,
                                   transition: 'all 0.2s'
                                }}></div>
                             </div>
                          )}
                       </div>
                       {item.type !== 'toggle' && (
                          item.type === 'select' ? (
                             <select className="form-control" defaultValue={item.value}>
                                <option>Production</option>
                                <option>Staging</option>
                                <option>Development</option>
                             </select>
                          ) : (
                             <input type={item.type} className="form-control" defaultValue={item.value} />
                          )
                       )}
                    </div>
                 ))}
              </div>
           </div>
         ))}
      </div>

      <div className="card" style={{ marginTop: 24, padding: 24, border: '1px solid #DE350B', background: '#FFEBE6' }}>
         <h4 style={{ color: '#DE350B', marginTop: 0 }}>🚨 Danger Zone</h4>
         <p style={{ fontSize: '0.875rem' }}>Extreme operations. Proceed with extreme caution. These actions cannot be undone.</p>
         <div style={{ display: 'flex', gap: 16, marginTop: 16 }}>
            <button className="btn btn-sm btn-danger">Flush Cache Redis</button>
            <button className="btn btn-sm btn-danger">Wipe Audit Logs (1y+)</button>
            <button className="btn btn-sm btn-danger">Emergency Platform Lock</button>
         </div>
      </div>
    </div>
  );
}
