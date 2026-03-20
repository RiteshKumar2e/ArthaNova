import { NavLink, useNavigate } from 'react-router-dom'
import { useAuthStore } from '../../store/authStore'
import styles from '../../styles/components/layout/Sidebar.module.scss'

const NAV_ITEMS = [
  {
    section: 'Main', items: [
      { to: '/dashboard', icon: '⊞', label: 'Dashboard', roles: ['user', 'admin'] },
      { to: '/market', icon: '📊', label: 'Market Overview', roles: ['user', 'admin'] },
      { to: '/stocks', icon: '🔍', label: 'Stock Explorer', roles: ['user', 'admin'] },
    ]
  },
  {
    section: 'Personal', items: [
      { to: '/portfolio', icon: '💼', label: 'Portfolio', roles: ['user', 'admin'] },
      { to: '/watchlist', icon: '⭐', label: 'Watchlist', roles: ['user', 'admin'] },
      { to: '/ai-chat', icon: '🤖', label: 'AI Chat', roles: ['user', 'admin'] },
    ]
  },
  {
    section: 'Tools', items: [
      { to: '/radar', icon: '🎯', label: 'Opportunity Radar', roles: ['user', 'admin'] },
    ]
  },
  {
    section: 'SYSTEM', items: [
      { to: '/backtest', icon: '🔄', label: 'Backtesting', roles: ['admin'] },
      { to: '/filings', icon: '📋', label: 'Filings Analyzer', roles: ['admin'] },
    ]
  },
  {
    section: 'Settings', items: [
      { to: '/notifications', icon: '🔔', label: 'Notifications', roles: ['user', 'admin'] },
      { to: '/profile', icon: '👤', label: 'Profile', roles: ['user', 'admin'] },
      { to: '/settings', icon: '⚙️', label: 'Settings', roles: ['user', 'admin'] },
    ]
  },
]

export default function Sidebar({ collapsed, onToggle }) {
  const { user, logout } = useAuthStore()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/', { replace: true })
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
        {NAV_ITEMS.map((section) => {
          const filteredItems = section.items.filter(item =>
            !item.roles || item.roles.includes(user?.role || 'user')
          )

          if (filteredItems.length === 0) return null

          return (
            <div key={section.section} className={styles.navSection}>
              {!collapsed && (
                <div className={styles.sectionLabel}>{section.section}</div>
              )}
              {filteredItems.map((item) => (
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
          )
        })}
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
