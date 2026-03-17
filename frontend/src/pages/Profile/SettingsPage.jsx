import React from 'react';
import { 
  Bell, 
  Shield, 
  Eye, 
  Smartphone, 
  Globe, 
  Zap,
  ArrowLeft,
  ChevronRight,
  Database,
  Cloud
} from 'lucide-react';
import { Link } from 'react-router-dom';
import DashboardLayout from '../../layouts/DashboardLayout';

export default function SettingsPage() {
  const sections = [
    {
      title: 'Notifications',
      items: [
        { label: 'Intelligence Alerts', sub: 'Real-time push notifications for high impact signals', icon: Bell, active: true },
        { label: 'Weekly Synthesis', sub: 'Monday morning executive briefing email', icon: Zap, active: false }
      ]
    },
    {
      title: 'Privacy & Security',
      items: [
        { label: 'Two-Factor Authentication', sub: 'Secure your ArthaNova account with 2FA', icon: Shield, active: true },
        { label: 'Data Processing Mode', sub: 'Control how AI analyzes your linked interests', icon: Database, active: true }
      ]
    },
    {
      title: 'Regional & Vernacular',
      items: [
        { label: 'Primary Language', sub: 'Currently set to English (Global)', icon: Globe, active: true },
        { label: 'Region Affinity', sub: 'Prioritize North American & EU tech corridors', icon: Cloud, active: true }
      ]
    }
  ];

  return (
    <DashboardLayout>
      <div className="settings-container">
        <div className="page-header-area">
          <div className="flex items-center gap-6">
            <Link to="/profile" className="back-btn-box">
              <ArrowLeft size={20} />
            </Link>
            <div className="page-header-text">
              <h1 className="page-title">Control Center</h1>
              <p className="page-subtitle">Manage your ArthaNova intelligence settings & privacy.</p>
            </div>
          </div>
        </div>

        <div className="settings-sections">
          {sections.map((section, idx) => (
            <div key={idx} className="settings-section">
              <h2 className="settings-section-label">{section.title}</h2>
              <div className="settings-card-group">
                {section.items.map((item, i) => (
                  <div key={i} className="settings-row group">
                    <div className="settings-row-left">
                       <div className="settings-icon-box">
                          <item.icon size={22} />
                       </div>
                       <div className="settings-row-text">
                          <p className="settings-item-label">{item.label}</p>
                          <p className="settings-item-sub">{item.sub}</p>
                       </div>
                    </div>
                    <div className="settings-row-right">
                       <div className={`settings-toggle ${item.active ? 'is-active' : ''}`}>
                          <div className="toggle-thumb" />
                       </div>
                       <ChevronRight size={16} className="settings-chevron" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="settings-footer">
           <span className="build-tag">v2.4.0 • Enterprise Build</span>
           <button className="deactivate-btn">Deactivate Account</button>
        </div>
      </div>
    </DashboardLayout>
  );
}
