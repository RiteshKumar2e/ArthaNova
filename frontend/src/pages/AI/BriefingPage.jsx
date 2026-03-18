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
        <div className="dash-welcome__text" style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <Link to="/dashboard" className="btn-outline" style={{ width: '44px', height: '44px', borderRadius: '12px', padding: 0 }}>
            <ArrowLeft size={18} />
          </Link>
          <div>
            <h1>News Navigator</h1>
            <p>Interactive Intelligence Briefing synthesizes all coverage into one explorable document.</p>
          </div>
        </div>
      </div>

      <div className="briefing-layout">
        {/* Left Column: Synthesis */}
        <div className="lg:col-span-12 xl:col-span-12 xxl:col-span-7" style={{ display: 'flex', flexDirection: 'column', gap: '32px', gridColumn: 'span 7' }}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="card card-premium"
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
              <div style={{ width: '40px', height: '40px', background: 'var(--clr-accent-lt)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Zap size={20} style={{ color: 'var(--clr-warning)' }} fill="currentColor" />
              </div>
              <h2 className="intel-tag" style={{ margin: 0 }}>{briefing?.title || 'Intelligence Synthesis'}</h2>
            </div>
            
            <p style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--clr-text)', lineHeight: 1.5, marginBottom: '32px' }}>
              {briefing?.summary || 'Analyzing complex market patterns...'}
            </p>

            <div style={{ background: 'var(--clr-bg-soft)', borderRadius: '16px', padding: '32px', marginBottom: '32px', border: '1px solid var(--clr-border-soft)' }}>
              <p style={{ fontSize: '1rem', color: 'var(--clr-text-soft)', lineHeight: 1.75 }}>
                {briefing?.content}
              </p>
            </div>

            <h3 className="intel-tag" style={{ marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Target size={14} /> Key Strategic Points
            </h3>
            <div className="strategic-points-grid">
              {briefing?.key_points?.map((point, idx) => (
                <div key={idx} className="strategic-point-item">
                  <span style={{ color: 'var(--clr-accent-pure)' }}>0{idx + 1}</span>
                  {point}
                </div>
              ))}
            </div>
          </motion.div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '24px' }}>
            <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
              <div style={{ width: '56px', height: '56px', background: 'var(--clr-accent-lt)', borderRadius: '18px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--clr-accent)' }}>
                <BarChart4 size={28} />
              </div>
              <div>
                <p className="intel-tag">Sentiment Map</p>
                <p style={{ fontWeight: 800, fontSize: '1.125rem', margin: 0 }}>Strategic Bullish</p>
              </div>
            </div>
            <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
              <div style={{ width: '56px', height: '56px', background: '#fffbeb', borderRadius: '18px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--clr-warning)' }}>
                <Sparkles size={28} />
              </div>
              <div>
                <p className="intel-tag">Confidence</p>
                <p style={{ fontWeight: 800, fontSize: '1.125rem', margin: 0 }}>94% Aggregated</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Q&A Chat */}
        <div className="lg:col-span-12 xl:col-span-5" style={{ gridColumn: 'span 5' }}>
          <div className="chat-container">
            <div style={{ padding: '24px', background: 'var(--clr-bg-dark)', color: '#fff' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <div style={{ width: '40px', height: '40px', background: 'rgba(255,255,255,0.1)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <MessageSquare size={20} style={{ color: 'var(--clr-accent-vivid)' }} fill="currentColor" />
                </div>
                <div>
                  <p style={{ fontWeight: 800, fontSize: '0.9rem', marginBottom: '2px' }}>Interactive Analyst</p>
                  <p className="intel-tag" style={{ color: 'var(--clr-accent-vivid)', fontSize: '0.6rem' }}>RAG Verified Engine</p>
                </div>
              </div>
            </div>
            
            <div className="chat-messages">
              <AnimatePresence>
                {messages.map((m, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, scale: 0.9, y: 10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    className={`chat-bubble ${m.role === 'user' ? 'chat-bubble--user' : 'chat-bubble--ai'}`}
                  >
                    {m.content}
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            <div className="chat-input-area">
              <div style={{ position: 'relative' }}>
                <input 
                  placeholder="Ask follow-up questions..." 
                  className="input-field"
                  style={{ height: '52px', paddingRight: '60px' }}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                />
                <button 
                  onClick={handleSend}
                  className="send-btn"
                >
                  <Send size={16} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
