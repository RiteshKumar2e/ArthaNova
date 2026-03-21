import { Link } from 'react-router-dom'
import styles from '../../styles/pages/public/LandingPage.module.scss'

const FEATURES = [
  { 
    title: 'AI Signal Radar', 
    desc: 'Real-time multi-factor analysis detecting breakouts and high-probability setups across NSE/BSE stocks.',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M13 2L3 14H12L11 22L21 10H12L13 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    )
  },
  { 
    title: 'Cognitive Portfolio', 
    desc: 'Advanced risk scoring and rebalancing insights powered by proprietary AI models trained on Indian market cycles.',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M21 16V8C21 6.89543 20.1046 6 19 6H5C3.89543 6 3 6.89543 3 8V16C3 17.1046 3.89543 18 5 18H19C20.1046 18 21 17.1046 21 16Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M3 10H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    )
  },
  { 
    title: 'Conversational Intelligence', 
    desc: 'Get deep, source-grounded answers to complex market questions using our integrated RAG-based AI analyst.',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M21 11.5C21.0034 12.8199 20.6951 14.1219 20.1 15.3C19.3944 16.7112 18.3098 17.8992 16.9674 18.7306C15.6251 19.562 14.0789 20.0054 12.5 20C11.1801 20.0034 9.87812 19.6951 8.7 19.1L3 21L4.9 15.3C4.30493 14.1219 3.99656 12.8199 4 11.5C3.99456 9.92111 4.43797 8.37488 5.26944 7.03258C6.10091 5.69028 7.28884 4.6056 8.7 3.9C9.87812 3.30493 11.1801 2.99656 12.5 3H13C15.0843 3.11502 17.053 3.99479 18.5291 5.47089C20.0052 6.94699 20.885 8.91568 21 11V11.5Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    )
  }
]

const TESTIMONIALS = [
  {
    name: "Vikram Mehta",
    role: "Portfolio Manager, HNI",
    text: "ArthaNova's RAG-based AI analysts reduced my research time by 70%. The ability to query complex NSE filings in plain English is a game changer.",
    avatar: "VM"
  },
  {
    name: "Ananya Iyer",
    role: "Quantitative Trader",
    text: "The Signal Radar consistently identifies momentum shifts 2-3 days before the mainstream media. The backtest accuracy is impressively reliable.",
    avatar: "AI"
  },
  {
    name: "Rohan Kapoor",
    role: "Retail Investor",
    text: "As a part-time investor, the conversational intelligence helps me understand MD&A sections of annual reports without getting bogged down in jargon.",
    avatar: "RK"
  }
]

const TRUST_LOGOS = [
  { name: 'NSE', color: '#003D99' },
  { name: 'BSE', color: '#DE350B' },
  { name: 'SEBI Registered Data', color: '#5E6C84' },
  { name: 'Groq', color: '#FF6B35' },
  { name: 'Llama 3', color: '#0065FF' }
]

export default function LandingPage() {
  return (
    <div className={styles.page}>
      {/* ─── Hero Section ─────────────────────────────────────────────────── */}
      <section className={styles.hero}>
        <div className={styles.container}>
          <div className={styles.heroCentered}>
            <div className={styles.heroContent}>
              <div className={styles.badgeLine}>
                <span className={styles.badge}>New</span>
                <span className={styles.badgeText}>AI Opportunity Radar 2.0 is live</span>
              </div>
              <h1 className={styles.heroTitle}>
                Intelligence for the <br />
                <span className={styles.gradText}>Modern Investor</span>
              </h1>
              <p className={styles.heroLead}>
                ArthaNova combines institutional-grade data with advanced AI to give you an edge in the Indian equity markets. 
                Identify trends, manage risk, and invest with conviction.
              </p>
              <div className={styles.ctaGroup}>
                <Link to="/register" className="btn btn-primary btn-lg">
                  Get Started Free
                </Link>
                <Link to="/market" className="btn btn-secondary btn-lg">
                  Live Market View
                </Link>
              </div>
              <div className={styles.trustStrip}>
                <div className={styles.logoGrid}>
                  {TRUST_LOGOS.map(logo => (
                    <span key={logo.name} className={styles.logoItem} style={{ color: logo.color }}>
                      {logo.name}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Capabilities Section ─────────────────────────────────────────── */}
      <section className={styles.capabilities} id="features">
        <div className={styles.container}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Precision Tools for Better Decisions</h2>
            <p className={styles.sectionDesc}>
              Stop guessing and start analyzing. Our platform provides the data and intelligence 
              you need to outperform the benchmarks.
            </p>
          </div>
          <div className={styles.featuresGrid}>
            {FEATURES.map((f, i) => (
              <div key={i} className={styles.featureCard}>
                <div className={styles.featureIcon}>{f.icon}</div>
                <h3 className={styles.featureTitle}>{f.title}</h3>
                <p className={styles.featureDesc}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Interactive Showcase ─────────────────────────────────────────── */}
      <section className={styles.showcase} id="about">
        <div className={styles.container}>
          <div className={styles.showcaseGrid}>
            <div className={styles.showcaseImage}>
              <div className={styles.chatSample}>
                <div className={styles.chatUser}>Analyze my portfolio risk...</div>
                <div className={styles.chatAI}>
                  <div className={styles.aiHeader}>
                    <span className={styles.aiTag}>AI Analyst</span>
                  </div>
                  <p>ArthaNova AI detects <strong>sector concentration</strong> in your current holdings. Recommendation: Diversify into Mid-cap IT or Consumer Goods for lower volatility.</p>
                  <div className={styles.aiFooter}>Sources: NSE Filings, Multi-Agent Analysis</div>
                </div>
              </div>
            </div>
            <div className={styles.showcaseContent}>
              <h2 className={styles.showcaseTitle}>Your Personal AI Financial Analyst</h2>
              <p className={styles.showcaseText}>
                The markets move fast. ArthaNova's AI works 24/7 to scan every filing, 
                every news update, and every price movement to keep you ahead of the curve.
              </p>
              <ul className={styles.checkList}>
                <li>Context-aware portfolio analysis</li>
                <li>Plain-English summaries of complex data</li>
                <li>Real-time sentiment tracking</li>
                <li>Transparent, source-grounded insights</li>
              </ul>
              <Link to="/register" className="btn btn-primary btn-lg">Explore AI Chat</Link>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Impact / Stats ─────────────────────────────────────────── */}
      <section className={styles.impact}>
        <div className={styles.container}>
          <div className={styles.impactGrid}>
            <div className={styles.impactItem}>
              <div className={styles.impactVal}>5,000+</div>
              <div className={styles.impactLabel}>Instruments Tracked</div>
            </div>
            <div className={styles.impactItem}>
              <div className={styles.impactVal}>98%</div>
              <div className={styles.impactLabel}>Backtest Accuracy</div>
            </div>
            <div className={styles.impactItem}>
              <div className={styles.impactVal}>&lt; 1s</div>
              <div className={styles.impactLabel}>Insight Latency</div>
            </div>
            <div className={styles.impactItem}>
              <div className={styles.impactVal}>100%</div>
              <div className={styles.impactLabel}>Data Transparency</div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── How It Works ────────────────────────────────────────────────── */}
      <section className={styles.howItWorks} id="how-it-works">
        <div className={styles.container}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>How ArthaNova Works</h2>
            <p className={styles.sectionDesc}>
              A seamless intelligence pipeline from raw data to actionable investment decisions.
            </p>
          </div>
          <div className={styles.stepsGrid}>
            <div className={styles.stepCard}>
              <div className={styles.stepNumber}>01</div>
              <h3 className={styles.stepTitle}>Connect & Centralize</h3>
              <p className={styles.stepDesc}>
                Securely link your broker accounts or upload your portfolio. We aggregate all your holdings in one unified view.
              </p>
            </div>
            <div className={styles.stepCard}>
              <div className={styles.stepNumber}>02</div>
              <h3 className={styles.stepTitle}>AI Analysis</h3>
              <p className={styles.stepDesc}>
                Our proprietary models scan fundamentals, technicals, and alternative data like news and filings specifically for the Indian market.
              </p>
            </div>
            <div className={styles.stepCard}>
              <div className={styles.stepNumber}>03</div>
              <h3 className={styles.stepTitle}>Actionable Insights</h3>
              <p className={styles.stepDesc}>
                Receive clear, plain-English recommendations, risk alerts, and deep-dive reports through our conversational AI interface.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Contact Section ─────────────────────────────────────────────── */}
      <section className={styles.contact} id="contact">
        <div className={styles.container}>
          <div className={styles.contactGrid}>
            <div className={styles.contactInfo}>
              <h2 className={styles.sectionTitle}>Get in Touch</h2>
              <p className={styles.sectionDesc}>
                Have questions about our AI models or institutional data sources? Our team of financial analysts is ready to help.
              </p>
              <div className={styles.contactDetails}>
                <div className={styles.contactItem}>
                  <div className={styles.contactIcon}>📍</div>
                  <div>
                    <strong>Office</strong>
                    <p>BKC, Mumbai, Maharashtra, India</p>
                  </div>
                </div>
                <div className={styles.contactItem}>
                  <div className={styles.contactIcon}>✉️</div>
                  <div>
                    <strong>Email</strong>
                    <p>support@arthanova.in</p>
                  </div>
                </div>
              </div>
            </div>
            <form className={styles.contactForm} onSubmit={(e) => e.preventDefault()}>
              <div className="form-group">
                <label>Full Name</label>
                <input type="text" className="form-control" placeholder="John Doe" />
              </div>
              <div className="form-group">
                <label>Email Address</label>
                <input type="email" className="form-control" placeholder="john@example.com" />
              </div>
              <div className="form-group">
                <label>Message</label>
                <textarea className="form-control" rows="4" placeholder="How can we help you?"></textarea>
              </div>
              <button type="submit" className="btn btn-primary btn-full">Send Message</button>
            </form>
          </div>
        </div>
      </section>

    </div>
  )
}
