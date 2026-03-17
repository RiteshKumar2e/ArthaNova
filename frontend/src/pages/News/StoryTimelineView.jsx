import React from 'react';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, 
  Clock, 
  TrendingUp, 
  TrendingDown, 
  Zap, 
  ShieldCheck, 
  ChevronRight,
  Share2,
  Bookmark
} from 'lucide-react';
import { Link, useParams } from 'react-router-dom';
import DashboardLayout from '../../layouts/DashboardLayout';
import Button from '../../components/ui/Button';

const timelineEvents = [
  {
    date: 'March 16, 2026',
    time: '14:20 GMT',
    title: 'Initial Signal: Supply Chain Diversification',
    description: 'Reports emerging from Southeast Asian manufacturing hubs indicate a massive shift in custom AI silicon production schedules.',
    sentiment: 'positive',
    impact: 'High'
  },
  {
    date: 'March 17, 2026',
    time: '09:00 GMT',
    title: 'NVIDIA Confirmation',
    description: 'NVIDIA CEO hints at localized LLM infrastructure during tech summit. Markets react with 4% rally in related sovereign cloud stocks.',
    sentiment: 'positive',
    impact: 'Critical'
  },
  {
    date: 'March 17, 2026',
    time: '16:45 GMT',
    title: 'EU Policy Friction',
    description: 'Draft regulations leaked from Brussels suggest localized data residency requirements for US-based frontier models.',
    sentiment: 'negative',
    impact: 'Medium'
  }
];

export default function StoryTimelineView() {
  const { id } = useParams();

  return (
    <DashboardLayout>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
        <div className="flex items-center space-x-4">
          <Link to="/feed" className="p-2 bg-white rounded-2xl border border-slate-200 text-slate-400 hover:text-slate-900 transition-all shadow-sm">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-3xl font-bold font-outfit text-slate-900 leading-tight">Story Arc Analysis</h1>
            <p className="text-slate-500 font-medium">Tracing the narrative evolution of ArthaNova Case ID #{id || '842'}</p>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <Button variant="outline" size="sm">
            <Share2 className="w-4 h-4 mr-2" />
            Share Intelligence
          </Button>
          <Button size="sm">
            <Bookmark className="w-4 h-4 mr-2" />
            Watch Arc
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Left: Timeline */}
        <div className="lg:col-span-8">
           <div className="bg-white rounded-[40px] border border-slate-100 p-10 shadow-sm relative overflow-hidden">
              <div className="absolute top-0 right-0 p-10 opacity-5">
                 <Clock className="w-40 h-40" />
              </div>
              
              <h2 className="text-xl font-bold text-slate-900 mb-12 flex items-center font-outfit uppercase tracking-widest text-xs">
                 Narrative Evolution
              </h2>

              <div className="analysis-timeline">
                 {timelineEvents.map((event, idx) => (
                    <motion.div 
                      key={idx}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.2 }}
                      className="relative pb-12 last:pb-0"
                    >
                       <div className="timeline-dot" />
                       <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                          <div className="flex items-center space-x-3">
                             <div className="px-3 py-1 bg-slate-100 text-slate-500 rounded-lg text-[9px] font-bold uppercase tracking-widest">
                                {event.date}
                             </div>
                             <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{event.time}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                             {event.sentiment === 'positive' ? (
                                <TrendingUp className="w-4 h-4 text-green-500" />
                             ) : (
                                <TrendingDown className="w-4 h-4 text-red-500" />
                             )}
                             <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500">{event.impact} Impact</span>
                          </div>
                       </div>
                       
                       <div className="logic-map-node">
                          <h3 className="text-lg font-bold text-slate-900 mb-3 font-outfit">{event.title}</h3>
                          <p className="text-sm text-slate-500 leading-relaxed font-medium">
                             {event.description}
                          </p>
                       </div>
                    </motion.div>
                 ))}
              </div>
           </div>
        </div>

        {/* Right: Summary & Predictions */}
        <div className="lg:col-span-4 space-y-8">
           <div className="bg-slate-900 rounded-[40px] p-10 text-white relative overflow-hidden shadow-2xl">
              <div className="absolute top-0 right-0 w-64 h-64 bg-yellow-500/10 blur-[100px] -mr-20 -mt-20" />
              <div className="flex items-center space-x-3 mb-6">
                 <Zap className="w-5 h-5 text-yellow-500" fill="currentColor" />
                 <h2 className="text-xl font-bold font-outfit uppercase tracking-widest text-xs">AI Prediction</h2>
              </div>
              <p className="text-slate-400 text-sm mb-8 leading-relaxed font-medium">
                 The decoupling of hardware from cycles suggests a secondary boom in **Localized Edge Computing** by Q4 2026.
              </p>
              <div className="p-5 bg-white/5 rounded-2xl border border-white/10 mb-6">
                 <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">Confidence Score</p>
                 <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold font-outfit">87.4%</span>
                    <div className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center">
                       <ShieldCheck className="w-6 h-6 text-green-400" />
                    </div>
                 </div>
              </div>
              <Button className="w-full bg-blue-600 hover:bg-blue-500 border-none">
                 Simulate Market Ripple
              </Button>
           </div>

           <div className="premium-card p-10 relative overflow-hidden group">
              <div className="absolute bottom-0 right-0 p-8 transform group-hover:scale-110 transition-transform opacity-10">
                 <Zap className="w-24 h-24" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-6 font-outfit uppercase tracking-widest text-xs">Related Narratives</h3>
              <div className="space-y-4">
                 {['Sovereign Cloud Boom', 'Custom Silicon Backlog', 'EU Data Sovereignty'].map(story => (
                    <div key={story} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100 cursor-pointer hover:border-blue-400 transition-all">
                       <span className="text-sm font-bold text-slate-900">{story}</span>
                       <ChevronRight className="w-4 h-4 text-slate-300" />
                    </div>
                 ))}
              </div>
           </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
