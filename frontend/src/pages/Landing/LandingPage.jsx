import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useAuthStore from '../../store/authStore';
import Navbar from '../../components/Navbar';
import Hero   from '../../components/Hero';
import { motion } from 'framer-motion';
import {
  Brain, MessageSquare, BarChart3, Shield,
  Globe2, Target, TrendingUp, Zap, ArrowRight,
  Mail, Github, Linkedin, Check, Crown, Star
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

const PLANS = [
  {
    name: 'Standard',
    type: 'Entry Tier',
    price: 'Free',
    description: 'Essential global news with basic AI synthesis.',
    features: ['Standard Feed Access', 'Basic Summary Views', '5 Video Studio Tokens/mo', 'Community Support'],
    icon: Star,
    color: 'slate',
    button: 'Get Started',
  },
  {
    name: 'Intelligence',
    type: 'Most Popular',
    price: '$29',
    description: 'Deep market logic and personalized story arcs.',
    features: ['Deep Analysis Access', 'Unlimited Synthesis', 'Sovereign Map Access', '50 Video Studio Tokens/mo', 'Priority Support'],
    icon: Zap,
    color: 'blue',
    button: 'Upgrade to Intel',
    featured: true,
  },
  {
    name: 'Sovereign',
    type: 'Institutional',
    price: '$199',
    description: 'Full-scale market predictions and private data nodes.',
    features: ['Predictive Logic Panel', 'Private Data Localization', 'Unlimited Video Studio', 'Direct AI Consultation', 'White-glove Support'],
    icon: Crown,
    color: 'yellow',
    button: 'Go Sovereign',
  }
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
  const { isAuthenticated } = useAuthStore();

  const PLATFORM_LINKS = [
    { label: 'Feed',         to: '/feed' },
    { label: 'Trending',     to: '/trending' },
    { label: 'AI Briefings', to: '/briefings' },
    { label: 'Deep Analysis',to: '/deep-analysis' },
    { label: 'Video Studio', to: '/studio' },
  ];

  const NAVIGATION_LINKS = [
    { label: 'Home',         to: '/' },
    { label: 'About',        to: '#about' },
    { label: 'Features',     to: '#features' },
    { label: 'How it Works', to: '#how' },
    { label: 'Pricing',      to: '#pricing' },
    { label: 'Contact',      to: '#contact' },
  ];

  const FOOTER_COLS = [
    { 
      title: isAuthenticated ? 'Platform' : 'Navigation',  
      links: isAuthenticated ? PLATFORM_LINKS : NAVIGATION_LINKS 
    },
    { title: 'Company',  links: [{ label: 'About', to: '#' }, { label: 'Blog', to: '#' }, { label: 'Careers', to: '#' }, { label: 'Press', to: '#' }] },
    { title: 'Legal',    links: [{ label: 'Privacy', to: '#' }, { label: 'Terms', to: '#' }, { label: 'Cookie Policy', to: '#' }] },
  ];

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
      
      {/* ── About Section ── */}
      <section id="about" className="lp-about">
        <div className="lp-container">
          <div className="lp-about__grid">
            <motion.div className="lp-about__content" {...inView()}>
              <span className="lp-section-chip">The ArthaNova Mission</span>
              <h2 className="lp-section-h2">The Intelligence Layer for Global Professionals.</h2>
              <p className="lp-about__text">
                In a world drowning in news, ArthaNova acts as your analytical filter. 
                We don't just aggregate stories; we synthesize them into actionable 
                intelligence using proprietary AI models trained on financial and 
                geopolitical data.
              </p>
              <div className="lp-about__pills">
                <div className="lp-about__pill">
                  <span className="dot" />
                  98.4% Fact Veracity
                </div>
                <div className="lp-about__pill">
                  <span className="dot" />
                  Multi-Source Logic
                </div>
              </div>
            </motion.div>
            
            <motion.div className="lp-about__image-wrap" {...inView(0.2)}>
              <div className="lp-about__card">
                <div className="lp-about__card-header">
                  <Shield size={18} color="var(--c-accent)" />
                  <span>Analytical Integrity</span>
                </div>
                <p>Every story is cross-referenced against 50+ trusted global sources before it ever reaches your desk.</p>
              </div>
              <div className="lp-about__card lp-about__card--offset">
                <div className="lp-about__card-header">
                  <Target size={18} color="var(--c-accent)" />
                  <span>Precision Filtering</span>
                </div>
                <p>No noise. Only the signals that impact your portfolio, your sector, and your interests.</p>
              </div>
            </motion.div>
          </div>
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



      {/* ── Pricing ── */}
      <section id="pricing" className="lp-pricing">
        <motion.div className="lp-section-header" {...inView()}>
          <span className="lp-section-chip">Pricing Plans</span>
          <h2 className="lp-section-h2">Master Your Market Logic</h2>
          <p className="lp-section-sub">Upgrade your intelligence tier for deep analytical power.</p>
        </motion.div>

        <div className="lp-pricing__grid">
          {PLANS.map((plan, i) => {
            const Icon = plan.icon;
            return (
              <motion.div 
                key={plan.name} 
                className={`lp-price-card ${plan.featured ? 'lp-price-card--featured' : ''}`}
                {...inView(i * 0.1)}
              >
                {plan.featured && <div className="lp-price-badge">Recommended</div>}
                
                <div className="lp-price-card__header">
                  <div className={`lp-price-icon lp-price-icon--${plan.color}`}>
                    <Icon size={24} />
                  </div>
                  <span className="lp-price-type">{plan.type}</span>
                  <h3 className="lp-price-name">{plan.name}</h3>
                  <div className="lp-price-val">
                    {plan.price}
                    {plan.price !== 'Free' && <span className="lp-price-mo">/mo</span>}
                  </div>
                  <p className="lp-price-desc">{plan.description}</p>
                </div>

                <ul className="lp-price-features">
                  {plan.features.map(f => (
                    <li key={f}>
                      <div className="lp-price-check"><Check size={12} strokeWidth={4} /></div>
                      {f}
                    </li>
                  ))}
                </ul>

                <button 
                  className={`lp-price-btn ${plan.featured ? 'lp-price-btn--primary' : 'lp-price-btn--secondary'}`}
                  onClick={() => navigate('/register')}
                >
                  {plan.button}
                </button>
              </motion.div>
            );
          })}
        </div>

        {/* ── Enterprise ── */}
        <motion.div className="lp-enterprise" {...inView(0.2)}>
          <div className="lp-enterprise__glow" />
          <div className="lp-enterprise__content">
            <div className="lp-enterprise__top">
              <Shield size={20} color="#60a5fa" />
              <span>Institutional Intelligence</span>
            </div>
            <h3>Enterprise Sovereign Node</h3>
            <p>Looking for custom data localization? Our team provides dedicated infrastructure deployment.</p>
          </div>
          <button className="lp-enterprise__btn" onClick={() => window.location.href = 'mailto:enterprise@arthanova.com'}>
            Request Demo
          </button>
        </motion.div>
      </section>


      {/* ── Footer ── */}
      <footer className="lp-footer" id="contact">
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
            <div className="lp-footer__socials">
              <a href="mailto:contact@arthanova.com" className="lp-footer__social-link" title="Mail">
                <Mail size={18} />
              </a>
              <a href="https://github.com" target="_blank" rel="noreferrer" className="lp-footer__social-link" title="GitHub">
                <Github size={18} />
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noreferrer" className="lp-footer__social-link" title="LinkedIn">
                <Linkedin size={18} />
              </a>
            </div>
          </div>

          {/* Link columns */}
          {FOOTER_COLS.map(({ title, links }) => (
            <div key={title} className="lp-footer__col">
              <p className="lp-footer__col-title">{title}</p>
              {links.map(({ label, to }) => (
                to.startsWith('#') ? (
                  <a key={label} href={to}>{label}</a>
                ) : (
                  <Link key={label} to={to}>{label}</Link>
                )
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
