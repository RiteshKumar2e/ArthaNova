import React, { useState, useEffect } from 'react'
import { notificationsAPI } from '../../../../api/client'
import { useAuthStore } from '../../../../store/authStore'
import { toast } from 'react-hot-toast'
import styles from '../../../../styles/pages/app/user/profile/NotificationsPage.module.css'

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all') // all, unread, system, market
  const { user } = useAuthStore()

  useEffect(() => {
    fetchNotifications()
  }, [])

  const fetchNotifications = async () => {
    try {
      setLoading(true)
      const res = await notificationsAPI.list()
      setNotifications(Array.isArray(res.data) ? res.data : [])
    } catch (err) {
      toast.error('Failed to load notifications')
    } finally {
      setLoading(false)
    }
  }

  const handleMarkRead = async (id) => {
    try {
      await notificationsAPI.markRead(id)
      setNotifications(notifications.map(n => n.id === id ? { ...n, is_read: true } : n))
    } catch (err) {}
  }

  const handleMarkAllRead = async () => {
    try {
      await notificationsAPI.markAllRead()
      setNotifications(notifications.map(n => ({ ...n, is_read: true })))
      toast.success('All marked as read')
    } catch (err) {}
  }

  const handleDelete = async (id) => {
    try {
      await notificationsAPI.delete(id)
      setNotifications(notifications.filter(n => n.id !== id))
      toast.success('Notification removed')
    } catch (err) {}
  }

  const notificationsList = Array.isArray(notifications) ? notifications : []
  
  const filteredNotifications = notificationsList.filter(n => {
    if (!n) return false
    if (filter === 'unread') return !n.is_read
    if (filter === 'system') return n.type === 'info' || n.type === 'system'
    if (filter === 'market') return n.type === 'market' || n.type === 'ai_alert'
    return true
  })

  const getIcon = (type) => {
    switch (type) {
      case 'market': return '📉'
      case 'ai_alert': return '🤖'
      case 'success': return '✅'
      case 'warning': return '⚠️'
      case 'danger': return '🚨'
      default: return '🔔'
    }
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div>
          <h1>NOTIFICATIONS</h1>
          <p>YOUR TIMELINE OF IMPORTANT MARKET EVENTS</p>
        </div>
        <div className={styles.headerActions}>
          <button className={styles.markAllBtn} onClick={handleMarkAllRead}>MARK ALL AS READ</button>
        </div>
      </div>

      <div className={styles.filters}>
        <button 
          className={`${styles.filterBtn} ${filter === 'all' ? styles.active : ''}`}
          onClick={() => setFilter('all')}
        >ALL</button>
        <button 
          className={`${styles.filterBtn} ${filter === 'unread' ? styles.active : ''}`}
          onClick={() => setFilter('unread')}
        >UNREAD</button>
        <button 
          className={`${styles.filterBtn} ${filter === 'market' ? styles.active : ''}`}
          onClick={() => setFilter('market')}
        >MARKET</button>
        <button 
          className={`${styles.filterBtn} ${filter === 'system' ? styles.active : ''}`}
          onClick={() => setFilter('system')}
        >SYSTEM</button>
      </div>

      <div className={styles.timeline}>
        {filteredNotifications.map((n) => (
          <div key={n.id} className={`${styles.notifCard} ${!n.is_read ? styles.unread : ''}`}>
            <div className={styles.notifIcon}>{getIcon(n.type)}</div>
            <div className={styles.notifContent}>
              <div className={styles.notifHeader}>
                <h3>{n.title}</h3>
                <span className={styles.time}>{new Date(n.created_at).toLocaleString()}</span>
              </div>
              <p className={styles.message}>{n.message}</p>
              <div className={styles.notifActions}>
                {!n.is_read && (
                  <button onClick={() => handleMarkRead(n.id)}>MARK AS READ</button>
                )}
                <button className={styles.deleteBtn} onClick={() => handleDelete(n.id)}>REMOVE</button>
              </div>
            </div>
          </div>
        ))}

        {!loading && filteredNotifications.length === 0 && (
          <div className={styles.emptyState}>
            <div style={{ fontSize: '3rem' }}>📭</div>
            <h2>NO NOTIFICATIONS FOUND</h2>
            <p>You're all caught up! New updates will appear here.</p>
          </div>
        )}

        {loading && (
          <div className={styles.loader}>LOADING TIMELINE...</div>
        )}
      </div>
    </div>
  )
}
