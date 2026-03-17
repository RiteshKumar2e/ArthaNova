import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Zap } from 'lucide-react';

const NAV_LINKS = [
  { label: 'Feed',         to: '/feed' },
  { label: 'Trending',     to: '/trending' },
  { label: 'AI Briefings', to: '/briefings' },
  { label: 'Video Studio', to: '/studio' },
];

export default function Navbar() {
  const [scrolled, setScrolled]     = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();

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
        <Link to="/" className="lp-nav__logo">
          <div className="lp-nav__logo-icon">
            <Zap size={16} fill="currentColor" />
          </div>
          <span className="lp-nav__logo-text">ArthaNova</span>
        </Link>

        {/* Desktop links */}
        <ul className="lp-nav__links">
          {NAV_LINKS.map(({ label, to }) => (
            <li key={to}>
              <Link to={to}>{label}</Link>
            </li>
          ))}
        </ul>

        {/* Actions */}
        <div className="lp-nav__actions">
          <button className="lp-btn-ghost" onClick={() => navigate('/login')}>
            Log in
          </button>
          <button className="lp-btn-primary" onClick={() => navigate('/register')}>
            Get started
          </button>
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
          <Link key={to} to={to} onClick={() => setMobileOpen(false)}>
            {label}
          </Link>
        ))}
        <div className="lp-nav__mobile-btns">
          <Link to="/login"    className="ghost">Log in</Link>
          <Link to="/register" className="primary">Get started</Link>
        </div>
      </div>
    </motion.header>
  );
}
