import React from 'react'
import { useAuthStore } from '../../../../store/authStore'

// Module Dashboards
import UserDashboard from './UserDashboard'
import AdminDashboard from '../../admin/AdminDashboard'

export default function DashboardPage() {
  const { user } = useAuthStore()

  // Dynamic Module Selection
  const renderDashboard = () => {
    switch (user?.role) {
      case 'admin':
        return <AdminDashboard user={user} />
      case 'user':
      default:
        return <UserDashboard user={user} />
    }
  }

  return (
    <div className="page-wrapper">
      {renderDashboard()}
    </div>
  )
}
