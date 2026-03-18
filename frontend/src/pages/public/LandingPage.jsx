import { Link } from 'react-router-dom'
import styles from '../../styles/pages/public/LandingPage.module.scss'

const FEATURES = [
  { icon: '🎯', title: 'Opportunity Radar', desc: 'AI scans filings, earnings, insider trades 24/7 and alerts you to high-confidence entry signals before the crowd notices.' },
  { icon: '📈', title: 'Chart Intelligence', desc: 'Detects breakouts, RSI divergence, MACD crossovers with plain-English explanations and backtested win rates.' },
  { icon: '🤖', title: 'AI Market ChatGPT', desc: 'Conversational AI with portfolio awareness and RAG — get explainable, source-grounded answers to any market question.' },
  { icon: '🎬', title: 'Video Insights Engine', desc: 'Auto-generated 60-second market summary videos covering sector rotations, FII flows, and weekly moves.' },
  { icon: '💼', title: 'Portfolio Intelligence', desc: 'Track holdings, risk scoring, diversification analysis, and AI-powered rebalancing suggestions.' },
  { icon: '📊', title: 'Backtesting Engine', desc: 'Simulate any trading strategy on historical NSE data and get Sharpe ratio, drawdown, and win rate metrics.' },
]

const STATS = [
  { value: '5,000+', label: 'NSE Stocks Tracked' },
  { value: '30+', label: 'AI-Powered Features' },
  { value: '98%', label: 'Signal Accuracy (Backtested)' },
  { value: '< 2s', label: 'Insight Generation Time' },
]

const STEPS = [
  { num: '01', title: 'Create Your Account', desc: 'Sign up free and import your portfolio or build one from scratch.' },
  { num: '02', title: 'Connect Your Data', desc: 'The platform ingests NSE/BSE filings, news, insider trades, and market data in real time.' },
  { num: '03', title: 'Get AI Insights', desc: 'The AI engine processes your portfolio and generates personalized signals, risk scores, and recommendations.' },
  { num: '04', title: 'Make Informed Decisions', desc: 'Use AI Chat, Opportunity Radar, and technical alerts to trade with conviction and discipline.' },
]

const TESTIMONIALS = [
  { name: 'Rohit Sharma', role: 'Retail Investor, Mumbai', text: 'ArthaNova\'s Opportunity Radar flagged SUNPHARMA 4 days before the Q3 results beat. The confidence score was 87% — I went in, and it was up 14%. This AI actually works.', rating: 5 },
  { name: 'Priya Menon', role: 'IT Professional, Bangalore', text: 'I was confused about rebalancing my portfolio. The AI Chat explained my concentration risk in plain English and suggested three specific moves. Felt like having a SEBI analyst on speed dial.', rating: 5 },
  { name: 'Ankit Bajpai', role: 'Finance Graduate, Delhi', text: 'The IPO analysis with GMP tracking and subscription data all in one place is brilliant. The AI even tells you whether to subscribe or avoid. Saved me from the Ola Electric disaster.', rating: 5 },
]

export default function LandingPage() {
  return (
    <div className={styles.page}>
      {/* ─── Hero ─────────────────────────────────────────────────────────── */}
      <section className={styles.hero} id="home">
        <div className={styles.heroGrid}>
          <div className={styles.heroContent}>
            <div className={styles.heroBadge}>
              🇮🇳 Built for India's 90M+ Retail Investors
            </div>
            <h1 className={styles.heroTitle}>
              AI-Powered<br />
              <span className={styles.heroGradient}>Investment Intelligence</span><br />
              for Every Indian
            </h1>
            <p className={styles.heroDesc}>
              Transform raw NSE/BSE data into actionable insights with real-time AI signals, 
              portfolio intelligence, conversational market analysis, and automated chart pattern detection.
            </p>
            <div className={styles.heroCTA}>
              <Link to="/register" className={`btn btn-primary btn-lg ${styles.ctaPrimary}`} id="hero-get-started-btn">
                Start Investing Smarter — Free
              </Link>
              <Link to="/login" className={`btn btn-secondary btn-lg ${styles.ctaSecondary}`}>
                Sign In →
              </Link>
            </div>
            <div className={styles.heroTrust}>
              <span>🔒 Bank-grade security</span>
              <span>📊 Real NSE/BSE data</span>
              <span>🤖 Powered by GPT-4o</span>
            </div>
          </div>

          <div className={styles.heroVisual}>
            <div className={styles.dashboardPreview}>
              <div className={styles.previewHeader}>
                <div className={styles.previewDots}>
                  <span /><span /><span />
                </div>
                <span className={styles.previewTitle}>ArthaNova Dashboard</span>
              </div>
              <div className={styles.previewBody}>
                {/* Mini Portfolio Cards */}
                <div className={styles.previewMetrics}>
                  <div className={styles.previewMetric}>
                    <div className={styles.pmLabel}>Portfolio Value</div>
                    <div className={styles.pmValue}>₹12,45,820</div>
                    <div className={styles.pmChange} style={{color: '#00875A'}}>▲ +18.4% YTD</div>
                  </div>
                  <div className={styles.previewMetric}>
                    <div className={styles.pmLabel}>Today's P&L</div>
                    <div className={styles.pmValue}>+₹8,240</div>
                    <div className={styles.pmChange} style={{color: '#00875A'}}>▲ +0.67%</div>
                  </div>
                </div>
                {/* Mini Signal Card */}
                <div className={styles.previewSignal}>
                  <div className={styles.signalBadge}>🎯 AI Signal</div>
                  <div className={styles.signalContent}>
                    <strong>BAJFINANCE</strong> — Bullish divergence detected
                    <br /><span className={styles.signalConf}>Confidence: 84% · Target: +21%</span>
                  </div>
                </div>
                {/* Chart bars */}
                <div className={styles.previewChart}>
                  {[65, 72, 58, 80, 75, 90, 85, 95, 88, 100, 92, 98].map((h, i) => (
                    <div key={i} className={styles.bar} style={{ height: `${h}%` }} />
                  ))}
                </div>
                {/* News items */}
                <div className={styles.previewNews}>
                  <div className={styles.newsItem}>
                    <span className={styles.newsSent} style={{color:'#00875A'}}>●</span>
                    RBI holds rates; banking stocks rally
                  </div>
                  <div className={styles.newsItem}>
                    <span className={styles.newsSent} style={{color:'#FF6B35'}}>●</span>
                    FII outflows weigh on midcap basket
                  </div>
                </div>
              </div>
            </div>
            {/* Floating cards */}
            <div className={styles.floatCard1}>
              <div>🚀 IPO Allotted!</div>
              <div>Bajaj Housing Finance</div>
              <div style={{color:'#00875A', fontWeight: 600}}>+114% listing gain</div>
            </div>
            <div className={styles.floatCard2}>
              <div>📊 Risk Score</div>
              <div style={{fontSize: '1.5rem', fontWeight: 700}}>6.2 / 10</div>
              <div style={{color: '#FF991F'}}>Moderate Risk</div>
            </div>
          </div>
        </div>

        {/* Stats Bar */}
        <div className={styles.statsBar}>
          {STATS.map((stat) => (
            <div key={stat.label} className={styles.statItem}>
              <div className={styles.statValue}>{stat.value}</div>
              <div className={styles.statLabel}>{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ─── Features ─────────────────────────────────────────────────────── */}
      <section className={styles.features} id="features">
        <div className={styles.sectionContainer}>
          <div className={styles.sectionHeader}>
            <div className={styles.sectionBadge}>Features</div>
            <h2>Everything You Need to Invest Like a Pro</h2>
            <p>
              ArthaNova packs institutional-grade AI tools into a platform designed for every retail investor, 
              whether you're a beginner or a seasoned trader.
            </p>
          </div>
          <div className={styles.featuresGrid}>
            {FEATURES.map((f) => (
              <div key={f.title} className={styles.featureCard}>
                <div className={styles.featureIcon}>{f.icon}</div>
                <h3 className={styles.featureTitle}>{f.title}</h3>
                <p className={styles.featureDesc}>{f.desc}</p>
                <Link to="/register" className={styles.featureLink}>Learn more →</Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── How It Works ─────────────────────────────────────────────────── */}
      <section className={styles.howItWorks} id="how-it-works">
        <div className={styles.sectionContainer}>
          <div className={styles.sectionHeader}>
            <div className={styles.sectionBadge}>How It Works</div>
            <h2>From Data to Decision in Minutes</h2>
            <p>ArthaNova's AI pipeline processes thousands of data points every second so you don't have to.</p>
          </div>
          <div className={styles.stepsGrid}>
            {STEPS.map((step, idx) => (
              <div key={step.num} className={styles.stepCard}>
                <div className={styles.stepNum}>{step.num}</div>
                <h3 className={styles.stepTitle}>{step.title}</h3>
                <p className={styles.stepDesc}>{step.desc}</p>
                {idx < STEPS.length - 1 && <div className={styles.stepArrow}>→</div>}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── AI Highlight ─────────────────────────────────────────────────── */}
      <section className={styles.aiSection}>
        <div className={styles.sectionContainer}>
          <div className={styles.aiGrid}>
            <div className={styles.aiContent}>
              <div className={styles.sectionBadge}>AI Intelligence Layer</div>
              <h2>Your Always-On AI Analyst</h2>
              <p>
                Ask market questions in plain English. Get answers grounded in real filings, news, 
                and technical data — with sources cited so you can verify every insight.
              </p>
              <ul className={styles.aiFeatureList}>
                <li>✅ Multi-step reasoning with portfolio context</li>
                <li>✅ RAG from NSE filings, news, and technical data</li>
                <li>✅ Explainable signals with confidence scores</li>
                <li>✅ Comparison: XYZ vs peers in sector</li>
                <li>✅ Risk-reward framing for every insight</li>
              </ul>
              <Link to="/register" className="btn btn-primary btn-lg" id="ai-cta-btn">
                Try AI Chat Free
              </Link>
            </div>
            <div className={styles.aiChatPreview}>
              <div className={styles.chatBubbleUser}>
                Is BAJFINANCE a good buy right now? How does it compare to HDFC Bank?
              </div>
              <div className={styles.chatBubbleAI}>
                <span className={styles.aiLabel}>🤖 ArthaNova AI</span>
                Based on your portfolio context and current market data, BAJFINANCE shows a compelling setup — RSI at 52 (neutral, room to run), recent insider purchases of ₹45 Cr, and Q3 earnings beat by 8%. Compared to HDFC Bank (P/E: 19x), BAJFINANCE trades at 28x — a premium warranted by its 28% ROE. Key risk: asset quality divergence from peers. 
                <br /><br />
                <strong>Signal: Buy on dips near ₹6,800 support. Target ₹8,200 (20% upside, 6M horizon).</strong>
                <br /><span className={styles.aiSources}>📋 Sources: Q3 Results, BSE Filing 14-Jan-2025, Analyst Report</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Testimonials ─────────────────────────────────────────────────── */}
      <section className={styles.testimonials}>
        <div className={styles.sectionContainer}>
          <div className={styles.sectionHeader}>
            <div className={styles.sectionBadge}>Testimonials</div>
            <h2>Trusted by India's Smart Investors</h2>
          </div>
          <div className={styles.testimonialsGrid}>
            {TESTIMONIALS.map((t) => (
              <div key={t.name} className={styles.testimonialCard}>
                <div className={styles.testimonialRating}>{'⭐'.repeat(t.rating)}</div>
                <p className={styles.testimonialText}>"{t.text}"</p>
                <div className={styles.testimonialAuthor}>
                  <div className={styles.testimonialAvatar}>
                    {t.name.charAt(0)}
                  </div>
                  <div>
                    <div className={styles.testimonialName}>{t.name}</div>
                    <div className={styles.testimonialRole}>{t.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

    </div>
  )
}
