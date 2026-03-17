import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Play, Sparkles, TrendingUp, Shield, Zap } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const FLOAT_CARDS = [
  {
    side: 'left',
    icon: <TrendingUp className="w-4 h-4 text-green-500" />,
    badge: 'Live • Market Pulse',
    badgeColor: 'text-green-600',
    dotColor: 'bg-green-500',
    text: 'Sensex up 1.2%  —  RBI holds rates steady, markets rally.',
    style: 'bottom-8 left-4 md:left-8 w-56',
  },
  {
    side: 'right',
    icon: <Zap className="w-4 h-4 text-blue-500" />,
    badge: 'AI Synthesis',
    badgeColor: 'text-blue-600',
    dotColor: 'bg-blue-500',
    text: 'Apple Q1 2026 earnings cross-referenced with 14 sources.',
    style: 'top-8 right-4 md:right-8 w-60',
  },
];

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] },
});

export default function Hero() {
  const navigate = useNavigate();

  return (
    <section className="hero-wrapper">
      {/* Background orbs */}
      <div className="hero-gradient-orb w-[700px] h-[700px] bg-blue-100/70   top-[-100px] left-[-200px]" />
      <div className="hero-gradient-orb w-[600px] h-[600px] bg-indigo-100/60 bottom-[-80px] right-[-150px]" />
      <div className="hero-gradient-orb w-[400px] h-[400px] bg-violet-100/40 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">

        {/* Badge */}
        <motion.div {...fadeUp(0)} className="flex justify-center">
          <span className="hero-badge">
            <Sparkles className="w-3.5 h-3.5" />
            AI-Powered Business Intelligence Platform
          </span>
        </motion.div>

        {/* Headline */}
        <motion.h1 {...fadeUp(0.1)} className="hero-headline">
          Business Intelligence{' '}
          <br className="hidden sm:block" />
          <span className="gradient-text">Beyond the Headline</span>
        </motion.h1>

        {/* Subheading */}
        <motion.p {...fadeUp(0.2)} className="hero-sub">
          ArthaNova transforms static articles into interactive intelligence.
          Personalised feeds, multi-source AI synthesis, and deep visual analysis —
          built for professionals who need to act fast.
        </motion.p>

        {/* CTA */}
        <motion.div {...fadeUp(0.3)} className="hero-cta-group">
          <button
            id="hero-get-started"
            className="btn-hero-primary group"
            onClick={() => navigate('/register')}
          >
            Start for free
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
          <button
            id="hero-watch-demo"
            className="btn-hero-secondary"
            onClick={() => navigate('/briefings')}
          >
            <Play className="w-4 h-4 fill-slate-700" />
            See live demo
          </button>
        </motion.div>

        {/* Mockup */}
        <motion.div
          initial={{ opacity: 0, y: 48 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.45, ease: [0.22, 1, 0.36, 1] }}
          className="relative"
        >
          <div className="hero-mockup-shell">
            {/* Fake browser chrome */}
            <div className="hero-mockup-topbar">
              <span className="hero-mockup-dot bg-red-400" />
              <span className="hero-mockup-dot bg-amber-400" />
              <span className="hero-mockup-dot bg-green-400" />
              <div className="flex-1 mx-4">
                <div className="mx-auto max-w-[260px] h-5 bg-white rounded-full flex items-center px-3 gap-2">
                  <Shield className="w-3 h-3 text-green-500" />
                  <span className="text-[10px] text-slate-400 font-medium">app.arthanoya.com/dashboard</span>
                </div>
              </div>
            </div>

            {/* Dashboard screenshot replacement — clean gradient UI mock */}
            <div className="relative bg-slate-50 w-full h-[340px] md:h-[420px] overflow-hidden">
              {/* Sidebar mock */}
              <div className="absolute left-0 top-0 bottom-0 w-[180px] bg-slate-900 flex flex-col gap-3 p-4">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-6 h-6 bg-blue-600 rounded-md flex items-center justify-center">
                    <Zap className="w-3.5 h-3.5 text-white" fill="currentColor" />
                  </div>
                  <span className="text-xs font-black text-white" style={{ fontFamily: 'Outfit' }}>ArthaNova</span>
                </div>
                {['Dashboard', 'Feed', 'Trending', 'AI Briefs', 'Studio', 'Saved'].map((item, i) => (
                  <div key={item}
                    className={`flex items-center gap-2 px-2 py-1.5 rounded-lg text-[11px] font-semibold
                      ${i === 0 ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-slate-200'}`}>
                    <div className={`w-1.5 h-1.5 rounded-full ${i === 0 ? 'bg-white' : 'bg-slate-600'}`} />
                    {item}
                  </div>
                ))}
              </div>

              {/* Main content mock */}
              <div className="absolute left-[180px] right-0 top-0 bottom-0 p-5 overflow-hidden">
                <div className="flex gap-3 mb-5">
                  {['Markets ↑1.2%', 'Tech Earnings', 'RBI Policy', 'Inflation Data'].map((tag, i) => (
                    <div key={i} className={`px-2.5 py-1 rounded-full text-[10px] font-bold
                      ${i === 0 ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-500'}`}>
                      {tag}
                    </div>
                  ))}
                </div>
                <div className="grid grid-cols-3 gap-3 mb-4">
                  {['₹1.8T Market Cap', '94 Stories Today', '12 AI Briefs'].map((stat, i) => (
                    <div key={i} className="bg-white rounded-xl p-3 border border-slate-100">
                      <p className="text-sm font-black text-slate-900">{stat.split(' ')[0]}</p>
                      <p className="text-[10px] text-slate-400 font-medium mt-0.5">{stat.split(' ').slice(1).join(' ')}</p>
                    </div>
                  ))}
                </div>
                <div className="flex flex-col gap-2.5">
                  {[
                    { h: 'RBI holds repo rate at 6.5% for 7th consecutive time', src: 'Reuters · 2h', hot: true },
                    { h: 'Infosys Q3 revenue beats estimates; guidance maintained', src: 'Bloomberg · 4h', hot: false },
                    { h: 'SEBI proposes new F&O trading restrictions for retail investors', src: 'Mint · 6h', hot: false },
                  ].map((item, i) => (
                    <div key={i} className="flex items-start gap-3 bg-white rounded-xl px-3.5 py-2.5 border border-slate-100">
                      {item.hot && <span className="mt-0.5 shrink-0 w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />}
                      <div>
                        <p className="text-[11px] font-bold text-slate-800 leading-snug">{item.h}</p>
                        <p className="text-[10px] text-slate-400 mt-0.5">{item.src}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Floating cards */}
          {FLOAT_CARDS.map((card) => (
            <div key={card.side}
              className={`hero-float-card ${card.style}`}>
              <div className="flex items-center gap-1.5">
                <span className={`w-1.5 h-1.5 rounded-full ${card.dotColor} animate-pulse`} />
                <span className={`text-[10px] font-bold uppercase tracking-wider ${card.badgeColor}`}>
                  {card.badge}
                </span>
              </div>
              <p className="text-[11px] font-semibold text-slate-800 leading-snug">{card.text}</p>
            </div>
          ))}

          {/* Glow beneath the mockup */}
          <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 w-3/4 h-16
                          bg-blue-400/20 blur-2xl rounded-full pointer-events-none" />
        </motion.div>
      </div>
    </section>
  );
}
