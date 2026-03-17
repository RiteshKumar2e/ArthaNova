import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import Hero from '../../components/Hero';
import { motion } from 'framer-motion';
import {
  Zap, MessageSquare, BarChart3, Shield,
  Globe2, Target, Brain, TrendingUp,
  ArrowRight,
} from 'lucide-react';

/* ── Data ─────────────────────────────────── */

const FEATURES = [
  {
    icon: Brain,
    color: 'bg-violet-50 text-violet-600',
    title: 'AI Synthesis',
    desc: 'Multi-article briefings that condense complex news into actionable, decision-ready intelligence.',
  },
  {
    icon: MessageSquare,
    color: 'bg-blue-50 text-blue-600',
    title: 'Interactive Q&A',
    desc: "Ask follow-up questions on any story. Get deep context you won't find in a headline.",
  },
  {
    icon: BarChart3,
    color: 'bg-emerald-50 text-emerald-600',
    title: 'Deep Analysis',
    desc: 'Visual logic maps, entity graphs, and financial impact assessments for every major story.',
  },
  {
    icon: Shield,
    color: 'bg-amber-50 text-amber-600',
    title: 'Verified Intelligence',
    desc: 'Our verification engine cross-checks facts across 50+ global sources before surfacing a story.',
  },
  {
    icon: Globe2,
    color: 'bg-rose-50 text-rose-600',
    title: 'Vernacular Lens',
    desc: 'Read any story in your language. AI-translated with financial context preserved.',
  },
  {
    icon: Target,
    color: 'bg-indigo-50 text-indigo-600',
    title: 'Personalised Feed',
    desc: 'Adaptive feed learns your portfolio, interests, and industry to surface what matters to you.',
  },
  {
    icon: TrendingUp,
    color: 'bg-teal-50 text-teal-600',
    title: 'Market Signals',
    desc: 'Real-time linkage between news events and market movements, visualised instantly.',
  },
  {
    icon: Zap,
    color: 'bg-orange-50 text-orange-600',
    title: 'Video Briefs',
    desc: 'Turn long-form stories into punchy 60-second AI-generated video briefings.',
  },
];

const HOW_STEPS = [
  {
    icon: Globe2,
    num: '01',
    title: 'Ingest & Verify',
    desc: 'We aggregate thousands of articles every hour and run them through our truth-verification engine.',
  },
  {
    icon: Brain,
    num: '02',
    title: 'Synthesise with AI',
    desc: 'Our models merge related stories, extract entities, and build a rich knowledge graph in real time.',
  },
  {
    icon: Target,
    num: '03',
    title: 'Deliver to You',
    desc: 'Insights land in your personalised feed, ready to read, query, or convert into a video brief.',
  },
];

const STATS = [
  { value: '50K+',  label: 'Articles daily' },
  { value: '98%',   label: 'Accuracy rate' },
  { value: '<2s',   label: 'Synthesis speed' },
  { value: '180+',  label: 'Countries covered' },
];

const TESTIMONIALS = [
  {
    initials: 'AV', bg: 'bg-blue-600',
    quote: '"ArthaNova cuts my morning briefing from 90 minutes to 10. The AI synthesis is genuinely impressive — it thinks like an analyst."',
    name: 'Arjun Verma', role: 'Portfolio Manager, Mirae Asset',
  },
  {
    initials: 'PS', bg: 'bg-violet-600',
    quote: '"It\'s the only platform that gives me both the headline and the second-order effects. The entity map feature alone is worth the subscription."',
    name: 'Priya Shankar', role: 'Senior Correspondent, The Hindu BL',
  },
  {
    initials: 'RK', bg: 'bg-teal-600',
    quote: '"We deployed ArthaNova across our research desk. The verified intelligence layer means our analysts trust the input, which speeds everything up."',
    name: 'Rohit Kumar', role: 'Head of Research, Nuvama Wealth',
  },
];

const FOOTER_COLS = [
  {
    title: 'Product',
    links: ['Feed', 'Trending', 'AI Briefings', 'Deep Analysis', 'Video Studio'],
    paths: ['/feed', '/trending', '/briefings', '/deep-analysis', '/studio'],
  },
  {
    title: 'Company',
    links: ['About', 'Blog', 'Careers', 'Press'],
    paths: ['#', '#', '#', '#'],
  },
  {
    title: 'Legal',
    links: ['Privacy', 'Terms', 'Cookie Policy'],
    paths: ['#', '#', '#'],
  },
];

/* ── Animations ───────────────────────────── */

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 28 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.65, delay, ease: [0.22, 1, 0.36, 1] },
});

/* ── Component ────────────────────────────── */

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white overflow-x-hidden">
      <Navbar />

      {/* ── Hero ── */}
      <Hero />

      {/* ── Social-proof / Logos ── */}
      <section className="logos-section">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="logos-label">Trusted by professionals at</p>
          <div className="logos-row">
            {['Bloomberg', 'Reuters', 'HDFC Securities', 'Nuvama', 'The Hindu BL', 'Mint'].map(name => (
              <span key={name}>{name}</span>
            ))}
          </div>
        </div>
      </section>

      {/* ── Features ── */}
      <section id="features" className="features-section">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div {...fadeUp()} className="text-center">
            <span className="section-label">Platform Features</span>
            <h2 className="section-heading">
              Intelligence at the speed of light
            </h2>
            <p className="section-sub">
              We've rebuilt news from the ground up — interactive, intelligent,
              and calibrated for professional decision-making.
            </p>
          </motion.div>

          <div className="feature-grid-4">
            {FEATURES.map((f, i) => (
              <motion.div key={f.title} {...fadeUp(i * 0.06)} className="feature-card">
                <div className={`feature-icon-wrap ${f.color}`}>
                  <f.icon className="w-5 h-5" />
                </div>
                <div>
                  <h3>{f.title}</h3>
                  <p className="mt-1">{f.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── How It Works (dark) ── */}
      <section id="how" className="how-section">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div {...fadeUp()} className="text-center">
            <span className="section-label !text-blue-400 !bg-blue-900/40 !border-blue-700/40">
              How It Works
            </span>
            <h2 className="section-heading !text-white mt-3">
              From raw news to refined insight
            </h2>
            <p className="section-sub !text-slate-400">
              Three steps. Milliseconds. No noise.
            </p>
          </motion.div>

          <div className="how-grid">
            {HOW_STEPS.map((step, i) => (
              <motion.div key={step.num} {...fadeUp(i * 0.12)} className="how-card">
                <span className="how-number">{step.num}</span>
                <div className="how-icon-wrap">
                  <step.icon className="w-5 h-5 text-blue-400" />
                </div>
                <h3>{step.title}</h3>
                <p>{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Stats Strip ── */}
      <section className="stats-strip">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="stats-grid">
            {STATS.map((s, i) => (
              <motion.div key={s.label} {...fadeUp(i * 0.08)} className="stat-item">
                <span className="stat-value">{s.value}</span>
                <span className="stat-label">{s.label}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Testimonials ── */}
      <section id="testimonials" className="testimonials-section">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div {...fadeUp()} className="text-center">
            <span className="section-label">Testimonials</span>
            <h2 className="section-heading mt-3">
              Loved by analysts, journalists & investors
            </h2>
          </motion.div>

          <div className="testimonials-grid">
            {TESTIMONIALS.map((t, i) => (
              <motion.div key={t.name} {...fadeUp(i * 0.1)} className="testimonial-card">
                <p className="testimonial-quote">{t.quote}</p>
                <div className="testimonial-author">
                  <div className={`testimonial-avatar ${t.bg}`}>{t.initials}</div>
                  <div>
                    <p className="testimonial-name">{t.name}</p>
                    <p className="testimonial-role">{t.role}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA Banner ── */}
      <section className="cta-section">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div {...fadeUp()} className="cta-inner">
            <div className="cta-glow w-[500px] h-[300px] bg-blue-600 -top-20 -left-20" />
            <div className="cta-glow w-[400px] h-[300px] bg-violet-600 -bottom-20 -right-10" />

            <span className="section-label !text-blue-300 !bg-blue-900/40 !border-blue-700/30 relative z-10">
              Join the beta
            </span>
            <h2 className="relative z-10 mt-4">
              Ready to think faster about the news?
            </h2>
            <p className="relative z-10">
              Join thousands of professionals who start their day with ArthaNova.
              Free plan available — no credit card required.
            </p>
            <div className="relative z-10 flex flex-col sm:flex-row gap-4 justify-center">
              <button
                id="cta-get-started"
                className="btn-hero-primary !bg-white !text-slate-900 hover:!bg-slate-100 group"
                onClick={() => navigate('/register')}
              >
                Get started for free
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
              <button
                id="cta-login"
                className="btn-hero-secondary !bg-white/10 !text-white !border-white/20 hover:!bg-white/20"
                onClick={() => navigate('/login')}
              >
                Already have an account
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="landing-footer">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="footer-grid">
            {/* Brand */}
            <div className="footer-brand">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 bg-blue-600 rounded-lg flex items-center justify-center">
                  <Zap className="w-4 h-4 text-white" fill="currentColor" />
                </div>
                <span className="footer-logo-text">ArthaNova</span>
              </div>
              <p className="footer-desc">
                Business intelligence reimagined for the age of AI. Fast, verified, and deeply contextual.
              </p>
            </div>

            {/* Link columns */}
            {FOOTER_COLS.map(col => (
              <div key={col.title}>
                <p className="footer-col-title">{col.title}</p>
                {col.links.map((link, i) => (
                  <Link key={link} to={col.paths[i]} className="footer-link">
                    {link}
                  </Link>
                ))}
              </div>
            ))}
          </div>

          <div className="footer-bottom">
            <p>© 2026 ArthaNova Technologies Pvt. Ltd. All rights reserved.</p>
            <p>Built with ❤️ in India · Powered by AI</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
