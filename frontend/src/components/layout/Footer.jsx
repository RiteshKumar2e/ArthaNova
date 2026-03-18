import { Link } from 'react-router-dom'
import styles from '../../styles/components/layout/Footer.module.scss'

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
              <a href="#" className={styles.social}>𝕏</a>
              <a href="#" className={styles.social}>in</a>
              <a href="#" className={styles.social}>YT</a>
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
              <a href="#">About Us</a>
              <a href="#">Blog</a>
              <a href="#">Careers</a>
              <a href="#">Press</a>
              <a href="#">Contact</a>
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
