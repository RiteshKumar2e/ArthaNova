import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Play, Video, Plus, Wand2, Download, Share2, Clock, CheckCircle2, Layout, Music, Type } from 'lucide-react';
import DashboardLayout from '../../layouts/DashboardLayout';
import Button from '../../components/ui/Button';
import { clsx } from 'clsx';

const library = [
  { id: 1, title: "NVIDIA Q1 Synthesis", status: "Completed", date: "2026-03-16", thumbnail: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=400&fit=crop" },
  { id: 2, title: "Neo-Banks Growth", status: "Processing", date: "2026-03-17", thumbnail: "https://images.unsplash.com/photo-1563986768609-322da13575f3?q=80&w=400&fit=crop" }
];

export default function VideoStudioPage() {
  const [view, setView] = useState('create'); // 'create' or 'library'

  return (
    <DashboardLayout>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold font-outfit text-slate-900">AI Video Studio</h1>
          <p className="text-slate-500">Transform your intelligence briefings into engaging short-form videos.</p>
        </div>
        
        <div className="flex bg-white p-1 rounded-2xl border border-slate-200 shadow-sm">
          <button
            onClick={() => setView('create')}
            className={clsx(
              "px-6 py-2 rounded-xl text-sm font-bold transition-all flex items-center space-x-2",
              view === 'create' 
                ? "bg-slate-900 text-white shadow-md" 
                : "text-slate-500 hover:text-slate-900 hover:bg-slate-50"
            )}
          >
            <Plus className="w-4 h-4" />
            <span>New Video</span>
          </button>
          <button
            onClick={() => setView('library')}
            className={clsx(
              "px-6 py-2 rounded-xl text-sm font-bold transition-all flex items-center space-x-2",
              view === 'library' 
                ? "bg-slate-900 text-white shadow-md" 
                : "text-slate-500 hover:text-slate-900 hover:bg-slate-50"
            )}
          >
            <Video className="w-4 h-4" />
            <span>Library</span>
          </button>
        </div>
      </div>

      {view === 'create' ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Main Preview Area */}
          <div className="lg:col-span-8 flex flex-col space-y-6">
            <div className="aspect-[9/16] max-w-[400px] mx-auto bg-slate-900 rounded-[32px] border-[8px] border-slate-800 shadow-2xl relative overflow-hidden group cursor-pointer">
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent z-10" />
              <img 
                src="https://images.unsplash.com/photo-1639322537228-f710d846310a?q=80&w=2000&auto=format&fit=crop" 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-80"
                alt="Video Preview"
              />
              
              {/* Overlay Content Mockup */}
              <div className="absolute bottom-10 left-6 right-6 z-20 space-y-3">
                <div className="flex space-x-2">
                   <div className="px-3 py-1 bg-blue-600/90 backdrop-blur-md rounded-lg text-[10px] font-bold text-white uppercase tracking-widest">
                    Market Update
                  </div>
                </div>
                <h3 className="text-white text-xl font-bold leading-tight font-outfit">
                  How AI Silicon is Redefining Global Power Dynamics
                </h3>
              </div>

              <div className="absolute inset-0 flex items-center justify-center z-30 opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="w-16 h-16 bg-white/20 backdrop-blur-xl border border-white/30 rounded-full flex items-center justify-center">
                  <Play className="w-8 h-8 text-white fill-white" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-3xl border border-slate-200 p-6 flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600">
                  <Wand2 className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-900">AI Script generated</p>
                  <p className="text-xs text-slate-500">Based on "Semiconductor Shift" article</p>
                </div>
              </div>
              <Button variant="outline" size="sm">Edit Script</Button>
            </div>
          </div>

          {/* Controls Sidebar */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-white rounded-3xl border border-slate-200 p-6 space-y-6">
              <h3 className="font-bold text-slate-900">Studio Controls</h3>
              
              <div className="space-y-4">
                <div className="space-y-2">
                  <p className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">Visual Style</p>
                  <div className="grid grid-cols-2 gap-2">
                    <button className="p-3 bg-slate-900 text-white rounded-xl text-xs font-bold flex items-center justify-center space-x-2">
                      <Layout className="w-4 h-4" />
                      <span>Modern</span>
                    </button>
                    <button className="p-3 bg-slate-50 text-slate-600 rounded-xl text-xs font-bold flex items-center justify-center space-x-2 border border-slate-100">
                      <Type className="w-4 h-4" />
                      <span>Bold</span>
                    </button>
                  </div>
                </div>

                <div className="space-y-2">
                  <p className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">Voiceover</p>
                  <select className="w-full bg-slate-50 border-none rounded-xl px-4 py-3 text-sm font-medium text-slate-700 outline-none ring-1 ring-slate-100">
                    <option>Professional Male (US)</option>
                    <option>Professional Female (UK)</option>
                    <option>Storyteller (Dynamic)</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <p className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">Music Mood</p>
                  <div className="flex flex-wrap gap-2">
                    {['Strategic', 'Energetic', 'Minimal', 'Uplifting'].map(mood => (
                      <button key={mood} className="px-3 py-1.5 bg-slate-50 hover:bg-slate-100 rounded-lg text-xs font-medium text-slate-600 transition-colors">
                        {mood}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="pt-6 border-t border-slate-100">
                <Button className="w-full" size="lg">
                  <Wand2 className="w-5 h-5 mr-2" />
                  Generate Video
                </Button>
              </div>
            </div>

            <div className="p-6 bg-blue-50 rounded-3xl border border-blue-100">
              <h4 className="font-bold text-blue-900 text-sm mb-2">Did you know?</h4>
              <p className="text-xs text-blue-700 leading-relaxed">
                Videos generated with ArthaNova see 4x higher engagement on LinkedIn compared to text-based posts.
              </p>
            </div>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {library.map((item) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-3xl border border-slate-200 overflow-hidden group border-b-4 hover:border-b-blue-500 transition-all hover:shadow-xl"
            >
              <div className="aspect-video relative overflow-hidden">
                <img src={item.thumbnail} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" alt={item.title} />
                <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center">
                    <Play className="w-6 h-6 text-white fill-white" />
                  </div>
                </div>
              </div>
              <div className="p-6">
                <div className="flex justify-between items-center mb-3">
                  <span className={clsx(
                    "px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider",
                    item.status === 'Completed' ? "bg-green-50 text-green-600" : "bg-orange-50 text-orange-600 animate-pulse"
                  )}>
                    {item.status}
                  </span>
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">{item.date}</span>
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-6">{item.title}</h3>
                <div className="flex items-center space-x-2">
                  <button className="flex-1 py-2 bg-slate-50 hover:bg-slate-100 rounded-xl text-xs font-bold text-slate-600 flex items-center justify-center space-x-2 transition-colors">
                    <Download className="w-4 h-4" />
                    <span>Download</span>
                  </button>
                  <button className="p-2 bg-slate-50 hover:bg-slate-100 rounded-xl text-slate-600 transition-colors">
                    <Share2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </DashboardLayout>
  );
}
