import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Zap } from 'lucide-react';
import useAuthStore from '../store/authStore';

import BrandLogo from './ui/BrandLogo';

const LANDING_LINKS = [
  { label: 'HOME',         to: '/' },
  { label: 'ABOUT',        to: '#about' },
  { label: 'FEATURES',     to: '#features' },
  { label: 'HOW IT WORKS', to: '#how' },
  { label: 'PRICING',      to: '#pricing' },
  { label: 'CONTACT',      to: '#contact' },
];

const DASHBOARD_LINKS = [
  { label: 'Feed',         to: '/feed' },
  { icon: Zap, label: 'AI Briefings', to: '/briefings' },
  { label: 'Market Pulse', to: '/trending' },
  { label: 'Video Studio', to: '/studio' },
];

export default function Navbar() {
  const [scrolled, setScrolled]     = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { isAuthenticated, logout } = useAuthStore();
  const navigate = useNavigate();

  const NAV_LINKS = isAuthenticated ? DASHBOARD_LINKS : LANDING_LINKS;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.45 }}
      className={`lp-nav${scrolled ? ' lp-nav--scrolled' : ''}`}
    >
      <div className="lp-nav__inner">
        {/* Logo */}
        <BrandLogo variant="dark" size={16} />

        {/* Desktop links - Centered */}
        <ul className="lp-nav__links">
          {NAV_LINKS.map(({ label, to }) => (
            <li key={to}>
              {to.startsWith('#') ? (
                <a href={to}>{label}</a>
              ) : (
                <Link to={to}>{label}</Link>
              )}
            </li>
          ))}
        </ul>

        {/* Actions - Far Right */}
        <div className="lp-nav__actions">
          {isAuthenticated ? (
            <>
              <button className="lp-btn-outline" onClick={() => navigate('/dashboard')}>
                Dashboard
              </button>
              <button className="lp-btn-primary" onClick={logout}>
                Log out
              </button>
            </>
          ) : (
            <>
              <button className="lp-btn-outline" onClick={() => navigate('/login')}>
                Sign In
              </button>
              <button className="lp-btn-primary" onClick={() => navigate('/register')}>
                Register
              </button>
            </>
          )}
          <button
            className="lp-nav__burger"
            onClick={() => setMobileOpen(v => !v)}
            aria-label="Toggle menu"
          >
            <span /><span /><span />
          </button>
        </div>
      </div>

      {/* Mobile dropdown */}
      <div className={`lp-nav__mobile${mobileOpen ? ' open' : ''}`}>
        {NAV_LINKS.map(({ label, to }) => (
          to.startsWith('#') ? (
            <a key={to} href={to} onClick={() => setMobileOpen(false)}>
              {label}
            </a>
          ) : (
            <Link key={to} to={to} onClick={() => setMobileOpen(false)}>
              {label}
            </Link>
          )
        ))}
        <div className="lp-nav__mobile-btns">
          {isAuthenticated ? (
            <>
              <Link to="/dashboard" className="ghost">Dashboard</Link>
              <button onClick={logout} className="primary" style={{ width: '100%', background: 'var(--clr-accent)', color: 'white', borderRadius: '12px', height: '44px', fontWeight: 700, border: 'none' }}>Log out</button>
            </>
          ) : (
            <>
              <Link to="/login"    className="ghost">Sign In</Link>
              <Link to="/register" className="primary">Register</Link>
            </>
          )}
        </div>
      </div>
    </motion.header>
  );
}
