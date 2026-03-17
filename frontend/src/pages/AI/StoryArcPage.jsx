import React from 'react';
import { motion } from 'framer-motion';
import { Network, History, Share2, TrendingUp, AlertCircle, ChevronRight, Activity, Target, Zap } from 'lucide-react';
import { clsx } from 'clsx';
import DashboardLayout from '../../layouts/DashboardLayout';
import Button from '../../components/ui/Button';

const timelineEvents = [
  { date: 'Oct 2025', title: 'Initial Concept Leak', desc: 'First reports of NVIDIA\'s next-gen Blackwell architecture surfacing from supply chain partners.', status: 'past' },
  { date: 'Dec 2025', title: 'Policy Shift', desc: 'EU AI Act updates specific requirements for massive compute clusters.', status: 'past' },
  { date: 'Feb 2026', title: 'Production Kickoff', desc: 'TSMC confirms capacity allocation for custom silicon orders.', status: 'past' },
  { date: 'Present', title: 'Global Rollout', desc: 'Primary synthesis of today\'s news showing immediate market adoption.', status: 'current' },
  { date: 'June 2026', title: 'Predicted Impact', desc: 'AI synthesis points to a significant shift in cloud provider margins.', status: 'future' },
];

export default function StoryArcPage() {
  return (
    <DashboardLayout>
      <div className="page-header-area">
        <div className="page-header-text">
          <h1 className="page-title">Story Arc Intelligence</h1>
          <p className="page-subtitle">Visualizing the evolution and causal chain of complex market narratives.</p>
        </div>
        <div className="page-header-actions">
           <div className="status-chip status-chip--active">
             <Activity size={16} />
             Live Tracking
          </div>
        </div>
      </div>

      <div className="arc-grid">
        {/* Timeline View */}
        <div className="arc-main-content">
          <div className="arc-timeline-card">
            <div className="arc-timeline-bg-icon">
               <History />
            </div>
            
            <h2 className="arc-section-label">
               Market Logic Chain
            </h2>
            
            <div className="arc-timeline-container">
              <div className="arc-timeline-track" />
              
              <div className="arc-timeline-events">
                {timelineEvents.map((event, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: idx * 0.1 }}
                    className="arc-event-row group"
                  >
                    <div className={`arc-event-date-box arc-event-date-box--${event.status}`}>
                      <span className="arc-event-date-text">
                        {event.date.split(' ').map((s, i) => <div key={i}>{s}</div>)}
                      </span>
                    </div>

                    <div className={`arc-event-details arc-event-details--${event.status}`}>
                      <h3 className="arc-event-title">{event.title}</h3>
                      <p className="arc-event-desc">{event.desc}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
          
          <div className="arc-insight-banner">
            <div className="arc-insight-glow" />
            <h3 className="arc-insight-title">
              <Target size={24} />
              Strategic Causal Loop
            </h3>
            <p className="arc-insight-text">
              Our AI model identifies a <strong>72.4% probability</strong> of a secondary ripple effect in the Sovereign AI sector by Q4. Historically, such technical decoupling precedes a surge in regional hardware demand.
            </p>
          </div>
        </div>

        {/* Intelligence Sidebar */}
        <div className="arc-sidebar">
          <div className="arc-side-card">
            <h3 className="arc-side-title">
              <Network size={20} />
              Entity Connectivity
            </h3>
            <div className="arc-entity-list">
              {[
                { name: 'NVDA', score: 'Strong', type: 'success', val: 92 },
                { name: 'TSM', score: 'Critical', type: 'accent', val: 88 },
                { name: 'ASML', score: 'Emerging', type: 'indigo', val: 65 },
                { name: 'ARM', score: 'Neutral', type: 'muted', val: 51 }
              ].map(entity => (
                <div key={entity.name} className="arc-entity-item">
                  <div className="arc-entity-header">
                    <span className="arc-entity-name">{entity.name}</span>
                    <span className={`arc-entity-badge arc-entity-badge--${entity.type}`}>
                       {entity.score}
                    </span>
                  </div>
                  <div className="arc-progress-track">
                    <motion.div 
                      initial={{ width: 0 }}
                      whileInView={{ width: `${entity.val}%` }}
                      viewport={{ once: true }}
                      className={`arc-progress-bar arc-progress-bar--${entity.type}`}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="arc-signal-alert">
             <div className="arc-signal-glow" />
             <div className="arc-signal-header">
               <AlertCircle size={20} />
               <span>Contrarian Signal</span>
             </div>
             <p className="arc-signal-text">
               "While consensus anticipates indefinite growth, our deep data nodes suggest 'AI Fatigue' in enterprise POCs may slow acquisition by late 2026."
             </p>
          </div>

          <Button variant="outline" className="arc-export-btn">
            <Share2 size={16} />
            Export Intel Arc
          </Button>
        </div>
      </div>
    </DashboardLayout>
  );
}
