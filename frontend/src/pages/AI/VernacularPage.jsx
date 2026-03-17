import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Globe, Languages, Zap, Lightbulb, MessageSquare, Copy, Check, Info } from 'lucide-react';
import { clsx } from "clsx";
import DashboardLayout from '../../layouts/DashboardLayout';
import Button from '../../components/ui/Button';

const languages = [
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
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
        <div>
          <h1 className="text-3xl font-bold font-outfit text-slate-900 leading-tight">Vernacular Intelligence Console</h1>
          <p className="text-slate-500 font-medium">Context-aware multi-modal translation and regional market insights.</p>
        </div>
        <div className="flex items-center space-x-3">
          <div className="px-4 py-2 bg-blue-50 text-blue-600 rounded-full text-[10px] font-bold uppercase tracking-widest border border-blue-100 flex items-center">
             <div className="w-1.5 h-1.5 bg-blue-600 rounded-full mr-2 animate-pulse" />
             Live Translation Node
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Translation Console */}
        <div className="lg:col-span-8 space-y-8">
          <div className="bg-white rounded-[40px] border border-slate-100 overflow-hidden shadow-sm relative">
            <div className="bg-slate-50/50 px-10 py-6 border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center space-x-8">
                 <div className="flex items-center space-x-3">
                   <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Source</span>
                   <div className="px-3 py-1 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-900 shadow-sm">
                      English (Global)
                   </div>
                 </div>
                 <Languages className="w-4 h-4 text-slate-300" />
                 <div className="flex items-center space-x-3">
                   <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Target</span>
                   <div className="relative group">
                      <select 
                        value={targetLang}
                        onChange={(e) => setTargetLang(e.target.value)}
                        className="bg-white border border-slate-200 px-4 py-1 rounded-xl text-xs font-bold text-blue-600 appearance-none outline-none cursor-pointer pr-10 shadow-sm hover:border-blue-400 transition-all font-outfit"
                      >
                        {languages.map(l => <option key={l.id} value={l.id}>{l.label} ({l.native})</option>)}
                      </select>
                      <ChevronRight className="absolute right-3 top-1/2 -translate-y-1/2 w-3 h-3 text-slate-400 rotate-90 pointer-events-none" />
                   </div>
                 </div>
              </div>
              <button 
                onClick={handleCopy} 
                className="p-3 bg-white border border-slate-200 text-slate-400 hover:text-slate-900 rounded-2xl transition-all shadow-sm group"
              >
                {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4 group-hover:scale-110" />}
              </button>
            </div>

            <div className="p-10 grid md:grid-cols-2 gap-12 divide-y md:divide-y-0 md:divide-x divide-slate-100">
              <div className="space-y-6">
                <h4 className="text-[10px] font-bold uppercase text-slate-400 tracking-widest px-1">Original Intelligence</h4>
                <p className="text-slate-900 font-medium leading-relaxed text-lg font-outfit">
                  "The rapid deployment of AI-native platforms is transforming the fiduciary landscape for retail investors in Southeast Asia."
                </p>
              </div>
              <div className="md:pl-12 space-y-6 pt-10 md:pt-0">
                <h4 className="text-[10px] font-bold uppercase text-blue-400 tracking-widest px-1">AI Regional Synthesis</h4>
                <p className="text-slate-900 font-medium leading-relaxed text-lg font-outfit">
                  "एआई-नेटिव प्लेटफार्मों की तेजी से तैनाती दक्षिण पूर्व एशिया में खुदरा निवेशकों के लिए प्रत्ययी परिदृश्य (fiduciary landscape) को बदल रही है।"
                </p>
                <div className="flex flex-wrap gap-2">
                   {['Formal', 'Financial', 'High Sentiment'].map(tag => (
                      <span key={tag} className="px-2 py-0.5 bg-blue-50 text-blue-600 rounded-lg text-[8px] font-bold uppercase tracking-widest border border-blue-100">
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
            className="bg-blue-600 rounded-[40px] p-10 text-white relative overflow-hidden shadow-2xl"
          >
            <div className="absolute top-0 right-0 p-10 opacity-10">
               <Globe className="w-48 h-48" />
            </div>
            <div className="relative z-10 flex flex-col md:flex-row items-start gap-10">
               <div className="w-16 h-16 bg-white/10 rounded-[24px] flex items-center justify-center shrink-0 border border-white/20 shadow-xl">
                 <Lightbulb className="w-8 h-8 text-blue-200" />
               </div>
               <div>
                 <h3 className="text-2xl font-bold font-outfit mb-4">Contextual Nuance AI</h3>
                 <div className="bg-white/10 backdrop-blur-xl rounded-[32px] p-8 border border-white/20 shadow-inner">
                   <p className="text-lg leading-relaxed mb-6 font-medium">
                     The term <span className="font-bold underline decoration-blue-300 decoration-2 underline-offset-4 cursor-help">"fiduciary landscape"</span> has been synthesized with special emphasis on its legal and trust connotations in the Indian market context, where <span className="text-blue-200 italic font-bold">"Vishvaas" (Trust)</span> is the primary catalyst for financial growth.
                   </p>
                   <div className="flex items-center space-x-3 text-blue-100 text-[10px] font-bold uppercase tracking-[0.2em] bg-white/5 px-4 py-2 rounded-full w-fit">
                     <Info className="w-3 h-3" />
                     <span>Logical Context: Indian BFSI Regulation</span>
                   </div>
                 </div>
               </div>
            </div>
          </motion.div>
        </div>

        {/* Regional Insights Sidebar */}
        <div className="lg:col-span-4 space-y-8">
           <div className="bg-white rounded-[40px] border border-slate-100 p-10 shadow-sm">
             <h3 className="text-lg font-bold text-slate-900 mb-8 flex items-center font-outfit uppercase tracking-widest text-xs">
               <Zap className="w-5 h-5 mr-3 text-yellow-500" fill="currentColor" />
               Regional Sentiment
             </h3>
             <div className="space-y-8">
               <div className="p-6 bg-slate-50 rounded-[32px] border border-slate-100 group hover:border-blue-400 transition-all cursor-pointer">
                  <div className="flex justify-between items-center mb-4">
                     <p className="text-sm font-bold text-slate-900 font-outfit">North India Market</p>
                     <span className="text-[10px] font-bold text-blue-600 bg-white px-2 py-0.5 rounded-lg shadow-sm">Critical</span>
                  </div>
                  <p className="text-[11px] text-slate-500 leading-relaxed font-medium mb-4">High relevance in tech corridors like Gurgaon & Noida. Focus on policy shifts.</p>
                  <div className="h-1.5 w-full bg-white rounded-full overflow-hidden shadow-inner">
                     <div className="h-full bg-blue-500 w-[85%] rounded-full shadow-lg shadow-blue-500/50" />
                  </div>
               </div>
               <div className="p-6 bg-slate-50 rounded-[32px] border border-slate-100 group hover:border-blue-400 transition-all cursor-pointer">
                  <div className="flex justify-between items-center mb-4">
                     <p className="text-sm font-bold text-slate-900 font-outfit">South India Hubs</p>
                     <span className="text-[10px] font-bold text-slate-400 bg-white px-2 py-0.5 rounded-lg shadow-sm">Stable</span>
                  </div>
                  <p className="text-[11px] text-slate-500 leading-relaxed font-medium mb-4">Deep correlation with SaaS and Enterprise software firms in Bangalore.</p>
                  <div className="h-1.5 w-full bg-white rounded-full overflow-hidden shadow-inner">
                     <div className="h-full bg-indigo-500 w-[72%] rounded-full shadow-lg shadow-indigo-500/50" />
                  </div>
               </div>
             </div>
           </div>

           <div className="bg-slate-900 rounded-[40px] p-10 text-white relative overflow-hidden group shadow-2xl">
              <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/10 blur-[100px] -mr-32 -mt-32" />
              <div className="relative z-10 text-center">
                 <div className="w-20 h-20 bg-white/10 rounded-[32px] flex items-center justify-center mx-auto mb-8 group-hover:rotate-12 transition-transform shadow-xl">
                    <MessageSquare className="w-10 h-10 text-blue-400" />
                 </div>
                 <h4 className="text-xl font-bold mb-4 font-outfit">Dialect Consultation</h4>
                 <p className="text-slate-400 text-xs mb-8 leading-relaxed font-medium">
                    Need a synthesis in a specific regional dialect? Consult our AI specialized in over 140 linguistic market nuances.
                 </p>
                 <Button className="w-full bg-blue-600 hover:bg-blue-500 border-none h-12 rounded-xl text-[10px] font-bold uppercase tracking-widest">
                    Consult Specialist
                 </Button>
              </div>
           </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
