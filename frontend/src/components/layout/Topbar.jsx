import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuthStore } from '../../store/authStore'
import { notificationsAPI } from '../../api/client'
import styles from '../../styles/components/layout/Topbar.module.css'

export default function Topbar({ onToggleSidebar }) {
  const { user } = useAuthStore()
  const navigate = useNavigate()
  const [unreadCount, setUnreadCount] = useState(0)

  useEffect(() => {
    if (user) {
      fetchUnreadCount()
      // Optional: Polling every 60 seconds
      const interval = setInterval(fetchUnreadCount, 60000)
      return () => clearInterval(interval)
    }
  }, [user])

  const fetchUnreadCount = async () => {
    try {
      const res = await notificationsAPI.list()
      const unread = res.data.filter(n => !n.is_read).length
      setUnreadCount(unread)
    } catch (err) {
      console.error('Failed to fetch notifications', err)
    }
  }

  return (
    <header className={styles.topbar}>
      <div className={styles.left}>
        <button onClick={onToggleSidebar} className={styles.menuBtn} aria-label="Toggle sidebar">
          ☰
        </button>
        <div className={styles.searchBox}>
          <span className={styles.searchIcon}>🔍</span>
          <input
            type="text"
            className={styles.searchInput}
            placeholder="Search stocks, news, companies..."
            onFocus={() => navigate('/stocks')}
          />
          <span className={styles.searchShortcut}>⌘K</span>
        </div>
      </div>

      <div className={styles.right}>
        {/* Market Badge */}
        <div className={styles.marketBadge}>
          <span className={styles.marketDot} />
          <span className={styles.marketLabel}>NSE Open</span>
        </div>

        {/* Nifty Index */}
        <div className={styles.indexChip}>
          <span className={styles.indexName}>NIFTY</span>
          <span className={styles.indexValue}>21,842</span>
          <span className={styles.indexChange} style={{ color: '#00875A' }}>▲ 0.48%</span>
        </div>

        {/* Notifications */}
        <Link to="/notifications" className={styles.iconBtn} title="Notifications">
          <span>🔔</span>
          {unreadCount > 0 && <span className={styles.notifBadge}>{unreadCount}</span>}
        </Link>

        {/* Profile */}
        <Link to="/profile" className={styles.profileBtn} title="Profile">
          <div className={styles.avatar}>
            {user?.full_name?.charAt(0).toUpperCase() || 'U'}
          </div>
          <span className={styles.profileName}>{user?.full_name?.split(' ')[0] || 'User'}</span>
        </Link>
      </div>
    </header>
  )
}
