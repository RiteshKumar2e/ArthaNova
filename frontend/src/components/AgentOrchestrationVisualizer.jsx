import React, { useState, useEffect } from 'react';
import '../styles/components/AgentOrchestrationVisualizer.css';

const AgentOrchestrationVisualizer = ({ orchestrationData, isLoading }) => {
  const [animationPhase, setAnimationPhase] = useState(0);

  useEffect(() => {
    if (orchestrationData) {
      const interval = setInterval(() => {
        setAnimationPhase(prev => (prev + 1) % 3);
      }, 800);
      return () => clearInterval(interval);
    }
  }, [orchestrationData]);

  if (isLoading) {
    return <div className="orchestrator-loading">Orchestrating agents...</div>;
  }

  if (!orchestrationData) {
    return <div className="orchestrator-empty">No orchestration data</div>;
  }

  const { agents_used, query_type, routing_confidence, execution_time, agent_responses } = orchestrationData;

  return (
    <div className="agent-orchestration-visualizer">
      <div className="orchestration-header">
        <h3>Multi-Agent Orchestration Flow</h3>
        <span className="execution-time">⏱️ {execution_time?.toFixed(2)}ms</span>
      </div>

      {/* Query Classification */}
      <div className="orchestration-section">
        <div className="section-title">1. Query Classification</div>
        <div className="query-box">
          <div className="query-type">{query_type || 'PORTFOLIO_ANALYSIS'}</div>
          <div className="confidence-bar">
            <div 
              className="confidence-fill" 
              style={{ width: `${routing_confidence * 100}%` }}
            ></div>
          </div>
          <span className="confidence-text">Confidence: {(routing_confidence * 100).toFixed(0)}%</span>
        </div>
      </div>

      {/* Agent Execution */}
      <div className="orchestration-section">
        <div className="section-title">2. Agent Execution</div>
        
        <div className="agents-timeline">
          {agents_used && agents_used.map((agent, index) => (
            <div key={agent} className="agent-node">
              <div className={`agent-icon phase-${animationPhase}`}>
                <span>{index + 1}</span>
              </div>
              <div className="agent-name">{agent}</div>
              {agent_responses?.[agent] && (
                <div className="agent-status success">✓ Complete</div>
              )}
            </div>
          ))}
        </div>

        {/* Connection Lines */}
        <div className="connection-lines">
          {agents_used && agents_used.slice(0, -1).map((_, idx) => (
            <div key={idx} className="connection-line"></div>
          ))}
        </div>
      </div>

      {/* Response Synthesis */}
      <div className="orchestration-section">
        <div className="section-title">3. Response Synthesis</div>
        <div className="synthesis-box">
          <div className="synthesis-description">
            Combining insights from {agents_used?.length || 0} specialized agents
          </div>
          {agent_responses && Object.keys(agent_responses).length > 0 && (
            <div className="agents-breakdown">
              {Object.entries(agent_responses).map(([agentName, response]) => (
                <div key={agentName} className="agent-response">
                  <div className="agent-badge">{agentName}</div>
                  <p className="response-preview">
                    {typeof response === 'string' 
                      ? response.substring(0, 100) + '...' 
                      : JSON.stringify(response).substring(0, 100) + '...'
                    }
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Architecture Metrics */}
      <div className="orchestration-metrics">
        <div className="metric">
          <span className="label">Autonomy Level</span>
          <span className="value">92%</span>
        </div>
        <div className="metric">
          <span className="label">Agents Coordinated</span>
          <span className="value">{agents_used?.length || 0}</span>
        </div>
        <div className="metric">
          <span className="label">Design Pattern</span>
          <span className="value">Multi-Agent Orchestration</span>
        </div>
        <div className="metric">
          <span className="label">Response Quality</span>
          <span className="value">Synthesized</span>
        </div>
      </div>
    </div>
  );
};

export default AgentOrchestrationVisualizer;
