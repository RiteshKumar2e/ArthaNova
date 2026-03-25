import { Link } from 'react-router-dom'
import styles from '../../styles/components/layout/Footer.module.css'
import { FaLinkedin, FaGithub, FaEnvelope } from 'react-icons/fa'

export default function Footer() {
  return (
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
              <Link to="/dashboard">Dashboard</Link>
              <Link to="/stocks">Stock Explorer</Link>
              <Link to="/radar">Opportunity Radar</Link>
              <Link to="/ai-chat">AI Chat</Link>
              <Link to="/portfolio">Portfolio</Link>
            </div>
            <div className={styles.linkGroup}>
              <h4>Markets</h4>
              <Link to="/market">Market Overview</Link>
              <Link to="/news">News Intelligence</Link>
              <Link to="/ipo">IPO Tracker</Link>
              <Link to="/insider">Insider Activity</Link>
              <Link to="/deals">Bulk &amp; Block Deals</Link>
            </div>
            <div className={styles.linkGroup}>
              <h4>Company</h4>
              <Link to="/about">About Us</Link>
              <Link to="/features">Features</Link>
              <Link to="/how-it-works">How It Works</Link>
              <Link to="/contact">Contact</Link>
            </div>
            <div className={styles.linkGroup}>
              <h4>Legal</h4>
              <a href="#">Privacy Policy</a>
              <a href="#">Terms of Service</a>
              <a href="#">Disclaimer</a>
              <a href="#">SEBI Disclosure</a>
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
  )
}
