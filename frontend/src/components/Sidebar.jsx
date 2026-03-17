import React from 'react';
import { motion } from 'framer-motion';
import { 
  BarChart3, 
  Zap, 
  Video, 
  Languages, 
  TrendingUp, 
  Network, 
  Bookmark, 
  Settings, 
  LogOut,
  LayoutDashboard,
  Bell
} from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { clsx } from 'clsx';

const menuItems = [
  { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
  { icon: BarChart3, label: 'Intelligence Feed', path: '/feed' },
  { icon: Zap, label: 'AI Briefings', path: '/briefings' },
  { icon: TrendingUp, label: 'Market Pulse', path: '/trending' },
  { icon: Video, label: 'AI Video Studio', path: '/studio' },
  { icon: Languages, label: 'Vernacular Engine', path: '/vernacular' },
  { icon: Network, label: 'Story Arc Tracker', path: '/story-arc' },
  { icon: Bookmark, label: 'Saved Stories', path: '/saved' },
  { icon: Zap, label: 'Subscription', path: '/subscription' },
];

export default function Sidebar() {
  const location = useLocation();

  return (
    <div className="w-72 h-screen fixed left-0 top-0 bg-white border-r border-slate-100 flex flex-col z-50">
      {/* Brand */}
      <div className="p-8">
        <Link to="/" className="flex items-center space-x-2">
          <div className="w-10 h-10 bg-slate-900 rounded-xl flex items-center justify-center">
            <Zap className="w-6 h-6 text-blue-400" fill="currentColor" />
          </div>
          <span className="text-2xl font-bold font-outfit tracking-tighter text-slate-900">
            ArthaNova
          </span>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-4 space-y-1 overflow-y-auto custom-scrollbar">
        {menuItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={clsx(
              "flex items-center space-x-3 px-4 py-3.5 rounded-2xl transition-all group",
              location.pathname === item.path 
                ? "bg-slate-900 text-white shadow-lg shadow-slate-200" 
                : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
            )}
          >
            <item.icon className={clsx(
              "w-5 h-5",
              location.pathname === item.path ? "text-blue-400" : "text-slate-400 group-hover:text-slate-600"
            )} />
            <span className="font-bold text-sm">{item.label}</span>
            {location.pathname === item.path && (
              <motion.div 
                layoutId="active-pill"
                className="ml-auto w-1.5 h-1.5 bg-blue-400 rounded-full"
              />
            )}
          </Link>
        ))}
      </nav>

      {/* Footer Settings */}
      <div className="p-4 border-t border-slate-50 space-y-2">
        <Link
          to="/settings"
          className={clsx(
            "flex items-center space-x-3 px-4 py-3 rounded-2xl transition-all",
            location.pathname === '/settings' ? "bg-slate-100 text-slate-900" : "text-slate-500 hover:bg-slate-50"
          )}
        >
          <Settings className="w-5 h-5" />
          <span className="font-bold text-sm">Settings</span>
        </Link>
        <button className="w-full flex items-center space-x-3 px-4 py-3 rounded-2xl text-red-500 hover:bg-red-50 transition-all">
          <LogOut className="w-5 h-5" />
          <span className="font-bold text-sm">Log Out</span>
        </button>
      </div>
    </div>
  );
}
