import React from 'react';
import { motion } from 'framer-motion';
import { Bookmark, Search, Clock, ChevronRight, Share2, Trash2 } from 'lucide-react';
import DashboardLayout from '../../layouts/DashboardLayout';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';

const savedItems = [
  { id: 1, title: 'The Semiconductor Decoupling', category: 'Technology', date: 'Saved 2 days ago' },
  { id: 2, title: 'EU Data Sovereignty Impact', category: 'Politics', date: 'Saved 3 days ago' },
  { id: 3, title: 'Retail Fiduciary Landscape', category: 'Finance', date: 'Saved 1 week ago' },
];

export default function SavedPage() {
  return (
    <DashboardLayout>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
        <div>
          <h1 className="text-3xl font-bold font-outfit text-slate-900 leading-tight">Saved Intelligence</h1>
          <p className="text-slate-500 font-medium">Your curated collection of market narratives and deep analyses.</p>
        </div>
        <div className="px-4 py-2 bg-blue-50 text-blue-600 rounded-full text-[10px] font-bold uppercase tracking-widest border border-blue-100">
           {savedItems.length} Archived Arcs
        </div>
      </div>

      <div className="bg-white rounded-[40px] border border-slate-200 p-10 shadow-sm min-h-[600px]">
        <div className="relative mb-10">
          <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <Input placeholder="Search your archive..." className="pl-14 h-14 bg-slate-50 border-none shadow-inner" />
        </div>

        <div className="space-y-6">
          {savedItems.map((item, idx) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="group p-8 bg-white border border-slate-100 rounded-[32px] flex flex-col md:flex-row items-center justify-between gap-6 hover:border-blue-200 hover:shadow-xl hover:shadow-slate-100 transition-all cursor-pointer"
            >
              <div className="flex items-center space-x-6">
                 <div className="w-16 h-16 bg-slate-50 rounded-[22px] flex items-center justify-center border border-slate-100 group-hover:bg-blue-50 transition-colors">
                    <Bookmark className="w-6 h-6 text-slate-400 group-hover:text-blue-600" />
                 </div>
                 <div>
                    <div className="flex items-center space-x-3 mb-1">
                       <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md uppercase tracking-widest">
                          {item.category}
                       </span>
                       <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center">
                          <Clock className="w-3 h-3 mr-1" /> {item.date}
                       </span>
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 font-outfit group-hover:text-blue-600 transition-colors">
                       {item.title}
                    </h3>
                 </div>
              </div>
              
              <div className="flex items-center space-x-2">
                 <button className="p-3 text-slate-400 hover:text-slate-900 transition-colors">
                    <Share2 className="w-5 h-5" />
                 </button>
                 <button className="p-3 text-slate-400 hover:text-red-500 transition-colors">
                    <Trash2 className="w-5 h-5" />
                 </button>
                 <div className="ml-4 w-12 h-12 bg-slate-900 text-white rounded-2xl flex items-center justify-center group-hover:bg-blue-600 transition-all">
                    <ChevronRight className="w-5 h-5" />
                 </div>
              </div>
            </motion.div>
          ))}

          {savedItems.length === 0 && (
             <div className="py-20 text-center">
                <Bookmark className="w-16 h-16 text-slate-200 mx-auto mb-6" />
                <p className="text-slate-500 font-medium">No saved stories yet.</p>
             </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
