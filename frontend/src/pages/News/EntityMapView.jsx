import React from 'react';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, 
  Globe, 
  Target, 
  Cpu, 
  Shield, 
  Building2, 
  ChevronRight,
  Maximize2,
  Filter
} from 'lucide-react';
import { clsx } from 'clsx';
import { Link } from 'react-router-dom';
import DashboardLayout from '../../layouts/DashboardLayout';
import Button from '../../components/ui/Button';

const entities = [
  { id: 'nvda', name: 'NVIDIA', type: 'Technology', connection: 'Primary Source', strength: '98%', color: 'blue' },
  { id: 'tsmc', name: 'TSMC', type: 'Manufacturing', connection: 'Supply Node', strength: '92%', color: 'indigo' },
  { id: 'eu', name: 'EU Commission', type: 'Regulatory', connection: 'Policy Valve', strength: '74%', color: 'red' },
  { id: 'asml', name: 'ASML', type: 'Hardware', connection: 'Tier 2 Support', strength: '81%', color: 'blue' },
];

export default function EntityMapView() {
  return (
    <DashboardLayout>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
        <div className="flex items-center space-x-4">
          <Link to="/dashboard" className="p-2 bg-white rounded-2xl border border-slate-200 text-slate-400 hover:text-slate-900 transition-all shadow-sm">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-3xl font-bold font-outfit text-slate-900 leading-tight">Entity Influence Map</h1>
            <p className="text-slate-500 font-medium">Mapping global market nodes & intelligence connections.</p>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <Button variant="outline" size="sm" className="rounded-xl">
            <Filter className="w-4 h-4 mr-2" />
            Filter Nodes
          </Button>
          <Button size="sm" className="rounded-xl">
            <Maximize2 className="w-4 h-4 mr-2" />
            V-Perspective
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Main Canvas */}
        <div className="lg:col-span-8 bg-slate-900 rounded-[48px] h-[600px] relative overflow-hidden shadow-2xl border-[12px] border-slate-800 group">
           <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-blue-900/20 via-slate-900 to-slate-950" />
           
           {/* Grid Pattern Overlay */}
           <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(#3b82f6 1px, transparent 1px)', backgroundSize: '40px 40px' }} />

           {/* Fake Nodes Positioning */}
           <motion.div 
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="absolute inset-0"
           >
              {/* Central Node */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                 <div className="w-32 h-32 bg-blue-600 rounded-full flex items-center justify-center shadow-[0_0_80px_rgba(59,130,246,0.5)] border-4 border-blue-400 group/node cursor-pointer hover:scale-110 transition-transform">
                    <Cpu className="w-12 h-12 text-white" />
                    <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 text-white font-bold font-outfit uppercase tracking-widest text-[10px] whitespace-nowrap">
                       Custom AI Silicon
                    </div>
                 </div>
              </div>

              {/* Orbital Nodes */}
              <div className="absolute top-1/4 left-1/4">
                 <div className="w-20 h-20 bg-slate-800 rounded-full border-2 border-slate-700 flex items-center justify-center hover:border-blue-500 transition-all cursor-pointer group/node">
                    <Building2 className="w-8 h-8 text-slate-400 group-hover/node:text-blue-400" />
                    <div className="absolute -top-8 left-1/2 -translate-x-1/2 text-slate-500 font-bold uppercase tracking-widest text-[8px] whitespace-nowrap">
                       TSMC Node
                    </div>
                 </div>
              </div>

              <div className="absolute bottom-1/4 right-1/4">
                 <div className="w-24 h-24 bg-red-900/20 rounded-full border-2 border-red-900/50 flex items-center justify-center hover:border-red-500 transition-all cursor-pointer group/node">
                    <Shield className="w-10 h-10 text-red-500" />
                    <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 text-red-500 font-bold uppercase tracking-widest text-[8px] whitespace-nowrap">
                       Regulatory Firewall
                    </div>
                 </div>
              </div>
           </motion.div>

           {/* HUD UI */}
           <div className="absolute top-10 left-10 p-6 bg-white/5 backdrop-blur-xl rounded-[32px] border border-white/10 text-white shadow-2xl">
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Active Intelligence Nodes</p>
              <p className="text-2xl font-bold font-outfit">1,412 Connections</p>
           </div>

           <div className="absolute bottom-10 right-10 flex space-x-3">
              <div className="px-6 py-3 bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 text-white text-[10px] font-bold uppercase tracking-widest">
                 Sovereign AI Focus
              </div>
              <div className="px-6 py-3 bg-blue-600 rounded-2xl text-white text-[10px] font-bold uppercase tracking-widest animate-pulse shadow-lg shadow-blue-600/50">
                 Live Feedback
              </div>
           </div>
        </div>

        {/* Sidebar Info */}
        <div className="lg:col-span-4 space-y-8">
           <div className="bg-white rounded-[40px] border border-slate-100 p-10 shadow-sm">
              <h3 className="text-lg font-bold text-slate-900 mb-8 flex items-center font-outfit uppercase tracking-widest text-xs">
                 Node Breakdown
              </h3>
              <div className="space-y-6">
                 {entities.map(entity => (
                    <div key={entity.id} className="p-5 bg-slate-50 rounded-[24px] border border-slate-100 flex items-center justify-between hover:border-blue-400 transition-all cursor-pointer group">
                       <div className="flex items-center space-x-4">
                          <div className={clsx(
                             "w-12 h-12 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110",
                             entity.color === 'blue' ? "bg-blue-50 text-blue-600" : 
                             entity.color === 'indigo' ? "bg-indigo-50 text-indigo-600" : "bg-red-50 text-red-600"
                          )}>
                             <Target className="w-6 h-6" />
                          </div>
                          <div>
                             <p className="text-sm font-bold text-slate-900 font-outfit">{entity.name}</p>
                             <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{entity.type}</p>
                          </div>
                       </div>
                       <div className="text-right">
                          <p className="text-xs font-bold text-slate-900">{entity.strength}</p>
                          <p className="text-[8px] text-slate-400 font-bold uppercase tracking-widest">Strength</p>
                       </div>
                    </div>
                 ))}
              </div>
              <Button variant="ghost" className="w-full h-14 mt-8 text-blue-600 hover:bg-blue-50 rounded-2xl font-bold uppercase tracking-widest text-[10px]">
                 Explore Hidden Nodes <ChevronRight className="w-4 h-4 ml-2" />
              </Button>
           </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
