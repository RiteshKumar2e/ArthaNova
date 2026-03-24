import React, { useState } from 'react';
import styles from '../../../styles/pages/app/admin/AlertsSignalsControl.module.css';

export default function AlertsSignalsControl() {
  const [logicSwitches, setLogicSwitches] = useState([
    { id: 1, label: 'TECHNICAL PATTERN ALERTS', status: true },
    { id: 2, label: 'FUNDAMENTAL DIVERGENCE ALERTS', status: true },
    { id: 3, label: 'SENTIMENT SPIKE ALERTS', status: false },
    { id: 4, label: 'PORTFOLIO RISK ALERTS', status: true },
    { id: 5, label: 'IPO OPPORTUNITY ALERTS', status: true },
  ]);

  const [signals, setSignals] = useState([
    { id: 'SIG-819', symbol: 'RELIANCE', pattern: 'GOLDEN CROSS', confidence: 94, status: 'PENDING' },
    { id: 'SIG-820', symbol: 'HDFCBANK', pattern: 'BEARISH DIV', confidence: 81, status: 'FLAGGED' },
    { id: 'SIG-821', symbol: 'TCS', pattern: 'BREAKOUT', confidence: 88, status: 'PENDING' },
  ]);

  const toggleSwitch = (id) => {
    setLogicSwitches(prev => prev.map(s => s.id === id ? { ...s, status: !s.status } : s));
  };

  const handleDisableAll = () => {
    if (window.confirm('FORCE DISABLE ALL ACTIVE ALERT CHANNELS?')) {
      setLogicSwitches(prev => prev.map(s => ({ ...s, status: false })));
      alert('ALL ALERT SYSTEMS OFFLINE');
    }
  };

  const handleSignalAction = (id, action) => {
    alert(`${action} TRIGGERED FOR SIGNAL: ${id}`);
    setSignals(prev => prev.filter(s => s.id !== id));
  };

  return (
    <div className={styles.container + " animate-fadeIn"}>
      <div className="page-header">
        <div>
          <h1 className="page-title">ALERTS & SIGNALS CONTROL ⚠️</h1>
          <p className="page-subtitle">MONITOR AND OVERRIDE AI-GENERATED SIGNALS BEFORE THEY REACH USERS.</p>
        </div>
        <button className="btn btn-danger btn-sm" onClick={handleDisableAll}>🚫 DISABLE ALL ALERTS</button>
      </div>

      <div className={styles.switchGrid}>
        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <h3>AI LOGIC SWITCHBOARD</h3>
          </div>
          <div className={styles.switchList}>
             {logicSwitches.map(logic => (
               <div key={logic.id} className={styles.switchRow}>
                  <span className={styles.switchLabel}>{logic.label}</span>
                  <button 
                    className={`${styles.toggleBtn} ${logic.status ? styles.toggleOn : styles.toggleOff}`}
                    onClick={() => toggleSwitch(logic.id)}
                  >
                    {logic.status ? '● ON' : '○ OFF'}
                  </button>
               </div>
             ))}
          </div>
        </div>

        <div className={styles.card}>
          <div className={styles.cardHeader}>
             <h3>SIGNAL PERFORMANCE</h3>
          </div>
          <div className={styles.chartArea}>
             <div style={{ fontSize: '2rem', color: '#eee' }}>📊</div>
             <p style={{ color: '#888', fontSize: '0.7rem', fontWeight: 700, textAlign: 'center' }}>INSUFFICIENT DATA TO GENERATE ACCURACY TRENDS.</p>
             <div className={styles.chartLabel}>ACCURACY TRENDS (LAST 8 DAYS)</div>
          </div>
          <button className="btn btn-sm btn-secondary btn-full" style={{ borderTop: '4px solid #000' }} onClick={() => alert('SYNCHRONIZING ANALYTICS...')}>🔄 SYNC PERFORMANCE DATA</button>
        </div>
      </div>

      <div className={styles.card}>
         <div className={styles.cardHeader} style={{ background: '#000' }}>
            <h3 style={{ color: '#fff' }}>PENDING SIGNALS FOR APPROVAL</h3>
         </div>
         <div className="table-responsive">
            <table className={styles.signalsTable}>
               <thead>
                  <tr>
                     <th>SIGNAL ID</th>
                     <th>STOCK</th>
                     <th>PATTERN</th>
                     <th>CONFIDENCE</th>
                     <th>STATUS</th>
                     <th style={{ textAlign: 'center' }}>ACTIONS</th>
                  </tr>
               </thead>
               <tbody>
                  {signals.length > 0 ? (
                    signals.map(sig => (
                       <tr key={sig.id}>
                          <td><span style={{ fontSize: '0.65rem', fontWeight: 950 }}>{sig.id}</span></td>
                          <td><strong className="text-upper">{sig.symbol}</strong></td>
                          <td><span style={{ fontWeight: 800, fontSize: '0.7rem' }}>{sig.pattern}</span></td>
                          <td><span className={styles.confidence}>{sig.confidence}%</span></td>
                          <td>
                             <span className={styles.statusBadge} style={{ color: sig.status === 'PENDING' ? '#000' : '#FF3131' }}>
                                {sig.status}
                             </span>
                          </td>
                          <td>
                             <div style={{ display: 'flex', gap: 8, justifyContent: 'center' }}>
                                <button className="btn btn-sm btn-primary" style={{ padding: '6px 14px', fontSize: '0.65rem' }} onClick={() => handleSignalAction(sig.id, 'APPROVE')}>APPROVE</button>
                                <button className="btn btn-sm btn-danger" style={{ padding: '6px 14px', fontSize: '0.65rem' }} onClick={() => handleSignalAction(sig.id, 'OVERRIDE')}>OVERRIDE</button>
                             </div>
                          </td>
                       </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="6" style={{ textAlign: 'center', padding: 40, color: '#97A0AF', fontSize: '0.75rem', fontWeight: 800 }}>
                        NO PENDING SIGNALS DETECTED.
                      </td>
                    </tr>
                  )}
               </tbody>
            </table>
         </div>
      </div>
    </div>
  );
}
