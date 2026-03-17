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
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <motion.nav
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300
        ${scrolled
          ? 'bg-white/80 backdrop-blur-xl border-b border-slate-200 shadow-sm'
          : 'bg-transparent'
        }`}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 rounded-lg bg-slate-900 flex items-center justify-center
                            group-hover:bg-blue-600 transition-colors duration-200">
              <Zap className="w-4 h-4 text-blue-400" fill="currentColor" />
            </div>
            <span className="text-lg font-black tracking-tight text-slate-900"
                  style={{ fontFamily: "'Outfit', sans-serif" }}>
              ArthaNova
            </span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-8">
            {NAV_LINKS.map(({ label, to }) => (
              <Link
                key={to}
                to={to}
                className="text-sm font-semibold text-slate-600 hover:text-slate-900 transition-colors"
              >
                {label}
              </Link>
            ))}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/login')}
              className="hidden sm:block text-sm font-semibold text-slate-600
                         hover:text-slate-900 transition-colors px-2 py-1.5"
            >
              Log in
            </button>
            <button
              onClick={() => navigate('/register')}
              className="text-sm font-bold px-5 py-2 rounded-xl bg-slate-900 text-white
                         hover:bg-blue-600 transition-all duration-200 shadow-sm"
            >
              Get started →
            </button>
          </div>
        </div>
      </div>
    </motion.nav>
  );
}
