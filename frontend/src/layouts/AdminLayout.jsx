import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import AdminSidebar from '../components/admin/AdminSidebar'
import Topbar from '../components/layout/Topbar'
import styles from '../styles/layouts/AdminLayout.module.scss'

export default function AdminLayout() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)

  return (
    <div className={`${styles.wrapper} ${sidebarCollapsed ? styles.collapsed : ''}`}>
      <AdminSidebar collapsed={sidebarCollapsed} onToggle={() => setSidebarCollapsed(!sidebarCollapsed)} />
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
