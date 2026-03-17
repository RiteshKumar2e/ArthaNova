import React from 'react';
import { motion } from 'framer-motion';
import { 
  Plus, 
  Search, 
  Filter, 
  Play, 
  MoreHorizontal, 
  Share2, 
  Download, 
  Trash2,
  Clock,
  LayoutGrid,
  List as ListIcon
} from 'lucide-react';
import { Link } from 'react-router-dom';
import DashboardLayout from '../../layouts/DashboardLayout';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';

const libraryVideos = [
  { id: 1, title: 'Semiconductor Narrative', date: '2 hours ago', duration: '0:45', size: '12MB', thumbnail: 'AI Tech' },
  { id: 2, title: 'EU Policy Impact', date: 'Yesterday', duration: '1:12', size: '24MB', thumbnail: 'Politics' },
  { id: 3, title: 'Market Correlation Map', date: 'Mar 15, 2026', duration: '0:30', size: '8MB', thumbnail: 'Finance' },
  { id: 4, title: 'Sovereign Cloud Boom', date: 'Mar 12, 2026', duration: '1:00', size: '18MB', thumbnail: 'Infrastructure' },
];

export default function VideoLibraryPage() {
  return (
    <DashboardLayout>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
        <div>
          <h1 className="text-3xl font-bold font-outfit text-slate-900 leading-tight">Video Library</h1>
          <p className="text-slate-500 font-medium">Manage and share your AI-generated intelligences.</p>
        </div>
        <Link to="/studio">
          <Button size="lg" className="shadow-lg shadow-blue-200">
            <Plus className="w-5 h-5 mr-2" />
            Create New
          </Button>
        </Link>
      </div>

      <div className="bg-white rounded-[40px] border border-slate-200 p-10 shadow-sm">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-10">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 font-bold" />
            <Input placeholder="Search library..." className="pl-12 bg-slate-50 border-none h-14" />
          </div>
          <div className="flex items-center space-x-2 bg-slate-50 p-1.5 rounded-2xl">
             <button className="p-2.5 bg-white shadow-sm rounded-xl text-slate-900 transition-all">
                <LayoutGrid className="w-5 h-5" />
             </button>
             <button className="p-2.5 text-slate-400 hover:text-slate-600 transition-all">
                <ListIcon className="w-5 h-5" />
             </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-8">
          {libraryVideos.map((video, idx) => (
            <motion.div
              key={video.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="group"
            >
              <div className="relative aspect-[9/16] rounded-[40px] bg-slate-100 overflow-hidden mb-5 border-4 border-white shadow-sm transition-all group-hover:shadow-2xl group-hover:shadow-slate-200 group-hover:-translate-y-2">
                 {/* Fake Thumbnail */}
                 <div className="absolute inset-0 bg-gradient-to-br from-slate-200 to-slate-300 flex items-center justify-center">
                    <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center border border-white/30 text-white font-bold text-xs uppercase tracking-widest text-center px-2">
                       {video.thumbnail}
                    </div>
                 </div>
                 
                 <div className="absolute top-4 right-4 p-2 bg-black/20 backdrop-blur-md rounded-xl text-white opacity-0 group-hover:opacity-100 transition-opacity">
                    <MoreHorizontal className="w-5 h-5 cursor-pointer" />
                 </div>
                 
                 <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center">
                    <button className="w-14 h-14 bg-white rounded-full flex items-center justify-center scale-90 group-hover:scale-100 transition-transform shadow-xl">
                       <Play className="w-6 h-6 text-slate-900 fill-slate-900" />
                    </button>
                 </div>
                 
                 <div className="absolute bottom-5 left-5 px-3 py-1 bg-black/40 backdrop-blur-md rounded-lg text-white text-[10px] font-bold">
                    {video.duration}
                 </div>
              </div>
              
              <div className="px-2">
                 <h3 className="text-base font-bold text-slate-900 mb-1 group-hover:text-blue-600 transition-colors truncate font-outfit">
                    {video.title}
                 </h3>
                 <div className="flex items-center text-[10px] font-bold text-slate-400 uppercase tracking-widest space-x-3">
                    <span className="flex items-center"><Clock className="w-3 h-3 mr-1" /> {video.date}</span>
                    <span>{video.size}</span>
                 </div>
                 
                 <div className="flex items-center space-x-1 mt-4 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button className="p-2 text-slate-400 hover:text-blue-600 transition-colors"><Share2 className="w-4 h-4" /></button>
                    <button className="p-2 text-slate-400 hover:text-blue-600 transition-colors"><Download className="w-4 h-4" /></button>
                    <button className="p-2 text-slate-400 hover:text-red-600 transition-colors"><Trash2 className="w-4 h-4" /></button>
                 </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}
