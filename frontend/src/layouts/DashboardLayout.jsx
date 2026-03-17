import React from 'react';
import { motion } from 'framer-motion';
import { Search, Bell, User } from 'lucide-react';
import Sidebar from '../components/Sidebar';

export default function DashboardLayout({ children }) {
  return (
    <div style={{ display: 'flex', height: '100vh', overflow: 'hidden' }}>
      {/* Sidebar Component */}
      <Sidebar />

      {/* Main Content */}
      <main className="dashboard-main" style={{ flex: 1, overflowY: 'auto' }}>
        {/* Top Navbar */}
        <header className="navbar-blur">
          <div style={{ flex: 1, maxWidth: '560px', position: 'relative' }}>
            <div className="auth-input-wrap">
              <span className="auth-input-icon"><Search size={16} /></span>
              <input 
                placeholder="Search intelligence (⌘K)" 
                className="auth-input"
                style={{ height: '40px', borderRadius: '12px', fontSize: '0.8125rem', background: 'var(--clr-bg-soft)', border: 'none' }}
              />
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '24px', marginLeft: 'auto' }}>
            <button 
              className="btn-outline" 
              style={{ width: '40px', height: '40px', padding: 0, borderRadius: '12px', background: 'var(--clr-bg-soft)', border: 'none', position: 'relative' }}
            >
              <Bell size={18} />
              <span style={{ position: 'absolute', top: '10px', right: '10px', width: '8px', height: '8px', background: 'var(--clr-danger)', borderRadius: '50%', border: '2px solid #fff' }} />
            </button>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', paddingLeft: '24px', borderLeft: '1px solid var(--clr-border)', cursor: 'pointer' }}>
              <div style={{ textAlign: 'right', display: 'none', md: 'block' }}>
                <p style={{ fontSize: '0.8125rem', fontWeight: 800, color: 'var(--clr-text)', marginBottom: '2px' }}>Anmol</p>
                <p style={{ fontSize: '0.6rem', fontWeight: 800, color: 'var(--clr-accent)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Investor</p>
              </div>
              <div style={{ width: '40px', height: '40px', background: 'var(--clr-bg-soft)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid var(--clr-border)' }}>
                <User size={18} style={{ color: 'var(--clr-muted)' }} />
              </div>
            </div>
          </div>
        </header>

        {/* Dynamic Page Content */}
        <div className="content-container">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            {children}
          </motion.div>
        </div>
      </main>
    </div>
  );
}
