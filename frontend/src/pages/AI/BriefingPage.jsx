import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Zap, MessageSquare, Send, ArrowLeft, ChevronRight, BookOpen, Hash, BarChart4 } from 'lucide-react';
import { Link } from 'react-router-dom';
import DashboardLayout from '../../layouts/DashboardLayout';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import { clsx } from 'clsx';

const keyPoints = [
  "Global semiconductor demand is shifting towards customized AI silicon.",
  "New regulations in the EU are creating temporary market friction for US-based models.",
  "Enterprise spending on AI infrastructure has grown 45% YoY.",
  "Supply chain diversification is moving towards Southeast Asian manufacturing hubs."
];

export default function BriefingPage() {
  const [messages, setMessages] = useState([
    { role: 'ai', content: "Hello Anmol. I've synthesized today's top 12 business stories into this briefing. I've focused on the areas most relevant to your Investor persona. What would you like to deep dive into?" }
  ]);
  const [input, setInput] = useState('');

  const handleSend = () => {
    if (!input.trim()) return;
    setMessages([...messages, { role: 'user', content: input }]);
    setInput('');
    // Simulate AI response
    setTimeout(() => {
      setMessages(prev => [...prev, { role: 'ai', content: "Based on the recent financial filings and global policy shifts, the impact on your portfolio could be significant in the next two quarters. Would you like me to generate a risk assessment map?" }]);
    }, 1000);
  };

  return (
    <DashboardLayout>
      <div className="flex items-center space-x-4 mb-10">
        <Link to="/dashboard" className="p-2 bg-white rounded-2xl border border-slate-200 text-slate-400 hover:text-slate-900 transition-all shadow-sm">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-3xl font-bold font-outfit text-slate-900 leading-tight">Intelligence Briefing</h1>
          <p className="text-slate-500 font-medium">Synthesized from 142 global intelligence sources.</p>
        </div>
      </div>

      <div className="briefing-layout">
        {/* Left Column: Synthesis */}
        <div className="lg:col-span-7 space-y-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="briefing-card"
          >
            <div className="flex items-center space-x-3 mb-8">
              <div className="w-10 h-10 bg-yellow-50 rounded-2xl flex items-center justify-center">
                <Zap className="w-5 h-5 text-yellow-500" fill="currentColor" />
              </div>
              <h2 className="text-xl font-bold text-slate-900 font-outfit uppercase tracking-widest text-xs">A1 Executive Strategy</h2>
            </div>
            
            <p className="text-slate-700 leading-relaxed text-lg mb-10 font-medium">
              The primary narrative of the week is the **decoupling of AI hardware from traditional semiconductor cycles**. Market intelligence indicates that while generic chip demand is cooling, custom AI silicon is reaching unprecedented wait times.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {keyPoints.map((point, idx) => (
                <div key={idx} className="p-5 bg-slate-50/50 rounded-[24px] border border-slate-100/50 flex items-start space-x-4">
                  <div className="w-6 h-6 bg-slate-900 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5 shadow-lg">
                    <span className="text-[10px] font-bold text-white">{idx + 1}</span>
                  </div>
                  <p className="text-sm font-bold text-slate-600 leading-snug">{point}</p>
                </div>
              ))}
            </div>
          </motion.div>

          <div className="grid grid-cols-2 gap-6">
            <div className="premium-card p-6 flex items-center space-x-5">
              <div className="w-14 h-14 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600">
                <BarChart4 className="w-7 h-7" />
              </div>
              <div>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-1">Sentiment</p>
                <p className="text-lg font-bold text-slate-900 font-outfit">Bullish High</p>
              </div>
            </div>
            <div className="premium-card p-6 flex items-center space-x-5">
              <div className="w-14 h-14 bg-green-50 rounded-2xl flex items-center justify-center text-green-600">
                <Hash className="w-7 h-7" />
              </div>
              <div>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-1">Core Entity</p>
                <p className="text-lg font-bold text-slate-900 font-outfit">NVIDIA NVDA</p>
              </div>
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-slate-900 rounded-[40px] p-10 text-white relative overflow-hidden shadow-2xl"
          >
            <div className="absolute top-0 right-0 w-80 h-80 bg-blue-600/10 blur-[100px] -mr-40 -mt-40" />
            <h3 className="text-xl font-bold mb-4 flex items-center font-outfit">
              <BookOpen className="w-5 h-5 mr-3 text-blue-400" />
              Predictive Logic Map
            </h3>
            <p className="text-slate-400 text-sm mb-8 leading-relaxed font-medium">
              Based on your current portfolio, these events have a direct correlation to 4 of your core local positions.
            </p>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/10">
                <span className="text-sm font-bold uppercase tracking-wider">Position: NVDA</span>
                <span className="text-xs font-bold text-green-400">+6.4% CORRELATION</span>
              </div>
              <div className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/10">
                <span className="text-sm font-bold uppercase tracking-wider">Position: EU-INDX</span>
                <span className="text-xs font-bold text-red-400">-2.1% IMPACT</span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Right Column: Q&A Chat */}
        <div className="lg:col-span-5 relative flex flex-col h-[750px]">
          <div className="bg-white rounded-t-[32px] border-x border-t border-slate-200 p-8 shadow-sm flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-slate-900 rounded-2xl flex items-center justify-center shadow-lg">
                <MessageSquare className="w-6 h-6 text-blue-400" fill="currentColor" />
              </div>
              <div>
                <p className="text-sm font-bold text-slate-900 leading-tight">Interactive Analyst</p>
                <p className="text-[10px] text-green-500 font-bold uppercase tracking-widest mt-1">Active Intelligence</p>
              </div>
            </div>
          </div>
          
          <div className="flex-1 bg-white border-x border-slate-200 overflow-y-auto p-8 space-y-6">
            {messages.map((m, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: m.role === 'user' ? 20 : -20 }}
                animate={{ opacity: 1, x: 0 }}
                className={clsx(
                  "max-w-[90%] p-5 rounded-[24px] text-sm leading-relaxed font-medium",
                  m.role === 'user' 
                    ? "ml-auto bg-blue-600 text-white shadow-xl shadow-blue-200 rounded-tr-none" 
                    : "mr-auto bg-slate-100 text-slate-800 rounded-tl-none"
                )}
              >
                {m.content}
              </motion.div>
            ))}
          </div>

          <div className="bg-white rounded-b-[32px] border-x border-b border-slate-200 p-8 shadow-sm">
            <div className="relative">
              <Input 
                placeholder="Ask deep dive questions..." 
                className="pr-14 bg-slate-50 border-none h-16 rounded-2xl shadow-inner font-bold text-xs"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
              />
              <button 
                onClick={handleSend}
                className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-slate-900 text-white rounded-xl flex items-center justify-center hover:bg-slate-800 transition-all active:scale-90"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
            <p className="mt-4 text-[9px] text-center text-slate-400 font-bold uppercase tracking-[0.2em]">
              Verified RAG Intelligence Engine
            </p>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
