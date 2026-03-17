import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, Users, Zap, Bell, ChevronRight, Play, ArrowUpRight, BarChart3, Target } from 'lucide-react';
import DashboardLayout from '../../layouts/DashboardLayout';
import Button from '../../components/ui/Button';
import useNewsStore from '../../store/newsStore';
import { Link } from 'react-router-dom';
import { clsx } from 'clsx';

export default function DashboardPage() {
  const { feed, fetchFeed } = useNewsStore();

  useEffect(() => {
    fetchFeed();
  }, [fetchFeed]);

  const stats = [
    { label: 'Intelligence Score', value: '842', change: '+12%', icon: Zap, color: 'text-yellow-500', bg: 'bg-yellow-50' },
    { label: 'Active Story Arcs', value: '14', change: '+2', icon: TrendingUp, color: 'text-blue-500', bg: 'bg-blue-50' },
    { label: 'Network Reach', value: '1.2k', change: '+142', icon: Users, color: 'text-green-500', bg: 'bg-green-50' },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-10">
        {/* Welcome Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold font-outfit text-slate-900 leading-tight">Welcome back, Anmol</h1>
            <p className="text-slate-500 font-medium">Here's your intelligence summary for March 17, 2026.</p>
          </div>
          <div className="flex items-center space-x-3">
             <Button variant="outline" size="sm" className="hidden sm:flex">
                <Bell className="w-4 h-4 mr-2" />
                Notifications
             </Button>
             <Link to="/briefings">
               <Button size="sm">
                  <Zap className="w-4 h-4 mr-2" />
                  Daily Briefing
               </Button>
             </Link>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="stats-grid">
          {stats.map((stat, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="stat-card"
            >
              <div className="flex justify-between items-start mb-4">
                <div className={clsx("p-3 rounded-2xl", stat.bg)}>
                  <stat.icon className={clsx("w-6 h-6", stat.color)} />
                </div>
                <span className="text-[10px] font-bold text-green-600 bg-green-50 px-2 py-1 rounded-lg flex items-center">
                  <ArrowUpRight className="w-3 h-3 mr-1" />
                  {stat.change}
                </span>
              </div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">{stat.label}</p>
              <p className="text-3xl font-bold text-slate-900 font-outfit">{stat.value}</p>
            </motion.div>
          ))}
        </div>

        {/* Main Dashboard Content */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Priority Feed */}
          <div className="lg:col-span-8 space-y-6">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-xl font-bold text-slate-900 font-outfit">Priority Intelligence</h2>
              <Link to="/feed" className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center group uppercase tracking-widest">
                Deep Feed <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
            
            <div className="space-y-4">
              {feed.slice(0, 3).map((item) => (
                <Link key={item.id} to={`/analysis/${item.id}`} className="block">
                  <div className="news-card group">
                    <div className="flex justify-between items-start mb-3">
                      <span className="px-3 py-1 bg-slate-100 text-slate-600 text-[10px] font-bold uppercase tracking-wider rounded-lg">
                        {item.category}
                      </span>
                      <span className="text-[10px] font-bold text-blue-600 uppercase tracking-widest">8.4 Impact</span>
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-blue-600 transition-colors font-outfit">{item.title}</h3>
                    <p className="text-sm text-slate-500 leading-relaxed line-clamp-2 font-medium">{item.summary}</p>
                  </div>
                </Link>
              ))}
            </div>

            {/* AI Studio Quick Access */}
            <div className="bg-slate-900 rounded-[40px] p-10 text-white relative overflow-hidden shadow-2xl">
               <div className="absolute top-0 right-0 w-80 h-80 bg-blue-600/20 blur-[100px] -mr-40 -mt-40" />
               <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
                  <div className="max-w-md">
                     <h3 className="text-3xl font-bold font-outfit mb-4">AI Video Studio</h3>
                     <p className="text-slate-400 text-sm leading-relaxed mb-8 font-medium">
                        Automatically transform your top business stories into engaging short-form videos for LinkedIn and Twitter.
                     </p>
                     <Link to="/studio">
                        <Button className="bg-blue-600 hover:bg-blue-500 border-none shadow-lg shadow-blue-900/40">
                           <Play className="w-4 h-4 mr-2 fill-white" />
                           Create New Video
                        </Button>
                     </Link>
                  </div>
                  <div className="w-full md:w-64 aspect-video bg-white/5 rounded-3xl border border-white/10 flex items-center justify-center group cursor-pointer">
                     <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                        <Play className="w-6 h-6 text-white fill-white" />
                     </div>
                  </div>
               </div>
            </div>
          </div>

          {/* Persona Insights Sidebar */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-white rounded-[32px] border border-slate-200 p-8 shadow-sm">
               <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center font-outfit">
                  <Target className="w-5 h-5 mr-3 text-blue-600" />
                  Investor Focus
               </h3>
               <div className="space-y-6">
                  <div>
                     <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">Narrative Strength</p>
                     <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                        <div className="h-full bg-blue-600 w-[84%]" />
                     </div>
                  </div>
                  <div className="pt-6 border-t border-slate-50">
                     <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4">Hot Commodities</p>
                     <div className="flex flex-wrap gap-2">
                        {['AI Chips', 'Sovereign Cloud', 'Neo-Banking', 'Green Steel'].map(tag => (
                           <span key={tag} className="px-3 py-1 bg-slate-50 text-slate-600 rounded-xl text-[10px] font-bold border border-slate-100 uppercase tracking-widest">
                             {tag}
                           </span>
                        ))}
                     </div>
                  </div>
               </div>
            </div>

            <div className="bg-blue-600 rounded-[32px] p-8 text-white relative overflow-hidden group">
               <div className="absolute bottom-0 right-0 p-4 opacity-20 group-hover:scale-110 transition-transform">
                  <BarChart3 className="w-24 h-24" />
               </div>
               <h3 className="text-lg font-bold mb-2 font-outfit">Predictive Logic</h3>
               <p className="text-blue-100 text-xs leading-relaxed mb-6 font-medium">
                  Based on your current portfolio, our AI predicts a secondary ripple effect in the European Fintech sector by early Q3.
               </p>
               <Button variant="ghost" size="sm" className="text-white border-white/20 hover:bg-white/10 w-full font-bold uppercase tracking-widest text-[10px]">
                  View Detail Map
               </Button>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
