import React from 'react';
import { motion } from 'framer-motion';
import { 
  User, 
  Mail, 
  MapPin, 
  Building2, 
  Zap, 
  Settings, 
  Edit3, 
  Clock,
  ChevronRight,
  Shield
} from 'lucide-react';
import DashboardLayout from '../../layouts/DashboardLayout';
import Button from '../../components/ui/Button';

export default function ProfilePage() {
  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto py-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Header Card */}
          <div className="lg:col-span-12">
             <div className="bg-white rounded-[40px] border border-slate-100 p-10 shadow-sm relative overflow-hidden">
                <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/5 blur-[100px] -mr-48 -mt-48" />
                <div className="relative z-10 flex flex-col md:flex-row items-center md:items-start gap-10">
                   <div className="relative">
                      <div className="w-32 h-32 bg-slate-900 rounded-[40px] flex items-center justify-center text-white text-4xl font-bold font-outfit shadow-2xl">
                         AJ
                      </div>
                      <button className="absolute -bottom-2 -right-2 p-2 bg-blue-600 text-white rounded-xl shadow-lg hover:bg-blue-500 transition-colors">
                         <Edit3 className="w-4 h-4" />
                      </button>
                   </div>
                   <div className="flex-1 text-center md:text-left">
                      <h1 className="text-4xl font-bold text-slate-900 font-outfit mb-3">Anmol Jain</h1>
                      <div className="flex flex-wrap justify-center md:justify-start gap-4 text-slate-500 text-sm font-medium">
                         <span className="flex items-center"><User className="w-4 h-4 mr-1.5" /> Investor Persona</span>
                         <span className="flex items-center"><MapPin className="w-4 h-4 mr-1.5" /> San Francisco, CA</span>
                         <span className="flex items-center"><Mail className="w-4 h-4 mr-1.5" /> anmol@arthanova.ai</span>
                      </div>
                      <div className="mt-8 flex flex-wrap justify-center md:justify-start gap-3">
                         <Button size="sm">Edit Profile</Button>
                         <Button variant="outline" size="sm">Public View</Button>
                      </div>
                   </div>
                </div>
             </div>
          </div>

          {/* Left: Persona & Stats */}
          <div className="lg:col-span-4 space-y-8">
             <div className="bg-slate-900 rounded-[40px] p-10 text-white shadow-2xl">
                <h3 className="text-lg font-bold font-outfit mb-6 uppercase tracking-widest text-[10px] text-blue-400">Intelligence Profile</h3>
                <div className="space-y-6">
                   <div>
                      <div className="flex justify-between items-center mb-2">
                         <span className="text-sm font-bold">Signal Accuracy</span>
                         <span className="text-blue-400 font-bold">94%</span>
                      </div>
                      <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                         <div className="h-full bg-blue-500 w-[94%]" />
                      </div>
                   </div>
                   <div>
                      <div className="flex justify-between items-center mb-2">
                         <span className="text-sm font-bold">Market Reach</span>
                         <span className="text-blue-400 font-bold">82%</span>
                      </div>
                      <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                         <div className="h-full bg-blue-500 w-[82%]" />
                      </div>
                   </div>
                </div>
                <div className="mt-10 pt-10 border-t border-white/5 grid grid-cols-2 gap-4">
                   <div className="text-center">
                      <p className="text-2xl font-bold font-outfit">1,412</p>
                      <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-1">Signals</p>
                   </div>
                   <div className="text-center">
                      <p className="text-2xl font-bold font-outfit">14</p>
                      <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-1">Watchlists</p>
                   </div>
                </div>
             </div>
          </div>

          {/* Right: History & Settings */}
          <div className="lg:col-span-8 space-y-8">
             <div className="bg-white rounded-[40px] border border-slate-100 p-10 shadow-sm">
                <h3 className="text-lg font-bold text-slate-900 mb-8 font-outfit flex items-center">
                   <Clock className="w-5 h-5 mr-3 text-blue-600" />
                   Recent Activity
                </h3>
                <div className="space-y-6">
                   {[
                      { action: 'Synthesized', target: 'EU Semiconductor Policy', time: '2h ago' },
                      { action: 'Saved', target: 'ASML Q3 Prediction Map', time: 'Yesterday' },
                      { action: 'Shared', target: 'Localized LLM Report', time: '3 days ago' },
                   ].map((item, i) => (
                      <div key={i} className="flex items-center justify-between p-5 bg-slate-50 rounded-2xl border border-slate-100 hover:border-blue-200 transition-all cursor-pointer group">
                         <div className="flex items-center space-x-4">
                            <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm">
                               <Zap className="w-4 h-4 text-yellow-500" fill="currentColor" />
                            </div>
                            <div>
                               <p className="text-sm font-bold text-slate-900">{item.action} <span className="text-blue-600">{item.target}</span></p>
                               <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{item.time}</p>
                            </div>
                         </div>
                         <ChevronRight className="w-4 h-4 text-slate-300 group-hover:translate-x-1 transition-transform" />
                      </div>
                   ))}
                </div>
             </div>

             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-8 bg-white rounded-[32px] border border-slate-100 shadow-sm hover:border-blue-400 transition-all cursor-pointer">
                   <Settings className="w-8 h-8 text-slate-400 mb-4" />
                   <h4 className="text-base font-bold text-slate-900 mb-2">Profile Settings</h4>
                   <p className="text-xs text-slate-500 leading-relaxed font-medium">Manage your personal information and profile visibility.</p>
                </div>
                <div className="p-8 bg-white rounded-[32px] border border-slate-100 shadow-sm hover:border-blue-400 transition-all cursor-pointer">
                   <Shield className="w-8 h-8 text-slate-400 mb-4" />
                   <h4 className="text-base font-bold text-slate-900 mb-2">Security & Privacy</h4>
                   <p className="text-xs text-slate-500 leading-relaxed font-medium">2FA, session management, and data privacy controls.</p>
                </div>
             </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
