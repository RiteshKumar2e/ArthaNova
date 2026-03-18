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
      <div className="studio-header">
        <div className="dash-welcome__text">
          <h1>AI Video Studio</h1>
          <p>Transform any business news into a broadcast-quality short video with AI-generated narration.</p>
        </div>
        <div className="badge badge-indigo" style={{ padding: '8px 16px', borderRadius: '12px' }}>
           <Film size={16} />
           Production Ready
        </div>
      </div>

      <div className="video-studio-grid">
        {/* Creation Form */}
        <div className="lg:col-span-12 xl:col-span-4" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
           <div className="card">
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
                 <div style={{ width: '40px', height: '40px', background: 'var(--clr-accent-lt)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Type size={20} color="var(--clr-accent)" />
                 </div>
                 <h2 style={{ fontSize: '0.9rem', fontWeight: 800, margin: 0 }}>Video Settings</h2>
              </div>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                 <div className="input-group">
                    <label className="input-label">Article / Story Title</label>
                    <input 
                      className="input-field"
                      placeholder="e.g. NVIDIA Q4 Earnings Breakdown"
                      value={articleTitle}
                      onChange={(e) => setArticleTitle(e.target.value)}
                    />
                 </div>

                 <div className="input-group">
                    <label className="input-label">Tone & Style</label>
                    <select className="intel-select" style={{ height: '48px', width: '100%' }}>
                       <option>Professional Broadcast</option>
                       <option>Cinematic Storyteller</option>
                       <option>Fast-Paced Explainer</option>
                    </select>
                 </div>

                 <Button 
                   onClick={handleGenerate} 
                   disabled={isProcessing}
                   className="vivid-button"
                 >
                    {isProcessing ? <Loader2 className="animate-spin" size={20} /> : <Film size={20} />}
                    {isProcessing ? "Synthesizing..." : "Generate AI Video"}
                 </Button>
              </div>
           </div>

           {videoContent && (
             <motion.div 
               initial={{ opacity: 0, scale: 0.95 }}
               animate={{ opacity: 1, scale: 1 }}
               className="card card-dark"
             >
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '16px' }}>
                   <Music size={18} color="var(--clr-accent-vivid)" />
                   <span style={{ fontSize: '0.75rem', fontWeight: 800 }}>Voice: Executive Male (Neutral)</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                   <ImageIcon size={18} color="var(--clr-accent-vivid)" />
                   <span style={{ fontSize: '0.75rem', fontWeight: 800 }}>Visuals: Dynamic Data Overlay</span>
                </div>
             </motion.div>
           )}
        </div>

        {/* Video Preview / Scenes */}
        <div className="lg:col-span-12 xl:col-span-8">
           {!videoContent && !isProcessing && (
             <div className="empty-preview-pane">
                <Video size={64} style={{ marginBottom: '24px', opacity: 0.2 }} />
                <p className="intel-tag">Preview will appear here</p>
             </div>
           )}

           {isProcessing && (
             <div className="render-overlay">
                <motion.div 
                   animate={{ scale: [1, 1.1, 1], rotate: [0, 5, -5, 0] }} 
                   transition={{ repeat: Infinity, duration: 2 }}
                   style={{ width: '80px', height: '80px', background: 'var(--clr-accent-lt)', borderRadius: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '32px', boxShadow: '0 0 40px rgba(37, 99, 235, 0.2)' }}
                >
                   <Sparkles size={40} color="var(--clr-accent)" />
                </motion.div>
                <h3 className="intel-tag" style={{ letterSpacing: '0.2rem' }}>Rendering Synthesis Engine...</h3>
             </div>
           )}

           {videoContent && !isProcessing && (
             <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
                <div className="player-canvas">
                   <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <AnimatePresence mode="wait">
                         <motion.div 
                           key={currentScene}
                           initial={{ opacity: 0, scale: 1.1 }}
                           animate={{ opacity: 1, scale: 1 }}
                           exit={{ opacity: 0, scale: 0.9 }}
                           transition={{ duration: 0.8 }}
                           style={{ textAlign: 'center', padding: '60px', zIndex: 10 }}
                         >
                            <h2 style={{ color: '#fff', fontSize: '2.5rem', fontWeight: 900, marginBottom: '24px', textShadow: '0 4px 20px rgba(0,0,0,0.8)' }}>
                               {videoContent.scenes[currentScene].visuals}
                            </h2>
                            <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '1.25rem', fontWeight: 500, maxWidth: '600px', margin: '0 auto' }}>
                               {videoContent.scenes[currentScene].narration}
                            </p>
                         </motion.div>
                      </AnimatePresence>
                   </div>
                   
                   <div className="player-controls">
                      <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                         <button className="btn-primary" style={{ width: '48px', height: '48px', borderRadius: '50%', padding: 0 }}>
                            <Play size={20} fill="currentColor" />
                         </button>
                         <div style={{ flex: 1, height: '4px', background: 'rgba(255,255,255,0.1)', borderRadius: '2px', overflow: 'hidden' }}>
                            <motion.div 
                              initial={{ width: 0 }}
                              animate={{ width: `${((currentScene + 1) / videoContent.scenes.length) * 100}%` }}
                              style={{ height: '100%', background: 'var(--clr-accent-pure)' }} 
                            />
                         </div>
                         <span style={{ color: '#fff', fontSize: '0.75rem', fontWeight: 800 }}>{videoContent.duration}</span>
                      </div>
                   </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
                   {videoContent.scenes.map((scene, idx) => (
                      <button 
                        key={idx}
                        onClick={() => setCurrentScene(idx)}
                        className={`studio-scene-btn ${currentScene === idx ? 'studio-scene-btn--active' : ''}`}
                      >
                         <div className="intel-tag" style={{ color: currentScene === idx ? 'rgba(255,255,255,0.7)' : 'var(--clr-muted)' }}>SCENE 0{idx+1}</div>
                         <div style={{ fontSize: '0.875rem', fontWeight: 800 }}>{scene.visuals}</div>
                      </button>
                   ))}
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '16px' }}>
                   <Button variant="outline">
                      <Download size={18} />
                      Download Assets
                   </Button>
                   <Button className="vivid-button">
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
