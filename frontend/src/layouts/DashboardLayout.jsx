import React from 'react';
import { motion } from 'framer-motion';
import { Search, Bell, User } from 'lucide-react';
import Sidebar from '../components/Sidebar';

export default function DashboardLayout({ children }) {
  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar Component */}
      <Sidebar />

      {/* Main Content */}
      <main className="dashboard-main flex-1 overflow-y-auto">
        {/* Top Navbar */}
        <header className="navbar-blur">
          <div className="flex-1 max-w-xl relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input 
              placeholder="Search intelligence (⌘K)" 
              className="w-full bg-slate-50 border-none rounded-2xl py-2.5 pl-12 pr-4 text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all"
            />
          </div>

          <div className="flex items-center space-x-6 ml-auto">
            <button className="p-2.5 bg-slate-50 border border-slate-100 rounded-2xl text-slate-500 hover:text-slate-900 transition-all relative">
              <Bell className="w-5 h-5" />
              <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white" />
            </button>
            <div className="flex items-center space-x-4 pl-6 border-l border-slate-100 cursor-pointer group">
              <div className="text-right">
                <p className="text-sm font-bold text-slate-900 leading-none mb-1">Anmol</p>
                <p className="text-[10px] font-bold text-blue-600 uppercase tracking-widest">Investor</p>
              </div>
              <div className="w-11 h-11 bg-slate-100 rounded-2xl flex items-center justify-center border border-slate-200 group-hover:border-blue-400 transition-colors">
                <User className="w-5 h-5 text-slate-400" />
              </div>
            </div>
          </div>
        </header>

        {/* Dynamic Page Content */}
        <div className="content-container">
          {children}
        </div>
      </main>
    </div>
  );
}
