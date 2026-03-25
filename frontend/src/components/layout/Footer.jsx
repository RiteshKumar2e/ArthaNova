import { useState } from 'react'
import { Link } from 'react-router-dom'
import styles from '../../styles/components/layout/Footer.module.css'
import popupStyles from '../../styles/components/layout/FooterPopup.module.css'
import { FaLinkedin, FaGithub, FaEnvelope } from 'react-icons/fa'

const LINK_DETAILS = {
  'Dashboard': { title: 'DASHBOARD', desc: 'Centralized command center for your investments. View real-time metrics, portfolio health, and AI-driven market summaries in one clean Neobrutalist interface.' },
  'Stock Explorer': { title: 'STOCK EXPLORER', desc: 'Deep-dive into individual equities. Access fundamental data, technical charts, AI sentiment scores, and institutional holding patterns instantly.' },
  'Opportunity Radar': { title: 'OPPORTUNITY RADAR', desc: 'Our proprietary screening engine. Discover high-probability setups based on volume surges, MACD crossovers, and hidden algorithmic anomalies.' },
  'AI Chat': { title: 'AI CHAT', desc: 'Your personal financial quantitative analyst. Ask complex queries like "Why did HDFC Bank drop?" and get data-backed, actionable insights instantly.' },
  'Portfolio': { title: 'PORTFOLIO INTELLIGENCE', desc: 'Track your holdings with precision. The Agentic AI analyzes your asset allocation and simulates potential macro-economic impacts on your net worth.' },
  'Market Overview': { title: 'MARKET OVERVIEW', desc: 'Bird\'s-eye view of the Indian stock market. Track Nifty, Bank Nifty, top sector performers, and overall market breadth in real-time.' },
  'News Intelligence': { title: 'NEWS INTELLIGENCE', desc: 'More than just headlines. Our NLP agents categorize news as bullish or bearish and map the direct impact to specific sectors and stocks.' },
  'IPO Tracker': { title: 'IPO TRACKER', desc: 'Stay ahead of primary markets. Get AI-generated subscription recommendations, grey market premium (GMP) updates, and listing day projections.' },
  'Insider Activity': { title: 'INSIDER ACTIVITY', desc: 'Follow the smart money. Real-time alerts on promoter buying, selling, and pledging activities to gauge management conviction.' },
  'Bulk & Block Deals': { title: 'BULK & BLOCK DEALS', desc: 'Institutional footprint tracking. See which Mutual Funds, FIIs, or HNIs are accumulating or dumping specific mid and small-cap stocks.' },
  'About Us': { title: 'ABOUT ARTHANOVA', desc: 'Built by engineers and quantitative analysts. Our mission is to democratize institutional-grade financial intelligence for retail investors through autonomous agents.' },
  'Features': { title: 'PLATFORM FEATURES', desc: 'We merge Generative AI, real-time data streaming, and Neo-brutalist design to bring you the fastest and most intuitive stock analysis tool.' },
  'How It Works': { title: 'HOW IT WORKS', desc: 'ArthaNova leverages multi-agent LangGraph orchestration. Agents scour data sources, cross-verify findings, and synthesize high-conviction alerts automatically.' },
  'Contact': { title: 'CONTACT US', desc: 'Reach out to us via email at riteshkumar90359@gmail.com for support, feedback or enterprise API access.' },
  'Privacy Policy': { title: 'PRIVACY POLICY', desc: 'Your data is encrypted and strictly secure. We adhere to localized data regulations like the DPDP Act and never sell your personal financial information.' },
  'Terms of Service': { title: 'TERMS OF SERVICE', desc: 'The legal agreement governing your usage of our intelligence platform. Outlines our responsibilities as an AI intelligence provider and your rights.' },
  'Disclaimer': { title: 'FINANCIAL DISCLAIMER', desc: 'Information provided by ArthaNova is strictly for educational purposes and algorithmic exploration. It does not constitute SEBI-registered financial advice.' },
  'SEBI Disclosure': { title: 'SEBI DISCLOSURE', desc: 'Regulatory compliance statements detailing that ArthaNova functions as an analytical software tool and not a registered investment advisor.' }
}

export default function Footer() {
  const [activePopup, setActivePopup] = useState(null)

  const handleLinkClick = (e, linkName) => {
    e.preventDefault()
    if (LINK_DETAILS[linkName]) {
      setActivePopup(LINK_DETAILS[linkName])
    }
  }

  const closePopup = () => setActivePopup(null)

  return (
    <>
      <footer className={styles.footer}>
        <div className={styles.container}>
          <div className={styles.top}>
            <div className={styles.brand}>
              <div className={styles.brandRow}>
                <span className={styles.brandIcon}>▲</span>
                <span className={styles.brandName}>ArthaNova</span>
              </div>
              <p className={styles.brandDesc}>
                AI-powered investment intelligence platform for India's retail investors. 
                Transform raw financial data into actionable insights.
              </p>
              <div className={styles.socials}>
                <a href="https://www.linkedin.com/in/riteshkumar-tech/" target="_blank" rel="noopener noreferrer" className={styles.social} aria-label="LinkedIn"><FaLinkedin /></a>
                <a href="https://github.com/RiteshKumar2e" target="_blank" rel="noopener noreferrer" className={styles.social} aria-label="GitHub"><FaGithub /></a>
                <a href="mailto:riteshkumar90359@gmail.com" className={styles.social} aria-label="Email"><FaEnvelope /></a>
              </div>
            </div>

            <div className={styles.linksGrid}>
              <div className={styles.linkGroup}>
                <h4>Platform</h4>
                <a href="#" onClick={(e) => handleLinkClick(e, 'Dashboard')}>Dashboard</a>
                <a href="#" onClick={(e) => handleLinkClick(e, 'Stock Explorer')}>Stock Explorer</a>
                <a href="#" onClick={(e) => handleLinkClick(e, 'Opportunity Radar')}>Opportunity Radar</a>
                <a href="#" onClick={(e) => handleLinkClick(e, 'AI Chat')}>AI Chat</a>
                <a href="#" onClick={(e) => handleLinkClick(e, 'Portfolio')}>Portfolio</a>
              </div>
              <div className={styles.linkGroup}>
                <h4>Markets</h4>
                <a href="#" onClick={(e) => handleLinkClick(e, 'Market Overview')}>Market Overview</a>
                <a href="#" onClick={(e) => handleLinkClick(e, 'News Intelligence')}>News Intelligence</a>
                <a href="#" onClick={(e) => handleLinkClick(e, 'IPO Tracker')}>IPO Tracker</a>
                <a href="#" onClick={(e) => handleLinkClick(e, 'Insider Activity')}>Insider Activity</a>
                <a href="#" onClick={(e) => handleLinkClick(e, 'Bulk & Block Deals')}>Bulk & Block Deals</a>
              </div>
              <div className={styles.linkGroup}>
                <h4>Company</h4>
                <a href="#" onClick={(e) => handleLinkClick(e, 'About Us')}>About Us</a>
                <a href="#" onClick={(e) => handleLinkClick(e, 'Features')}>Features</a>
                <a href="#" onClick={(e) => handleLinkClick(e, 'How It Works')}>How It Works</a>
                <a href="#" onClick={(e) => handleLinkClick(e, 'Contact')}>Contact</a>
              </div>
              <div className={styles.linkGroup}>
                <h4>Legal</h4>
                <a href="#" onClick={(e) => handleLinkClick(e, 'Privacy Policy')}>Privacy Policy</a>
                <a href="#" onClick={(e) => handleLinkClick(e, 'Terms of Service')}>Terms of Service</a>
                <a href="#" onClick={(e) => handleLinkClick(e, 'Disclaimer')}>Disclaimer</a>
                <a href="#" onClick={(e) => handleLinkClick(e, 'SEBI Disclosure')}>SEBI Disclosure</a>
              </div>
            </div>
          </div>

          <div className={styles.bottom}>
            <p>© {new Date().getFullYear()} ArthaNova. All rights reserved.</p>
            <p className={styles.disclaimer}>
              ⚠️ Investment involves risk. This platform provides AI-based analysis for informational purposes only and does not constitute SEBI-registered investment advice.
            </p>
          </div>
        </div>
      </footer>

      {activePopup && (
        <div className={popupStyles.popupOverlay} onClick={closePopup}>
          <div className={popupStyles.popupContent} onClick={(e) => e.stopPropagation()}>
            <button className={popupStyles.popupClose} onClick={closePopup} aria-label="Close popup">×</button>
            <div className={popupStyles.popupTitle}>{activePopup.title}</div>
            <p className={popupStyles.popupDesc}>{activePopup.desc}</p>
          </div>
        </div>
      )}
    </>
  )
}
