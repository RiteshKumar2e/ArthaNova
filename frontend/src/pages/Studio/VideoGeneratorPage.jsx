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
  Share2, 
  ChevronRight,
  Monitor,
  Smartphone
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import DashboardLayout from '../../layouts/DashboardLayout';
import Button from '../../components/ui/Button';
import { clsx } from 'clsx';

export default function VideoGeneratorPage() {
  const [activeTab, setActiveTab] = useState('script');
  const [format, setFormat] = useState('vertical');
  const [generating, setGenerating] = useState(false);

  const steps = [
    { id: 'script', icon: Type, label: 'AI Script' },
    { id: 'visuals', icon: Layers, label: 'Visuals' },
    { id: 'audio', icon: Music, label: 'Audio' },
  ];

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
      <div className="flex items-center justify-between mb-10">
        <div className="flex items-center space-x-4">
          <Link to="/dashboard" className="p-2 bg-white rounded-2xl border border-slate-200 text-slate-400 hover:text-slate-900 transition-all shadow-sm">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-3xl font-bold font-outfit text-slate-900 leading-tight">AI Video Studio</h1>
            <p className="text-slate-500 font-medium">Transform narratives into high-impact media.</p>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <Button variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
          <Button size="sm" onClick={handleGenerate} disabled={generating}>
            <Sparkles className={clsx("w-4 h-4 mr-2", generating && "animate-spin")} />
            {generating ? "Generating..." : "Generate AI Cut"}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left: Studio Preview */}
        <div className="lg:col-span-12 xl:col-span-5">
          <div className="relative group">
            <div className={clsx(
              "transition-all duration-700 mx-auto bg-slate-900 shadow-[0_0_100px_rgba(59,130,246,0.1)] relative overflow-hidden",
              format === 'vertical' 
                ? "aspect-[9/16] max-w-[340px] rounded-[56px] border-[12px] border-slate-800" 
                : "aspect-video max-w-full rounded-[32px] border-[8px] border-slate-800"
            )}>
              {/* Fake Video Content */}
              <div className="absolute inset-0 bg-gradient-to-br from-slate-800 to-slate-900" />
              
              <AnimatePresence mode="wait">
                {generating ? (
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center"
                  >
                    <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-6" />
                    <p className="text-white font-outfit text-xl font-bold">Synthesizing Scenes...</p>
                    <p className="text-slate-400 text-xs mt-2 font-medium">Assembling 4K renders & AI Voiceover</p>
                  </motion.div>
                ) : (
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="absolute inset-0 flex flex-col justify-end p-8"
                  >
                     <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-20 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center cursor-pointer hover:scale-110 transition-transform">
                        <Play className="w-8 h-8 text-white fill-white" />
                     </div>
                     <div className="space-y-4 relative z-10">
                        <span className="px-3 py-1 bg-blue-600 text-white text-[10px] font-bold uppercase tracking-widest rounded-full">Coming Up</span>
                        <h3 className="text-2xl font-bold text-white font-outfit leading-tight drop-shadow-lg">
                           The Future of Customized AI Silicon
                        </h3>
                        <div className="flex items-center space-x-2 text-white/60 text-[10px] font-bold uppercase tracking-widest">
                           <span>00:15 / 00:45</span>
                           <div className="h-1 flex-1 bg-white/20 rounded-full overflow-hidden">
                              <div className="h-full bg-blue-500 w-1/3" />
                           </div>
                        </div>
                     </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Format Toggle */}
            <div className="absolute -left-16 top-1/2 -translate-y-1/2 hidden xl:flex flex-col space-y-4">
               <button 
                  onClick={() => setFormat('vertical')}
                  className={clsx(
                    "p-3 rounded-2xl transition-all shadow-lg",
                    format === 'vertical' ? "bg-blue-600 text-white" : "bg-white text-slate-400 hover:text-slate-900"
                  )}
               >
                  <Smartphone className="w-5 h-5" />
               </button>
               <button 
                  onClick={() => setFormat('landscape')}
                  className={clsx(
                    "p-3 rounded-2xl transition-all shadow-lg",
                    format === 'landscape' ? "bg-blue-600 text-white" : "bg-white text-slate-400 hover:text-slate-900"
                  )}
               >
                  <Monitor className="w-5 h-5" />
               </button>
            </div>
          </div>
        </div>

        {/* Right: Controls */}
        <div className="lg:col-span-12 xl:col-span-7 space-y-6">
          <div className="video-control-panel">
            <div className="flex items-center space-x-1 mb-8 p-1 bg-slate-50 rounded-2xl">
              {steps.map(step => (
                <button
                  key={step.id}
                  onClick={() => setActiveTab(step.id)}
                  className={clsx(
                    "flex-1 flex items-center justify-center py-3 px-4 rounded-xl text-xs font-bold transition-all uppercase tracking-widest",
                    activeTab === step.id 
                      ? "bg-white text-slate-900 shadow-sm ring-1 ring-slate-200" 
                      : "text-slate-400 hover:text-slate-600"
                  )}
                >
                  <step.icon className="w-4 h-4 mr-2" />
                  {step.label}
                </button>
              ))}
            </div>

            <div className="min-h-[400px]">
              <AnimatePresence mode="wait">
                {activeTab === 'script' && (
                  <motion.div
                    key="script"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-6"
                  >
                     <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100 italic text-slate-600 leading-relaxed text-sm">
                        "Scene 1: Close-up of high-tech server racks. [AI VOICE]: The demand for customized silicon is reaching a tipping point. As enterprises shift away from generic hardware, companies like TSMC and NVIDIA are seeing unprecedented backlog..."
                     </div>
                     <div className="space-y-4">
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Story Reference</p>
                        <div className="p-4 bg-white rounded-2xl border border-slate-200 flex items-center justify-between group cursor-pointer hover:border-blue-400 transition-all">
                           <div className="flex items-center space-x-3">
                              <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center">
                                 <Video className="w-4 h-4 text-blue-600" />
                              </div>
                              <span className="text-sm font-bold text-slate-900">Customized Silicon Future...</span>
                           </div>
                           <ChevronRight className="w-4 h-4 text-slate-300" />
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
                  >
                    <div className="studio-asset-grid">
                      {Array.from({ length: 6 }).map((_, i) => (
                        <div key={i} className="asset-item group">
                          <div className="w-full h-full bg-slate-200/50 rounded-2xl flex items-center justify-center">
                             <Video className="w-6 h-6 text-slate-300 group-hover:text-blue-500 transition-colors" />
                          </div>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}

                {activeTab === 'audio' && (
                   <motion.div
                     key="audio"
                     initial={{ opacity: 0, x: 20 }}
                     animate={{ opacity: 1, x: 0 }}
                     exit={{ opacity: 0, x: -20 }}
                     className="space-y-6"
                   >
                     {['Professional Male', 'Calm Female', 'Dynamic Narrator'].map((voice, i) => (
                       <div key={i} className="p-5 bg-white rounded-[24px] border border-slate-200 flex items-center justify-between hover:border-blue-400 transition-all cursor-pointer">
                          <div className="flex items-center space-x-4">
                             <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center">
                                <Music className="w-5 h-5 text-slate-600" />
                             </div>
                             <div>
                                <p className="text-sm font-bold text-slate-900">{voice}</p>
                                <p className="text-[10px] text-slate-400 font-bold uppercase">British English • HQ</p>
                             </div>
                          </div>
                          <div className="w-6 h-6 border-2 border-slate-200 rounded-full flex items-center justify-center">
                             <div className="w-3 h-3 bg-blue-600 rounded-full opacity-0" />
                          </div>
                       </div>
                     ))}
                   </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
