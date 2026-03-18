import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Network, History, Share2, TrendingUp, AlertCircle, ChevronRight, Activity, Target, Zap, Loader2 } from 'lucide-react';
import DashboardLayout from '../../layouts/DashboardLayout';
import Button from '../../components/ui/Button';
import useNewsStore from '../../store/newsStore';
import useAIStore from '../../store/aiStore';

export default function StoryArcPage() {
  const { arcs, fetchArcs, loading } = useNewsStore();
  const { storyPrediction, fetchStoryPrediction } = useAIStore();
  const [selectedArc, setSelectedArc] = useState(null);

  useEffect(() => {
    fetchArcs();
  }, [fetchArcs]);

  useEffect(() => {
    if (arcs && arcs.length > 0 && !selectedArc) {
      setSelectedArc(arcs[0]);
    }
  }, [arcs, selectedArc]);

  useEffect(() => {
    if (selectedArc) {
      fetchStoryPrediction(selectedArc.title);
    }
  }, [selectedArc, fetchStoryPrediction]);

  if (loading && !selectedArc) {
    return (
      <DashboardLayout>
        <div style={{ padding: '100px 0', textAlign: 'center' }}>
          <Loader2 className="animate-spin" size={48} style={{ margin: '0 auto 24px', color: 'var(--clr-accent)' }} />
          <p>Navigating narrative arcs...</p>
        </div>
      </DashboardLayout>
    );
  }

  const currentArc = selectedArc || (arcs && arcs[0]);

  return (
    <DashboardLayout>
      <div className="page-header-area">
        <div className="page-header-text">
          <h1 className="page-title">Story Arc Tracker</h1>
          <p className="page-subtitle">AI-powered causal chain visualization for ongoing business narratives.</p>
        </div>
        <div className="page-header-actions">
           <div className="status-chip status-chip--active">
             <Activity size={16} />
             {currentArc?.status || 'Live Tracking'}
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
               {currentArc?.title || 'Interactive Visual Narrative'}
            </h2>
            
            <div className="arc-timeline-container">
              <div className="arc-timeline-track" />
              
              <div className="arc-timeline-events">
                {currentArc?.events?.map((event, idx) => (
                  <motion.div
                    key={event.id}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: idx * 0.1 }}
                    className="arc-event-row group"
                  >
                    <div className={`arc-event-date-box arc-event-date-box--past`}>
                      <span className="arc-event-date-text">
                        {new Date(event.event_date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                      </span>
                    </div>

                    <div className={`arc-event-details`}>
                      <h3 className="arc-event-title">{event.title}</h3>
                      <p className="arc-event-desc">{event.description}</p>
                    </div>
                  </motion.div>
                ))}
                
                {/* AI Predicted Future Event */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  className="arc-event-row group"
                  style={{ borderLeft: '2px dashed var(--clr-accent)', marginLeft: '-2px' }}
                >
                  <div className="arc-event-date-box arc-event-date-box--future">
                    <span className="arc-event-date-text">Next <div>Move</div></span>
                  </div>
                  <div className="arc-event-details arc-event-details--future">
                    <h3 className="arc-event-title">AI Projected Outcome</h3>
                    <p className="arc-event-desc">{currentArc?.prediction || 'Analyzing historical patterns for predictive shift...'}</p>
                  </div>
                </motion.div>
              </div>
            </div>
          </div>
          
          <div className="arc-insight-banner">
            <div className="arc-insight-glow" />
            <h3 className="arc-insight-title">
              <Zap size={24} style={{ fill: '#60a5fa', color: '#60a5fa' }} />
              Interactive Intelligence Briefing
            </h3>
            <p className="arc-insight-text">
              {storyPrediction || 'Calculating contrarian perspectives and sentiment shifts...'}
            </p>
          </div>
        </div>

        {/* Intelligence Sidebar */}
        <div className="arc-sidebar">
          <div className="arc-side-card">
            <h3 className="arc-side-title">
              <Network size={20} />
              Key Players Mapped
            </h3>
            <div className="arc-entity-list">
              {currentArc?.key_players?.map(entity => (
                <div key={entity.name} className="arc-entity-item">
                  <div className="arc-entity-header">
                    <span className="arc-entity-name">{entity.name}</span>
                    <span className={`arc-entity-badge arc-entity-badge--accent`}>
                       {entity.role}
                    </span>
                  </div>
                  <div className="arc-progress-track">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${Math.random() * 40 + 60}%` }}
                      className={`arc-progress-bar arc-progress-bar--accent`}
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
               <span>Contrarian Perspective</span>
             </div>
             <p className="arc-signal-text">
               "Sentiment shifts tracked by ArthaNova suggest that despite platform fee hikes, retention remains anomalously high in suburban corridors."
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
