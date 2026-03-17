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
      <div className="page-header-area">
        <div className="page-header-text">
          <h1 className="page-title">Saved Intelligence</h1>
          <p className="page-subtitle">Your curated collection of market narratives and deep analyses.</p>
        </div>
        <div className="page-header-actions">
           <div className="status-chip status-chip--neutral">
             {savedItems.length} Archived Arcs
          </div>
        </div>
      </div>

      <div className="saved-container">
        <div className="saved-search-wrap">
          <Search className="saved-search-icon" />
          <input 
            placeholder="Search your archive..." 
            className="saved-search-input"
          />
        </div>

        <div className="saved-list">
          {savedItems.map((item, idx) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="saved-item group"
            >
              <div className="saved-item-left">
                 <div className="saved-item-icon-box">
                    <Bookmark size={20} />
                 </div>
                 <div className="saved-item-content">
                    <div className="saved-item-meta">
                       <span className="saved-item-category">
                          {item.category}
                       </span>
                       <span className="saved-item-date">
                          <Clock size={12} /> {item.date}
                       </span>
                    </div>
                    <h3 className="saved-item-title">
                       {item.title}
                    </h3>
                 </div>
              </div>
              
              <div className="saved-item-actions">
                 <button className="saved-btn-circle" title="Share Link">
                    <Share2 size={18} />
                 </button>
                 <button className="saved-btn-circle saved-btn-danger" title="Remove from Archive">
                    <Trash2 size={18} />
                 </button>
                 <div className="saved-btn-chevron">
                    <ChevronRight size={20} />
                 </div>
              </div>
            </motion.div>
          ))}

          {savedItems.length === 0 && (
             <div className="saved-empty-state">
                <Bookmark size={48} className="saved-empty-icon" />
                <p className="saved-empty-text">No saved stories in your archive yet.</p>
             </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
