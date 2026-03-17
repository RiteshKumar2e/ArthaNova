import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Zap, TrendingUp } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const SIDEBAR_ITEMS = ['Dashboard', 'Feed', 'Trending', 'AI Briefs', 'Studio', 'Saved'];
const ARTICLES = [
  { h: 'RBI holds repo rate at 6.5% — 7th consecutive pause', src: 'Reuters · 2h', hot: true },
  { h: 'Infosys Q3 revenue beats estimates; FY26 guidance raised', src: 'Bloomberg · 4h', hot: false },
  { h: 'SEBI tightens F&O rules; retail participation may fall', src: 'Mint · 6h', hot: false },
];

export default function Hero() {
  const navigate = useNavigate();

  return (
    <section className="lp-hero">
      {/* Background orbs */}
      <div className="lp-hero__orb lp-hero__orb--a" />
      <div className="lp-hero__orb lp-hero__orb--b" />

      <div className="lp-hero__inner">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          style={{ display: 'flex', justifyContent: 'center' }}
        >
          <span className="lp-hero__badge">
            <span className="lp-hero__badge-dot" />
            AI-Powered Business Intelligence
          </span>
        </motion.div>

        {/* Headline */}
        <motion.h1
          className="lp-hero__h1"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
        >
          Business Intelligence<br />
          <em>Beyond the Headline</em>
        </motion.h1>

        {/* Subheading */}
        <motion.p
          className="lp-hero__sub"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.18 }}
        >
          ArthaNova transforms static articles into interactive intelligence.
          Personalised feeds, multi-source AI synthesis, and deep visual
          analysis — built for professionals who need to act fast.
        </motion.p>

        {/* CTA */}
        <motion.div
          className="lp-hero__cta"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.26 }}
        >
          <button className="lp-cta-main" onClick={() => navigate('/register')}>
            Start for free <ArrowRight size={16} />
          </button>
          <button className="lp-cta-ghost" onClick={() => navigate('/feed')}>
            See live feed →
          </button>
        </motion.div>

        {/* Dashboard mockup */}
        <motion.div
          className="lp-hero__mockup"
          initial={{ opacity: 0, y: 48 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.38, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="lp-mockup-shell">
            {/* Browser chrome */}
            <div className="lp-mockup-chrome">
              <div className="lp-mockup-dots">
                <span /><span /><span />
              </div>
              <div className="lp-mockup-url">
                <span className="lp-mockup-url-dot" />
                app.arthanoya.com/dashboard
              </div>
            </div>

            {/* App body */}
            <div className="lp-mockup-body">
              {/* Sidebar */}
              <div className="lp-mockup-sidebar">
                <div className="lp-mockup-sidebar-logo">
                  <div className="lp-mockup-sidebar-logo-icon">
                    <Zap size={14} fill="currentColor" />
                  </div>
                  <span className="lp-mockup-sidebar-logo-text">ArthaNova</span>
                </div>
                {SIDEBAR_ITEMS.map((item, i) => (
                  <div key={item} className={`lp-mockup-nav-item${i === 0 ? ' active' : ''}`}>
                    <span className="dot" />
                    {item}
                  </div>
                ))}
              </div>

              {/* Main content */}
              <div className="lp-mockup-main">
                <div className="lp-mockup-topbar">
                  <span className="lp-mockup-page-title">Intelligence Feed</span>
                  <div className="lp-mockup-tags">
                    <span className="lp-mockup-tag lp-mockup-tag--green">Markets ↑1.2%</span>
                    <span className="lp-mockup-tag lp-mockup-tag--gray">Tech Earnings</span>
                    <span className="lp-mockup-tag lp-mockup-tag--gray">RBI Policy</span>
                  </div>
                </div>

                <div className="lp-mockup-stats">
                  {[
                    ['₹1.8T', 'Market Cap'],
                    ['94',    'Stories Today'],
                    ['12',    'AI Briefs'],
                  ].map(([val, lbl]) => (
                    <div key={lbl} className="lp-mockup-stat">
                      <div className="lp-mockup-stat-val">{val}</div>
                      <div className="lp-mockup-stat-lbl">{lbl}</div>
                    </div>
                  ))}
                </div>

                <div className="lp-mockup-articles">
                  {ARTICLES.map((a, i) => (
                    <div key={i} className="lp-mockup-article">
                      {a.hot && <span className="lp-mockup-article-hot" />}
                      <div>
                        <div className="lp-mockup-article-h">{a.h}</div>
                        <div className="lp-mockup-article-src">{a.src}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Floating insight cards */}
          <div className="lp-hero__float lp-hero__float--left">
            <div className="lp-hero__float-badge">
              <span className="lp-hero__float-dot" style={{ background: '#16a34a' }} />
              <span className="lp-hero__float-label" style={{ color: '#15803d' }}>Live · Market</span>
            </div>
            <p className="lp-hero__float-text">Sensex +1.2% — RBI holds rates. Rally continues.</p>
          </div>

          <div className="lp-hero__float lp-hero__float--right">
            <div className="lp-hero__float-badge">
              <span className="lp-hero__float-dot" style={{ background: '#2563eb' }} />
              <span className="lp-hero__float-label" style={{ color: '#1d4ed8' }}>AI Synthesis</span>
            </div>
            <p className="lp-hero__float-text">Apple Q1 cross-referenced across 14 sources.</p>
          </div>

          {/* Glow */}
          <div className="lp-hero__glow" />
        </motion.div>
      </div>
    </section>
  );
}
