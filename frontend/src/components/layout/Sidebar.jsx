import { NavLink, useNavigate } from 'react-router-dom'
import { useAuthStore } from '../../store/authStore'
import styles from '../../styles/components/layout/Sidebar.module.css'

const USER_NAV = [
  {
    section: 'MAIN', items: [
      { to: '/dashboard', icon: '⊞', label: 'Dashboard', roles: ['user', 'admin'] },
      { to: '/market', icon: '📊', label: 'Market Overview', roles: ['user', 'admin'] },
      { to: '/stocks', icon: '🔍', label: 'Stock Explorer', roles: ['user', 'admin'] },
      { to: '/technical', icon: '📈', label: 'Technical Analysis', roles: ['user', 'admin'] },
    ]
  },
  {
    section: 'PERSONAL', items: [
      { to: '/portfolio', icon: '💼', label: 'Portfolio', roles: ['user', 'admin'] },
      { to: '/watchlist', icon: '⭐', label: 'Watchlist', roles: ['user', 'admin'] },
      { to: '/ai-chat', icon: '🤖', label: 'AI Chat', roles: ['user', 'admin'] },
    ]
  },
  {
    section: 'TOOLS', items: [
      { to: '/agent-intelligence', icon: '🔥', label: 'Agentic Intelligence', roles: ['user', 'admin'] },
      { to: '/radar', icon: '🎯', label: 'Opportunity Radar', roles: ['user', 'admin'] },
      { to: '/videos', icon: '🎬', label: 'AI Video Gen', roles: ['user', 'admin'] },
    ]
  },
  {
    section: 'SYSTEM', items: [
      { to: '/backtest', icon: '🔄', label: 'Backtesting', roles: ['user', 'admin'] },
      { to: '/filings', icon: '📋', label: 'Filings Analyzer', roles: ['user', 'admin'] },
    ]
  },
  {
    section: 'SETTINGS', items: [
      { to: '/notifications', icon: '🔔', label: 'Notifications', roles: ['user', 'admin'] },
      { to: '/profile', icon: '👤', label: 'Profile', roles: ['user', 'admin'] },
    ]
  },
]

const ADMIN_NAV = [
  { section: 'PLATFORM', items: [
    { to: '/admin', icon: '📊', label: 'Dashboard', exact: true },
    { to: '/admin/users', icon: '👥', label: 'User Management' },
    { to: '/admin/roles', icon: '🛡️', label: 'Role & Permissions' },
  ]},
  { section: 'OPERATIONS', items: [
    { to: '/admin/content', icon: '📝', label: 'Content Management' },
    { to: '/admin/data', icon: '💾', label: 'Data Management' },
    { to: '/admin/alerts', icon: '⚠️', label: 'Alerts Override' },
  ]},
  { section: 'INTELLIGENCE', items: [
    { to: '/admin/ai-models', icon: '🤖', label: 'AI Monitoring' },
    { to: '/admin/video-engine', icon: '🎬', label: 'Video Pipelines' },
  ]},
  { section: 'REPORTS', items: [
    { to: '/admin/analytics', icon: '📈', label: 'Platform Analytics' },
    { to: '/admin/logs', icon: '📋', label: 'Audit Logs' },
  ]},
  { section: 'TOOLS', items: [
    { to: '/agent-intelligence', icon: '🔥', label: 'Agentic Intelligence' },
    { to: '/technical', icon: '📈', label: 'Technical Analysis' },
    { to: '/backtest', icon: '🔄', label: 'Backtesting' },
    { to: '/filings', icon: '📋', label: 'Filings Analyzer' },
  ]},
  { section: 'SYSTEM', items: [
    { to: '/admin/settings', icon: '⚙️', label: 'System Settings' },
  ]},
]

export default function Sidebar({ collapsed, onToggle, onNavigate }) {
  const { user, logout } = useAuthStore()
  const navigate = useNavigate()
  const isAdmin = user?.role === 'admin' || user?.is_admin === true

  const handleLogout = () => {
    logout()
    navigate('/', { replace: true })
  }

  const navItems = isAdmin ? ADMIN_NAV : USER_NAV

  return (
    <aside 
      className={`${styles.sidebar} ${collapsed ? styles.collapsed : ''}`}
      onClick={(e) => e.stopPropagation()}
    >
      {/* Navigation */}
      {!collapsed && user && (
        <div className={styles.userInfo}>
          <div className={styles.userAvatar}>
            {user.full_name?.charAt(0).toUpperCase() || 'U'}
          </div>
          <div className={styles.userDetails}>
            <div className={styles.userName}>{user.full_name}</div>
            <div className={styles.userEmail}>{user.email}</div>
            {isAdmin && <div className={styles.adminBadge}>ADMIN</div>}
          </div>
        </div>
      )}

      {/* Navigation */}
      <nav className={styles.nav}>
        {navItems.map((section) => {
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
                  end={item.exact}
                  className={({ isActive }) =>
                    `${styles.navItem} ${isActive ? styles.active : ''}`
                  }
                  title={collapsed ? item.label : undefined}
                  onClick={onNavigate}
                >
                  {({ isActive }) => (
                    <>
                      <span className={styles.navIcon}>{item.icon}</span>
                      {!collapsed && <span className={styles.navLabel}>{item.label}</span>}
                      {isActive && !collapsed && isAdmin && <span className={styles.activeDot}></span>}
                    </>
                  )}
                </NavLink>
              ))}
            </div>
          )
        })}
      </nav>

      {/* Bottom Actions */}
      <div className={styles.bottom}>
        {!collapsed && isAdmin && (
          <div className={styles.adminStatus}>
            <span className={styles.adminIndicator}>⚙️ Admin Mode</span>
          </div>
        )}
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
