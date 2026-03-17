import React from 'react';
import { motion } from 'framer-motion';
import { 
  User, 
  Mail, 
  MapPin, 
  Zap, 
  Settings, 
  Edit3, 
  Clock,
  ChevronRight,
  Shield
} from 'lucide-react';
import DashboardLayout from '../../layouts/DashboardLayout';
import Button from '../../components/ui/Button';

const RECENT_ACTIVITY = [
  { action: 'Synthesized', target: 'EU Semiconductor Policy', time: '2h ago' },
  { action: 'Saved', target: 'ASML Q3 Prediction Map', time: 'Yesterday' },
  { action: 'Shared', target: 'Localized LLM Report', time: '3 days ago' },
];

export default function ProfilePage() {
  return (
    <DashboardLayout>
      <div className="profile-hero">
        <div className="profile-hero__bg" />
        <div className="profile-hero__content">
          <div className="profile-avatar-wrap">
            <div className="profile-avatar">AJ</div>
            <button className="profile-avatar-edit" aria-label="Edit avatar">
               <Edit3 size={18} />
            </button>
          </div>
          
          <div className="profile-info">
            <h1>Anmol Jain</h1>
            <div className="profile-meta-list">
              <span className="profile-meta-item"><User size={16} /> Investor Persona</span>
              <span className="profile-meta-item"><MapPin size={16} /> San Francisco, CA</span>
              <span className="profile-meta-item"><Mail size={16} /> anmol@arthanova.ai</span>
            </div>
            <div style={{ display: 'flex', gap: '12px' }}>
              <Button size="sm">Edit Profile</Button>
              <Button variant="outline" size="sm">Public View</Button>
            </div>
          </div>
        </div>
      </div>

      <div className="profile-grid-main">
        {/* Left: Intelligence Profile */}
        <aside>
          <div className="intelligence-profile">
            <h3>Intelligence Profile</h3>
            
            <div className="intel-stat-group">
              <div className="intel-stat-header">
                <span>Signal Accuracy</span>
                <span>94%</span>
              </div>
              <div className="intel-progress-bar">
                <motion.div 
                  className="intel-progress-fill" 
                  initial={{ width: 0 }}
                  animate={{ width: '94%' }}
                  transition={{ duration: 1, delay: 0.5 }}
                />
              </div>
            </div>

            <div className="intel-stat-group">
              <div className="intel-stat-header">
                <span>Market Reach</span>
                <span>82%</span>
              </div>
              <div className="intel-progress-bar">
                <motion.div 
                  className="intel-progress-fill" 
                  initial={{ width: 0 }}
                  animate={{ width: '82%' }}
                  transition={{ duration: 1, delay: 0.7 }}
                />
              </div>
            </div>

            <div className="intel-counters">
              <div>
                <div className="intel-counter-val">1,412</div>
                <div className="intel-counter-lbl">Signals</div>
              </div>
              <div>
                <div className="intel-counter-val">14</div>
                <div className="intel-counter-lbl">Watchlists</div>
              </div>
            </div>
          </div>
        </aside>

        {/* Right: Activity & Quick Settings */}
        <div style={{ display: 'flex', flex_direction: 'column', gap: '32px' }}>
          <div className="card">
            <h3 className="dash-section-title" style={{ display: 'flex', alignItems: 'center' }}>
               <Clock size={18} style={{ marginRight: '12px', color: 'var(--clr-accent)' }} />
               Recent Activity
            </h3>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {RECENT_ACTIVITY.map((item, i) => (
                <div key={i} className="activity-item" style={{ borderRadius: 'var(--r-md)', border: '1px solid var(--clr-border)', background: '#fff' }}>
                  <div className="activity-icon">
                    <Zap size={16} fill="currentColor" />
                  </div>
                  <div className="activity-info">
                    <h4>{item.action} <span style={{ color: 'var(--clr-accent)' }}>{item.target}</span></h4>
                    <p>{item.time}</p>
                  </div>
                  <ChevronRight size={14} style={{ color: '#cbd5e1' }} />
                </div>
              ))}
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
            <div className="setting-card">
              <Settings className="setting-card-icon" size={32} />
              <h4>Profile Settings</h4>
              <p>Manage your personal information and profile visibility.</p>
            </div>
            <div className="setting-card">
              <Shield className="setting-card-icon" size={32} />
              <h4>Security & Privacy</h4>
              <p>2FA, session management, and data privacy controls.</p>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
