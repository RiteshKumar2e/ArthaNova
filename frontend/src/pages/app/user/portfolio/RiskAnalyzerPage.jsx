import React, { useState, useEffect } from 'react';
import { portfolioAPI, aiAPI } from '../../../../api/client';
import styles from './RiskAnalyzerPage.module.css';

export default function RiskAnalyzerPage() {
  const [loading, setLoading] = useState(true);
  const [portfolioData, setPortfolioData] = useState(null);
  const [riskAlerts, setRiskAlerts] = useState([]);
  const [aiAnalysis, setAiAnalysis] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [portRes, alertsRes, riskRes] = await Promise.all([
          portfolioAPI.get(),
          aiAPI.getRiskAlerts(),
          aiAPI.getPortfolioNewsPrioritization()
        ]);
        setPortfolioData(portRes.data);
        setRiskAlerts(alertsRes.data || []);
        setAiAnalysis(riskRes.data?.ai_summary || 'No critical risk factors detected currently.');
      } catch (err) {
        console.error('Failed to fetch risk data', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="page-wrapper text-center" style={{ padding: '100px' }}>
        <div className="neo-tag lime animate-pulse">⚡ INITIALIZING RISK SENTINEL...</div>
      </div>
    );
  }

  const riskScore = portfolioData?.analytics?.risk_score || 0;

  return (
    <div className="page-wrapper animate-fadeIn">
      <div className="page-header">
        <div>
          <h1 className="page-title">🛡️ RISK ANALYZER</h1>
          <p className="page-subtitle">Deep Portfolio Exposure & Loss Mitigation Engine</p>
        </div>
      </div>

      <div className={styles.topRow}>
        <div className={styles.riskMeter}>
          <div className={styles.meterTitle}>PORTFOLIO RISK SCORE</div>
          <div className={styles.meterValue} style={{ color: riskScore > 7 ? 'var(--color-danger)' : riskScore > 4 ? 'var(--color-warning)' : 'var(--color-success)' }}>
            {riskScore.toFixed(1)} <span style={{ fontSize: '1rem', color: '#666' }}>/ 10</span>
          </div>
          <div className={styles.meterBar}>
            <div className={styles.meterFill} style={{ width: `${riskScore * 10}%`, background: riskScore > 7 ? 'var(--color-danger)' : 'var(--primary)' }}></div>
          </div>
          <p className={styles.meterDesc}>
            {riskScore > 7 ? 'CRITICAL: High concentration in volatile sectors.' : riskScore > 4 ? 'MODERATE: Balanced exposure with minor sector overlap.' : 'STABLE: Low correlation and healthy diversification.'}
          </p>
        </div>

        <div className={styles.aiSummary}>
          <div className={styles.summaryHeader}>
            <span className="neo-tag cyan">AI SENTINEL PERSPECTIVE</span>
          </div>
          <div className={styles.summaryContent}>
            {aiAnalysis}
          </div>
        </div>
      </div>

      <div className={styles.mainGrid}>
        <div className={styles.alertsContainer}>
          <h3 className={styles.sectionTitle}>⚠️ ACTIVE RISK ALERTS</h3>
          <div className={styles.alertList}>
            {riskAlerts.length === 0 ? (
              <div className={styles.emptyAlert}>NO ACTIVE THREATS DETECTED.</div>
            ) : (
              riskAlerts.map((alert, idx) => (
                <div key={idx} className={styles.alertCard} style={{ borderLeftColor: alert.severity === 'CRITICAL' ? 'var(--color-danger)' : 'var(--color-warning)' }}>
                  <div className={styles.alertHeader}>
                    <span className={styles.alertSymbol}>{alert.symbol}</span>
                    <span className={`${styles.severityBadge} ${alert.severity === 'CRITICAL' ? styles.critical : styles.medium}`}>
                      {alert.severity}
                    </span>
                  </div>
                  <div className={styles.alertMsg}>{alert.message}</div>
                  <div className={styles.alertAction}>
                    <strong>SENTINEL RECOMMENDATION:</strong> {alert.action}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        <div className={styles.exposureContainer}>
          <h3 className={styles.sectionTitle}>📊 SECTOR CONCENTRATION</h3>
          <div className={styles.sectorList}>
             {portfolioData?.analytics?.sector_allocation?.map((sector, idx) => (
               <div key={idx} className={styles.sectorItem}>
                 <div className={styles.sectorInfo}>
                    <span className={styles.sectorName}>{sector.sector}</span>
                    <span className={styles.sectorVal}>{sector.value.toFixed(1)}%</span>
                 </div>
                 <div className={styles.sectorBar}>
                    <div className={styles.sectorFill} style={{ width: `${sector.value}%` }}></div>
                 </div>
               </div>
             ))}
          </div>
        </div>
      </div>
    </div>
  );
}
