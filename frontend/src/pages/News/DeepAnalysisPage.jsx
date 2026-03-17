import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Share2, Bookmark, Zap, Globe, MessageSquare, BarChart3, Info, ChevronRight, Play } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';
import DashboardLayout from '../../layouts/DashboardLayout';
import Button from '../../components/ui/Button';

import { Input } from '../../components/ui/Input';
import { clsx } from 'clsx';

export default function DeepAnalysisPage() {
  const { id } = useParams();
  const [activeTab, setActiveTab] = useState('analysis');

  return (
    <DashboardLayout>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6">
        <Link to="/feed" className="flex items-center space-x-4 group">
          <div className="p-2 bg-white rounded-2xl border border-slate-200 text-slate-400 group-hover:text-slate-900 transition-all shadow-sm">
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          </div>
          <div>
            <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none mb-1">Back to Intelligence</span>
            <span className="text-sm font-bold text-slate-900">ArthaNova Feed</span>
          </div>
        </Link>
        <div className="flex items-center space-x-3">
          <Button variant="outline" size="sm" className="rounded-2xl">
            <Bookmark className="w-4 h-4 mr-2" />
            Archive Arc
          </Button>
          <Button size="sm" className="rounded-2xl shadow-lg shadow-blue-100">
            <Share2 className="w-4 h-4 mr-2" />
            Export Intel
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Main Content Area */}
        <div className="lg:col-span-8 space-y-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-[48px] border border-slate-100 p-12 md:p-16 shadow-sm relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/5 blur-[100px] -mr-48 -mt-48" />
            
            <div className="relative z-10">
              <div className="flex items-center space-x-4 mb-10">
                <span className="px-4 py-1.5 bg-slate-900 text-white rounded-xl text-[10px] font-bold uppercase tracking-widest shadow-xl">Critical Analysis</span>
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">March 17, 2026 • Case ID #{id || '842'}</span>
              </div>

              <h1 className="text-4xl md:text-6xl font-bold font-outfit text-slate-900 leading-tight mb-12 tracking-tight">
                NVIDIA Blackwell: The Convergence of Compute & Sovereignty
              </h1>

              <div className="prose prose-slate max-w-none">
                <p className="text-2xl font-medium text-slate-500 leading-relaxed mb-12 font-outfit">
                  "The unveiling of the Blackwell GPU architecture marks a pivotal moment in the computational landscape, yet its secondary effects on global power distribution remain under-analyzed."
                </p>
                
                <div className="bg-slate-50 border-l-8 border-blue-600 p-10 my-16 rounded-[32px] relative group overflow-hidden shadow-inner">
                   <Zap className="absolute -right-8 -bottom-8 w-40 h-40 text-blue-600/5 rotate-12" />
                   <p className="text-xl italic text-slate-900 font-medium leading-relaxed relative z-10">
                     "We aren't just looking at more chips; we are looking at the foundational layer of state-level intelligence."
                   </p>
                   <p className="mt-4 text-sm font-bold text-blue-600 uppercase tracking-widest relative z-10">— Dr. Elena Vance, Lead AI Strategist</p>
                </div>

                <div className="space-y-8 text-slate-600 text-lg leading-relaxed font-medium">
                  <p>
                    Core to this shift is the integration of high-scale liquid cooling and the drastic decoupling of the memory controller from traditional fabric constraints. This technical nuance allows for large-scale training with **40% less energy overhead**, which is the primary bottleneck for current datacenter expansion in the APAC region.
                  </p>
                  <p>
                    Governments are now leveraging Blackwell-based clusters to satisfy data localization laws while maintaining global model parity. This creates a unique market for "Local Intelligence" providers.
                  </p>
                </div>
              </div>

              <div className="mt-20 pt-12 border-t border-slate-50 flex flex-wrap gap-4">
                 {['Compute Strategy', 'Semiconductors', 'Sovereign AI', 'Macro Analysis'].map(tag => (
                   <span key={tag} className="px-5 py-2 bg-slate-50 text-slate-500 rounded-full text-[10px] font-bold uppercase tracking-widest border border-slate-100 hover:border-blue-400 hover:text-blue-600 transition-all cursor-pointer">
                      {tag}
                   </span>
                 ))}
              </div>
            </div>
          </motion.div>

          {/* Interactive AI Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-slate-900 rounded-[40px] p-10 text-white relative overflow-hidden shadow-2xl group cursor-pointer">
               <div className="absolute top-0 right-0 w-48 h-48 bg-yellow-500/10 blur-[60px] -mr-24 -mt-24 group-hover:bg-yellow-500/20 transition-all" />
               <Zap className="w-12 h-12 text-yellow-500 mb-8" fill="currentColor" />
               <h3 className="text-2xl font-bold mb-4 font-outfit">AI Executive Brief</h3>
               <p className="text-slate-400 text-base leading-relaxed mb-8 font-medium">Condense this 3,000-word deep dive into a 60-second actionable briefing.</p>
               <Button className="w-full bg-blue-600 hover:bg-blue-500 border-none h-14 rounded-2xl shadow-xl shadow-blue-900/40">
                  Generate Synthesis
               </Button>
            </div>
            
            <div className="bg-white rounded-[40px] border border-slate-100 p-10 shadow-sm group cursor-pointer hover:border-blue-400 transition-all">
               <BarChart3 className="w-12 h-12 text-blue-600 mb-8" />
               <h3 className="text-2xl font-bold text-slate-900 mb-4 font-outfit">Logical Impact Map</h3>
               <p className="text-slate-500 text-base leading-relaxed mb-8 font-medium">Visualize the causal relationships between this signal and your current holdings.</p>
               <Button variant="outline" className="w-full h-14 rounded-2xl">
                  Perspective Overlay
               </Button>
            </div>
          </div>
        </div>

        {/* Intelligence Sidebar */}
        <div className="lg:col-span-4 space-y-8">
           <div className="bg-white rounded-[40px] border border-slate-100 p-10 shadow-sm">
             <div className="flex items-center space-x-3 mb-10">
               <Info className="w-5 h-5 text-blue-600" />
               <h3 className="text-lg font-bold text-slate-900 font-outfit uppercase tracking-widest text-xs">Intelligence Console</h3>
             </div>
             
             <div className="flex bg-slate-50 p-1.5 rounded-2xl mb-10 border border-slate-100">
                {['analysis', 'q&a'].map(tab => (
                  <button 
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={clsx(
                      "flex-1 py-3 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all",
                      activeTab === tab ? "bg-white text-blue-600 shadow-xl" : "text-slate-400 hover:text-slate-600"
                    )}
                  >
                    {tab}
                  </button>
                ))}
             </div>

             {activeTab === 'analysis' ? (
               <div className="space-y-10">
                 <div>
                    <div className="flex items-center justify-between mb-4 px-1">
                       <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Sentiment Pull</p>
                       <span className="text-sm font-bold text-green-600">Strongly Bullish</span>
                    </div>
                    <div className="flex items-center space-x-1.5 h-12">
                       {[1,2,3,4,5,6,7,8].map(i => (
                          <motion.div 
                             key={i} 
                             initial={{ height: '20%' }}
                             animate={{ height: i <= 6 ? '100%' : '20%' }}
                             className={clsx(
                                "flex-1 rounded-full",
                                i <= 6 ? "bg-green-500" : "bg-slate-100"
                             )} 
                          />
                       ))}
                    </div>
                    <p className="mt-4 text-[10px] font-bold text-slate-400 text-center uppercase tracking-[0.2em]">+12.4% Intensity</p>
                 </div>
                 
                 <div className="pt-10 border-t border-slate-50">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-6">Connected Nodes</p>
                    <div className="space-y-4">
                      {[
                        { name: 'TSMC', symbol: 'TSM', strength: 'Strong', color: 'blue' },
                        { name: 'Vertiv', symbol: 'VRT', strength: 'Medium', color: 'slate' },
                        { name: 'Supermicro', symbol: 'SMCI', strength: 'High', color: 'blue' }
                      ].map(entity => (
                        <div key={entity.symbol} className="flex justify-between items-center p-4 bg-slate-50 rounded-2xl border border-slate-100 hover:border-blue-200 transition-all cursor-pointer group">
                          <div className="flex items-center space-x-4">
                             <div className={clsx(
                                "w-10 h-10 rounded-xl flex items-center justify-center font-bold text-xs ring-2 ring-white shadow-sm transition-colors",
                                entity.color === 'blue' ? "bg-blue-600 text-white" : "bg-slate-200 text-slate-500"
                             )}>
                                {entity.symbol[0]}
                             </div>
                             <div>
                                <p className="text-sm font-bold text-slate-900 group-hover:text-blue-600 transition-colors">{entity.name}</p>
                                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-[0.1em]">{entity.symbol}</p>
                             </div>
                          </div>
                          <ChevronRight className="w-4 h-4 text-slate-300 group-hover:translate-x-1 transition-transform" />
                        </div>
                      ))}
                    </div>
                 </div>
               </div>
             ) : (
               <div className="space-y-6">
                 <div className="p-5 bg-blue-50/50 border border-blue-100 rounded-2xl text-xs text-blue-800 leading-relaxed font-medium shadow-sm">
                   Hello! I can analyze the Blackwell impact on specific market verticals or answer technical architectural questions.
                 </div>
                 <div className="space-y-3">
                    {['Energy efficiency impact?', 'Sovereign cloud growth?', 'Competitive moat?'].map(q => (
                       <div key={q} className="p-4 bg-white border border-slate-100 rounded-2xl text-[10px] font-bold text-slate-400 uppercase tracking-widest hover:border-blue-400 hover:text-blue-600 cursor-pointer transition-all">
                          {q}
                       </div>
                    ))}
                 </div>
                 <div className="relative mt-8">
                    <Input className="h-14 pl-5 pr-12 rounded-2xl border-slate-100 focus:ring-4 focus:ring-blue-500/10 text-sm" placeholder="Ask your intelligence analyst..." />
                    <button className="absolute right-4 top-1/2 -translate-y-1/2 w-8 h-8 bg-blue-600 text-white rounded-xl flex items-center justify-center shadow-lg">
                       <ArrowRight className="w-4 h-4" />
                    </button>
                 </div>
               </div>
             )}
           </div>

           <div className="bg-slate-900 rounded-[40px] p-10 text-white relative overflow-hidden group shadow-2xl">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 to-transparent" />
              <div className="relative z-10 text-center">
                 <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                    <Play className="w-6 h-6 text-white fill-white" />
                 </div>
                 <h4 className="text-lg font-bold mb-3 font-outfit">AI Video Context</h4>
                 <p className="text-slate-400 text-sm mb-8 leading-relaxed font-medium">
                    A 60-second synthesized video breakdown of the Blackwell narrative is ready.
                 </p>
                 <Button className="w-full bg-white text-slate-900 hover:bg-slate-100 border-none h-12 rounded-xl text-[10px] font-bold uppercase tracking-[0.2em]">
                    Watch Stream
                 </Button>
              </div>
           </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
