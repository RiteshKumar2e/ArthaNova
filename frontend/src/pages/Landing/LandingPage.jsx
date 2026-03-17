import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import Hero   from '../../components/Hero';
import { motion } from 'framer-motion';
import {
  Brain, MessageSquare, BarChart3, Shield,
  Globe2, Target, TrendingUp, Zap, ArrowRight,
} from 'lucide-react';
import '../../styles/pages/public/landing.css';

/* ─── Data ────────────────────────────────────── */

const FEATURES = [
  { Icon: Brain,        color: '#7c3aed', bg: '#f5f3ff', title: 'AI Synthesis',        desc: 'Multi-article briefings that condense complex news into actionable, decision-ready intelligence.' },
  { Icon: MessageSquare,color: '#2563eb', bg: '#eff6ff', title: 'Interactive Q&A',      desc: "Ask follow-up questions on any story and get deep context you won't find in a headline." },
  { Icon: BarChart3,    color: '#059669', bg: '#f0fdf4', title: 'Deep Analysis',        desc: 'Visual logic maps, entity graphs, and financial impact assessments for every major story.' },
  { Icon: Shield,       color: '#d97706', bg: '#fffbeb', title: 'Verified Intelligence',desc: 'Our engine cross-checks facts across 50+ global sources before surfacing a story.' },
  { Icon: Globe2,       color: '#dc2626', bg: '#fef2f2', title: 'Vernacular Lens',      desc: 'Read any story in your language. AI-translated with full financial context preserved.' },
  { Icon: Target,       color: '#0891b2', bg: '#ecfeff', title: 'Personalised Feed',    desc: 'Adaptive feed learns your portfolio, sector, and interests to surface what matters most.' },
  { Icon: TrendingUp,   color: '#0d9488', bg: '#f0fdfa', title: 'Market Signals',       desc: 'Real-time linkage between news events and market movements — visualised instantly.' },
  { Icon: Zap,          color: '#ea580c', bg: '#fff7ed', title: 'Video Briefs',          desc: 'Turn long-form stories into punchy 60-second AI-generated video briefings.' },
];

const HOW_STEPS = [
  { Icon: Globe2, num: '01', title: 'Ingest & Verify',    desc: 'We aggregate thousands of articles every hour and run them through our truth-verification pipeline.' },
  { Icon: Brain,  num: '02', title: 'Synthesise with AI', desc: 'Our models merge related stories, extract entities, and build a rich knowledge graph in real time.' },
  { Icon: Target, num: '03', title: 'Deliver to You',     desc: 'Insights land in your personalised feed — ready to read, query, or convert to a video brief.' },
];

const STATS = [
  { value: '50K+', label: 'Articles daily' },
  { value: '98%',  label: 'Accuracy rate' },
  { value: '<2s',  label: 'Synthesis speed' },
  { value: '180+', label: 'Countries covered' },
];

const TESTIMONIALS = [
  {
    avatar: 'AV', avatarBg: '#2563eb',
    stars: 5,
    quote: '"ArthaNova cuts my morning briefing from 90 minutes to 10. The AI synthesis is genuinely impressive — it thinks like an analyst."',
    name: 'Arjun Verma', role: 'Portfolio Manager, Mirae Asset',
  },
  {
    avatar: 'PS', avatarBg: '#7c3aed',
    stars: 5,
    quote: '"The only platform that gives me both the headline and the second-order effects. The entity map alone is worth the subscription."',
    name: 'Priya Shankar', role: 'Senior Correspondent, The Hindu BL',
  },
  {
    avatar: 'RK', avatarBg: '#0d9488',
    stars: 5,
    quote: '"Our research desk runs on ArthaNova. The verified intelligence layer means analysts trust the input — everything moves faster."',
    name: 'Rohit Kumar', role: 'Head of Research, Nuvama Wealth',
  },
];

const FOOTER_COLS = [
  { title: 'Product',  links: [['Feed', '/feed'], ['Trending', '/trending'], ['AI Briefings', '/briefings'], ['Deep Analysis', '/deep-analysis'], ['Video Studio', '/studio']] },
  { title: 'Company',  links: [['About', '#'], ['Blog', '#'], ['Careers', '#'], ['Press', '#']] },
  { title: 'Legal',    links: [['Privacy', '#'], ['Terms', '#'], ['Cookie Policy', '#']] },
];

/* ─── Scroll animation helper ─────────────────── */
const inView = (delay = 0) => ({
  initial:    { opacity: 0, y: 24 },
  whileInView:{ opacity: 1, y: 0 },
  viewport:   { once: true },
  transition: { duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] },
});

/* ─── Component ───────────────────────────────── */
export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="lp-root">
      <Navbar />
      <Hero />

      {/* ── Logos / Social proof ── */}
      <section className="lp-logos">
        <p className="lp-logos__label">Trusted by professionals at</p>
        <div className="lp-logos__row">
          {['Bloomberg', 'Reuters', 'HDFC Securities', 'Nuvama', 'The Hindu BL', 'Mint'].map(n => (
            <span key={n}>{n}</span>
          ))}
        </div>
      </section>

      {/* ── Features ── */}
      <section id="features" className="lp-features">
        <motion.div className="lp-section-header" {...inView()}>
          <span className="lp-section-chip">Platform Features</span>
          <h2 className="lp-section-h2">Intelligence at the speed of light</h2>
          <p className="lp-section-sub">
            We've rebuilt news from the ground up — interactive, intelligent,
            and calibrated for professional decision-making.
          </p>
        </motion.div>

        <div className="lp-features__grid">
          {FEATURES.map(({ Icon, color, bg, title, desc }, i) => (
            <motion.div key={title} className="lp-feature-card" {...inView(i * 0.055)}>
              <div className="lp-feature-icon" style={{ background: bg }}>
                <Icon size={20} color={color} />
              </div>
              <h3>{title}</h3>
              <p>{desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── How it works ── */}
      <section id="how" className="lp-how">
        <motion.div className="lp-section-header" style={{ maxWidth: 600, margin: '0 auto 64px' }} {...inView()}>
          <span className="lp-section-chip">How It Works</span>
          <h2 className="lp-section-h2">From raw news to refined insight</h2>
          <p className="lp-section-sub">Three steps. Milliseconds. No noise.</p>
        </motion.div>
        <div className="lp-how__grid">
          {HOW_STEPS.map(({ Icon, num, title, desc }, i) => (
            <motion.div key={num} className="lp-how-card" {...inView(i * 0.1)}>
              <span className="lp-how-card__num">{num}</span>
              <div className="lp-how-card__icon">
                <Icon size={20} />
              </div>
              <h3>{title}</h3>
              <p>{desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── Stats ── */}
      <section className="lp-stats">
        <div className="lp-stats__grid">
          {STATS.map(({ value, label }, i) => (
            <motion.div key={label} style={{ textAlign: 'center' }} {...inView(i * 0.08)}>
              <div className="lp-stat-val">{value}</div>
              <div className="lp-stat-lbl">{label}</div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── Testimonials ── */}
      <section id="testimonials" className="lp-testimonials">
        <motion.div className="lp-section-header" {...inView()}>
          <span className="lp-section-chip">Testimonials</span>
          <h2 className="lp-section-h2">Loved by analysts, journalists & investors</h2>
        </motion.div>
        <div className="lp-testimonials__grid">
          {TESTIMONIALS.map(({ avatar, avatarBg, stars, quote, name, role }, i) => (
            <motion.div key={name} className="lp-testimonial" {...inView(i * 0.1)}>
              <div className="lp-testimonial__stars">
                {Array.from({ length: stars }).map((_, j) => (
                  <span key={j}>★</span>
                ))}
              </div>
              <p className="lp-testimonial__quote">{quote}</p>
              <div className="lp-testimonial__author">
                <div className="lp-testimonial__avatar" style={{ background: avatarBg }}>
                  {avatar}
                </div>
                <div>
                  <div className="lp-testimonial__name">{name}</div>
                  <div className="lp-testimonial__role">{role}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="lp-cta-section">
        <motion.div className="lp-cta-box" {...inView()}>
          <div className="lp-cta-box__glow lp-cta-box__glow--a" />
          <div className="lp-cta-box__glow lp-cta-box__glow--b" />
          <h2>Ready to think faster about the news?</h2>
          <p>
            Join thousands of professionals who start their day with ArthaNova.
            Free plan available — no credit card required.
          </p>
          <div className="lp-cta-box__btns">
            <button className="lp-cta-btn-white" onClick={() => navigate('/register')}>
              Get started for free <ArrowRight size={16} />
            </button>
            <button className="lp-cta-btn-outline" onClick={() => navigate('/login')}>
              Already have an account
            </button>
          </div>
        </motion.div>
      </section>

      {/* ── Footer ── */}
      <footer className="lp-footer">
        <div className="lp-footer__grid">
          {/* Brand */}
          <div>
            <div className="lp-footer__brand-icon">
              <Zap size={16} fill="currentColor" />
            </div>
            <div className="lp-footer__brand-name">ArthaNova</div>
            <p className="lp-footer__brand-desc">
              Business intelligence reimagined for the age of AI.
              Fast, verified, and deeply contextual.
            </p>
          </div>

          {/* Link columns */}
          {FOOTER_COLS.map(({ title, links }) => (
            <div key={title} className="lp-footer__col">
              <p className="lp-footer__col-title">{title}</p>
              {links.map(([label, to]) => (
                <Link key={label} to={to}>{label}</Link>
              ))}
            </div>
          ))}
        </div>

        <div className="lp-footer__bottom">
          <p>© 2026 ArthaNova Technologies Pvt. Ltd. All rights reserved.</p>
          <p>Built in India · Powered by AI</p>
        </div>
      </footer>
    </div>
  );
}
