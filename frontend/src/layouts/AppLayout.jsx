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
        setSidebarCollapsed(true)
      }
    }
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  // Close sidebar on any click outside (desktop + mobile)
  useEffect(() => {
    if (sidebarCollapsed) {
      // No need to listen if already closed
      return
    }

    const handleDocumentClick = (e) => {
      // Check if click is on sidebar, toggle button, or collapse button
      const sidebar = document.querySelector('aside')
      const menuBtn = e.target.closest('[class*="menuBtn"]')
      const collapseBtn = e.target.closest('[class*="collapseBtn"]')
      
      const isClickOnSidebar = sidebar && sidebar.contains(e.target)
      
      // Close sidebar if click is NOT on these elements
      if (!isClickOnSidebar && !menuBtn && !collapseBtn) {
        setSidebarCollapsed(true)
      }
    }

    // Use capturing phase to catch all clicks
    document.addEventListener('click', handleDocumentClick, true)
    
    return () => {
      document.removeEventListener('click', handleDocumentClick, true)
    }
  }, [sidebarCollapsed])

  const toggleSidebar = () => setSidebarCollapsed(prev => !prev)

  const closeSidebarOnNavigate = () => {
    // On mobile, close sidebar when navigating
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
        onNavigate={closeSidebarOnNavigate}
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
