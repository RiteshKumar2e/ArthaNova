import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import Sidebar from '../components/layout/Sidebar'
import Topbar from '../components/layout/Topbar'
import styles from '../styles/layouts/AdminLayout.module.css'

export default function AdminLayout() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)

  return (
    <div className={`${styles.wrapper} ${sidebarCollapsed ? styles.collapsed : ''}`}>
      <div
        className={styles.mobileOverlay}
        onClick={() => setSidebarCollapsed(true)}
      ></div>
      <Sidebar
        collapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
        onNavigate={() => { if (window.innerWidth <= 992) setSidebarCollapsed(true); }}
      />
      <div className={styles.content}>
        <Topbar onToggleSidebar={() => setSidebarCollapsed(!sidebarCollapsed)} />
        <main className={styles.main}>
          <div className={styles.adminContainer}>
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  )
}
