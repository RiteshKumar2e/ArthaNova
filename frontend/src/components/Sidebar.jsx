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
  LayoutDashboard
} from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

import BrandLogo from './ui/BrandLogo';

const MENU_ITEMS = [
  { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
  { icon: BarChart3, label: 'Intelligence Feed', path: '/feed' },
  { icon: Zap, label: 'AI Briefings', path: '/briefings' },
  { icon: TrendingUp, label: 'Market Pulse', path: '/trending' },
  { icon: Video, label: 'AI Video Studio', path: '/studio' },
  { icon: Languages, label: 'Vernacular Engine', path: '/vernacular' },
  { icon: Network, label: 'Story Arc Tracker', path: '/story-arc' },
  { icon: Bookmark, label: 'Saved Stories', path: '/saved' },
];

export default function Sidebar() {
  const location = useLocation();

  return (
    <aside className="sidebar-container">
      {/* Brand */}
      <div style={{ padding: '28px 20px 24px' }}>
        <BrandLogo variant="dark" size={18} />
      </div>

      <div style={{ padding: '0 0 20px', flex: 1, display: 'flex', flexDirection: 'column' }}>
        <p className="sidebar-section-label" style={{ 
          fontSize: '0.6rem', 
          fontWeight: 800, 
          letterSpacing: '0.12em', 
          color: '#cbd5e1', 
          padding: '12px 20px 8px',
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          <span style={{ width: '4px', height: '4px', background: '#60a5fa', borderRadius: '50%' }}></span>
          INTELLIGENCE CONSOLE
        </p>
        
        {/* Navigation */}
        <nav style={{ padding: '0 10px', display: 'flex', flexDirection: 'column', gap: '2px' }}>
          {MENU_ITEMS.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`nav-item ${isActive ? 'nav-item-active' : ''}`}
              >
                <item.icon size={18} />
                <span>{item.label}</span>
                {isActive && (
                  <motion.div 
                    layoutId="active-pill"
                    style={{ marginLeft: 'auto', width: '4px', height: '4px', background: '#60a5fa', borderRadius: '50%', boxShadow: '0 0 8px #60a5fa' }}
                  />
                )}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Footer Settings */}
      <div style={{ padding: '16px 12px', borderTop: '1px solid var(--clr-border)', display: 'flex', flexDirection: 'column', gap: '4px' }}>
        <Link
          to="/settings"
          className={`nav-item ${location.pathname === '/settings' ? 'nav-item-active' : ''}`}
        >
          <Settings size={18} />
          <span>Settings</span>
        </Link>
        <button className="nav-item" style={{ color: 'var(--clr-danger)' }}>
          <LogOut size={18} />
          <span>Log Out</span>
        </button>
      </div>
    </aside>
  );
}
