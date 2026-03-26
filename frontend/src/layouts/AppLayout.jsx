import { useState, useEffect } from 'react'
import { Outlet } from 'react-router-dom'
import Sidebar from '../components/layout/Sidebar'
import Topbar from '../components/layout/Topbar'
import styles from '../styles/layouts/AppLayout.module.css'

export default function AppLayout() {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 992)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(window.innerWidth < 992)

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 992
      setIsMobile(mobile)
      if (mobile) {
        // Auto-collapse on mobile when resized down
        setSidebarCollapsed(true)
      }
    }
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const toggleSidebar = () => setSidebarCollapsed(prev => !prev)
  const closeSidebarOnMobile = () => {
    if (isMobile) setSidebarCollapsed(true)
  }

  const showBackdrop = !sidebarCollapsed && isMobile

  return (
    <div className={`${styles.wrapper} ${sidebarCollapsed ? styles.collapsed : ''}`}>
      {/* Mobile Backdrop */}
      {showBackdrop && (
        <div className={styles.backdrop} onClick={() => setSidebarCollapsed(true)} />
      )}
      
      <Sidebar 
        collapsed={sidebarCollapsed} 
        onToggle={toggleSidebar} 
        onNavigate={closeSidebarOnMobile}
      />
      
      <div className={styles.content}>
        <Topbar onToggleSidebar={toggleSidebar} />
        <main className={styles.main}>
          <Outlet />
        </main>
      </div>
    </div>
  )
}
