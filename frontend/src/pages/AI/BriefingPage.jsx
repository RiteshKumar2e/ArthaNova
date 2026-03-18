import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Zap, MessageSquare, Send, ArrowLeft, BookOpen, Hash, BarChart4, Loader2, Target, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import DashboardLayout from '../../layouts/DashboardLayout';
import Button from '../../components/ui/Button';
import useAIStore from '../../store/aiStore';

export default function BriefingPage() {
  const { briefing, generateBriefing, isProcessing } = useAIStore();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');

  useEffect(() => {
    if (!briefing) {
      generateBriefing([1, 2, 3]);
    }
  }, [generateBriefing, briefing]);

  useEffect(() => {
    if (briefing && messages.length === 0) {
      setMessages([
        { role: 'ai', content: `Hello! I've synthesized today's top intelligence for you. The focus is on "${briefing.title}". What specific aspect of this narrative should we explore further?` }
      ]);
    }
  }, [briefing, messages.length]);

  const handleSend = () => {
    if (!input.trim()) return;
    const newMsg = { role: 'user', content: input };
    setMessages(prev => [...prev, newMsg]);
    setInput('');
    
    // Simulate interactive analysis
    setTimeout(() => {
      setMessages(prev => [...prev, { 
        role: 'ai', 
        content: `Based on the synthesis of ${briefing.title}, your question regarding "${input}" correlates with our 'Supply Chain Resilience' marker. Historically, this precedes a 15% shift in regional pricing. Would you like a localized risk map?` 
      }]);
    }, 1500);
  };

  if (isProcessing && !briefing) {
    return (
      <DashboardLayout>
        <div style={{ height: '70vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            style={{ marginBottom: '24px' }}
          >
            <Sparkles size={48} color="var(--clr-accent)" />
          </motion.div>
          <h2 style={{ fontSize: '1rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.2em' }}>Synthesizing Global Multi-Articles...</h2>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="dash-welcome" style={{ marginBottom: '32px' }}>
        <div className="dash-welcome__text" style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <Link to="/dashboard" className="btn-outline" style={{ width: '44px', height: '44px', borderRadius: '12px', padding: 0 }}>
            <ArrowLeft size={18} />
          </Link>
          <div>
            <h1>News Navigator</h1>
            <p>Interactive Intelligence Briefing synthesizes all coverage into one explorable document.</p>
          </div>
        </div>
      </div>

      <div className="briefing-layout" style={{ display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: '32px' }}>
        {/* Left Column: Synthesis */}
        <div className="lg:col-span-12 xl:col-span-7" style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="briefing-card"
            style={{ background: '#fff', padding: '40px', borderRadius: '24px', border: '1px solid var(--clr-border)', boxShadow: '0 4px 20px rgba(0,0,0,0.03)' }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
              <div style={{ width: '40px', height: '40px', background: 'var(--clr-accent-lt)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Zap size={20} style={{ color: '#F59E0B' }} fill="currentColor" />
              </div>
              <h2 style={{ fontSize: '0.8rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em', margin: 0 }}>{briefing?.title || 'Intelligence Synthesis'}</h2>
            </div>
            
            <p style={{ fontSize: '1.2rem', fontWeight: 600, color: 'var(--clr-text)', lineHeight: 1.6, marginBottom: '32px' }}>
              {briefing?.summary || 'Analyzing complex market patterns...'}
            </p>

            <div style={{ background: 'var(--clr-bg-soft)', borderRadius: '16px', padding: '24px', marginBottom: '32px', border: '1px solid var(--clr-border)' }}>
              <p style={{ fontSize: '0.95rem', color: '#475569', lineHeight: 1.7 }}>
                {briefing?.content}
              </p>
            </div>

            <h3 style={{ fontSize: '0.7rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Target size={14} /> Key Strategic Points
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              {briefing?.key_points?.map((point, idx) => (
                <div key={idx} style={{ padding: '16px', background: '#fff', border: '1px solid var(--clr-border)', borderRadius: '12px', fontSize: '0.8125rem', fontWeight: 700, display: 'flex', gap: '12px' }}>
                  <span style={{ color: 'var(--clr-accent)' }}>0{idx + 1}</span>
                  {point}
                </div>
              ))}
            </div>
          </motion.div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
            <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '20px', padding: '24px', background: '#fff', border: '1px solid var(--clr-border)', borderRadius: '24px' }}>
              <div style={{ width: '56px', height: '56px', background: '#eff6ff', borderRadius: '18px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#3b82f6' }}>
                <BarChart4 size={28} />
              </div>
              <div>
                <p style={{ fontSize: '0.65rem', fontWeight: 800, textTransform: 'uppercase', color: 'var(--clr-muted)' }}>Sentiment Map</p>
                <p style={{ fontWeight: 800, fontSize: '1.1rem', margin: 0 }}>Strategic Bullish</p>
              </div>
            </div>
            <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '20px', padding: '24px', background: '#fff', border: '1px solid var(--clr-border)', borderRadius: '24px' }}>
              <div style={{ width: '56px', height: '56px', background: '#fef3c7', borderRadius: '18px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#d97706' }}>
                <Sparkles size={28} />
              </div>
              <div>
                <p style={{ fontSize: '0.65rem', fontWeight: 800, textTransform: 'uppercase', color: 'var(--clr-muted)' }}>Confidence</p>
                <p style={{ fontWeight: 800, fontSize: '1.1rem', margin: 0 }}>94% Aggregated</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Q&A Chat */}
        <div className="lg:col-span-12 xl:col-span-5" style={{ height: '700px', display: 'flex', flexDirection: 'column' }}>
          <div className="card" style={{ borderBottomLeftRadius: 0, borderBottomRightRadius: 0, borderBottom: 'none', padding: '24px', background: 'var(--clr-text)', color: '#fff' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div style={{ width: '40px', height: '40px', background: 'rgba(255,255,255,0.1)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <MessageSquare size={20} style={{ color: '#60a5fa' }} fill="currentColor" />
              </div>
              <div>
                <p style={{ fontWeight: 800, fontSize: '0.9rem', marginBottom: '0px' }}>Interactive Analyst</p>
                <p style={{ fontSize: '0.6rem', fontWeight: 800, textTransform: 'uppercase', color: '#60a5fa' }}>RAG Verified Engine</p>
              </div>
            </div>
          </div>
          
          <div style={{ flex: 1, background: '#f8fafc', border: '1px solid var(--clr-border)', overflowY: 'auto', padding: '32px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <AnimatePresence>
              {messages.map((m, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  style={{
                    maxWidth: '85%',
                    padding: '16px 20px',
                    borderRadius: '16px',
                    fontSize: '0.875rem',
                    fontWeight: 600,
                    lineHeight: 1.5,
                    alignSelf: m.role === 'user' ? 'flex-end' : 'flex-start',
                    background: m.role === 'user' ? 'var(--clr-accent)' : '#fff',
                    color: m.role === 'user' ? '#fff' : 'var(--clr-text)',
                    border: m.role === 'user' ? 'none' : '1px solid var(--clr-border)',
                    borderTopRightRadius: m.role === 'user' ? '4px' : '16px',
                    borderTopLeftRadius: m.role === 'user' ? '16px' : '4px',
                    boxShadow: m.role === 'user' ? '0 8px 16px rgba(37, 99, 235, 0.15)' : 'none'
                  }}
                >
                  {m.content}
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          <div className="card" style={{ borderTopLeftRadius: 0, borderTopRightRadius: 0, borderTop: 'none', padding: '24px', background: '#fff', border: '1px solid var(--clr-border)' }}>
            <div style={{ position: 'relative' }}>
              <input 
                placeholder="Ask follow-up questions..." 
                className="auth-input"
                style={{ height: '52px', paddingRight: '60px', borderRadius: '12px', border: '1px solid var(--clr-border)' }}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
              />
              <button 
                onClick={handleSend}
                style={{ 
                  position: 'absolute', 
                  right: '6px', 
                  top: '50%', 
                  transform: 'translateY(-50%)', 
                  width: '40px', 
                  height: '40px', 
                  padding: 0, 
                  borderRadius: '10px',
                  background: 'var(--clr-text)',
                  color: '#fff',
                  border: 'none',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <Send size={16} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
