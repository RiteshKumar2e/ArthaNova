import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, ArrowUpRight, ArrowDownRight, Activity, Filter, Share2, Target, Zap, ChevronRight } from 'lucide-react';
import DashboardLayout from '../../layouts/DashboardLayout';
import Button from '../../components/ui/Button';

const TRENDING_ENTITIES = [
  { name: 'NVIDIA', symbol: 'NVDA', volume: 'High', sentiment: 82, trend: '+12.4%', status: 'up' },
  { name: 'Tesla', symbol: 'TSLA', volume: 'Medium', sentiment: 45, trend: '-2.1%', status: 'down' },
  { name: 'Supermicro', symbol: 'SMCI', volume: 'High', sentiment: 71, trend: '+5.8%', status: 'up' },
  { name: 'Microsoft', symbol: 'MSFT', volume: 'Steady', sentiment: 64, trend: '+0.5%', status: 'up' },
  { name: 'Apple', symbol: 'AAPL', volume: 'Steady', sentiment: 49, trend: '-0.8%', status: 'down' }
];

const SECTORS = [
  { label: 'Technology', val: 'Bullish', level: 85, color: 'var(--clr-success)' },
  { label: 'Finance', val: 'Neutral', level: 52, color: 'var(--clr-muted)' },
  { label: 'Energy', val: 'Bearish', level: 24, color: 'var(--clr-danger)' },
  { label: 'Healthcare', val: 'Bullish', level: 68, color: 'var(--clr-success)' },
  { label: 'Retail', val: 'Neutral', level: 45, color: 'var(--clr-muted)' },
  { label: 'Auto', val: 'Bearish', level: 31, color: 'var(--clr-danger)' },
  { label: 'Crypto', val: 'Bullish', level: 92, color: 'var(--clr-success)' },
  { label: 'Infrastructure', val: 'Neutral', level: 58, color: 'var(--clr-muted)' },
];

export default function TrendingPage() {
  return (
    <DashboardLayout>
      <div className="dash-welcome" style={{ marginBottom: '40px' }}>
        <div className="dash-welcome__text">
          <h1>Market Pulse</h1>
          <p>Real-time sentiment velocity and trending narrative clusters.</p>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <Button variant="outline" size="sm">
            <Filter size={16} style={{ marginRight: '8px' }} />
            Segment Analysis
          </Button>
          <Button size="sm">
            <Share2 size={16} style={{ marginRight: '8px' }} />
            Export Intelligence
          </Button>
        </div>
      </div>

      <div className="dash-grid">
        {/* Sentiment Heatmap */}
        <div className="lg:col-span-12 xl:col-span-8" style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
          <div className="card" style={{ padding: '32px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px', flexWrap: 'wrap', gap: '20px' }}>
              <h2 className="dash-section-title" style={{ marginBottom: 0, display: 'flex', alignItems: 'center' }}>
                <Activity size={20} style={{ marginRight: '12px', color: 'var(--clr-danger)' }} />
                Sector Sentiment Velocity
              </h2>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', background: 'var(--clr-bg-soft)', padding: '8px 16px', borderRadius: '12px' }}>
                <span style={{ fontSize: '0.65rem', fontWeight: 800, textTransform: 'uppercase', color: 'var(--clr-danger)' }}>Bearish</span>
                <div style={{ width: '80px', height: '4px', background: 'linear-gradient(to right, var(--clr-danger), var(--clr-border), var(--clr-success))', borderRadius: '4px' }} />
                <span style={{ fontSize: '0.65rem', fontWeight: 800, textTransform: 'uppercase', color: 'var(--clr-success)' }}>Bullish</span>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '20px' }}>
              {SECTORS.map((item, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: idx * 0.05 }}
                  className="tool-btn"
                  style={{ 
                    height: '140px', padding: '20px', borderRadius: '24px', position: 'relative', overflow: 'hidden',
                    justifyContent: 'space-between', alignItems: 'flex-start', textAlign: 'left'
                  }}
                >
                  <span className="intel-counter-lbl" style={{ margin: 0 }}>{item.label}</span>
                  <div style={{ width: '100%' }}>
                    <span style={{ fontSize: '0.875rem', fontWeight: 800, color: 'var(--clr-text)', display: 'block', marginBottom: '8px' }}>{item.val}</span>
                    <div style={{ width: '100%', height: '4px', background: 'var(--clr-border)', borderRadius: '4px', overflow: 'hidden' }}>
                      <div style={{ height: '100%', background: item.color, width: `${item.level}%` }} />
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          <div className="card" style={{ padding: '0' }}>
            <div style={{ padding: '24px 32px', borderBottom: '1px solid var(--clr-border)' }}>
              <h3 className="dash-section-title" style={{ marginBottom: 0 }}>Trending Intelligence Arcs</h3>
            </div>
            <div>
              {[
                { title: "Sovereign AI Infrastructure", mentions: "1.2k+", reach: "Worldwide", velocity: "Fast", trend: "up" },
                { title: "Digital Rupee Expansion", mentions: "840", reach: "Regional", velocity: "Medium", trend: "steady" },
                { title: "Post-Quantum Cryptography", mentions: "320", reach: "Niche", velocity: "Fast", trend: "up" }
              ].map((arc, idx) => (
                <div key={idx} className="activity-item" style={{ padding: '24px 32px' }}>
                  <div className="activity-icon" style={{ borderRadius: '12px', width: '44px', height: '44px', fontSize: '1rem' }}>
                    {idx + 1}
                  </div>
                  <div className="activity-info">
                    <h4 style={{ fontSize: '1rem', marginBottom: '4px' }}>{arc.title}</h4>
                    <p style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                      <span style={{ fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{arc.mentions} signals</span>
                      <span style={{ color: '#cbd5e1' }}>•</span>
                      <span style={{ fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{arc.reach}</span>
                    </p>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '32px' }}>
                    <div style={{ textAlign: 'right', display: 'none', md: 'block' }}>
                      <p className="intel-counter-lbl" style={{ marginBottom: '4px' }}>Velocity</p>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', justifyContent: 'flex-end' }}>
                        <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: arc.velocity === 'Fast' ? 'var(--clr-success)' : 'var(--clr-warning)' }} />
                        <span style={{ fontSize: '0.75rem', fontWeight: 700 }}>{arc.velocity}</span>
                      </div>
                    </div>
                    <button className="btn-outline" style={{ width: '40px', height: '40px', padding: 0, borderRadius: '10px' }}>
                      <ArrowUpRight size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Hot Symbols Sidebar */}
        <aside style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
          <div className="intelligence-profile" style={{ borderRadius: '40px' }}>
            <h3 style={{ marginBottom: '32px', display: 'flex', alignItems: 'center' }}>
              <Target size={18} style={{ marginRight: '10px', color: '#60a5fa' }} />
              Hot Market Symbols
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {TRENDING_ENTITIES.map((entity) => (
                <div key={entity.symbol} className="activity-item" style={{ background: 'rgba(255,255,255,0.05)', borderRadius: '20px', border: '1px solid rgba(255,255,255,0.1)', padding: '16px' }}>
                  <div className="activity-icon" style={{ background: 'rgba(37,99,235,0.2)', color: '#60a5fa', borderRadius: '12px' }}>
                    {entity.symbol[0]}
                  </div>
                  <div className="activity-info">
                    <h4 style={{ color: '#fff', fontSize: '1rem' }}>{entity.symbol}</h4>
                    <p style={{ color: '#94a3b8' }}>{entity.name}</p>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <p style={{ fontSize: '0.875rem', fontWeight: 800, color: entity.status === 'up' ? '#4ade80' : '#f87171', display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
                      {entity.status === 'up' ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                      {entity.trend}
                    </p>
                    <div style={{ marginTop: '4px', width: '40px', height: '3px', background: 'rgba(255,255,255,0.1)', borderRadius: '2px', overflow: 'hidden', marginLeft: 'auto' }}>
                      <div style={{ height: '100%', background: 'var(--clr-accent)', width: `${entity.sentiment}%` }} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <Button style={{ background: '#fff', color: 'var(--clr-text)', width: '100%', marginTop: '32px', borderRadius: '12px', fontSize: '0.7rem', fontWeight: 800, textTransform: 'uppercase' }}>
              Synchronize All Symbols
            </Button>
          </div>

          <div className="card" style={{ background: 'var(--clr-bg-soft)', position: 'relative', overflow: 'hidden' }}>
            <Zap size={80} style={{ position: 'absolute', right: '-10px', bottom: '-10px', opacity: 0.05, color: 'var(--clr-warning)' }} fill="currentColor" />
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', color: 'var(--clr-warning)', marginBottom: '16px' }}>
              <Zap size={18} fill="currentColor" />
              <span style={{ fontSize: '0.7rem', fontWeight: 800, textTransform: 'uppercase', color: 'var(--clr-text)', letterSpacing: '0.1em' }}>A1 Market Logic</span>
            </div>
            <p style={{ fontSize: '0.875rem', fontStyle: 'italic', fontWeight: 600, color: 'var(--clr-muted)', lineHeight: 1.6 }}>
              "Sentiment clusters suggest a breakout for energy-sector narratives as grid infrastructure becomes a primary bottleneck for global AI sovereign cloud expansion."
            </p>
          </div>
        </aside>
      </div>
    </DashboardLayout>
  );
}
