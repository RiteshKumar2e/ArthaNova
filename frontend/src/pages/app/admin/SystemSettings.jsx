import React from 'react';
import styles from '../../../styles/pages/app/admin/SystemSettings.module.css';

export default function SystemSettings() {
  const SETTINGS_SECTIONS = [
    { title: 'Core API Configuration', items: [
      { label: 'NSE Market Data API Key', type: 'password', value: '****************' },
      { label: 'Groq/LLM Endpoint', type: 'text', value: 'https://api.groq.com/openai/v1' },
      { label: 'Market Sync Rate (ms)', type: 'number', value: 1000 },
    ]},
    { title: 'Feature Toggles', items: [
      { label: 'Real-time Video Gen', type: 'toggle', value: true },
      { label: 'AI Sentiment Feed', type: 'toggle', value: true },
      { label: 'Institutional Tracking', type: 'toggle', value: false },
    ]},
    { title: 'System Environment', items: [
      { label: 'Environment Mode', type: 'select', value: 'Production' },
      { label: 'Maintenance Mode', type: 'toggle', value: false },
      { label: 'Verbose Logging', type: 'toggle', value: true },
    ]},
  ];

  return (
    <div className={`${styles.container} animate-fadeIn`}>
      <div className="page-header" style={{ marginBottom: 30 }}>
        <div>
          <h1 className="page-title">SYSTEM SETTINGS ⚙️</h1>
          <p className="page-subtitle">MASTER CONFIGURATION, API KEYS, FEATURE FLAGS, AND ENVIRONMENT CONTROLS.</p>
        </div>
        <div className={styles.headerActions}>
          <button className="btn btn-secondary">💾 BACKUP CONFIG</button>
          <button className="btn btn-primary">✅ SAVE CHANGES</button>
        </div>
      </div>

      <div className={styles.settingsGrid}>
         {SETTINGS_SECTIONS.map(section => (
           <div key={section.title} className={styles.card}>
              <div className={styles.cardHeader}>
                 <h3>{section.title}</h3>
              </div>
              <div className={styles.cardBody}>
                 {section.items.map((item, i) => (
                    <div key={i} className={styles.settingItem}>
                       <div className={styles.settingLabelRow}>
                          <label className={styles.settingLabel}>{item.label}</label>
                          {item.type === 'toggle' && (
                             <div className={`${styles.toggleSwitch} ${item.value ? styles.toggleSwitchActive : ''}`}>
                                <div className={`${styles.toggleHandle} ${item.value ? styles.toggleHandleActive : ''}`}></div>
                             </div>
                          )}
                       </div>
                       {item.type !== 'toggle' && (
                          item.type === 'select' ? (
                             <select className={styles.neoInput} defaultValue={item.value}>
                                <option>Production</option>
                                <option>Staging</option>
                                <option>Development</option>
                             </select>
                          ) : (
                             <input type={item.type} className={styles.neoInput} defaultValue={item.value} />
                          )
                       )}
                    </div>
                 ))}
              </div>
           </div>
         ))}
      </div>

      <div className={styles.dangerZone}>
         <h4>🚨 DANGER ZONE (SYSTEM OVERRIDES)</h4>
         <p style={{ fontSize: '0.7rem', fontWeight: 800 }}>EXTREME OPERATIONS. PROCEED WITH EXTREME CAUTION. THESE ACTIONS CANNOT BE UNDONE.</p>
         <div className={styles.dangerActions}>
            <button className="btn btn-sm btn-danger" style={{ flex: 1 }}>FLUSH CACHE REDIS</button>
            <button className="btn btn-sm btn-danger" style={{ flex: 1 }}>WIPE AUDIT LOGS</button>
            <button className="btn btn-sm btn-danger" style={{ flex: 1 }}>EMERGENCY LOCK</button>
         </div>
      </div>
      
      <div style={{ height: 40 }} />
    </div>
  );
}
// End of file
