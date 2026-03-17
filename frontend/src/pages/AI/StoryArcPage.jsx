import React from 'react';
import { motion } from 'framer-motion';
import { Network, History, Share2, TrendingUp, AlertCircle, ChevronRight, Activity, Target, Zap } from 'lucide-react';
import { clsx } from 'clsx';
import DashboardLayout from '../../layouts/DashboardLayout';
import Button from '../../components/ui/Button';

const timelineEvents = [
  { date: 'Oct 2025', title: 'Initial Concept Leak', desc: 'First reports of NVIDIA\'s next-gen Blackwell architecture surfacing from supply chain partners.', status: 'past' },
  { date: 'Dec 2025', title: 'Policy Shift', desc: 'EU AI Act updates specific requirements for massive compute clusters.', status: 'past' },
  { date: 'Feb 2026', title: 'Production Kickoff', desc: 'TSMC confirms capacity allocation for custom silicon orders.', status: 'past' },
  { date: 'Present', title: 'Global Rollout', desc: 'Primary synthesis of today\'s news showing immediate market adoption.', status: 'current' },
  { date: 'June 2026', title: 'Predicted Impact', desc: 'AI synthesis points to a significant shift in cloud provider margins.', status: 'future' },
];

export default function StoryArcPage() {
  return (
    <DashboardLayout>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
        <div>
          <h1 className="text-3xl font-bold font-outfit text-slate-900 leading-tight">Story Arc Intelligence</h1>
          <p className="text-slate-500 font-medium">Visualizing the evolution and causal chain of complex market narratives.</p>
        </div>
        <div className="flex items-center space-x-3">
           <div className="px-4 py-2 bg-blue-50 text-blue-600 rounded-full text-[10px] font-bold uppercase tracking-widest border border-blue-100 flex items-center">
             <Activity className="w-4 h-4 mr-2" />
             Live Tracking
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Timeline View */}
        <div className="lg:col-span-8 flex flex-col space-y-10">
          <div className="bg-white rounded-[40px] border border-slate-100 p-12 shadow-sm relative overflow-hidden">
            <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none">
               <History className="w-64 h-64" />
            </div>
            
            <h2 className="text-xl font-bold text-slate-900 mb-12 flex items-center font-outfit uppercase tracking-widest text-xs relative z-10">
               Market Logic Chain
            </h2>
            
            <div className="relative pb-10 z-10">
              <div className="absolute left-[39px] top-0 bottom-10 w-[2px] bg-slate-50" />
              
              <div className="space-y-16">
                {timelineEvents.map((event, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: idx * 0.1 }}
                    className="relative flex items-start space-x-10 group"
                  >
                    <div className={clsx(
                      "w-20 h-20 rounded-[24px] flex-shrink-0 flex items-center justify-center border-4 border-white shadow-xl z-20 transition-all group-hover:scale-110",
                      event.status === 'past' ? "bg-slate-50 text-slate-400" : 
                      event.status === 'current' ? "bg-blue-600 text-white shadow-blue-500/40" : 
                      "bg-white text-blue-400 border-blue-50"
                    )}>
                      <span className="text-[10px] font-bold uppercase tracking-tighter leading-tight text-center">
                        {event.date.split(' ').map((s, i) => <div key={i}>{s}</div>)}
                      </span>
                    </div>

                    <div className={clsx(
                      "flex-1 p-8 rounded-[32px] border transition-all duration-300",
                      event.status === 'current' ? "bg-blue-50 border-blue-200 shadow-inner" : "bg-white border-slate-50 hover:border-blue-200 hover:shadow-lg hover:shadow-slate-100"
                    )}>
                      <h3 className="text-lg font-bold text-slate-900 mb-3 font-outfit">{event.title}</h3>
                      <p className="text-sm text-slate-500 leading-relaxed font-medium">{event.desc}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
          
          <div className="bg-slate-900 rounded-[40px] p-12 text-white relative overflow-hidden shadow-2xl group">
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-600/10 blur-[120px] -mr-48 -mb-48 group-hover:bg-blue-600/20 transition-all" />
            <h3 className="text-2xl font-bold mb-6 flex items-center font-outfit">
              <Target className="w-6 h-6 mr-3 text-blue-400" />
              Strategic Causal Loop
            </h3>
            <p className="text-slate-400 text-lg leading-relaxed max-w-3xl font-medium">
              Our AI model identifies a **72.4% probability** of a secondary ripple effect in the Sovereign AI sector by Q4. Historically, such technical decoupling precedes a surge in regional hardware demand.
            </p>
          </div>
        </div>

        {/* Intelligence Sidebar */}
        <div className="lg:col-span-4 space-y-8">
          <div className="bg-white rounded-[40px] border border-slate-100 p-10 shadow-sm">
            <h3 className="text-lg font-bold text-slate-900 mb-10 flex items-center font-outfit uppercase tracking-widest text-xs">
              <Network className="w-5 h-5 mr-3 text-blue-600" />
              Entity Connectivity
            </h3>
            <div className="space-y-8">
              {[
                { name: 'NVDA', score: 'Strong', color: 'bg-green-500', val: 92 },
                { name: 'TSM', score: 'Critical', color: 'bg-blue-600', val: 88 },
                { name: 'ASML', score: 'Emerging', color: 'bg-indigo-500', val: 65 },
                { name: 'ARM', score: 'Neutral', color: 'bg-slate-400', val: 51 }
              ].map(entity => (
                <div key={entity.name} className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-bold text-slate-900 font-outfit uppercase tracking-wider">{entity.name}</span>
                    <span className={clsx("text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-lg", entity.color.replace('bg', 'text'), entity.color.replace('bg', 'bg').concat('/10'))}>
                       {entity.score}
                    </span>
                  </div>
                  <div className="h-2 w-full bg-slate-50 rounded-full overflow-hidden shadow-inner">
                    <motion.div 
                      initial={{ width: 0 }}
                      whileInView={{ width: `${entity.val}%` }}
                      viewport={{ once: true }}
                      className={clsx("h-full rounded-full shadow-lg", entity.color)}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-orange-50 rounded-[32px] border border-orange-100 p-8 shadow-sm relative overflow-hidden">
             <div className="absolute -top-4 -right-4 w-24 h-24 bg-orange-100/50 rounded-full blur-2xl" />
             <div className="flex items-center space-x-3 text-orange-600 mb-4 relative z-10">
               <AlertCircle className="w-5 h-5" />
               <span className="text-[10px] font-bold uppercase tracking-[0.2em]">Contrarian Signal</span>
             </div>
             <p className="text-sm text-orange-900 leading-relaxed italic font-medium relative z-10">
               "While consensus anticipates indefinite growth, our deep data nodes suggest 'AI Fatigue' in enterprise POCs may slow acquisition by late 2026."
             </p>
          </div>

          <Button variant="outline" className="w-full h-14 rounded-2xl font-bold uppercase tracking-widest text-[10px]">
            <Share2 className="w-4 h-4 mr-2" />
            Export Intel Arc
          </Button>
        </div>
      </div>
    </DashboardLayout>
  );
}
