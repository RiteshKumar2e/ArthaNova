import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Film, Type, Music, Share2, Download, Zap, Sparkles, Loader2, Image as ImageIcon, Video, ArrowRight } from 'lucide-react';
import DashboardLayout from '../../layouts/DashboardLayout';
import Button from '../../components/ui/Button';
import useAIStore from '../../store/aiStore';

export default function VideoStudioPage() {
  const { videoContent, generateVideoContent, isProcessing } = useAIStore();
  const [articleTitle, setArticleTitle] = useState("");
  const [currentScene, setCurrentScene] = useState(0);

  const handleGenerate = () => {
    if (!articleTitle.trim()) return;
    generateVideoContent(articleTitle);
  };

  return (
    <DashboardLayout>
      <div className="page-header-area">
        <div className="page-header-text">
          <h1 className="page-title">AI Video Studio</h1>
          <p className="page-subtitle">Transform any business news into a broadcast-quality short video with AI-generated narration.</p>
        </div>
        <div className="badge badge-indigo" style={{ background: 'rgba(99, 102, 241, 0.1)', color: '#6366f1', border: '1px solid rgba(99, 102, 241, 0.2)', padding: '8px 16px', borderRadius: '12px' }}>
           <Film size={16} style={{ marginRight: '10px' }} />
           Production Ready
        </div>
      </div>

      <div className="analysis-layout" style={{ display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: '32px' }}>
        {/* Creation Form */}
        <div className="lg:col-span-12 xl:col-span-4">
           <div className="card" style={{ padding: '32px', background: '#fff', border: '1px solid var(--clr-border)', borderRadius: '24px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
                 <div style={{ width: '40px', height: '40px', background: 'var(--clr-accent-lt)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Type size={20} color="var(--clr-accent)" />
                 </div>
                 <h2 style={{ fontSize: '0.9rem', fontWeight: 800, margin: 0 }}>Video Settings</h2>
              </div>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                 <div>
                    <label style={{ fontSize: '0.7rem', fontWeight: 800, textTransform: 'uppercase', color: 'var(--clr-muted)', marginBottom: '8px', display: 'block' }}>Article / Story Title</label>
                    <input 
                      className="auth-input"
                      placeholder="e.g. NVIDIA Q4 Earnings Breakdown"
                      value={articleTitle}
                      onChange={(e) => setArticleTitle(e.target.value)}
                      style={{ height: '48px', borderRadius: '12px', background: 'var(--clr-bg-soft)', border: '1px solid var(--clr-border)' }}
                    />
                 </div>

                 <div>
                    <label style={{ fontSize: '0.7rem', fontWeight: 800, textTransform: 'uppercase', color: 'var(--clr-muted)', marginBottom: '8px', display: 'block' }}>Tone & Style</label>
                    <select className="auth-input" style={{ height: '48px', borderRadius: '12px', background: 'var(--clr-bg-soft)', border: '1px solid var(--clr-border)' }}>
                       <option>Professional Broadcast</option>
                       <option>Cinematic Storyteller</option>
                       <option>Fast-Paced Explainer</option>
                    </select>
                 </div>

                 <Button 
                   onClick={handleGenerate} 
                   disabled={isProcessing}
                   style={{ marginTop: '12px' }}
                 >
                    {isProcessing ? <Loader2 className="animate-spin" size={20} /> : <Film size={20} />}
                    {isProcessing ? "Synthesizing..." : "Generate AI Video"}
                 </Button>
              </div>
           </div>

           {videoContent && (
             <motion.div 
               initial={{ opacity: 0, y: 20 }}
               animate={{ opacity: 1, y: 0 }}
               className="card" 
               style={{ marginTop: '24px', padding: '24px', background: 'var(--clr-text)', color: '#fff', borderRadius: '24px' }}
             >
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                   <Music size={18} color="#60a5fa" />
                   <span style={{ fontSize: '0.75rem', fontWeight: 800 }}>Voice: Executive Male (Neutral)</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                   <ImageIcon size={18} color="#60a5fa" />
                   <span style={{ fontSize: '0.75rem', fontWeight: 800 }}>Visuals: Dynamic Data Overlay</span>
                </div>
             </motion.div>
           )}
        </div>

        {/* Video Preview / Scenes */}
        <div className="lg:col-span-12 xl:col-span-8">
           {!videoContent && !isProcessing && (
             <div style={{ height: '500px', background: '#f8fafc', borderRadius: '32px', border: '2px dashed var(--clr-border)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: 'var(--clr-muted)' }}>
                <Video size={64} style={{ marginBottom: '24px', opacity: 0.3 }} />
                <p style={{ fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em' }}>Preview will appear here</p>
             </div>
           )}

           {isProcessing && (
             <div style={{ height: '500px', background: '#fff', borderRadius: '32px', border: '1px solid var(--clr-border)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                <motion.div 
                   animate={{ scale: [1, 1.1, 1] }} 
                   transition={{ repeat: Infinity, duration: 1.5 }}
                   style={{ width: '80px', height: '80px', background: 'var(--clr-accent-lt)', borderRadius: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '32px' }}
                >
                   <Sparkles size={40} color="var(--clr-accent)" />
                </motion.div>
                <h3 style={{ fontSize: '1rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.2em' }}>Rendering Synthesis Engine...</h3>
             </div>
           )}

           {videoContent && !isProcessing && (
             <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
                <div style={{ position: 'relative', height: '480px', background: '#000', borderRadius: '32px', overflow: 'hidden', boxShadow: '0 20px 50px rgba(0,0,0,0.2)' }}>
                   {/* Mock Player */}
                   <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <AnimatePresence mode="wait">
                         <motion.div 
                           key={currentScene}
                           initial={{ opacity: 0 }}
                           animate={{ opacity: 1 }}
                           exit={{ opacity: 0 }}
                           style={{ textAlign: 'center', padding: '60px' }}
                         >
                            <h2 style={{ color: '#fff', fontSize: '2.5rem', fontWeight: 900, marginBottom: '24px', textShadow: '0 4px 10px rgba(0,0,0,0.5)' }}>
                               {videoContent.scenes[currentScene].visuals}
                            </h2>
                            <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '1.1rem', fontWeight: 500 }}>
                               {videoContent.scenes[currentScene].narration}
                            </p>
                         </motion.div>
                      </AnimatePresence>
                   </div>
                   
                   {/* Player Controls UI */}
                   <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '32px', background: 'linear-gradient(to top, rgba(0,0,0,0.8), transparent)' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                         <button style={{ width: '48px', height: '48px', borderRadius: '15px', background: 'var(--clr-accent)', border: 'none', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <Play size={24} fill="currentColor" />
                         </button>
                         <div style={{ flex: 1, height: '4px', background: 'rgba(255,255,255,0.2)', borderRadius: '2px' }}>
                            <div style={{ width: `${((currentScene + 1) / videoContent.scenes.length) * 100}%`, height: '100%', background: 'var(--clr-accent)', borderRadius: '2px' }} />
                         </div>
                         <span style={{ color: '#fff', fontSize: '0.8rem', fontWeight: 800 }}>{videoContent.duration}</span>
                      </div>
                   </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
                   {videoContent.scenes.map((scene, idx) => (
                      <button 
                        key={idx}
                        onClick={() => setCurrentScene(idx)}
                        style={{ 
                          padding: '16px', background: currentScene === idx ? 'var(--clr-accent)' : '#fff',
                          border: '1px solid var(--clr-border)', borderRadius: '16px', textAlign: 'left',
                          color: currentScene === idx ? '#fff' : 'var(--clr-text)', transition: 'all 0.2s',
                          cursor: 'pointer'
                        }}
                      >
                         <div style={{ fontSize: '0.65rem', fontWeight: 800, opacity: 0.8, marginBottom: '8px' }}>SCENE 0{idx+1}</div>
                         <div style={{ fontSize: '0.8rem', fontWeight: 800 }}>{scene.visuals}</div>
                      </button>
                   ))}
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '16px' }}>
                   <Button variant="outline">
                      <Download size={18} />
                      Download Assets
                   </Button>
                   <Button>
                      <Share2 size={18} />
                      Publish to Feed
                   </Button>
                </div>
             </div>
           )}
        </div>
      </div>
    </DashboardLayout>
  );
}
