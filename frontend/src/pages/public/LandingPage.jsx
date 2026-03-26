import { useState } from 'react'
import { Link } from 'react-router-dom'
import styles from '../../styles/pages/public/LandingPage.module.css'

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



export default function LandingPage() {
  const [showModal, setShowModal] = useState(false)
  return (
    <div className={styles.page}>
      {/* ─── Hero Section (Home) ─────────────────────────────────────────── */}
      <section className={styles.hero} id="home">
        {/* Floating Decorative Elements */}
        <div className={`${styles.floatingBox} ${styles.box1}`}></div>
        <div className={`${styles.floatingBox} ${styles.box2}`}></div>
        <div className={`${styles.floatingBox} ${styles.box3}`}></div>

        <div className={styles.container}>
          <div className={styles.heroCentered}>
            <div className={styles.heroContent}>
              <div className={styles.badgeLine}>
                🚀 #1 INTELLIGENCE FOR MODERN INVESTORS
              </div>
              <h1 className={styles.heroTitle}>
                ArthaNova <br />
                <span className={styles.gradText}>THE SMART EDGE</span>
              </h1>
              <p className={styles.heroLead}>
                Intelligence for the Indian markets. Identify trends, manage risk, and invest with institutional-grade AI and data. 🚀
              </p>
              <div className={styles.ctaGroup}>
                <button 
                  onClick={() => setShowModal(true)}
                  className="btn btn-yellow btn-lg"
                  style={{cursor: 'pointer'}}
                >
                  LEARN MORE
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── About Section ─────────────────────────────────────────────────── */}
      <section className={styles.showcase} id="about">
        <div className={styles.container}>
          <div className={styles.showcaseGrid}>
            <div className={styles.showcaseImage}>
              <div className={styles.chatSample}>
                <div className={styles.chatUser}>Analyze my portfolio risk...</div>
                <div className={styles.chatAI}>
                  <div className={styles.aiHeader}>
                    <span className={styles.aiTag}>AI ANALYST</span>
                  </div>
                  <p>ArthaNova AI detects <strong>sector concentration</strong> in your current holdings. Recommendation: Diversify into Mid-cap IT or Consumer Goods.</p>
                  <div className={styles.aiFooter}>Sources: NSE Filings, Multi-Agent Analysis</div>
                </div>
              </div>
            </div>
            <div className={styles.showcaseContent}>
              <h2 className={styles.showcaseTitle}>Your Personal AI Analyst 🤖</h2>
              <p className={styles.showcaseText}>
                The markets move fast. ArthaNova's AI works 24/7 to scan every filing, 
                every news update, and every price movement.
              </p>
              <ul className={styles.checkList}>
                <li>✅ Context-aware portfolio analysis</li>
                <li>✅ Plain-English summaries</li>
                <li>✅ Real-time sentiment tracking</li>
                <li>✅ Source-grounded insights</li>
              </ul>
              <Link to="/login" className="btn btn-primary btn-lg">EXPLORE AI CHAT</Link>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Features Section ─────────────────────────────────────────── */}
      <section className={styles.capabilities} id="features">
        <div className={styles.container}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Precision Tools 🛠️</h2>
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

      {/* ─── How It Works Section ─────────────────────────────────────────── */}
      <section className={styles.howItWorks} id="how-it-works">
        <div className={styles.container}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>How It Works ⚙️</h2>
            <p className={styles.sectionDesc}>
              Three simple steps to institutional-grade market intelligence.
            </p>
          </div>
          <div className={styles.stepsGrid}>
            <div className={styles.stepCard}>
              <div className={styles.stepNumber}>01</div>
              <h3 className={styles.stepTitle}>Connect Data</h3>
              <p className={styles.stepDesc}>Link your portfolio or watchlist to start the AI-driven analysis engine.</p>
            </div>
            <div className={styles.stepCard}>
              <div className={styles.stepNumber}>02</div>
              <h3 className={styles.stepTitle}>Get Signals</h3>
              <p className={styles.stepDesc}>Receive real-time multi-factor signals and deep sentiment analysis on your holdings.</p>
            </div>
            <div className={styles.stepCard}>
              <div className={styles.stepNumber}>03</div>
              <h3 className={styles.stepTitle}>Execute Smart</h3>
              <p className={styles.stepDesc}>Use our AI analyst to validate your trades and manage risk like a pro.</p>
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
              <div className={styles.impactLabel}>INSTRUMENTS</div>
            </div>
            <div className={styles.impactItem}>
              <div className={styles.impactVal}>98%</div>
              <div className={styles.impactLabel}>ACCURACY</div>
            </div>
            <div className={styles.impactItem}>
              <div className={styles.impactVal}>&lt; 1s</div>
              <div className={styles.impactLabel}>LATENCY</div>
            </div>
            <div className={styles.impactItem}>
              <div className={styles.impactVal}>100%</div>
              <div className={styles.impactLabel}>TRANSPARENCY</div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Contact Section ─────────────────────────────────────────────── */}
      <section className={styles.contact} id="contact">
        <div className={styles.container}>
          <div className={styles.contactGrid}>
            <div className={styles.contactInfo}>
              <h2 className={styles.sectionTitle}>GET IN TOUCH ✉️</h2>
              <p className={styles.sectionDesc}>
                Have questions about our AI models? Our team is ready to help.
              </p>
              <div className={styles.contactDetails}>
                <div className={styles.contactItem}>
                  <div className={styles.contactIcon}>📍</div>
                  <div>
                    <strong>OFFICE</strong>
                    <p>BKC, Mumbai, India</p>
                  </div>
                </div>
                <div className={styles.contactItem}>
                  <div className={styles.contactIcon}>✉️</div>
                  <div>
                    <strong>EMAIL</strong>
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
                <textarea className="form-control" rows="4" placeholder="How can we help?"></textarea>
              </div>
              <button type="submit" className="btn btn-primary btn-full">SEND MESSAGE</button>
            </form>
          </div>
        </div>
      </section>

      {/* ─── Modal Popup ─────────────────────────────────────────────────── */}
      {showModal && (
        <div className={styles.modalOverlay} onClick={() => setShowModal(false)}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <button 
              className={styles.closeBtn}
              onClick={() => setShowModal(false)}
              aria-label="Close modal"
            >
              ✕
            </button>
            <h2 className={styles.modalTitle}>THE MEANING OF ARTHANOVA</h2>
            <div className={styles.modalContent}>
              <p className={styles.modalStatement}>
                <strong>"ARTHA"</strong> (अर्थ) — SANSKRIT FOR <em>WEALTH, VALUE, PROSPERITY</em><br/>
                <strong>+</strong> <strong>"NOVA"</strong> — LATIN FOR <em>NEW, BRIGHT, INNOVATION</em>
              </p>
              <blockquote className={styles.modalQuote}>
                <em>
                  "ArthaNova: Democratizing institutional-grade market intelligence for 14 crore+ Indian retail investors—turning data into wealth through AI-powered opportunity discovery, real-time technical intelligence, conversational wisdom, and portfolio-aware decisions."
                </em>
              </blockquote>
              <div className={styles.whyNameSection}>
                <h3 className={styles.whyNameTitle}>WHY THIS NAME?</h3>
                <p className={styles.whyNameText}>
                  <strong>Artha</strong> (Sanskrit) = Wealth & Prosperity | <strong>Nova</strong> (Latin) = New & Bright Innovation
                </p>
                <p className={styles.whyNameText}>
                  A beacon of institutional-grade intelligence, democratizing professional-grade market analysis for India's 14 crore+ retail investors.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

