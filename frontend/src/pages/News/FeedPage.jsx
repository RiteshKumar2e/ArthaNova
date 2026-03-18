import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Zap, ChevronRight, Bookmark, Globe, MessageSquare } from 'lucide-react';
import DashboardLayout from '../../layouts/DashboardLayout';
import Button from '../../components/ui/Button';
import useNewsStore from '../../store/newsStore';
import { Link } from 'react-router-dom';

const PERSONAS = [
  { id: 'investor', label: 'Investor', icon: '📈', desc: 'Market analysis & ROI' },
  { id: 'founder', label: 'Founder', icon: '🚀', desc: 'Growth & Strategy' },
  { id: 'student', label: 'Student', icon: '🎓', desc: 'Concepts & Learning' }
];

export default function FeedPage() {
  const { feed, fetchFeed, loading } = useNewsStore();
  const [selectedPersona, setSelectedPersona] = useState('Investor');

  useEffect(() => {
    fetchFeed(selectedPersona.toLowerCase());
  }, [selectedPersona, fetchFeed]);

  return (
    <DashboardLayout>
      <div className="dash-welcome">
        <div className="dash-welcome__text">
          <h1>Intelligence Feed</h1>
          <p>Real-time synthesis curated for your market profile.</p>
        </div>
        <div style={{ maxWidth: '360px', width: '100%' }}>
          <div className="intel-textarea-wrap" style={{ height: '48px', padding: '0 20px', display: 'flex', alignItems: 'center' }}>
            <Search size={18} style={{ color: 'var(--clr-muted)', marginRight: '12px' }} />
            <input 
              placeholder="Search narratives..." 
              style={{ border: 'none', background: 'transparent', width: '100%', outline: 'none', fontWeight: 600, fontSize: '0.875rem' }}
            />
          </div>
        </div>
      </div>

      {/* Persona Selector */}
      <div className="persona-switcher">
        {PERSONAS.map((persona) => (
          <button
            key={persona.id}
            onClick={() => setSelectedPersona(persona.label)}
            className={`persona-btn ${selectedPersona === persona.label ? 'persona-btn--active' : ''}`}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ 
                fontSize: '1.5rem', 
                background: selectedPersona === persona.label ? 'rgba(255,255,255,0.1)' : 'var(--clr-bg-soft)', 
                width: '42px', height: '42px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' 
              }}>
                {persona.icon}
              </div>
              {selectedPersona === persona.label && (
                 <div className="badge-pulse" style={{ width: '8px', height: '8px', background: 'var(--clr-accent-vivid)', borderRadius: '50%', boxShadow: '0 0 12px var(--clr-accent-vivid)' }} />
              )}
            </div>
            <div>
              <h3 style={{ fontSize: '0.9rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em', margin: '0 0 4px 0' }}>{persona.label}</h3>
              <p style={{ fontSize: '0.65rem', opacity: 0.7, fontWeight: 700, textTransform: 'uppercase', margin: 0 }}>{persona.desc}</p>
            </div>
          </button>
        ))}
      </div>

      {/* Feed Content */}
      <div className="feed-grid">
        {loading ? (
           <div style={{ padding: '80px 0', textAlign: 'center' }}>
              <Loader2 className="animate-spin" size={32} style={{ margin: '0 auto 20px', color: 'var(--clr-accent)' }} />
              <p className="intel-tag" style={{ border: 'none' }}>Processing Intelligence...</p>
           </div>
        ) : (
          <AnimatePresence mode="popLayout">
            {feed.map((item, idx) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05, duration: 0.5 }}
                className="intelligence-card"
              >
                <div className="intelligence-card__body">
                  <div className="intelligence-card__meta">
                    <span className="badge badge-indigo" style={{ padding: '6px 12px' }}>
                      {item.category}
                    </span>
                    <div className="intel-tag" style={{ border: 'none', background: 'transparent' }}>
                       <Globe size={14} />
                       <span>{item.source}</span>
                    </div>
                    <div style={{ marginLeft: 'auto' }}>
                       <div className="badge badge-yellow" style={{ padding: '6px 12px' }}>
                          <Zap size={14} fill="currentColor" />
                          {item.impact_score} Impact
                       </div>
                    </div>
                  </div>

                  <Link to={`/analysis/${item.id}`}>
                    <h2 className="intelligence-card__title">
                      {item.title}
                    </h2>
                  </Link>
                  <p className="intelligence-card__summary">
                    {item.summary}
                  </p>

                  <div className="intelligence-card__footer">
                    <div className="intelligence-card__actions">
                      <Link to="/briefings" className="btn-ghost btn-sm" style={{ fontWeight: 800, textTransform: 'uppercase', fontSize: '0.7rem' }}>
                        <MessageSquare size={16} color="var(--clr-accent)" />
                        Intelligence Q&A
                      </Link>
                      <Link to="/vernacular" className="btn-ghost btn-sm" style={{ fontWeight: 800, textTransform: 'uppercase', fontSize: '0.7rem' }}>
                        <Globe size={16} />
                        Regional View
                      </Link>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                      <button className="btn-outline" style={{ width: '44px', height: '44px', padding: 0, borderRadius: '14px' }}>
                        <Bookmark size={20} />
                      </button>
                      <Link to="/story-arc">
                        <Button className="vivid-button" size="sm" style={{ borderRadius: '14px' }}>
                          Deep Analysis <ChevronRight size={18} />
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        )}
      </div>
    </DashboardLayout>
  );
}
