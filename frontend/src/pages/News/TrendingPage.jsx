import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, ArrowUpRight, ArrowDownRight, Activity, Filter, Share2, Target, Zap } from 'lucide-react';
import DashboardLayout from '../../layouts/DashboardLayout';
import Button from '../../components/ui/Button';
import { clsx } from 'clsx';

const trendingEntities = [
  { name: 'NVIDIA', symbol: 'NVDA', volume: 'High', sentiment: 82, trend: '+12.4%', status: 'up' },
  { name: 'Tesla', symbol: 'TSLA', volume: 'Medium', sentiment: 45, trend: '-2.1%', status: 'down' },
  { name: 'Supermicro', symbol: 'SMCI', volume: 'High', sentiment: 71, trend: '+5.8%', status: 'up' },
  { name: 'Microsoft', symbol: 'MSFT', volume: 'Steady', sentiment: 64, trend: '+0.5%', status: 'up' },
  { name: 'Apple', symbol: 'AAPL', volume: 'Steady', sentiment: 49, trend: '-0.8%', status: 'down' }
];

export default function TrendingPage() {
  return (
    <DashboardLayout>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6">
        <div>
          <h1 className="text-3xl font-bold font-outfit text-slate-900 leading-tight">Market Intelligence Pulse</h1>
          <p className="text-slate-500 font-medium">Real-time sentiment velocity and trending narrative clusters.</p>
        </div>
        <div className="flex items-center space-x-3">
          <Button variant="outline" size="sm" className="rounded-2xl">
            <Filter className="w-4 h-4 mr-2" />
            Segment Analysis
          </Button>
          <Button size="sm" className="rounded-2xl shadow-lg shadow-blue-100">
            <Share2 className="w-4 h-4 mr-2" />
            Export Intelligence
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Sentiment Heatmap */}
        <div className="lg:col-span-8 space-y-10">
          <div className="bg-white rounded-[40px] border border-slate-100 p-10 shadow-sm relative overflow-hidden">
            <div className="flex flex-col md:flex-row items-center justify-between mb-12 gap-4">
              <h2 className="text-xl font-bold text-slate-900 flex items-center font-outfit uppercase tracking-widest text-xs">
                <Activity className="w-5 h-5 mr-3 text-red-500" />
                Sector Sentiment Velocity
              </h2>
              <div className="flex items-center space-x-3 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 bg-slate-50 px-4 py-2 rounded-full">
                <span>Bearish</span>
                <div className="w-24 h-1.5 bg-gradient-to-r from-red-400 via-slate-200 to-green-400 rounded-full" />
                <span>Bullish</span>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {[
                { label: 'Technology', val: 'Bullish', level: 85, color: 'bg-green-500' },
                { label: 'Finance', val: 'Neutral', level: 52, color: 'bg-slate-400' },
                { label: 'Energy', val: 'Bearish', level: 24, color: 'bg-red-500' },
                { label: 'Healthcare', val: 'Bullish', level: 68, color: 'bg-green-500' },
                { label: 'Retail', val: 'Neutral', level: 45, color: 'bg-slate-400' },
                { label: 'Auto', val: 'Bearish', level: 31, color: 'bg-red-500' },
                { label: 'Crypto', val: 'Bullish', level: 92, color: 'bg-green-500' },
                { label: 'Infrastructure', val: 'Neutral', level: 58, color: 'bg-slate-400' },
              ].map((item, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: idx * 0.05 }}
                  className="aspect-square rounded-[32px] border border-slate-50 bg-slate-50/30 p-6 flex flex-col justify-between transition-all hover:bg-white hover:shadow-xl hover:shadow-slate-200/50 cursor-pointer group"
                >
                  <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400 group-hover:text-slate-900 transition-colors">{item.label}</span>
                  <div className="space-y-2">
                    <span className="block text-sm font-bold text-slate-900 font-outfit">{item.val}</span>
                    <div className="h-1 w-full bg-slate-200 rounded-full overflow-hidden">
                      <div className={clsx("h-full transition-all duration-1000", item.color)} style={{ width: `${item.level}%` }} />
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-[40px] border border-slate-100 overflow-hidden shadow-sm">
            <div className="p-10 border-b border-slate-50">
              <h3 className="text-xl font-bold text-slate-900 font-outfit uppercase tracking-widest text-xs">Trending Intelligence Arcs</h3>
            </div>
            <div className="divide-y divide-slate-50">
              {[
                { title: "Sovereign AI Infrastructure", mentions: "1.2k+", reach: "Worldwide", velocity: "Fast", trend: "up" },
                { title: "Digital Rupee Expansion", mentions: "840", reach: "Regional", velocity: "Medium", trend: "steady" },
                { title: "Post-Quantum Cryptography", mentions: "320", reach: "Niche", velocity: "Fast", trend: "up" }
              ].map((arc, idx) => (
                <div key={idx} className="p-8 flex items-center justify-between hover:bg-slate-50 transition-all cursor-pointer group">
                  <div className="flex items-center space-x-6">
                    <div className="w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-400 font-bold font-outfit group-hover:bg-slate-900 group-hover:text-white transition-all shadow-sm">
                      {idx + 1}
                    </div>
                    <div>
                      <h4 className="text-lg font-bold text-slate-900 group-hover:text-blue-600 transition-colors font-outfit">{arc.title}</h4>
                      <div className="flex items-center space-x-3 mt-1">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{arc.mentions} signals</span>
                        <span className="w-1 h-1 bg-slate-300 rounded-full" />
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{arc.reach}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-10">
                    <div className="text-right hidden md:block">
                      <p className="text-[10px] font-bold uppercase text-slate-400 tracking-[0.2em] mb-1">Velocity</p>
                      <div className="flex items-center justify-end space-x-2">
                        <div className={clsx(
                          "w-2 h-2 rounded-full",
                          arc.velocity === 'Fast' ? 'bg-green-500 animate-pulse' : 'bg-yellow-500'
                        )} />
                        <p className="text-xs font-bold text-slate-900">{arc.velocity}</p>
                      </div>
                    </div>
                    <Button variant="ghost" className="h-12 w-12 p-0 rounded-2xl bg-slate-50 hover:bg-blue-600 hover:text-white transition-all">
                      <ArrowUpRight className="w-5 h-5" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Hot Symbols Sidebar */}
        <div className="lg:col-span-4 space-y-8">
          <div className="bg-slate-900 rounded-[48px] p-10 text-white shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/10 blur-[100px] -mr-32 -mt-32" />
            <h3 className="text-lg font-bold mb-10 flex items-center text-blue-400 font-outfit uppercase tracking-widest text-xs">
              <Target className="w-5 h-5 mr-3" />
              Hot Market Symbols
            </h3>
            <div className="space-y-6">
              {trendingEntities.map((entity) => (
                <div key={entity.symbol} className="flex items-center justify-between p-5 rounded-[24px] bg-white/5 border border-white/10 hover:bg-white/10 transition-all cursor-pointer group">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 rounded-2xl bg-blue-600/20 flex items-center justify-center font-bold text-blue-400 font-outfit text-lg">
                      {entity.symbol[0]}
                    </div>
                    <div>
                      <p className="text-base font-bold leading-tight font-outfit">{entity.symbol}</p>
                      <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-0.5">{entity.name}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={clsx("text-sm font-bold flex items-center justify-end font-outfit", entity.status === 'up' ? 'text-green-400' : 'text-red-400')}>
                      {entity.status === 'up' ? <ArrowUpRight className="w-4 h-4 mr-1" /> : <ArrowDownRight className="w-4 h-4 mr-1" />}
                      {entity.trend}
                    </p>
                    <div className="flex items-center justify-end space-x-1.5 mt-1">
                      <div className="h-1 w-8 bg-white/10 rounded-full overflow-hidden">
                        <div className="h-full bg-blue-500" style={{ width: `${entity.sentiment}%` }} />
                      </div>
                      <span className="text-[9px] text-slate-500 font-bold uppercase tracking-tighter">{entity.sentiment}%</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <Button className="w-full mt-10 bg-white text-slate-900 hover:bg-slate-100 border-none h-12 rounded-2xl font-bold uppercase tracking-widest text-[10px]" size="sm">
              Synchronize All Symbols
            </Button>
          </div>

          <div className="premium-card p-10 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:scale-110 transition-transform">
              <Zap className="w-24 h-24 text-yellow-500" fill="currentColor" />
            </div>
            <div className="flex items-center space-x-3 text-yellow-500 mb-6 px-1">
              <Zap className="w-5 h-5" fill="currentColor" />
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-900">A1 Market Logic</span>
            </div>
            <p className="text-sm text-slate-500 leading-relaxed font-medium">
              "Sentiment clusters suggest a breakout for energy-sector narratives as grid infrastructure becomes a primary bottleneck for global AI sovereign cloud expansion."
            </p>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
