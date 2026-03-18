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
        <div className="node-status node-status--active">
           <div className="status-dot" />
           Intelligence Node Active
        </div>
      </div>

      <div className="analysis-layout" style={{ display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: '32px' }}>
        {/* Translation Console */}
        <div className="lg:col-span-12 xl:col-span-8 vernacular-console">
          <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
            <div className="vernacular-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '32px' }}>
                 <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                   <span className="intel-tag">Source</span>
                   <div className="badge badge-blue">
                      English (Global)
                   </div>
                 </div>
                 <Languages size={18} style={{ color: '#cbd5e1' }} />
                 <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                   <span className="intel-tag">Target</span>
                   <div style={{ position: 'relative' }}>
                      <select 
                        value={targetLang}
                        onChange={(e) => setTargetLang(e.target.value)}
                        className="intel-select"
                      >
                        {LANGUAGES.map(l => <option key={l.id} value={l.id}>{l.label} ({l.native})</option>)}
                      </select>
                   </div>
                 </div>
              </div>
              <button 
                onClick={handleCopy} 
                className="btn-outline"
                style={{ width: '40px', height: '40px', padding: 0, borderRadius: '12px' }}
              >
                {copied ? <Check size={18} style={{ color: 'var(--clr-success)' }} /> : <Copy size={18} />}
              </button>
            </div>

            <div className="vernacular-main-grid">
              <div className="vernacular-input-pane">
                <h4 className="intel-tag">Input Article / Content</h4>
                <textarea
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  className="intel-textarea"
                  placeholder="Paste English business news here..."
                />
                <Button onClick={handleTranslate} size="sm">
                  Run Engine
                </Button>
              </div>
              
              <div className="vernacular-output-pane">
                <h4 className="intel-tag" style={{ color: 'var(--clr-accent)' }}>Linguistic Adaptation</h4>
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
                            <span key={tag} className="badge" style={{ background: 'var(--clr-bg-soft)', border: '1px solid var(--clr-border)', color: 'var(--clr-muted)' }}>
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
            className="ai-surface-pure"
          >
            <div className="ai-glow-blue" />
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
           <div className="card">
              <h3 className="card-side-title" style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '32px', fontSize: '0.9rem', fontWeight: 800, margin: 0 }}>
                <Zap size={18} style={{ color: 'var(--clr-warning)' }} fill="currentColor" />
                Regional Sentiment
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '32px', marginTop: '32px' }}>
                <div>
                   <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                      <p style={{ fontSize: '0.875rem', fontWeight: 800 }}>North India Market</p>
                      <span className="badge badge-red">Critical</span>
                   </div>
                   <div className="sentiment-track">
                      <div className="sentiment-fill" style={{ width: '85%', background: 'var(--clr-danger)' }} />
                   </div>
                </div>
                <div>
                   <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                      <p style={{ fontSize: '0.875rem', fontWeight: 800 }}>South India Hubs</p>
                      <span className="badge badge-blue">High</span>
                   </div>
                   <div className="sentiment-track">
                      <div className="sentiment-fill" style={{ width: '72%', background: 'var(--clr-accent)' }} />
                   </div>
                </div>
              </div>
           </div>

           <div className="consultant-card">
              <div style={{ width: '64px', height: '64px', background: 'rgba(255,255,255,0.1)', borderRadius: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px' }}>
                 <MessageSquare size={32} style={{ color: '#60a5fa' }} />
              </div>
              <h4 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#fff', marginBottom: '12px' }}>Regional Consultant</h4>
              <p style={{ fontSize: '0.75rem', color: '#94a3b8', lineHeight: 1.6, marginBottom: '24px' }}>
                 Need a deep dive into specific regional dialects or local market regulations?
              </p>
              <Button variant="secondary" style={{ width: '100%', borderRadius: '12px' }}>
                 Talk to AI Expert
              </Button>
           </div>
        </aside>
      </div>
    </DashboardLayout>
  );
}
