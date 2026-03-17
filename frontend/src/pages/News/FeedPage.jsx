import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Filter, Zap, LayoutGrid, List as ListIcon, ChevronRight, Bookmark, Share2, Globe, MessageSquare } from 'lucide-react';
import DashboardLayout from '../../layouts/DashboardLayout';
import Button from '../../components/ui/Button';
import { clsx } from 'clsx';
import useNewsStore from '../../store/newsStore';
import { Link } from 'react-router-dom';

const personas = [
  { id: 'investor', label: 'Investor', icon: '📈', desc: 'Market analysis & ROI' },
  { id: 'founder', label: 'Founder', icon: '🚀', desc: 'Growth & Strategy' },
  { id: 'student', label: 'Student', icon: '🎓', desc: 'Concepts & Learning' }
];

export default function FeedPage() {
  const { feed, fetchFeed, loading } = useNewsStore();
  const [selectedPersona, setSelectedPersona] = useState('Investor');

  useEffect(() => {
    fetchFeed(selectedPersona.toLowerCase());
  }, [selectedPersona, fetchFeed]);

  return (
    <DashboardLayout>
      <div className="flex flex-col space-y-10">
        {/* Top Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <h1 className="text-3xl font-bold font-outfit text-slate-900 leading-tight">Intelligence Feed</h1>
            <p className="text-slate-500 font-medium">Real-time synthesis curated for your market profile.</p>
          </div>
          <div className="flex items-center space-x-3 w-full md:w-auto">
            <div className="relative flex-1 md:w-80">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 font-bold" />
              <input 
                placeholder="Search narratives..." 
                className="input-field pl-12 h-14"
              />
            </div>
          </div>
        </div>

        {/* Persona Selector */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {personas.map((persona) => (
            <button
              key={persona.id}
              onClick={() => setSelectedPersona(persona.label)}
              className={clsx(
                "p-6 rounded-[32px] border-2 transition-all text-left group flex flex-col justify-between h-36",
                selectedPersona === persona.label 
                  ? "bg-slate-900 border-slate-900 text-white shadow-2xl shadow-slate-200" 
                  : "bg-white border-slate-50 hover:border-slate-200 text-slate-600 shadow-sm"
              )}
            >
              <div className="flex items-center justify-between">
                <div className={clsx(
                  "w-10 h-10 rounded-2xl flex items-center justify-center text-xl",
                  selectedPersona === persona.label ? "bg-white/10" : "bg-slate-50"
                )}>
                  {persona.icon}
                </div>
                {selectedPersona === persona.label && (
                   <div className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-pulse shadow-[0_0_8px_rgba(59,130,246,0.8)]" />
                )}
              </div>
              <div>
                <h3 className="font-bold text-sm tracking-tight mb-1 font-outfit uppercase">{persona.label}</h3>
                <p className={clsx("text-[10px] font-bold uppercase tracking-widest", selectedPersona === persona.label ? "text-slate-400" : "text-slate-400")}>
                  {persona.desc}
                </p>
              </div>
            </button>
          ))}
        </div>

        {/* Feed Content */}
        <div className="feed-container">
          {loading ? (
             <div className="py-24 text-center">
                <div className="w-12 h-12 border-[4px] border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-6" />
                <p className="text-slate-500 font-bold uppercase tracking-[0.2em] text-[10px]">Processing Intelligence...</p>
             </div>
          ) : (
            <AnimatePresence mode="popLayout">
              {feed.map((item, idx) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1, duration: 0.5 }}
                  className="bg-white rounded-[40px] border border-slate-100 p-10 hover:border-blue-200 hover:shadow-2xl hover:shadow-slate-200/50 transition-all group relative"
                >
                  <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center space-x-4">
                      <span className="px-4 py-1.5 bg-slate-50 border border-slate-100 text-slate-900 text-[10px] font-bold uppercase tracking-widest rounded-xl">
                        {item.category}
                      </span>
                      <div className="flex items-center space-x-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                         <Globe className="w-3 h-3" />
                         <span>{item.source}</span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                       <div className="px-3 py-1 bg-yellow-50 text-yellow-600 rounded-lg text-[9px] font-bold uppercase tracking-wider flex items-center">
                          <Zap className="w-3 h-3 mr-1" fill="currentColor" />
                          {item.impact_score} Impact
                       </div>
                    </div>
                  </div>

                  <Link to={`/analysis/${item.id}`}>
                    <h2 className="text-3xl font-bold text-slate-900 mb-4 group-hover:text-blue-600 transition-colors font-outfit tracking-tight leading-tight">
                      {item.title}
                    </h2>
                  </Link>
                  <p className="text-slate-500 text-base leading-relaxed mb-10 max-w-4xl font-medium">
                    {item.summary}
                  </p>

                  <div className="flex flex-col sm:flex-row items-center justify-between pt-10 border-t border-slate-50 gap-6">
                    <div className="flex items-center space-x-8">
                      <button className="flex items-center space-x-2 text-slate-400 hover:text-blue-600 transition-colors text-[10px] font-bold uppercase tracking-widest">
                        <MessageSquare className="w-4 h-4" />
                        <span>Intelligence Q&A</span>
                      </button>
                      <button className="flex items-center space-x-2 text-slate-400 hover:text-blue-600 transition-colors text-[10px] font-bold uppercase tracking-widest">
                        <Globe className="w-4 h-4" />
                        <span>Regional View</span>
                      </button>
                    </div>
                    <div className="flex items-center space-x-3 w-full sm:w-auto">
                      <button className="p-3 bg-slate-50 text-slate-400 hover:text-slate-900 hover:bg-slate-100 rounded-2xl transition-all">
                        <Bookmark className="w-5 h-5" />
                      </button>
                      <Link to={`/analysis/${item.id}`} className="flex-1 sm:flex-none">
                        <Button className="w-full sm:w-auto group/btn rounded-[20px] px-8">
                          Deep Analysis <ChevronRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </Button>
                      </Link>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
