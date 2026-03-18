import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import Sidebar from '../components/layout/Sidebar'
import Topbar from '../components/layout/Topbar'
import styles from '../styles/layouts/AppLayout.module.scss'

export default function AppLayout() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)

  return (
    <div className={`${styles.wrapper} ${sidebarCollapsed ? styles.collapsed : ''}`}>
      <Sidebar collapsed={sidebarCollapsed} onToggle={() => setSidebarCollapsed(!sidebarCollapsed)} />
      <div className={styles.content}>
        <Topbar onToggleSidebar={() => setSidebarCollapsed(!sidebarCollapsed)} />
        <main className={styles.main}>
          <Outlet />
        </main>
      </div>
    </div>
  )
}
