import React from 'react';
import { 
  Bell, 
  Shield, 
  Eye, 
  Smartphone, 
  Globe, 
  Zap,
  ArrowLeft,
  ChevronRight,
  Database,
  Cloud
} from 'lucide-react';
import { Link } from 'react-router-dom';
import DashboardLayout from '../../layouts/DashboardLayout';
import Button from '../../components/ui/Button';

export default function SettingsPage() {
  const sections = [
    {
      title: 'Notifications',
      items: [
        { label: 'Intelligence Alerts', sub: 'Real-time push notifications for high impact signals', icon: Bell, active: true },
        { label: 'Weekly Synthesis', sub: 'Monday morning executive briefing email', icon: Zap, active: false }
      ]
    },
    {
      title: 'Privacy & Security',
      items: [
        { label: 'Two-Factor Authentication', sub: 'Secure your ArthaNova account with 2FA', icon: Shield, active: true },
        { label: 'Data Processing Mode', sub: 'Control how AI analyzes your linked interests', icon: Database, active: true }
      ]
    },
    {
      title: 'Regional & Vernacular',
      items: [
        { label: 'Primary Language', sub: 'Currently set to English (Global)', icon: Globe, active: true },
        { label: 'Region Affinity', sub: 'Prioritize North American & EU tech corridors', icon: Cloud, active: true }
      ]
    }
  ];

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto py-10">
        <div className="flex items-center space-x-4 mb-12">
          <Link to="/profile" className="p-2 bg-white rounded-2xl border border-slate-200 text-slate-400 hover:text-slate-900 transition-all shadow-sm">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-3xl font-bold font-outfit text-slate-900 leading-tight">Control Center</h1>
            <p className="text-slate-500 font-medium">Manage your ArthaNova intelligence settings & privacy.</p>
          </div>
        </div>

        <div className="space-y-12">
          {sections.map((section, idx) => (
            <div key={idx} className="space-y-6">
              <h2 className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] px-2">{section.title}</h2>
              <div className="bg-white rounded-[40px] border border-slate-100 overflow-hidden shadow-sm">
                {section.items.map((item, i) => (
                  <div key={i} className="flex items-center justify-between p-8 hover:bg-slate-50 transition-colors border-b last:border-none border-slate-50 group cursor-pointer">
                    <div className="flex items-center space-x-6">
                       <div className="w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-400 group-hover:text-blue-600 transition-colors">
                          <item.icon className="w-6 h-6" />
                       </div>
                       <div>
                          <p className="text-sm font-bold text-slate-900 mb-1">{item.label}</p>
                          <p className="text-[11px] text-slate-400 font-medium">{item.sub}</p>
                       </div>
                    </div>
                    <div className="flex items-center space-x-6">
                       <div className={`w-12 h-6 rounded-full transition-colors relative ${item.active ? 'bg-blue-600' : 'bg-slate-200'}`}>
                          <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${item.active ? 'left-7' : 'left-1'}`} />
                       </div>
                       <ChevronRight className="w-4 h-4 text-slate-300" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}

          <div className="pt-10 flex justify-between items-center text-[10px] font-bold text-slate-400 uppercase tracking-widest px-4">
             <span>v2.4.0 • Enterprise Build</span>
             <button className="text-red-500 hover:text-red-600">Deactivate Account</button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
