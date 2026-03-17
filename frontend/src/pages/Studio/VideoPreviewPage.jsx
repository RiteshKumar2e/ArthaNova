import React from 'react';
import { motion } from 'framer-motion';
import { 
  Play, 
  ArrowLeft, 
  Download, 
  Share2, 
  Sparkles, 
  CheckCircle2, 
  Clock,
  Maximize2,
  MoreHorizontal,
  Youtube,
  Linkedin,
  Twitter
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import DashboardLayout from '../../layouts/DashboardLayout';
import Button from '../../components/ui/Button';

export default function VideoPreviewPage() {
  const navigate = useNavigate();

  return (
    <DashboardLayout>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
        <div className="flex items-center space-x-4">
          <button 
            onClick={() => navigate(-1)} 
            className="p-2 bg-white rounded-2xl border border-slate-200 text-slate-400 hover:text-slate-900 transition-all shadow-sm"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-3xl font-bold font-outfit text-slate-900 leading-tight">Review Media</h1>
            <p className="text-slate-500 font-medium">Finalizing your AI-generated intelligence brief.</p>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <Button variant="outline" className="rounded-2xl">
            <MoreHorizontal className="w-4 h-4" />
          </Button>
          <Button className="rounded-2xl bg-slate-900 text-white hover:bg-slate-800">
            <Download className="w-4 h-4 mr-2" />
            Download 4K
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Video Player Area */}
        <div className="lg:col-span-12 xl:col-span-7">
           <div className="bg-slate-900 rounded-[48px] aspect-video relative overflow-hidden group shadow-[0_40px_100px_rgba(0,0,0,0.2)]">
              {/* Fake Video Cover */}
              <div className="absolute inset-0 bg-gradient-to-br from-slate-800 to-slate-950" />
              
              {/* Playback Controls Overlay */}
              <div className="absolute inset-0 flex items-center justify-center">
                 <motion.button 
                   whileHover={{ scale: 1.1 }}
                   whileTap={{ scale: 0.95 }}
                   className="w-24 h-24 bg-blue-600 text-white rounded-full flex items-center justify-center shadow-2xl shadow-blue-500/50 relative z-10"
                 >
                    <Play className="w-10 h-10 fill-white ml-1" />
                 </motion.button>
              </div>

              {/* Bottom Bar */}
              <div className="absolute bottom-0 left-0 right-0 p-8 flex items-center justify-between z-10">
                 <div className="flex items-center space-x-6">
                    <div className="flex items-center space-x-2 text-white/60 text-xs font-bold font-outfit uppercase tracking-widest">
                       <Clock className="w-4 h-4" />
                       <span>00:45 / 00:45</span>
                    </div>
                    <div className="h-1.5 w-48 bg-white/20 rounded-full overflow-hidden">
                       <div className="h-full bg-blue-500 w-full" />
                    </div>
                 </div>
                 <button className="text-white hover:text-blue-400 transition-colors">
                    <Maximize2 className="w-5 h-5" />
                 </button>
              </div>
           </div>

           <div className="mt-10 flex flex-wrap gap-4">
              <Button className="bg-blue-600 hover:bg-blue-500 h-14 px-8 rounded-2xl flex-1 flex items-center justify-center">
                 <Youtube className="w-5 h-5 mr-3" />
                 Publish to YouTube
              </Button>
              <Button className="bg-[#0077b5] hover:bg-[#006097] h-14 px-8 rounded-2xl flex-1 flex items-center justify-center">
                 <Linkedin className="w-5 h-5 mr-3" />
                 Share on LinkedIn
              </Button>
              <Button className="bg-slate-900 h-14 px-8 rounded-2xl flex-1 flex items-center justify-center">
                 <Twitter className="w-5 h-5 mr-3" />
                 Post to X
              </Button>
           </div>
        </div>

        {/* Sidebar Info */}
        <div className="lg:col-span-12 xl:col-span-5 space-y-8">
           <div className="bg-white rounded-[40px] border border-slate-100 p-10 shadow-sm relative overflow-hidden">
              <div className="flex items-center space-x-3 text-green-600 mb-8">
                 <CheckCircle2 className="w-6 h-6" />
                 <span className="text-[10px] font-bold uppercase tracking-[0.2em]">Generation Successful</span>
              </div>
              
              <h3 className="text-2xl font-bold font-outfit text-slate-900 mb-6">NVIDIA Blackwell Analysis</h3>
              <div className="space-y-6">
                 <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Original Script</p>
                    <p className="text-sm text-slate-600 leading-relaxed font-medium">
                       "The decoupling of hardware from traditional cycles is reaching a tipping point..."
                    </p>
                 </div>
                 <div className="grid grid-cols-2 gap-4 pt-6 border-t border-slate-50">
                    <div>
                       <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Resolution</p>
                       <p className="text-sm font-bold text-slate-900">4K (2160p)</p>
                    </div>
                    <div>
                       <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Duration</p>
                       <p className="text-sm font-bold text-slate-900">0:45s</p>
                    </div>
                 </div>
              </div>
           </div>

           <div className="bg-blue-600 rounded-[40px] p-10 text-white relative overflow-hidden shadow-2xl group">
              <div className="absolute top-0 right-0 p-8 transform group-hover:scale-110 transition-transform opacity-10">
                 <Sparkles className="w-24 h-24" />
              </div>
              <h4 className="text-xl font-bold font-outfit mb-4">Multi-format Export</h4>
              <p className="text-blue-100 text-sm leading-relaxed mb-8 font-medium">
                 Our AI can automatically resize this intelligence brief for Instagram Reels and TikTok with optimized subtitles.
              </p>
              <Button className="w-full bg-white text-blue-600 hover:bg-slate-50 border-none h-12 rounded-xl text-[10px] font-bold uppercase tracking-widest">
                 Create Social Variants
              </Button>
           </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
