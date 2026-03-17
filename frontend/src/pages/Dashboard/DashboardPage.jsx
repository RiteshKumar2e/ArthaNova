import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, Users, Zap, Bell, ChevronRight, Play, ArrowUpRight, BarChart3, Target } from 'lucide-react';
import DashboardLayout from '../../layouts/DashboardLayout';
import Button from '../../components/ui/Button';
import useNewsStore from '../../store/newsStore';
import { Link } from 'react-router-dom';

const STATS = [
  { label: 'Intelligence Score', value: '842', change: '+12%', icon: Zap, color: '#eab308', bg: '#fefce8' },
  { label: 'Active Story Arcs', value: '14', change: '+2', icon: TrendingUp, color: '#3b82f6', bg: '#eff6ff' },
  { label: 'Network Reach', value: '1.2k', change: '+142', icon: Users, color: '#22c55e', bg: '#f0fdf4' },
];

export default function DashboardPage() {
  const { feed, fetchFeed } = useNewsStore();

  useEffect(() => {
    fetchFeed();
  }, [fetchFeed]);

  return (
    <DashboardLayout>
      <div className="dash-welcome">
        <div className="dash-welcome__text">
          <h1>Welcome back, Anmol</h1>
          <p>Here's your intelligence summary for March 17, 2026.</p>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
           <Button variant="outline" size="sm" className="hidden-mobile">
              <Bell size={16} />
              Notifications
           </Button>
           <Link to="/briefings">
             <Button size="sm">
                <Zap size={16} fill="currentColor" />
                Daily Briefing
             </Button>
           </Link>
        </div>
      </div>

      <div className="stats-grid" style={{ marginBottom: '40px' }}>
        {STATS.map((stat, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="stat-card"
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
              <div style={{ background: stat.bg, color: stat.color, padding: '10px', borderRadius: '12px', display: 'flex' }}>
                <stat.icon size={24} />
              </div>
              <span className="badge badge-green">
                <ArrowUpRight size={12} style={{ marginRight: '4px' }} />
                {stat.change}
              </span>
            </div>
            <p className="intel-counter-lbl">{stat.label}</p>
            <p className="intel-counter-val" style={{ textAlign: 'left', fontSize: '2rem' }}>{stat.value}</p>
          </motion.div>
        ))}
      </div>

      <div className="dash-grid">
        {/* Priority Feed */}
        <section>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
            <h2 className="dash-section-title" style={{ marginBottom: 0 }}>Priority Intelligence</h2>
            <Link to="/feed" className="auth-forgot-link" style={{ fontSize: '0.65rem' }}>
              Deep Feed <ChevronRight size={12} />
            </Link>
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '40px' }}>
            {feed.slice(0, 3).map((item) => (
              <Link key={item.id} to={`/analysis/${item.id}`} className="intelligence-card">
                <div className="intelligence-card__body" style={{ padding: '24px' }}>
                  <div className="intelligence-card__meta">
                    <span className="badge" style={{ background: '#f1f5f9', color: '#64748b' }}>{item.category}</span>
                    <span className="badge badge-blue">8.4 Impact</span>
                  </div>
                  <h3 className="intelligence-card__title" style={{ fontSize: '1.25rem' }}>{item.title}</h3>
                  <p className="intelligence-card__summary" style={{ fontSize: '0.875rem', maxW: '100%' }}>{item.summary}</p>
                </div>
              </Link>
            ))}
          </div>

          {/* AI Studio Hero Widget */}
          <div className="briefing-hero" style={{ padding: '40px', background: 'var(--clr-accent)', backgroundImage: 'linear-gradient(135deg, #1e40af, #2563eb)' }}>
             <div style={{ maxWidth: '400px', position: 'relative', zIndex: 10 }}>
                <h3 className="briefing-title" style={{ fontSize: '2rem', marginBottom: '16px' }}>AI Video Studio</h3>
                <p style={{ color: '#dbeafe', fontSize: '0.875rem', marginBottom: '24px', lineHeight: 1.6 }}>
                   Transform narratives into high-impact media briefings in seconds.
                </p>
                <Link to="/studio">
                   <Button style={{ background: '#fff', color: 'var(--clr-accent)' }}>
                      <Play size={16} fill="currentColor" />
                      Create New Video
                   </Button>
                </Link>
             </div>
             <BarChart3 size={120} style={{ position: 'absolute', right: '40px', bottom: '-20px', opacity: 0.1, color: '#fff' }} />
          </div>
        </section>

        {/* Sidebar Widgets */}
        <aside style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <div className="card">
             <h3 className="dash-section-title" style={{ display: 'flex', alignItems: 'center', fontSize: '0.9rem' }}>
                <Target size={18} style={{ marginRight: '10px', color: 'var(--clr-accent)' }} />
                Investor Focus
             </h3>
             <div style={{ marginTop: '20px' }}>
                <div className="intel-stat-group" style={{ marginBottom: '24px' }}>
                   <div className="intel-stat-header">
                      <span style={{ fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: '#94a3b8' }}>Narrative Strength</span>
                      <span style={{ color: 'var(--clr-accent)' }}>84%</span>
                   </div>
                   <div className="intel-progress-bar">
                      <div className="intel-progress-fill" style={{ width: '84%' }} />
                   </div>
                </div>
                
                <div style={{ paddingTop: '20px', borderTop: '1px solid var(--clr-bg-soft)' }}>
                   <p style={{ fontSize: '0.7rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em', color: '#cbd5e1', marginBottom: '12px' }}>Hot Commodities</p>
                   <div className="entity-list">
                      {['AI Chips', 'Sovereign Cloud', 'Neo-Banking', 'Green Steel'].map(tag => (
                         <span key={tag} className="entity-pill" style={{ fontSize: '0.65rem' }}>{tag}</span>
                      ))}
                   </div>
                </div>
             </div>
          </div>

          <div className="intelligence-profile" style={{ padding: '24px', borderRadius: 'var(--r-xl)' }}>
             <h3 style={{ marginBottom: '12px' }}>Predictive Logic</h3>
             <p style={{ fontSize: '0.75rem', color: '#93c5fd', lineHeight: 1.6, marginBottom: '20px' }}>
                Based on your portfolio, our AI predicts a secondary ripple effect in the European Fintech sector by early Q3.
             </p>
             <Button variant="outline" size="sm" style={{ width: '100%', borderColor: 'rgba(255,255,255,0.2)', color: '#fff' }}>
                View Detail Map
             </Button>
          </div>
        </aside>
      </div>
    </DashboardLayout>
  );
}
