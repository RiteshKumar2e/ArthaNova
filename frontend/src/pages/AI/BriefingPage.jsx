import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Zap, MessageSquare, Send, ArrowLeft, BookOpen, Hash, BarChart4 } from 'lucide-react';
import { Link } from 'react-router-dom';
import DashboardLayout from '../../layouts/DashboardLayout';
import Button from '../../components/ui/Button';

const KEY_POINTS = [
  "Global semiconductor demand is shifting towards customized AI silicon.",
  "New regulations in the EU are creating temporary market friction for US-based models.",
  "Enterprise spending on AI infrastructure has grown 45% YoY.",
  "Supply chain diversification is moving towards Southeast Asian manufacturing hubs."
];

export default function BriefingPage() {
  const [messages, setMessages] = useState([
    { role: 'ai', content: "Hello Anmol. I've synthesized today's top 12 business stories into this briefing. I've focused on the areas most relevant to your Investor persona. What would you like to deep dive into?" }
  ]);
  const [input, setInput] = useState('');

  const handleSend = () => {
    if (!input.trim()) return;
    setMessages([...messages, { role: 'user', content: input }]);
    setInput('');
    setTimeout(() => {
      setMessages(prev => [...prev, { role: 'ai', content: "Based on the recent financial filings and global policy shifts, the impact on your portfolio could be significant in the next two quarters. Would you like me to generate a risk assessment map?" }]);
    }, 1000);
  };

  return (
    <DashboardLayout>
      <div className="dash-welcome" style={{ marginBottom: '32px' }}>
        <div className="dash-welcome__text" style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <Link to="/dashboard" className="btn-outline" style={{ width: '44px', height: '44px', borderRadius: '12px', padding: 0 }}>
            <ArrowLeft size={18} />
          </Link>
          <div>
            <h1>Intelligence Briefing</h1>
            <p>Synthesized from 142 global intelligence sources.</p>
          </div>
        </div>
      </div>

      <div className="briefing-layout">
        {/* Left Column: Synthesis */}
        <div className="lg:col-span-12 xl:col-span-7" style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="briefing-card"
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
              <div style={{ width: '40px', height: '40px', background: 'var(--clr-accent-lt)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Zap size={20} className="text-yellow-500" fill="currentColor" />
              </div>
              <h2 className="dash-section-title" style={{ marginBottom: 0, fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.1em' }}>A1 Executive Strategy</h2>
            </div>
            
            <p style={{ fontSize: '1.25rem', fontWeight: 600, color: 'var(--clr-text)', lineHeight: 1.5, marginBottom: '32px' }}>
              The primary narrative of the week is the <span style={{ color: 'var(--clr-accent)' }}>decoupling of AI hardware from traditional semiconductor cycles</span>. Market intelligence indicates that while generic chip demand is cooling, custom AI silicon is reaching unprecedented wait times.
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px' }}>
              {KEY_POINTS.map((point, idx) => (
                <div key={idx} className="activity-item" style={{ borderRadius: 'var(--r-md)', border: '1px solid var(--clr-border)', background: 'var(--clr-bg-soft)', padding: '16px' }}>
                  <div className="activity-icon" style={{ background: 'var(--clr-text)', color: '#fff', width: '24px', height: '24px', fontSize: '0.7rem' }}>
                    {idx + 1}
                  </div>
                  <div className="activity-info">
                    <p style={{ fontSize: '0.8125rem', fontWeight: 700, color: 'var(--clr-muted)' }}>{point}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
            <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '20px', padding: '24px' }}>
              <div style={{ width: '56px', height: '56px', background: '#eff6ff', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#3b82f6' }}>
                <BarChart4 size={28} />
              </div>
              <div>
                <p className="intel-counter-lbl" style={{ textAlign: 'left' }}>Sentiment</p>
                <p className="dash-section-title" style={{ marginBottom: 0 }}>Bullish High</p>
              </div>
            </div>
            <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '20px', padding: '24px' }}>
              <div style={{ width: '56px', height: '56px', background: '#f0fdf4', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#22c55e' }}>
                <Hash size={28} />
              </div>
              <div>
                <p className="intel-counter-lbl" style={{ textAlign: 'left' }}>Core Entity</p>
                <p className="dash-section-title" style={{ marginBottom: 0 }}>NVIDIA NVDA</p>
              </div>
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="intelligence-profile"
            style={{ position: 'relative', overflow: 'hidden' }}
          >
            <div style={{ position: 'absolute', top: 0, right: 0, width: '320px', height: '320px', background: 'rgba(37, 99, 235, 0.1)', filter: 'blur(100px)', marginRight: '-160px', marginTop: '-160px', zIndex: 0 }} />
            <div style={{ position: 'relative', zIndex: 1 }}>
              <h3 style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <BookOpen size={18} style={{ color: '#60a5fa' }} />
                Predictive Logic Map
              </h3>
              <p style={{ fontSize: '0.875rem', color: '#94a3b8', marginBottom: '24px', fontWeight: 500 }}>
                Based on your current portfolio, these events have a direct correlation to 4 of your core local positions.
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '16px', background: 'rgba(255,255,255,0.05)', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)' }}>
                  <span style={{ fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Position: NVDA</span>
                  <span style={{ fontSize: '0.7rem', fontWeight: 800, color: '#4ade80' }}>+6.4% CORRELATION</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '16px', background: 'rgba(255,255,255,0.05)', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)' }}>
                  <span style={{ fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Position: EU-INDX</span>
                  <span style={{ fontSize: '0.7rem', fontWeight: 800, color: '#f87171' }}>-2.1% IMPACT</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Right Column: Q&A Chat */}
        <div className="lg:col-span-12 xl:col-span-5" style={{ height: '750px', display: 'flex', flexDirection: 'column' }}>
          <div className="card" style={{ borderBottomLeftRadius: 0, borderBottomRightRadius: 0, borderBottom: 'none', padding: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div style={{ width: '48px', height: '48px', background: 'var(--clr-text)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <MessageSquare size={24} style={{ color: '#60a5fa' }} fill="currentColor" />
              </div>
              <div>
                <p style={{ fontWeight: 800, color: 'var(--clr-text)', marginBottom: '2px' }}>Interactive Analyst</p>
                <p style={{ fontSize: '0.7rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em', color: '#22c55e' }}>Active Intelligence</p>
              </div>
            </div>
          </div>
          
          <div className="card" style={{ flex: 1, borderRadius: 0, borderTop: 'none', borderBottom: 'none', overflowY: 'auto', padding: '32px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {messages.map((m, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: m.role === 'user' ? 20 : -20 }}
                animate={{ opacity: 1, x: 0 }}
                style={{
                  maxWidth: '85%',
                  padding: '16px 20px',
                  borderRadius: '16px',
                  fontSize: '0.875rem',
                  fontWeight: 600,
                  lineHeight: 1.5,
                  alignSelf: m.role === 'user' ? 'flex-end' : 'flex-start',
                  background: m.role === 'user' ? 'var(--clr-accent)' : 'var(--clr-bg-soft)',
                  color: m.role === 'user' ? '#fff' : 'var(--clr-text)',
                  borderTopRightRadius: m.role === 'user' ? '2px' : '16px',
                  borderTopLeftRadius: m.role === 'user' ? '16px' : '2px',
                  boxShadow: m.role === 'user' ? '0 10px 25px rgba(37, 99, 235, 0.2)' : 'none'
                }}
              >
                {m.content}
              </motion.div>
            ))}
          </div>

          <div className="card" style={{ borderTopLeftRadius: 0, borderTopRightRadius: 0, borderTop: 'none', padding: '24px' }}>
            <div className="auth-input-wrap">
              <input 
                placeholder="Ask deep dive questions..." 
                className="auth-input"
                style={{ height: '56px', paddingRight: '60px', borderRadius: '12px' }}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
              />
              <button 
                onClick={handleSend}
                className="btn-primary"
                style={{ position: 'absolute', right: '8px', top: '50%', transform: 'translateY(-50%)', width: '40px', height: '40px', padding: 0, borderRadius: '10px' }}
              >
                <Send size={16} />
              </button>
            </div>
            <p style={{ marginTop: '16px', fontSize: '0.65rem', textAlign: 'center', color: 'var(--clr-muted)', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.15em' }}>
              Verified RAG Intelligence Engine
            </p>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
