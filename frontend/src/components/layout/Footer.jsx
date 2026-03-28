import { useState } from 'react'
import { Link } from 'react-router-dom'
import styles from '../../styles/components/layout/Footer.module.css'
import popupStyles from '../../styles/components/layout/FooterPopup.module.css'
import { FaLinkedin, FaGithub, FaEnvelope } from 'react-icons/fa'

const LINK_DETAILS = {
  'Dashboard': { 
    title: 'DASHBOARD', 
    status: 'LIVE', 
    tags: ['Portfolio Tracking', 'Real-Time', 'Command Center'],
    desc: 'Your central command center. View real-time portfolio metrics, active alerts, and AI-synthesized market summaries in one clean, actionable interface.',
    features: ['Aggregated API connections for live data', 'Customizable Neo-Brutalist widgets', 'Instant P&L tracking and risk visualization']
  },
  'Stock Explorer': { 
    title: 'STOCK EXPLORER', 
    status: 'LIVE', 
    tags: ['Equities', 'Fundamentals', 'Sentiment'],
    desc: 'Deep-dive into individual equities. Access specialized technical indicators, AI sentiment scores, and historical data instantly without the clutter.',
    features: ['Technical charts with auto-pattern recognition', 'NLP-based sentiment scoring from recent news', 'Institutional holding patterns (FII/DII)']
  },
  'Opportunity Radar': { 
    title: 'OPPORTUNITY RADAR', 
    status: 'LIVE', 
    tags: ['Screening Engine', 'Breakouts', 'Volume Surge'],
    desc: 'Our proprietary screening engine. Discover high-probability setups driven by algorithmic anomalies, insider buying, and breakout patterns.',
    features: ['Real-time MACD & RSI crossover alerts', 'Volume surge detection algorithms', 'Automated anomaly highlighting']
  },
  'AI Chat': { 
    title: 'AI CHAT', 
    status: 'BETA', 
    tags: ['LLM', 'RAG Context', 'Quant'],
    desc: 'Your personal financial quant. Ask complex queries and receive data-backed, institutional-grade insights instantly using RAG-powered Large Language Models.',
    features: ['Context-aware chat using Groq/Llama-3', 'Query execution over live stock databases', 'Conversational technical analysis']
  },
  'Portfolio': { 
    title: 'PORTFOLIO', 
    status: 'LIVE', 
    tags: ['Risk Analysis', 'Stress Test', 'Asset Allocation'],
    desc: 'Track and stress-test your holdings. The AI analyzes your concentration risk and predicts how emerging news events might impact your net worth.',
    features: ['Automated rebalancing recommendations', 'News impact simulation on specific holdings', 'Sector overweight/underweight alerts']
  },
  'Market Overview': { 
    title: 'MARKET OVERVIEW', 
    status: 'LIVE', 
    tags: ['Macro', 'Indices', 'Breadth'],
    desc: 'A live, macro-level snapshot of the Indian economy. Track indices, sectoral momentum, FII/DII activity, and options data in real-time.',
    features: ['Nifty50 & BankNifty heatmaps', 'Live Market Breadth (Advances vs Declines)', 'Global market correlation metrics']
  },
  'News Intelligence': { 
    title: 'NEWS INTELLIGENCE', 
    status: 'BETA', 
    tags: ['NLP', 'Auto-Classification', 'Filings'],
    desc: 'Our NLP agents contextualize regulatory filings and news, auto-classifying them as bullish or bearish and mapping their direct impacts.',
    features: ['Sentiment polarity scoring (Bullish/Bearish)', 'Sector and stock tagging algorithms', 'Spam/Noise filtering for pure signal']
  },
  'IPO Tracker': { 
    title: 'IPO TRACKER', 
    status: 'BETA', 
    tags: ['Primary Market', 'GMP', 'Projections'],
    desc: 'Stay ahead of primary markets. Get AI-generated subscription recommendations and grey market premium (GMP) projections before listing.',
    features: ['Live grey market premium tracking', 'AI subscription recommendations', 'Detailed DRHP summarization']
  },
  'Insider Activity': { 
    title: 'INSIDER ACTIVITY', 
    status: 'LIVE', 
    tags: ['Promoters', 'Pledging', 'Smart Money'],
    desc: 'Follow the smart money. Receive instant alerts on promoter buying, selling, or pledging activities to gauge genuine management conviction.',
    features: ['Real-time promoter transaction logs', 'Pledged shares monitor', 'Historical insider conviction scoring']
  },
  'Bulk & Block Deals': { 
    title: 'BULK & BLOCK DEALS', 
    status: 'LIVE', 
    tags: ['HNI', 'FII', 'Institutional'],
    desc: 'Track institutional blueprints. Monitor which domestic funds and FIIs are actively accumulating or dumping specific mid and small-cap stocks.',
    features: ['Daily block/bulk deal screener', 'Buyer/Seller counterparty mapping', 'Volume impact analysis']
  },
  'About Us': { 
    title: 'ABOUT ARTHANOVA', 
    status: 'INFO', 
    tags: ['Mission', 'Team', 'Vision'],
    desc: 'Built by engineers and quantitative analysts. Our mission is to democratize institutional-grade financial intelligence for retail investors through autonomous agents.',
    features: ['Founded with a focus on retail empowerment', 'Engineering-first approach to finance', 'Transparent, ad-free environment']
  },
  'Features': { 
    title: 'FEATURES', 
    status: 'INFO', 
    tags: ['Design', 'Engine', 'Speed'],
    desc: 'We merge Generative AI, real-time data streaming, and Neo-brutalist design to bring you the fastest and most intuitive stock analysis tool.',
    features: ['High-contrast Neo-Brutalist UX', 'Multi-Agent LangGraph architecture', 'Lightning-fast API responses']
  },
  'How It Works': { 
    title: 'HOW IT WORKS', 
    status: 'INFO', 
    tags: ['Orchestration', 'LLM', 'Data'],
    desc: 'ArthaNova leverages multi-agent orchestrations. Agents scour data sources, cross-verify findings, and synthesize high-conviction alerts automatically.',
    features: ['Signal Agent: Scans the market', 'Context Agent: Adds historical weight', 'Analyst Agent: Generates the final alpha signal']
  },
  'Contact': { 
    title: 'CONTACT US', 
    status: 'INFO', 
    tags: ['Support', 'Enterprise', 'Feedback'],
    desc: 'Need support, have feedback or want to discuss enterprise API solutions? Reach out to us directly.',
    features: ['Email: riteshkumar90359@gmail.com', 'GitHub: github.com/RiteshKumar2e', 'LinkedIn: in/riteshkumar-tech']
  },
  'Privacy Policy': { 
    title: 'PRIVACY POLICY', 
    status: 'LEGAL', 
    tags: ['Data Security', 'DPDP Act', 'Encryption'],
    desc: 'Your data is encrypted and strictly secure. We adhere to localized data regulations like the DPDP Act and never sell your personal financial information.',
    features: ['End-to-End Encryption', 'No third-party data selling', 'Full data deletion rights']
  },
  'Terms of Service': { 
    title: 'TERMS OF SERVICE', 
    status: 'LEGAL', 
    tags: ['Agreement', 'Rights', 'Usage'],
    desc: 'The legal agreement governing your usage of our intelligence platform. Outlines our responsibilities as an AI intelligence provider and your rights.',
    features: ['Clear usage boundaries', 'API rate limiting rules', 'User rights and protections']
  },
  'Disclaimer': { 
    title: 'FINANCIAL DISCLAIMER', 
    status: 'LEGAL', 
    tags: ['Not Advice', 'Educational', 'Risk'],
    desc: 'Information provided by ArthaNova is strictly for educational purposes and algorithmic exploration. It does not constitute SEBI-registered financial advice.',
    features: ['No guaranteed returns', 'Do your own research (DYOR)', 'Market risks apply']
  },
  'SEBI Disclosure': { 
    title: 'SEBI DISCLOSURE', 
    status: 'LEGAL', 
    tags: ['Compliance', 'Software', 'Non-Advisory'],
    desc: 'Regulatory compliance statements detailing that ArthaNova functions as an analytical software tool and not a registered investment advisor.',
    features: ['Unbiased algorithmic data', 'No SEBI registration claimed', 'Full transparency of algorithms']
  },
  'License': { 
    title: 'PROPRIETARY LICENSE', 
    status: 'LEGAL', 
    tags: ['All Rights Reserved', 'Proprietary', 'Copyright'],
    desc: 'ArthaNova is proprietary software. All rights reserved by Ritesh Kumar. No part of this software — including its code, design, UI, or assets — may be used, copied, or distributed without explicit written permission.',
    features: [
      'Copyright (c) 2022 Ritesh Kumar. All Rights Reserved.',
      'Unauthorized use, copying, or distribution is strictly prohibited',
      'Design, UI elements, and branding are exclusively proprietary',
      'No license is granted to any person without written consent',
      'Violations may result in civil and/or criminal penalties'
    ]
  }
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
                <a href="#" onClick={(e) => handleLinkClick(e, 'License')}>License</a>
              </div>
            </div>
          </div>

          <div className={styles.bottom}>
            <div className={styles.copyrightRow}>
              <div />
              <p className={styles.copyrightText}>© {new Date().getFullYear()} ARTHANOVA. ALL RIGHTS RESERVED.</p>
              <div className={styles.builderContainer}>
                <p className={styles.builder}>BUILD BY RITESH KUMAR WITH <span className={styles.heart}>❤️</span></p>
              </div>
            </div>
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
            
            <div className={popupStyles.popupHeader}>
              <h3 className={popupStyles.popupTitle}>{activePopup.title}</h3>
              <div className={`${popupStyles.popupStatus} ${activePopup.status === 'BETA' ? popupStyles.beta : ''}`}>
                APP STATUS: {activePopup.status}
              </div>
            </div>

            <div className={popupStyles.popupTags}>
              {activePopup.tags.map(tag => (
                <span key={tag} className={popupStyles.popupTag}>{tag}</span>
              ))}
            </div>

            <p className={popupStyles.popupDesc}>{activePopup.desc}</p>

            <div className={popupStyles.popupFeaturesBox}>
              <span className={popupStyles.popupFeaturesTitle}>KEY CAPABILITIES</span>
              <ul className={popupStyles.popupFeatureList}>
                {activePopup.features.map((feature, idx) => (
                  <li key={idx} className={popupStyles.popupFeatureItem}>{feature}</li>
                ))}
              </ul>
            </div>

          </div>
        </div>
      )}
    </>
  )
}
