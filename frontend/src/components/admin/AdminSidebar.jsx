import { NavLink } from 'react-router-dom'
import { useAuthStore } from '../../store/authStore'
import styles from '../../styles/components/layout/AdminSidebar.module.css'

const ADMIN_NAV = [
  { section: 'Platform', items: [
    { to: '/admin', icon: '📊', label: 'Dashboard', exact: true },
    { to: '/admin/users', icon: '👥', label: 'User Management' },
    { to: '/admin/roles', icon: '🛡️', label: 'Role & Permissions' },
  ]},
  { section: 'Operations', items: [
    { to: '/admin/content', icon: '📝', label: 'Content Management' },
    { to: '/admin/data', icon: '💾', label: 'Data Management' },
    { to: '/admin/alerts', icon: '⚠️', label: 'Alerts Override' },
  ]},
  { section: 'Intelligence', items: [
    { to: '/admin/ai-models', icon: '🤖', label: 'AI Monitoring' },
    { to: '/admin/video-engine', icon: '🎬', label: 'Video Pipelines' },
  ]},
  { section: 'Reports', items: [
    { to: '/admin/analytics', icon: '📈', label: 'Platform Analytics' },
    { to: '/admin/logs', icon: '📋', label: 'Audit Logs' },
  ]},
  { section: 'System', items: [
    { to: '/admin/notifications', icon: '🔔', label: 'Global Notifications' },
    { to: '/admin/settings', icon: '⚙️', label: 'System Settings' },
  ]},
]

export default function AdminSidebar({ collapsed, onToggle }) {
  const { user } = useAuthStore()

  return (
    <aside className={`${styles.sidebar} ${collapsed ? styles.collapsed : ''}`}>
      <div className={styles.brand}>
        <span className={styles.brandIcon}>▲</span>
        {!collapsed && (
          <div className={styles.brandName}>ArthaNova Admin</div>
        )}
      </div>

      <nav className={styles.nav}>
        {ADMIN_NAV.map((section) => (
          <div key={section.section} className={styles.navSection}>
            {!collapsed && (
              <div className={styles.sectionLabel}>{section.section}</div>
            )}
            {section.items.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.exact}
                className={({ isActive }) =>
                  `${styles.navItem} ${isActive ? styles.active : ''}`
                }
                title={collapsed ? item.label : undefined}
              >
                {({ isActive }) => (
                  <>
                    <span className={styles.navIcon}>{item.icon}</span>
                    {!collapsed && <span className={styles.navLabel}>{item.label}</span>}
                    {isActive && !collapsed && <span className={styles.activeDot}></span>}
                  </>
                )}
              </NavLink>
            ))}
          </div>
        ))}
      </nav>

      <div className={styles.bottom}>
        {!collapsed && (
          <div className={styles.userBrief}>
            <div className={styles.adminBadge}>ADMIN</div>
          </div>
        )}
        <button onClick={onToggle} className={styles.collapseBtn} title="Toggle sidebar">
          {collapsed ? '→' : '←'}
        </button>
      </div>
    </aside>
  )
}
