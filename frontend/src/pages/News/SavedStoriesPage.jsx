import React from 'react';
import { motion } from 'framer-motion';
import { Bookmark, Trash2, Share2, ArrowRight, Zap, Globe } from 'lucide-react';
import DashboardLayout from '../../layouts/DashboardLayout';
import Button from '../../components/ui/Button';

const savedStories = [
  {
    id: 1,
    title: "The Ethics of Generative AI: Global Policy Shift",
    source: "Intelligence Hub",
    time: "Saved 2 days ago",
    summary: "EU regulators propose new transparency requirements for foundational models. This could delay releases by 6-8 months.",
    category: "Policy",
  },
  {
    id: 2,
    title: "SpaceX Starship: Towards a Multi-Planetary Economy",
    source: "Astro Economy",
    time: "Saved 5 days ago",
    summary: "New flight data suggests payload costs could drop below $100/kg by 2030, opening markets for orbital manufacturing.",
    category: "Space",
  },
];

export default function SavedStoriesPage() {
  return (
    <DashboardLayout>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
        <div>
          <h1 className="text-3xl font-bold font-outfit text-slate-900 leading-tight">Intelligence Vault</h1>
          <p className="text-slate-500 font-medium">Your curated laboratory of market signals and deep analysis.</p>
        </div>
        <Link to="/feed">
          <Button size="sm" variant="outline" className="rounded-2xl">
            Explore Feed
          </Button>
        </Link>
      </div>

      <div className="space-y-8">
        {savedStories.map((story, idx) => (
          <motion.div
            key={story.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="bg-white rounded-[40px] border border-slate-100 p-10 hover:border-blue-200 hover:shadow-2xl hover:shadow-slate-200/50 transition-all group"
          >
            <div className="flex justify-between items-start mb-6">
              <div className="flex items-center space-x-4">
                <span className="px-4 py-1.5 bg-slate-50 border border-slate-100 text-slate-900 text-[10px] font-bold uppercase tracking-widest rounded-xl">
                  {story.category}
                </span>
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{story.time}</span>
              </div>
              <div className="flex items-center space-x-2">
                <button className="p-3 bg-red-50 text-red-400 hover:text-red-600 rounded-2xl transition-all">
                  <Trash2 className="w-5 h-5" />
                </button>
                <button className="p-3 bg-slate-50 text-slate-400 hover:text-slate-900 rounded-2xl transition-all">
                  <Share2 className="w-5 h-5" />
                </button>
              </div>
            </div>

            <h2 className="text-3xl font-bold text-slate-900 mb-4 group-hover:text-blue-600 transition-colors cursor-pointer font-outfit leading-tight tracking-tight">
              {story.title}
            </h2>
            <p className="text-slate-500 text-base leading-relaxed mb-10 max-w-4xl font-medium">
              {story.summary}
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-between pt-10 border-t border-slate-50 gap-6">
              <div className="flex items-center space-x-4 w-full sm:w-auto">
                <Button variant="ghost" size="sm" className="flex-1 sm:flex-none h-11 px-6 rounded-2xl bg-slate-50 border border-slate-100">
                  <Zap className="w-4 h-4 mr-2 text-yellow-500" fill="currentColor" />
                  AI Synthesis
                </Button>
                <Button variant="ghost" size="sm" className="flex-1 sm:flex-none h-11 px-6 rounded-2xl bg-slate-50 border border-slate-100">
                  <Globe className="w-4 h-4 mr-2 text-blue-500" />
                  Vernacular
                </Button>
              </div>
              <Button size="sm" className="w-full sm:w-auto h-11 px-8 rounded-2xl shadow-lg shadow-blue-100 group">
                Deep Dive <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </div>
          </motion.div>
        ))}

        {savedStories.length === 0 && (
          <div className="text-center py-32 bg-white rounded-[48px] border-2 border-dashed border-slate-100">
            <div className="w-20 h-20 bg-slate-50 rounded-[32px] flex items-center justify-center mx-auto mb-6">
               <Bookmark className="w-10 h-10 text-slate-200" />
            </div>
            <h3 className="text-2xl font-bold text-slate-900 mb-2 font-outfit">Intelligence Vault Empty</h3>
            <p className="text-slate-400 max-w-sm mx-auto font-medium">
              Signals you curate will synchronize here for cross-model study and archival synthesis.
            </p>
            <Link to="/feed" className="inline-block mt-8">
               <Button variant="outline" className="rounded-2xl px-8 h-12">Begin Feed Curation</Button>
            </Link>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
