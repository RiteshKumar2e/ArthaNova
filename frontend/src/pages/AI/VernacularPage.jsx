import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Globe, Languages, Zap, Lightbulb, MessageSquare, Copy, Check, Info, ChevronRight } from 'lucide-react';
import DashboardLayout from '../../layouts/DashboardLayout';
import Button from '../../components/ui/Button';

const LANGUAGES = [
  { id: 'hi', label: 'Hindi', native: 'हिन्दी' },
  { id: 'en', label: 'English', native: 'English' },
  { id: 'fr', label: 'French', native: 'Français' },
  { id: 'jp', label: 'Japanese', native: '日本語' },
  { id: 'es', label: 'Spanish', native: 'Español' },
];

export default function VernacularPage() {
  const [targetLang, setTargetLang] = useState('hi');
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <DashboardLayout>
      <div className="dash-welcome" style={{ marginBottom: '40px' }}>
        <div className="dash-welcome__text">
          <h1>Vernacular Intelligence</h1>
          <p>Context-aware multi-modal translation and regional market insights.</p>
        </div>
        <div className="badge badge-blue" style={{ height: 'fit-content', padding: '10px 20px', borderRadius: '12px' }}>
           <div style={{ width: '8px', height: '8px', background: 'var(--clr-accent)', borderRadius: '50%', marginRight: '10px', animation: 'pulse 2s infinite' }} />
           Live Translation Node
        </div>
      </div>

      <div className="analysis-layout">
        {/* Translation Console */}
        <div className="lg:col-span-12 xl:col-span-8" style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
          <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
            <div style={{ background: 'var(--clr-bg-soft)', padding: '24px 32px', borderBottom: '1px solid var(--clr-border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '32px' }}>
                 <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                   <span className="intel-counter-lbl" style={{ margin: 0 }}>Source</span>
                   <div className="badge" style={{ background: '#fff', border: '1px solid var(--clr-border)', color: 'var(--clr-text)' }}>
                      English (Global)
                   </div>
                 </div>
                 <Languages size={18} style={{ color: '#cbd5e1' }} />
                 <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                   <span className="intel-counter-lbl" style={{ margin: 0 }}>Target</span>
                   <div style={{ position: 'relative' }}>
                      <select 
                        value={targetLang}
                        onChange={(e) => setTargetLang(e.target.value)}
                        className="auth-input"
                        style={{ height: '36px', padding: '0 32px 0 16px', borderRadius: '10px', fontSize: '0.75rem', background: '#fff' }}
                      >
                        {LANGUAGES.map(l => <option key={l.id} value={l.id}>{l.label} ({l.native})</option>)}
                      </select>
                      <ChevronRight size={14} style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%) rotate(90deg)', pointerEvents: 'none', color: 'var(--clr-muted)' }} />
                   </div>
                 </div>
              </div>
              <button 
                onClick={handleCopy} 
                className="btn-outline"
                style={{ width: '40px', height: '40px', padding: 0, borderRadius: '12px', background: '#fff' }}
              >
                {copied ? <Check size={18} style={{ color: 'var(--clr-success)' }} /> : <Copy size={18} />}
              </button>
            </div>

            <div style={{ padding: '40px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '48px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <h4 className="intel-counter-lbl" style={{ textAlign: 'left' }}>Original Intelligence</h4>
                <p style={{ fontSize: '1.25rem', fontWeight: 600, color: 'var(--clr-text)', lineHeight: 1.5 }}>
                  "The rapid deployment of AI-native platforms is transforming the fiduciary landscape for retail investors in Southeast Asia."
                </p>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', borderLeft: '1px solid var(--clr-bg-soft)', paddingLeft: '40px' }}>
                <h4 className="intel-counter-lbl" style={{ textAlign: 'left', color: 'var(--clr-accent)' }}>AI Regional Synthesis</h4>
                <p style={{ fontSize: '1.25rem', fontWeight: 600, color: 'var(--clr-text)', lineHeight: 1.5 }}>
                  "एआई-नेटिव प्लेटफार्मों की तेजी से तैनाती दक्षिण पूर्व एशिया में खुदरा निवेशकों के लिए प्रत्ययी परिदृश्य (fiduciary landscape) को बदल रही है।"
                </p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                   {['Formal', 'Financial', 'High Sentiment'].map(tag => (
                      <span key={tag} className="badge badge-blue" style={{ fontSize: '0.65rem' }}>
                         {tag}
                      </span>
                   ))}
                </div>
              </div>
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="intelligence-profile"
            style={{ padding: '48px', position: 'relative', overflow: 'hidden' }}
          >
            <div style={{ position: 'absolute', top: 0, right: 0, padding: '40px', opacity: 0.05 }}>
               <Globe size={200} />
            </div>
            <div style={{ position: 'relative', zIndex: 10, display: 'flex', gap: '40px', alignItems: 'flex-start' }}>
               <div style={{ width: '64px', height: '64px', background: 'rgba(255,255,255,0.1)', borderRadius: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, border: '1px solid rgba(255,255,255,0.2)' }}>
                 <Lightbulb size={32} style={{ color: '#93c5fd' }} />
               </div>
               <div>
                 <h3 style={{ fontSize: '1.5rem', marginBottom: '16px' }}>Contextual Nuance AI</h3>
                 <div style={{ background: 'rgba(255,255,255,0.05)', backdropFilter: 'blur(10px)', borderRadius: '24px', padding: '32px', border: '1px solid rgba(255,255,255,0.1)' }}>
                   <p style={{ fontSize: '1.125rem', lineHeight: 1.6, marginBottom: '24px', fontWeight: 500 }}>
                     The term <span style={{ textDecoration: 'underline', textDecorationColor: '#60a5fa', textDecorationThickness: '2px', textUnderlineOffset: '4px' }}>"fiduciary landscape"</span> has been synthesized with special emphasis on its legal and trust connotations in the Indian market context, where <span style={{ color: '#93c5fd', fontStyle: 'italic', fontWeight: 800 }}>"Vishvaas" (Trust)</span> is the primary catalyst for financial growth.
                   </p>
                   <div style={{ display: 'flex', alignItems: 'center', gap: '12px', background: 'rgba(255,255,255,0.05)', padding: '8px 16px', borderRadius: '99px', width: 'fit-content' }}>
                     <Info size={14} style={{ color: '#93c5fd' }} />
                     <span style={{ fontSize: '0.65rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em' }}>Logical Context: Indian BFSI Regulation</span>
                   </div>
                 </div>
               </div>
            </div>
          </motion.div>
        </div>

        {/* Regional Insights Sidebar */}
        <aside style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
           <div className="card" style={{ padding: '32px' }}>
             <h3 className="widget-title" style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '32px' }}>
               <Zap size={18} style={{ color: 'var(--clr-warning)' }} fill="currentColor" />
               Regional Sentiment
             </h3>
             <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
               <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                     <p style={{ fontSize: '0.875rem', fontWeight: 800 }}>North India Market</p>
                     <span className="badge badge-blue" style={{ fontSize: '0.6rem' }}>Critical</span>
                  </div>
                  <p style={{ fontSize: '0.8125rem', color: 'var(--clr-muted)', lineHeight: 1.5, marginBottom: '16px' }}>High relevance in tech corridors like Gurgaon & Noida. Focus on policy shifts.</p>
                  <div className="intel-progress-bar">
                     <div className="intel-progress-fill" style={{ width: '85%' }} />
                  </div>
               </div>
               <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                     <p style={{ fontSize: '0.875rem', fontWeight: 800 }}>South India Hubs</p>
                     <span className="badge" style={{ fontSize: '0.6rem', background: 'var(--clr-bg-soft)' }}>Stable</span>
                  </div>
                  <p style={{ fontSize: '0.8125rem', color: 'var(--clr-muted)', lineHeight: 1.5, marginBottom: '16px' }}>Deep correlation with SaaS and Enterprise software firms in Bangalore.</p>
                  <div className="intel-progress-bar">
                     <div className="intel-progress-fill" style={{ width: '72%', background: '#6366f1' }} />
                  </div>
               </div>
             </div>
           </div>

           <div className="intelligence-profile" style={{ textAlign: 'center', padding: '40px' }}>
              <div style={{ width: '80px', height: '80px', background: 'rgba(255,255,255,0.1)', borderRadius: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 32px', border: '1px solid rgba(255,255,255,0.2)' }}>
                 <MessageSquare size={40} style={{ color: '#60a5fa' }} />
              </div>
              <h4 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#fff', marginBottom: '12px' }}>Dialect Consultation</h4>
              <p style={{ fontSize: '0.75rem', color: '#93c5fd', lineHeight: 1.6, marginBottom: '32px' }}>
                 Need a synthesis in a specific regional dialect? Consult our AI specialized in over 140 linguistic market nuances.
              </p>
              <Button style={{ background: '#fff', color: 'var(--clr-text)', width: '100%', borderRadius: '12px', fontSize: '0.7rem', fontWeight: 800, textTransform: 'uppercase' }}>
                 Consult Specialist
              </Button>
           </div>
        </aside>
      </div>
    </DashboardLayout>
  );
}
