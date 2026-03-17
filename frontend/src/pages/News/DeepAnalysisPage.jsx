import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Share2, Bookmark, Zap, BarChart3, Info, ChevronRight, Play } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';
import DashboardLayout from '../../layouts/DashboardLayout';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';

export default function DeepAnalysisPage() {
  const { id } = useParams();
  const [activeTab, setActiveTab] = useState('analysis');

  return (
    <DashboardLayout>
      <div className="dash-welcome" style={{ marginBottom: '40px' }}>
        <div className="dash-welcome__text" style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <Link to="/feed" className="btn-outline" style={{ width: '44px', height: '44px', borderRadius: '12px', padding: 0 }}>
            <ArrowLeft size={18} />
          </Link>
          <div>
            <h1 style={{ fontSize: '1.5rem' }}>Deep Analysis</h1>
            <p>Critical evidence synthesis for your market arc.</p>
          </div>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <Button variant="outline" size="sm">
            <Bookmark size={16} style={{ marginRight: '8px' }} />
            Archive Arc
          </Button>
          <Button size="sm">
            <Share2 size={16} style={{ marginRight: '8px' }} />
            Export Intel
          </Button>
        </div>
      </div>

      <div className="analysis-layout">
        {/* Main Content Area */}
        <div className="analysis-main" style={{ position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', top: 0, right: 0, width: '400px', height: '400px', background: 'rgba(37, 99, 235, 0.03)', filter: 'blur(100px)', marginRight: '-200px', marginTop: '-200px' }} />
          
          <div style={{ position: 'relative', zIndex: 10 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '40px' }}>
              <span className="badge" style={{ background: 'var(--clr-text)', color: '#fff' }}>Critical Analysis</span>
              <span style={{ fontSize: '0.7rem', fontWeight: 800, color: 'var(--clr-muted)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                March 17, 2026 • Case ID #{id || '842'}
              </span>
            </div>

            <h1 className="analysis-h1">
              NVIDIA Blackwell: The Convergence of Compute & Sovereignty
            </h1>

            <div className="analysis-content">
              <p style={{ fontSize: '1.5rem', fontStyle: 'italic', color: 'var(--clr-muted)', marginBottom: '48px', borderLeft: '4px solid var(--clr-accent)', paddingLeft: '24px' }}>
                "The unveiling of the Blackwell GPU architecture marks a pivotal moment in the computational landscape, yet its secondary effects on global power distribution remain under-analyzed."
              </p>
              
              <div style={{ background: 'var(--clr-bg-soft)', borderRadius: '24px', padding: '32px', marginBottom: '48px', border: '1px solid var(--clr-border)' }}>
                 <p style={{ fontSize: '1.125rem', fontWeight: 700, color: 'var(--clr-text)', marginBottom: '12px' }}>
                    "We aren't just looking at more chips; we are looking at the foundational layer of state-level intelligence."
                 </p>
                 <p style={{ fontSize: '0.7rem', fontWeight: 800, color: 'var(--clr-accent)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>— Dr. Elena Vance, Lead AI Strategist</p>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                <p>
                  Core to this shift is the integration of high-scale liquid cooling and the drastic decoupling of the memory controller from traditional fabric constraints. This technical nuance allows for large-scale training with <strong>40% less energy overhead</strong>, which is the primary bottleneck for current datacenter expansion in the APAC region.
                </p>
                <p>
                  Governments are now leveraging Blackwell-based clusters to satisfy data localization laws while maintaining global model parity. This creates a unique market for "Local Intelligence" providers.
                </p>
              </div>
            </div>

            <div style={{ marginTop: '64px', paddingTop: '32px', borderTop: '1px solid var(--clr-bg-soft)', display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
               {['Compute Strategy', 'Semiconductors', 'Sovereign AI', 'Macro Analysis'].map(tag => (
                 <span key={tag} className="entity-pill">{tag}</span>
               ))}
            </div>
          </div>
        </div>

        {/* Intelligence Sidebar */}
        <div className="analysis-sidebar">
           <div className="card" style={{ padding: '32px' }}>
             <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '32px' }}>
               <Info size={18} style={{ color: 'var(--clr-accent)' }} />
               <h3 className="widget-title" style={{ marginBottom: 0 }}>Intelligence Console</h3>
             </div>
             
             <div style={{ display: 'flex', background: 'var(--clr-bg-soft)', padding: '4px', borderRadius: '12px', marginBottom: '32px' }}>
                {['analysis', 'q&a'].map(tab => (
                  <button 
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className="btn-ghost"
                    style={{ 
                      flex: 1, 
                      padding: '8px', 
                      borderRadius: '8px', 
                      fontSize: '0.65rem', 
                      fontWeight: 800, 
                      textTransform: 'uppercase',
                      background: activeTab === tab ? '#fff' : 'transparent',
                      color: activeTab === tab ? 'var(--clr-accent)' : 'var(--clr-muted)',
                      boxShadow: activeTab === tab ? '0 4px 12px rgba(0,0,0,0.05)' : 'none'
                    }}
                  >
                    {tab}
                  </button>
                ))}
             </div>

             {activeTab === 'analysis' ? (
               <div style={{ display: 'flex', flexDirection: 'column', gap: '40px' }}>
                 <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                       <p className="intel-counter-lbl" style={{ textAlign: 'left' }}>Sentiment Pull</p>
                       <span className="badge badge-green">Bullish</span>
                    </div>
                    <div style={{ display: 'flex', gap: '4px', height: '40px', alignItems: 'flex-end' }}>
                       {[1,2,3,4,5,6,7,8].map(i => (
                          <div 
                             key={i} 
                             style={{ 
                                flex: 1, 
                                borderRadius: '4px', 
                                height: i <= 6 ? '100%' : '30%',
                                background: i <= 6 ? 'var(--clr-success)' : 'var(--clr-bg-soft)'
                             }} 
                          />
                       ))}
                    </div>
                    <p style={{ marginTop: '12px', fontSize: '0.6rem', fontWeight: 800, color: 'var(--clr-muted)', textAlign: 'center', textTransform: 'uppercase', letterSpacing: '0.1em' }}>+12.4% Intensity</p>
                 </div>
                 
                 <div style={{ paddingTop: '32px', borderTop: '1px solid var(--clr-bg-soft)' }}>
                    <p className="widget-title" style={{ fontSize: '0.65rem' }}>Connected Nodes</p>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                      {[
                        { name: 'TSMC', symbol: 'TSM', strength: 'Strong', color: 'blue' },
                        { name: 'Vertiv', symbol: 'VRT', strength: 'Medium', color: 'slate' },
                        { name: 'Supermicro', symbol: 'SMCI', strength: 'High', color: 'blue' }
                      ].map(entity => (
                        <div key={entity.symbol} className="activity-item" style={{ borderRadius: '16px', border: '1px solid var(--clr-border)', background: '#fff', padding: '12px' }}>
                          <div className="activity-icon" style={{ background: entity.color === 'blue' ? 'var(--clr-accent)' : 'var(--clr-bg-soft)', color: entity.color === 'blue' ? '#fff' : 'var(--clr-muted)', borderRadius: '10px' }}>
                             {entity.symbol[0]}
                          </div>
                          <div className="activity-info">
                             <h4 style={{ fontSize: '0.8125rem' }}>{entity.name}</h4>
                             <p style={{ fontSize: '0.65rem', fontWeight: 800 }}>{entity.symbol}</p>
                          </div>
                          <ChevronRight size={14} style={{ color: '#cbd5e1' }} />
                        </div>
                      ))}
                    </div>
                 </div>
               </div>
             ) : (
               <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                 <p style={{ fontSize: '0.8125rem', color: 'var(--clr-muted)', lineHeight: 1.5, background: 'var(--clr-accent-lt)', padding: '16px', borderRadius: '16px', border: '1px solid #dbeafe' }}>
                    I can analyze the Blackwell impact on specific market verticals or answer technical architectural questions.
                 </p>
                 <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {['Energy efficiency impact?', 'Sovereign cloud growth?', 'Competitive moat?'].map(q => (
                       <button key={q} className="btn-outline" style={{ justifyContent: 'flex-start', fontSize: '0.7rem', textTransform: 'uppercase', padding: '12px' }}>
                          {q}
                       </button>
                    ))}
                 </div>
                 <div className="auth-input-wrap">
                    <input 
                      className="auth-input" 
                      style={{ height: '48px', paddingRight: '48px' }} 
                      placeholder="Ask analyst..." 
                    />
                    <button className="btn-primary" style={{ position: 'absolute', right: '6px', top: '50%', transform: 'translateY(-50%)', width: '36px', height: '36px', borderRadius: '10px', padding: 0 }}>
                       <ChevronRight size={16} />
                    </button>
                 </div>
               </div>
             )}
           </div>

           <div className="intelligence-profile" style={{ textAlign: 'center' }}>
              <div style={{ width: '48px', height: '48px', background: 'rgba(255,255,255,0.1)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
                 <Play size={18} fill="#fff" />
              </div>
              <h4 style={{ fontWeight: 800, color: '#fff', marginBottom: '8px' }}>AI Video Context</h4>
              <p style={{ fontSize: '0.75rem', color: '#93c5fd', lineHeight: 1.5, marginBottom: '24px' }}>
                 A 60-second synthesized video breakdown of the Blackwell narrative is ready.
              </p>
              <Button style={{ background: '#fff', color: 'var(--clr-text)', width: '100%', fontSize: '0.7rem', fontWeight: 800, textTransform: 'uppercase' }}>
                 Watch Stream
              </Button>
           </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
