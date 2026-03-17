import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Command, Zap, FileText, Video, Settings, User, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function CommandPalette({ isOpen, onClose }) {
  const [query, setQuery] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        isOpen ? onClose() : null; // Handled by parent
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const actions = [
    { label: 'Intelligence Feed', icon: Search, shortcut: 'F', path: '/feed' },
    { label: 'Daily Briefing', icon: Zap, shortcut: 'B', path: '/briefings' },
    { label: 'Video Studio', icon: Video, shortcut: 'V', path: '/studio' },
    { label: 'User Profile', icon: User, shortcut: 'P', path: '/profile' },
    { label: 'Settings', icon: Settings, shortcut: 'S', path: '/settings' },
  ];

  const filteredActions = actions.filter(action => 
    action.label.toLowerCase().includes(query.toLowerCase())
  );

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-start justify-center pt-24 px-4 bg-slate-900/40 backdrop-blur-sm" onClick={onClose}>
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: -20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: -20 }}
          className="w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-200"
          onClick={e => e.stopPropagation()}
        >
          <div className="flex items-center px-6 py-4 border-b border-slate-100">
            <Search className="w-5 h-5 text-slate-400 mr-4" />
            <input
              autoFocus
              className="flex-1 bg-transparent border-none outline-none text-lg text-slate-900 placeholder:text-slate-400"
              placeholder="Search actions or ask AI..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            <div className="flex items-center space-x-1 px-2 py-1 bg-slate-100 rounded-lg">
              <span className="text-[10px] font-bold text-slate-400">ESC</span>
            </div>
          </div>

          <div className="max-h-[400px] overflow-y-auto p-2">
            <div className="px-4 py-2">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Global Navigation</p>
            </div>
            {filteredActions.map((action, idx) => (
              <button
                key={idx}
                onClick={() => { navigate(action.path); onClose(); }}
                className="w-full flex items-center justify-between px-4 py-3 rounded-2xl hover:bg-slate-50 transition-all group"
              >
                <div className="flex items-center space-x-4">
                  <div className="p-2 bg-slate-100 rounded-xl group-hover:bg-blue-600 group-hover:text-white transition-colors">
                    <action.icon className="w-5 h-5" />
                  </div>
                  <span className="font-bold text-slate-700 group-hover:text-slate-900 transition-colors">{action.label}</span>
                </div>
                <div className="flex items-center space-x-2">
                   <div className="px-2 py-1 bg-slate-50 border border-slate-100 rounded-md text-[10px] font-bold text-slate-400">
                     ⌘{action.shortcut}
                   </div>
                   <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-blue-600 transition-colors opacity-0 group-hover:opacity-100 translate-x-[-10px] group-hover:translate-x-0 transition-all" />
                </div>
              </button>
            ))}

            {query.length > 0 && filteredActions.length === 0 && (
               <div className="p-8 text-center">
                  <Zap className="w-10 h-10 text-yellow-500 mx-auto mb-4" />
                  <p className="font-bold text-slate-900 mb-1">Ask AI about "{query}"</p>
                  <p className="text-sm text-slate-500">I'll synthesize an answer from your intelligence feed.</p>
                  <Button size="sm" className="mt-6">Submit to AI RAG</Button>
               </div>
            )}
          </div>

          <div className="bg-slate-50 px-6 py-4 border-t border-slate-100 flex items-center justify-between">
            <div className="flex items-center space-x-6 text-[11px] text-slate-400 font-medium">
               <div className="flex items-center space-x-2">
                  <Command className="w-3 h-3" />
                  <span>Search across ArthaNova</span>
               </div>
               <div className="flex items-center space-x-2">
                  <ArrowRight className="w-3 h-3 rotate-90" />
                  <span>Navigate</span>
               </div>
            </div>
            <div className="flex items-center space-x-2">
               <Zap className="w-4 h-4 text-yellow-500" fill="currentColor" />
               <span className="text-[10px] font-bold text-slate-500 uppercase">AI Search Enabled</span>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
