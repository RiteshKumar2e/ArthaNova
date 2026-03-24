import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import Sidebar from '../components/layout/Sidebar'
import Topbar from '../components/layout/Topbar'
import styles from '../styles/layouts/AppLayout.module.css'

export default function AppLayout() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(window.innerWidth < 992)

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 992) {
        // Optional: auto-uncollapse on desktop
        // setSidebarCollapsed(false)
      } else {
        // Auto-collapse on mobile if resized down
        setSidebarCollapsed(true)
      }
    }
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const toggleSidebar = () => setSidebarCollapsed(!sidebarCollapsed)
  const closeSidebarOnMobile = () => {
    if (window.innerWidth < 992) setSidebarCollapsed(true)
  }

  return (
    <div className={`${styles.wrapper} ${sidebarCollapsed ? styles.collapsed : ''}`}>
      {/* Mobile Backdrop */}
      {!sidebarCollapsed && window.innerWidth < 992 && (
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
