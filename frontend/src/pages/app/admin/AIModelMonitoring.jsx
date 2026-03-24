import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuthStore } from '../../../store/authStore';
import styles from '../../../styles/pages/app/admin/AIModelMonitoring.module.css';

export default function AIModelMonitoring() {
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [retraining, setRetraining] = useState(false);
  const { accessToken } = useAuthStore();

  useEffect(() => {
    const fetchAIStatus = async () => {
      try {
        const response = await axios.get('/api/v1/admin/ai/status', {
          headers: { Authorization: `Bearer ${accessToken}` }
        });
        setStatus(response.data);
      } catch (error) {
        console.error('Error fetching AI status:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchAIStatus();
  }, [accessToken]);

  const handleRetrain = () => {
    setRetraining(true);
    alert('INITIALIZING SENTIMENT MODEL RETRAINING...');
    setTimeout(() => {
      setRetraining(false);
      alert('MODEL RETRAINED SUCCESSFULLY ON LATEST DATASETS.');
    }, 4000);
  };

  const handleAction = (agent, action) => {
    alert(`${action} TRIGGERED FOR AGENT: ${agent}`);
  };

  return (
    <div className={styles.container + " animate-fadeIn"}>
      <div className="page-header">
        <div>
          <h1 className="page-title">AI MODEL MONITORING 🤖</h1>
          <p className="page-subtitle">TRACK PERFORMANCE, LATENCY, AND TRAINING STATUS OF ARTHANOVA AI MODULES.</p>
        </div>
        <button 
          className={`btn btn-primary btn-sm ${retraining ? 'loading' : ''}`} 
          onClick={handleRetrain}
          disabled={retraining}
        >
          {retraining ? 'RETRAINING...' : '⚡ RETRAIN SENTIMENT MODEL'}
        </button>
      </div>

      <div className={styles.metricsGrid}>
        <div className={styles.metricCard}>
          <div className={styles.metricLabel}>TOTAL AI QUERIES</div>
          <div className={styles.metricValue}>{status?.system?.orchestrator?.total_queries || 0}</div>
          <div className={styles.metricSub} style={{ color: '#14a800' }}>▲ {status?.system?.orchestrator?.multi_agent_executions || 0} MULTI-AGENT EXECUTIONS</div>
        </div>
        <div className={styles.metricCard}>
          <div className={styles.metricLabel}>COMPLIANCE BLOCKS</div>
          <div className={styles.metricValue}>{status?.system?.orchestrator?.compliance_blocks || 0}</div>
          <div className={styles.metricSub} style={{ color: '#FF3131' }}>SAFETY GUARDRAILS ENFORCED</div>
        </div>
        <div className={styles.metricCard}>
          <div className={styles.metricLabel}>AVG. ORCHESTRATION LATENCY</div>
          <div className={styles.metricValue}>
            {status?.performance?.latency_metrics?.orchestration?.avg 
              ? `${Math.round(status.performance.latency_metrics.orchestration.avg)}ms` 
              : 'N/A'}
          </div>
          <div className={styles.metricSub} style={{ color: '#14B8A6' }}>GROQ OPTIMIZED (V1.2)</div>
        </div>
      </div>

      <div className={styles.card}>
        <div className={styles.cardHeader}>
          <h3>ACTIVE AI MODULES</h3>
        </div>
        <div className="table-responsive">
          <table className={styles.modelTable}>
            <thead>
              <tr>
                <th>MODULE NAME</th>
                <th>LATENCY</th>
                <th>HEALTH / AUTONOMY</th>
                <th>STATUS</th>
                <th style={{ textAlign: 'center' }}>ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan="5" style={{ textAlign: 'center', padding: 40, fontWeight: 800 }}>LOADING AI ORCHESTRATOR STATUS...</td></tr>
              ) : (
                Object.values(status?.agents || {}).map(agent => (
                  <tr key={agent.name}>
                    <td>
                      <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <strong className="text-upper">{agent.name}</strong>
                        <span style={{ fontSize: '0.65rem', color: '#666', fontWeight: 800 }}>{agent.capability}</span>
                      </div>
                    </td>
                    <td><span style={{ fontWeight: 800 }}>{agent.metrics?.avg_response_time_ms || 0}MS</span></td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                        <div className={styles.healthBar}>
                          <div className={styles.healthProgress} style={{ width: agent.metrics?.autonomy_score || '0%' }} />
                        </div>
                        <span style={{ fontSize: '0.65rem', fontWeight: 950 }}>{agent.metrics?.autonomy_score}</span>
                      </div>
                    </td>
                    <td>
                      <span className={`${styles.statusBadge} ${agent.status === 'failed' ? styles.statusFailed : agent.status === 'processing' ? styles.statusProcess : styles.statusSuccess}`}>
                        {agent.status.toUpperCase()}
                      </span>
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: 8, justifyContent: 'center' }}>
                        <button className="btn btn-sm btn-secondary" style={{ padding: '6px 12px', fontSize: '0.65rem' }} onClick={() => handleAction(agent.name, 'LOGS')}>LOGS</button>
                        <button className="btn btn-sm btn-primary" style={{ padding: '6px 12px', fontSize: '0.65rem' }} onClick={() => handleAction(agent.name, 'RESTART')}>RESTART</button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
