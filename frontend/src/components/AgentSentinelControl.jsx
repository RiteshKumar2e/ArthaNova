import React, { useState, useEffect } from 'react';
import styles from './AgentSentinelControl.module.css';

const AGENTS = [
  { id: 'FilingAgent', name: '🕵️ FilingAgent', task: 'Monitoring NSE/SEBI Filings', color: 'var(--primary)', status: 'idle' },
  { id: 'PatternAgent', name: '📈 PatternAgent', task: 'Scanning Technical Breakouts', color: 'var(--accent)', status: 'idle' },
  { id: 'ContextAgent', name: '🌍 ContextAgent', task: 'Enriching Market Sentiment', color: 'var(--secondary)', status: 'idle' },
  { id: 'PortfolioAgent', name: '💼 PortfolioAgent', task: 'Cross-referencing Holdings', color: 'var(--yellow)', status: 'idle' },
  { id: 'ActionAgent', name: '🧠 ActionAgent', task: 'Synthesizing Trade Actions', color: 'var(--purple)', status: 'idle' },
];

export default function AgentSentinelControl() {
  const [activeAgents, setActiveAgents] = useState([]);
  const [logs, setLogs] = useState([]);
  const [isScanning, setIsScanning] = useState(false);

  const addLog = (msg) => {
    setLogs(prev => [ { id: `${Date.now()}-${Math.random()}`, msg, time: new Date().toLocaleTimeString() }, ...prev.slice(0, 5) ]);
  };

  const startScan = () => {
    if (isScanning) return;
    setIsScanning(true);
    setLogs([]);
    addLog('🚀 [SENTINEL] Initiating Multi-Agent Orchestration...');

    const sequence = async () => {
      for (let i = 0; i < AGENTS.length; i++) {
        const agent = AGENTS[i];
        setActiveAgents(prev => [...prev, agent.id]);
        addLog(`>> ${agent.name} is now ${agent.task.toLowerCase()}...`);
        await new Promise(r => setTimeout(r, 800 + Math.random() * 1000));
        
        if (i === 0) addLog('✓ Found 3 new Bulk Deals: JUBLFOOD, INFY, RELIANCE.');
        if (i === 1) addLog('✓ RSI Breakout detected on ZOMATO (RSI: 74).');
        if (i === 2) addLog('✓ Sentiment check: Bullish narrative on IT sector confirms INFY move.');
        if (i === 3) addLog('⚠ Materiality check: JUBLFOOD sold by promoter. Portfolio exposure: 4.2%.');
        if (i === 4) addLog('⚡ Synthesis Complete: 2 Critical alerts generated.');
      }
      addLog('✅ [SENTINEL] Scan Complete. Dashboard updated with AI insights.');
      setIsScanning(false);
      setTimeout(() => setActiveAgents([]), 2000);
    };

    sequence();
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.titleGroup}>
          <h3 className={styles.title}>AGENTIC SENTINEL</h3>
          <p className={styles.subtitle}>Institutional-Grade Multi-Agent Oversight</p>
        </div>
        <button 
          onClick={startScan} 
          className={`${styles.scanBtn} ${isScanning ? styles.scanning : ''}`}
          disabled={isScanning}
        >
          {isScanning ? 'SCANNING...' : 'INITIATE SENTINEL SCAN'}
        </button>
      </div>

      <div className={styles.agentGrid}>
        {AGENTS.map(agent => (
          <div 
            key={agent.id} 
            className={`${styles.agentCard} ${activeAgents.includes(agent.id) ? styles.active : ''}`}
            style={{ '--agent-color': agent.color }}
          >
            <div className={styles.agentIcon}>{activeAgents.includes(agent.id) ? '⚡' : '🔘'}</div>
            <div className={styles.agentInfo}>
              <div className={styles.agentName}>{agent.name}</div>
              <div className={styles.agentTask}>{agent.task}</div>
            </div>
            {activeAgents.includes(agent.id) && <div className={styles.pulse}></div>}
          </div>
        ))}
      </div>

      <div className={styles.logWindow}>
        <div className={styles.logHeader}>SENTINEL LOGS_V2.0</div>
        <div className={styles.logList}>
          {logs.length === 0 ? (
            <div className={styles.emptyLog}>SYSTEM IDLE. AWAITING INSTRUCTIONS.</div>
          ) : (
            logs.map(log => (
              <div key={log.id} className={styles.logEntry}>
                <span className={styles.logTime}>[{log.time}]</span> {log.msg}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
