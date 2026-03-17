import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Play, 
  ArrowLeft, 
  Layers, 
  Music, 
  Video, 
  Type, 
  Sparkles, 
  Download, 
  ChevronRight,
  Monitor,
  Smartphone
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import DashboardLayout from '../../layouts/DashboardLayout';
import Button from '../../components/ui/Button';

const STEPS = [
  { id: 'script', icon: Type, label: 'AI Script' },
  { id: 'visuals', icon: Layers, label: 'Visuals' },
  { id: 'audio', icon: Music, label: 'Audio' },
];

export default function VideoGeneratorPage() {
  const [activeTab, setActiveTab] = useState('script');
  const [format, setFormat] = useState('vertical');
  const [generating, setGenerating] = useState(false);
  const navigate = useNavigate();

  const handleGenerate = () => {
    setGenerating(true);
    setTimeout(() => {
      setGenerating(false);
      navigate('/studio/preview');
    }, 2000);
  };

  return (
    <DashboardLayout>
      <div className="dash-welcome" style={{ marginBottom: '40px' }}>
        <div className="dash-welcome__text" style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <Link to="/studio" className="btn-outline" style={{ width: '44px', height: '44px', borderRadius: '12px', padding: 0 }}>
            <ArrowLeft size={18} />
          </Link>
          <div>
            <h1 style={{ fontSize: '1.5rem' }}>AI Video Studio</h1>
            <p>Transform narratives into high-impact media.</p>
          </div>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <Button variant="outline" size="sm">
            <Download size={16} />
            Export Raw
          </Button>
          <Button size="sm" onClick={handleGenerate} disabled={generating}>
            <Sparkles size={16} />
            {generating ? "Synthesizing..." : "Generate AI Cut"}
          </Button>
        </div>
      </div>

      <div className="studio-layout">
        {/* Left: Studio Preview */}
        <div className="studio-preview-area" style={{ flex: 1, height: '100%', minHeight: '600px' }}>
          <div className="phone-mockup" style={{ 
            width: format === 'vertical' ? '320px' : '90%', 
            height: format === 'vertical' ? '640px' : '400px',
            transition: 'all 0.5s cubic-bezier(0.16, 1, 0.3, 1)'
          }}>
            {/* Background Gradient */}
            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg, #1e293b, #0f172a)' }} />
            
            <AnimatePresence mode="wait">
              {generating ? (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '32px', textAlign: 'center' }}
                >
                  <div className="loader" style={{ width: '48px', height: '48px', border: '4px solid #60a5fa', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 1s linear infinite', marginBottom: '24px' }} />
                  <p style={{ color: '#fff', fontSize: '1.25rem', fontWeight: 800 }}>Synthesizing Alpha...</p>
                  <p style={{ color: '#64748b', fontSize: '0.75rem', marginTop: '8px', fontWeight: 700, textTransform: 'uppercase' }}>Assembling 4K renders</p>
                </motion.div>
              ) : (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', padding: '32px' }}
                >
                   <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '64px', height: '64px', background: 'rgba(255,255,255,0.1)', backdropFilter: 'blur(8px)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                      <Play size={24} style={{ color: '#fff' }} fill="#fff" />
                   </div>
                   <div style={{ position: 'relative', zIndex: 10 }}>
                      <span className="badge badge-blue">Scene 1 / 4</span>
                      <h3 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#fff', margin: '12px 0', lineHeight: 1.2 }}>
                         The Future of Customized AI Silicon
                      </h3>
                      <div className="intel-stat-group" style={{ marginBottom: 0 }}>
                         <div className="intel-stat-header" style={{ fontSize: '0.65rem', color: '#94a3b8' }}>
                            <span>00:15 / 00:45</span>
                         </div>
                         <div className="intel-progress-bar" style={{ background: 'rgba(255,255,255,0.1)' }}>
                            <div className="intel-progress-fill" style={{ width: '33%' }} />
                         </div>
                      </div>
                   </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Format Selector */}
          <div style={{ position: 'absolute', top: '24px', right: '24px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
             <button 
                onClick={() => setFormat('vertical')}
                className={format === 'vertical' ? 'btn-primary' : 'btn-outline'}
                style={{ width: '44px', height: '44px', padding: 0, borderRadius: '12px', background: format === 'vertical' ? '' : '#fff' }}
             >
                <Smartphone size={20} />
             </button>
             <button 
                onClick={() => setFormat('landscape')}
                className={format === 'landscape' ? 'btn-primary' : 'btn-outline'}
                style={{ width: '44px', height: '44px', padding: 0, borderRadius: '12px', background: format === 'landscape' ? '' : '#fff' }}
             >
                <Monitor size={20} />
             </button>
          </div>
        </div>

        {/* Right: Studio Controls */}
        <div className="studio-controls" style={{ height: '100%', minHeight: '600px', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          <div style={{ display: 'flex', background: 'var(--clr-bg-soft)', padding: '6px', borderRadius: '16px', marginBottom: '32px' }}>
            {STEPS.map(step => (
              <button
                key={step.id}
                onClick={() => setActiveTab(step.id)}
                className="btn-ghost"
                style={{ 
                  flex: 1, padding: '12px', borderRadius: '12px', fontSize: '0.7rem', fontWeight: 800, textTransform: 'uppercase',
                  background: activeTab === step.id ? '#fff' : 'transparent',
                  color: activeTab === step.id ? 'var(--clr-text)' : 'var(--clr-muted)',
                  boxShadow: activeTab === step.id ? 'var(--shadow-sm)' : 'none'
                }}
              >
                <step.icon size={16} style={{ marginRight: '8px' }} />
                {step.label}
              </button>
            ))}
          </div>

          <div style={{ flex: 1, overflowY: 'auto' }}>
            <AnimatePresence mode="wait">
              {activeTab === 'script' && (
                <motion.div
                  key="script"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}
                >
                   <div style={{ padding: '24px', background: 'var(--clr-bg-soft)', borderRadius: '20px', border: '1px solid var(--clr-border)', fontStyle: 'italic', fontSize: '0.875rem', color: 'var(--clr-muted)', lineHeight: 1.6 }}>
                      "Scene 1: Close-up of high-tech server racks. [AI VOICE]: The demand for customized silicon is reaching a tipping point. As enterprises shift away from generic hardware, companies like TSMC and NVIDIA are seeing unprecedented backlog..."
                   </div>
                   <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                      <p className="intel-counter-lbl" style={{ textAlign: 'left' }}>Story Reference</p>
                      <div className="activity-item" style={{ borderRadius: '16px', border: '1px solid var(--clr-border)', background: '#fff', padding: '16px' }}>
                         <div className="activity-icon">
                            <Video size={16} />
                         </div>
                         <div className="activity-info">
                            <h4 style={{ fontSize: '0.875rem' }}>Customized Silicon Future...</h4>
                         </div>
                         <ChevronRight size={14} style={{ color: '#cbd5e1' }} />
                      </div>
                   </div>
                </motion.div>
              )}

              {activeTab === 'visuals' && (
                <motion.div
                  key="visuals"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}
                >
                  {Array.from({ length: 6 }).map((_, i) => (
                    <div key={i} className="tool-btn" style={{ height: '140px', padding: 0, overflow: 'hidden' }}>
                      <div style={{ width: '100%', height: '100%', background: 'var(--clr-bg-soft)', display: 'flex', alignItems: 'center', justify_content: 'center' }}>
                         <Video size={24} style={{ color: '#cbd5e1' }} />
                      </div>
                    </div>
                  ))}
                </motion.div>
              )}

              {activeTab === 'audio' && (
                 <motion.div
                   key="audio"
                   initial={{ opacity: 0, x: 20 }}
                   animate={{ opacity: 1, x: 0 }}
                   exit={{ opacity: 0, x: -20 }}
                   style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}
                 >
                   {['Professional Male', 'Calm Female', 'Dynamic Narrator'].map((voice, i) => (
                     <div key={i} className="activity-item" style={{ borderRadius: '16px', border: '1px solid var(--clr-border)', background: '#fff', padding: '16px', cursor: 'pointer' }}>
                        <div className="activity-icon" style={{ borderRadius: '50%' }}>
                           <Music size={16} />
                        </div>
                        <div className="activity-info">
                           <h4 style={{ fontSize: '0.875rem' }}>{voice}</h4>
                           <p style={{ fontSize: '0.65rem' }}>British English • HQ</p>
                        </div>
                        <div style={{ width: '20px', height: '20px', border: '2px solid var(--clr-border)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                           {i === 0 && <div style={{ width: '10px', height: '10px', background: 'var(--clr-accent)', borderRadius: '50%' }} />}
                        </div>
                     </div>
                   ))}
                 </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
