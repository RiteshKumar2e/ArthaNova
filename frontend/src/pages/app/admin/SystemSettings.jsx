import React, { useState, useEffect } from 'react';
import { adminAPI } from '../../../api/client';
import { toast } from 'react-hot-toast';
import styles from '../../../styles/pages/app/admin/SystemSettings.module.css';

export default function SystemSettings() {
  const [settings, setSettings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const response = await adminAPI.getSettings();
      setSettings(response.data || []);
    } catch (error) {
      toast.error('Failed to load settings');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = (key, value) => {
    setSettings(prev => prev.map(s => s.key === key ? { ...s, value } : s));
  };

  const onSave = async () => {
    try {
      setSaving(true);
      await adminAPI.updateSettings(settings.map(s => ({ key: s.key, value: s.value })));
      toast.success('Settings updated successfully');
      fetchSettings();
    } catch (error) {
      toast.error('Failed to update settings');
    } finally {
      setSaving(false);
    }
  };

  const handleSystemAction = async (action) => {
    if (!window.confirm(`ARE YOU SURE YOU WANT TO PERFORM: ${action.replace('_', ' ').toUpperCase()}?`)) return;
    
    toast.promise(
      adminAPI.performSystemAction(action),
      {
        loading: `${action.replace('_', ' ').toUpperCase()} IN PROGRESS...`,
        success: `${action.replace('_', ' ').toUpperCase()} COMPLETED.`,
        error: 'SYSTEM ACTION FAILED: ACCESS DENIED.',
      }
    );
  };

  const categories = [...new Set(settings.map(s => s.category))];

  return (
    <div className={`${styles.container} animate-fadeIn`}>
      <div className="page-header" style={{ marginBottom: 30 }}>
        <div>
          <h1 className="page-title">SYSTEM SETTINGS ⚙️</h1>
          <p className="page-subtitle">MASTER CONFIGURATION, API KEYS, FEATURE FLAGS, AND ENVIRONMENT CONTROLS.</p>
        </div>
        <div className={styles.headerActions}>
          <button className="btn btn-secondary" onClick={() => window.print()}>💾 PRINT CONFIG</button>
          <button className={`btn btn-primary ${saving ? 'loading' : ''}`} onClick={onSave} disabled={saving || loading}>
            {saving ? 'SAVING...' : '✅ SAVE CHANGES'}
          </button>
        </div>
      </div>

      <div className={styles.settingsGrid}>
         {loading ? (
            <div style={{ textAlign: 'center', padding: 40, fontWeight: 900 }}>LOADING CONFIGURATION...</div>
         ) : categories.map(cat => (
           <div key={cat} className={styles.card}>
              <div className={styles.cardHeader}>
                 <h3 style={{ textTransform: 'uppercase' }}>{cat.replace('_', ' ')}</h3>
              </div>
              <div className={styles.cardBody}>
                 {settings.filter(s => s.category === cat).map((item, i) => (
                    <div key={i} className={styles.settingItem}>
                       <div className={styles.settingLabelRow}>
                          <label className={styles.settingLabel}>{item.description || item.key.toUpperCase()}</label>
                          {item.type === 'toggle' && (
                             <div 
                                className={`${styles.toggleSwitch} ${item.value === '1' ? styles.toggleSwitchActive : ''}`}
                                onClick={() => handleUpdate(item.key, item.value === '1' ? '0' : '1')}
                             >
                                <div className={`${styles.toggleHandle} ${item.value === '1' ? styles.toggleHandleActive : ''}`}></div>
                             </div>
                          )}
                       </div>
                       {item.type !== 'toggle' && (
                          <input 
                            type={item.type === 'password' ? 'password' : 'text'} 
                            className={styles.neoInput} 
                            value={item.value} 
                            onChange={(e) => handleUpdate(item.key, e.target.value)}
                          />
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
            <button className="btn btn-sm btn-danger" style={{ flex: 1 }} onClick={() => handleSystemAction('flush_cache')}>FLUSH CACHE REDIS</button>
            <button className="btn btn-sm btn-danger" style={{ flex: 1 }} onClick={() => handleSystemAction('wipe_logs')}>WIPE AUDIT LOGS</button>
            <button className="btn btn-sm btn-danger" style={{ flex: 1 }} onClick={() => handleSystemAction('emergency_lock')}>EMERGENCY LOCK</button>
         </div>
      </div>
      
      <div style={{ height: 40 }} />
    </div>
  );
}
