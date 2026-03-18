import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Globe, Languages, Zap, Lightbulb, MessageSquare, Copy, Check, Info, ChevronRight, Loader2, Sparkles } from 'lucide-react';
import DashboardLayout from '../../layouts/DashboardLayout';
import Button from '../../components/ui/Button';
import useAIStore from '../../store/aiStore';

const LANGUAGES = [
  { id: 'hi', label: 'Hindi', native: 'हिन्दी' },
  { id: 'ta', label: 'Tamil', native: 'தமிழ்' },
  { id: 'te', label: 'Telugu', native: 'తెలుగు' },
  { id: 'bn', label: 'Bengali', native: 'বাংলা' },
];

export default function VernacularPage() {
  const { translation, vernacularEngine, isProcessing } = useAIStore();
  const [inputText, setInputText] = useState("The rapid deployment of AI-native platforms is transforming the fiduciary landscape for retail investors in Southeast Asia.");
  const [targetLang, setTargetLang] = useState('hi');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    vernacularEngine(inputText, targetLang);
  }, [targetLang, vernacularEngine]);

  const handleTranslate = () => {
    vernacularEngine(inputText, targetLang);
  };

  const handleCopy = () => {
    if (translation?.translated) {
      navigator.clipboard.writeText(translation.translated);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <DashboardLayout>
      <div className="dash-welcome" style={{ marginBottom: '40px' }}>
        <div className="dash-welcome__text">
          <h1>Vernacular Business Engine</h1>
          <p>Real-time, context-aware translation with culturally adapted business explanations.</p>
        </div>
        <div className="badge badge-blue" style={{ height: 'fit-content', padding: '10px 20px', borderRadius: '12px', background: 'var(--clr-accent-lt)', color: 'var(--clr-accent)', border: '1px solid var(--clr-accent-lt)' }}>
           <Sparkles size={16} style={{ marginRight: '10px' }} />
           Intelligence Node Active
        </div>
      </div>

      <div className="analysis-layout" style={{ display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: '32px' }}>
        {/* Translation Console */}
        <div className="lg:col-span-12 xl:col-span-8" style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
          <div className="card" style={{ padding: 0, overflow: 'hidden', background: '#fff', border: '1px solid var(--clr-border)', borderRadius: '24px' }}>
            <div style={{ background: 'var(--clr-bg-soft)', padding: '24px 32px', borderBottom: '1px solid var(--clr-border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '32px' }}>
                 <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                   <span style={{ fontSize: '0.65rem', fontWeight: 800, textTransform: 'uppercase', color: 'var(--clr-muted)' }}>Source</span>
                   <div className="badge" style={{ background: '#fff', border: '1px solid var(--clr-border)', color: 'var(--clr-text)', fontSize: '0.75rem' }}>
                      English (Global)
                   </div>
                 </div>
                 <Languages size={18} style={{ color: '#cbd5e1' }} />
                 <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                   <span style={{ fontSize: '0.65rem', fontWeight: 800, textTransform: 'uppercase', color: 'var(--clr-muted)' }}>Target</span>
                   <div style={{ position: 'relative' }}>
                      <select 
                        value={targetLang}
                        onChange={(e) => setTargetLang(e.target.value)}
                        className="auth-input"
                        style={{ height: '36px', padding: '0 32px 0 16px', borderRadius: '10px', fontSize: '0.75rem', background: '#fff', border: '1px solid var(--clr-border)' }}
                      >
                        {LANGUAGES.map(l => <option key={l.id} value={l.id}>{l.label} ({l.native})</option>)}
                      </select>
                   </div>
                 </div>
              </div>
              <button 
                onClick={handleCopy} 
                style={{ width: '40px', height: '40px', padding: 0, borderRadius: '12px', background: '#fff', border: '1px solid var(--clr-border)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
              >
                {copied ? <Check size={18} style={{ color: '#22c55e' }} /> : <Copy size={18} />}
              </button>
            </div>

            <div style={{ padding: '40px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '48px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <h4 style={{ fontSize: '0.65rem', fontWeight: 800, textTransform: 'uppercase', color: 'var(--clr-muted)' }}>Input Article / Content</h4>
                <textarea
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  style={{ 
                    width: '100%', height: '140px', border: 'none', resize: 'none', 
                    fontSize: '1.1rem', fontWeight: 600, color: 'var(--clr-text)', lineHeight: 1.5,
                    outline: 'none', background: 'transparent'
                  }}
                  placeholder="Paste English business news here..."
                />
                <Button onClick={handleTranslate} style={{ width: 'fit-content', fontSize: '0.7rem' }}>
                  Run Engine
                </Button>
              </div>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', borderLeft: '1px solid var(--clr-bg-soft)', paddingLeft: '40px', position: 'relative' }}>
                <h4 style={{ fontSize: '0.65rem', fontWeight: 800, textTransform: 'uppercase', color: 'var(--clr-accent)' }}>Linguistic Adaptation</h4>
                <AnimatePresence mode="wait">
                  {isProcessing ? (
                    <motion.div 
                      key="loading" 
                      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                      style={{ padding: '20px 0', textAlign: 'center' }}
                    >
                      <Loader2 className="animate-spin" size={24} style={{ margin: '0 auto', color: 'var(--clr-accent)' }} />
                    </motion.div>
                  ) : (
                    <motion.div 
                      key="result"
                      initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
                    >
                      <p style={{ fontSize: '1.25rem', fontWeight: 600, color: 'var(--clr-text)', lineHeight: 1.6 }}>
                        {translation?.translated || "Select a language to begin adaptation."}
                      </p>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '24px' }}>
                         {['Context-Aware', 'Verified', 'Cultural Adaptation'].map(tag => (
                            <span key={tag} className="badge" style={{ fontSize: '0.6rem', background: 'var(--clr-bg-soft)', border: '1px solid var(--clr-border)', color: 'var(--clr-muted)' }}>
                               {tag}
                            </span>
                         ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="intelligence-profile"
            style={{ padding: '48px', position: 'relative', overflow: 'hidden', background: 'var(--clr-text)', color: '#fff', borderRadius: '32px' }}
          >
            <div style={{ position: 'absolute', top: 0, right: 0, padding: '40px', opacity: 0.05 }}>
               <Globe size={200} />
            </div>
            <div style={{ position: 'relative', zIndex: 10, display: 'flex', gap: '40px', alignItems: 'flex-start' }}>
               <div style={{ width: '64px', height: '64px', background: 'rgba(255,255,255,0.1)', borderRadius: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, border: '1px solid rgba(255,255,255,0.2)' }}>
                 <Lightbulb size={32} style={{ color: '#60a5fa' }} />
               </div>
               <div>
                 <h3 style={{ fontSize: '1.5rem', marginBottom: '16px', fontWeight: 800 }}>AI Context Note</h3>
                 <div style={{ background: 'rgba(255,255,255,0.05)', backdropFilter: 'blur(10px)', borderRadius: '24px', padding: '32px', border: '1px solid rgba(255,255,255,0.1)' }}>
                   <p style={{ fontSize: '1.125rem', lineHeight: 1.6, marginBottom: '24px', fontWeight: 500, color: '#e2e8f0' }}>
                     {translation?.context_note || "Our engine provides culturally adapted explanations rather than literal translations, focusing on regional business nuances."}
                   </p>
                   <div style={{ display: 'flex', alignItems: 'center', gap: '12px', background: 'rgba(255,255,255,0.1)', padding: '8px 16px', borderRadius: '99px', width: 'fit-content' }}>
                     <Info size={14} style={{ color: '#60a5fa' }} />
                     <span style={{ fontSize: '0.65rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em' }}>Confidence Score: {translation?.vernacular_score || "0.00"}</span>
                   </div>
                 </div>
               </div>
            </div>
          </motion.div>
        </div>

        {/* Regional Insights Sidebar */}
        <aside style={{ display: 'flex', flexDirection: 'column', gap: '32px', gridColumn: 'span 4' }}>
           <div className="card" style={{ padding: '32px', background: '#fff', border: '1px solid var(--clr-border)', borderRadius: '24px' }}>
              <h3 style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '32px', fontSize: '0.9rem', fontWeight: 800, margin: 0 }}>
                <Zap size={18} style={{ color: '#F59E0B' }} fill="currentColor" />
                Regional Sentiment
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '32px', marginTop: '32px' }}>
                <div>
                   <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                      <p style={{ fontSize: '0.875rem', fontWeight: 800 }}>North India Market</p>
                      <span className="badge" style={{ fontSize: '0.6rem', background: '#fff', border: '1px solid var(--clr-border)' }}>Critical</span>
                   </div>
                   <div style={{ height: '6px', background: '#f1f5f9', borderRadius: '3px', overflow: 'hidden' }}>
                      <div style={{ width: '85%', height: '100%', background: 'var(--clr-accent)' }} />
                   </div>
                </div>
                <div>
                   <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                      <p style={{ fontSize: '0.875rem', fontWeight: 800 }}>South India Hubs</p>
                      <span className="badge" style={{ fontSize: '0.6rem', background: '#fff', border: '1px solid var(--clr-border)' }}>High</span>
                   </div>
                   <div style={{ height: '6px', background: '#f1f5f9', borderRadius: '3px', overflow: 'hidden' }}>
                      <div style={{ width: '72%', height: '100%', background: '#6366f1' }} />
                   </div>
                </div>
              </div>
           </div>

           <div style={{ background: 'linear-gradient(135deg, #0f172a 0%, #172554 100%)', textAlign: 'center', padding: '40px', borderRadius: '32px' }}>
              <div style={{ width: '64px', height: '64px', background: 'rgba(255,255,255,0.1)', borderRadius: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px' }}>
                 <MessageSquare size={32} style={{ color: '#60a5fa' }} />
              </div>
              <h4 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#fff', marginBottom: '12px' }}>Regional Consultant</h4>
              <p style={{ fontSize: '0.75rem', color: '#94a3b8', lineHeight: 1.6, marginBottom: '24px' }}>
                 Need a deep dive into specific regional dialects or local market regulations?
              </p>
              <Button style={{ background: '#fff', color: 'var(--clr-text)', width: '100%', borderRadius: '12px' }}>
                 Talk to AI Expert
              </Button>
           </div>
        </aside>
      </div>
    </DashboardLayout>
  );
}
