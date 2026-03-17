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
      <div className="dash-welcome" style={{ marginBottom: '32px' }}>
        <div className="dash-welcome__text">
          <h1>Intelligence Feed</h1>
          <p>Real-time synthesis curated for your market profile.</p>
        </div>
        <div className="input-group" style={{ maxWidth: '320px', display: 'block' }}>
          <div className="auth-input-wrap">
            <span className="auth-input-icon"><Search size={18} /></span>
            <input 
              placeholder="Search narratives..." 
              className="auth-input" 
              style={{ background: '#fff' }}
            />
          </div>
        </div>
      </div>

      {/* Persona Selector */}
      <div className="stats-grid" style={{ marginBottom: '48px' }}>
        {PERSONAS.map((persona) => (
          <button
            key={persona.id}
            onClick={() => setSelectedPersona(persona.label)}
            className="card"
            style={{ 
              background: selectedPersona === persona.label ? 'var(--clr-text)' : '#fff',
              borderColor: selectedPersona === persona.label ? 'var(--clr-text)' : 'var(--clr-border)',
              color: selectedPersona === persona.label ? '#fff' : 'var(--clr-text)',
              display: 'flex', flexDirection: 'column', justifyContent: 'space-between', textAlign: 'left',
              height: '140px', padding: '24px', cursor: 'pointer'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ fontSize: '1.5rem', background: selectedPersona === persona.label ? 'rgba(255,255,255,0.1)' : 'var(--clr-bg-soft)', width: '40px', height: '40px', borderRadius: '12px', display: 'flex', alignItems: 'center', justify_content: 'center' }}>
                {persona.icon}
              </div>
              {selectedPersona === persona.label && (
                 <div className="badge-pulse" style={{ width: '6px', height: '6px', background: '#60a5fa', borderRadius: '50%', boxShadow: '0 0 8px #60a5fa' }} />
              )}
            </div>
            <div>
              <h3 style={{ fontSize: '0.875rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'inherit' }}>{persona.label}</h3>
              <p style={{ fontSize: '0.7rem', color: selectedPersona === persona.label ? '#94a3b8' : 'var(--clr-muted)', fontWeight: 700, textTransform: 'uppercase' }}>{persona.desc}</p>
            </div>
          </button>
        ))}
      </div>

      {/* Feed Content */}
      <div className="feed-grid">
        {loading ? (
           <div style={{ padding: '80px 0', textAlign: 'center' }}>
              <div className="loader" style={{ width: '40px', height: '40px', border: '3px solid var(--clr-accent)', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 1s linear infinite', margin: '0 auto 24px' }} />
              <p style={{ fontSize: '0.7rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.2em', color: 'var(--clr-muted)' }}>Processing Intelligence...</p>
           </div>
        ) : (
          <AnimatePresence mode="popLayout">
            {feed.map((item, idx) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                className="intelligence-card"
              >
                <div className="intelligence-card__body">
                  <div className="intelligence-card__meta" style={{ marginBottom: '24px' }}>
                    <span className="badge" style={{ background: 'var(--clr-bg-soft)', color: 'var(--clr-muted)', border: '1px solid var(--clr-border)' }}>
                      {item.category}
                    </span>
                    <div className="profile-meta-item" style={{ fontSize: '0.7rem', fontWeight: 800, textTransform: 'uppercase' }}>
                       <Globe size={12} />
                       <span>{item.source}</span>
                    </div>
                    <div style={{ marginLeft: 'auto' }}>
                       <span className="badge badge-yellow">
                          <Zap size={12} fill="currentColor" style={{ marginRight: '4px' }} />
                          {item.impact_score} Impact
                       </span>
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

                  <div style={{ marginTop: '32px', paddingTop: '32px', borderTop: '1px solid var(--clr-bg-soft)', display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '24px' }}>
                    <div style={{ display: 'flex', gap: '32px' }}>
                      <button className="btn-ghost" style={{ padding: 0, fontSize: '0.7rem', fontWeight: 800, textTransform: 'uppercase' }}>
                        <MessageSquare size={16} style={{ marginRight: '8px' }} />
                        Intelligence Q&A
                      </button>
                      <button className="btn-ghost" style={{ padding: 0, fontSize: '0.7rem', fontWeight: 800, textTransform: 'uppercase' }}>
                        <Globe size={16} style={{ marginRight: '8px' }} />
                        Regional View
                      </button>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <button className="btn-outline" style={{ width: '44px', height: '44px', padding: 0, borderRadius: '12px' }}>
                        <Bookmark size={20} />
                      </button>
                      <Link to={`/analysis/${item.id}`}>
                        <Button style={{ borderRadius: '12px', paddingLeft: '24px', paddingRight: '24px' }}>
                          Deep Analysis <ChevronRight size={16} style={{ marginLeft: '4px' }} />
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
