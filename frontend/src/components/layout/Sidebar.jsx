import { NavLink, useNavigate } from 'react-router-dom'
import { useAuthStore } from '../../store/authStore'
import styles from '../../styles/components/layout/Sidebar.module.scss'

const NAV_ITEMS = [
  { section: 'Overview', items: [
    { to: '/dashboard', icon: '⊞', label: 'Dashboard' },
    { to: '/market', icon: '📊', label: 'Market Overview' },
  ]},
  { section: 'Discover', items: [
    { to: '/stocks', icon: '🔍', label: 'Stock Explorer' },
    { to: '/radar', icon: '🎯', label: 'Opportunity Radar' },
    { to: '/technical', icon: '📈', label: 'Technical Analysis' },
  ]},
  { section: 'Portfolio', items: [
    { to: '/portfolio', icon: '💼', label: 'Portfolio' },
    { to: '/watchlist', icon: '⭐', label: 'Watchlist' },
    { to: '/risk', icon: '🛡️', label: 'Risk Analyzer' },
    { to: '/backtest', icon: '🔁', label: 'Backtesting' },
  ]},
  { section: 'Intelligence', items: [
    { to: '/ai-chat', icon: '🤖', label: 'AI Chat' },
    { to: '/news', icon: '📰', label: 'News Intelligence' },
    { to: '/filings', icon: '📋', label: 'Filings Analyzer' },
    { to: '/videos', icon: '🎬', label: 'Video Insights' },
  ]},
  { section: 'Market Data', items: [
    { to: '/insider', icon: '👤', label: 'Insider Activity' },
    { to: '/deals', icon: '🤝', label: 'Bulk & Block Deals' },
    { to: '/ipo', icon: '🚀', label: 'IPO Tracker' },
  ]},
  { section: 'Account', items: [
    { to: '/notifications', icon: '🔔', label: 'Notifications' },
    { to: '/profile', icon: '👤', label: 'Profile' },
    { to: '/settings', icon: '⚙️', label: 'Settings' },
    { to: '/admin', icon: '🛠️', label: 'Admin Panel' },
  ]},
]

export default function Sidebar({ collapsed, onToggle }) {
  const { user, logout } = useAuthStore()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  return (
    <aside className={`${styles.sidebar} ${collapsed ? styles.collapsed : ''}`}>
      {/* Brand */}
      <div className={styles.brand}>
        <span className={styles.brandIcon}>▲</span>
        {!collapsed && (
          <div>
            <div className={styles.brandName}>ArthaNova</div>
            <div className={styles.brandTagline}>AI for India</div>
          </div>
        )}
      </div>

      {/* User Info */}
      {!collapsed && user && (
        <div className={styles.userInfo}>
          <div className={styles.userAvatar}>
            {user.full_name?.charAt(0).toUpperCase() || 'U'}
          </div>
          <div className={styles.userDetails}>
            <div className={styles.userName}>{user.full_name}</div>
            <div className={styles.userEmail}>{user.email}</div>
          </div>
        </div>
      )}

      {/* Navigation */}
      <nav className={styles.nav}>
        {NAV_ITEMS.map((section) => (
          <div key={section.section} className={styles.navSection}>
            {!collapsed && (
              <div className={styles.sectionLabel}>{section.section}</div>
            )}
            {section.items.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `${styles.navItem} ${isActive ? styles.active : ''}`
                }
                title={collapsed ? item.label : undefined}
              >
                <span className={styles.navIcon}>{item.icon}</span>
                {!collapsed && <span className={styles.navLabel}>{item.label}</span>}
              </NavLink>
            ))}
          </div>
        ))}
      </nav>

      {/* Bottom Actions */}
      <div className={styles.bottom}>
        <button onClick={onToggle} className={styles.collapseBtn} title="Toggle sidebar">
          {collapsed ? '→' : '←'}
        </button>
        {!collapsed && (
          <button onClick={handleLogout} className={styles.logoutBtn}>
            <span>⬡</span> Logout
          </button>
        )}
      </div>
    </aside>
  )
}
