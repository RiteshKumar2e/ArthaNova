import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuthStore } from './store/authStore'

// Layouts
import PublicLayout from './layouts/PublicLayout'
import AppLayout from './layouts/AppLayout'
import AdminLayout from './layouts/AdminLayout'

// Public Pages
import LandingPage from './pages/public/LandingPage'
import LoginPage from './pages/auth/LoginPage'
import RegisterPage from './pages/auth/RegisterPage'
import ForgotPasswordPage from './pages/auth/ForgotPasswordPage'
import ResetPasswordPage from './pages/auth/ResetPasswordPage'

// App Pages
import DashboardPage from './pages/app/DashboardPage'
import MarketOverviewPage from './pages/app/MarketOverviewPage'
import StockExplorerPage from './pages/app/StockExplorerPage'
import StockDetailPage from './pages/app/StockDetailPage'
import PortfolioPage from './pages/app/PortfolioPage'
import AIChatPage from './pages/app/AIChatPage'
import NewsIntelligencePage from './pages/app/NewsIntelligencePage'
import IPOTrackerPage from './pages/app/IPOTrackerPage'
import OpportunityRadarPage from './pages/app/OpportunityRadarPage'
import ProfilePage from './pages/app/ProfilePage'
import {
  InsiderActivityPage,
  DealsTrackerPage,
  TechnicalAnalysisPage,
  WatchlistPage,
  RiskAnalyzerPage,
  BacktestingPage,
  VideoInsightsPage,
  FilingsAnalyzerPage,
  NotificationsPage,
  SettingsPage
} from './pages/app/PlaceholderPages'

// Admin Pages
import AdminDashboard from './pages/app/admin/AdminDashboard'
import UserManagement from './pages/app/admin/UserManagement'
import ContentManagement from './pages/app/admin/ContentManagement'
import StockDataManagement from './pages/app/admin/StockDataManagement'
import AlertsSignalsControl from './pages/app/admin/AlertsSignalsControl'
import AIModelMonitoring from './pages/app/admin/AIModelMonitoring'
import VideoEngineControl from './pages/app/admin/VideoEngineControl'
import ReportsAnalytics from './pages/app/admin/ReportsAnalytics'
import GlobalNotifications from './pages/app/admin/GlobalNotifications'
import RoleAccessControl from './pages/app/admin/RoleAccessControl'
import AuditLogs from './pages/app/admin/AuditLogs'
import SystemSettings from './pages/app/admin/SystemSettings'

// Route Guards
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useAuthStore()
  return isAuthenticated ? children : <Navigate to="/login" replace />
}

const AdminRoute = ({ children }) => {
  const { isAuthenticated, user } = useAuthStore()
  if (!isAuthenticated) return <Navigate to="/login" replace />
  if (user?.role !== 'admin' && !user?.is_admin) return <Navigate to="/dashboard" replace />
  return children
}

const PublicRoute = ({ children }) => {
  const { isAuthenticated } = useAuthStore()
  return !isAuthenticated ? children : <Navigate to="/dashboard" replace />
}

export default function App() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route element={<PublicLayout />}>
        <Route path="/" element={<LandingPage />} />
      </Route>

      {/* Auth Routes (Standalone) */}
      <Route path="/login" element={<PublicRoute><LoginPage /></PublicRoute>} />
      <Route path="/register" element={<PublicRoute><RegisterPage /></PublicRoute>} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      <Route path="/reset-password" element={<ResetPasswordPage />} />

      {/* Protected App Routes (User) */}
      <Route
        element={
          <ProtectedRoute>
            <AppLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/market" element={<MarketOverviewPage />} />
        <Route path="/stocks" element={<StockExplorerPage />} />
        <Route path="/stocks/:symbol" element={<StockDetailPage />} />
        <Route path="/technical" element={<TechnicalAnalysisPage />} />
        <Route path="/radar" element={<OpportunityRadarPage />} />
        <Route path="/portfolio" element={<PortfolioPage />} />
        <Route path="/watchlist" element={<WatchlistPage />} />
        <Route path="/ai-chat" element={<AIChatPage />} />
        <Route path="/news" element={<NewsIntelligencePage />} />
        <Route path="/filings" element={<FilingsAnalyzerPage />} />
        <Route path="/insider" element={<InsiderActivityPage />} />
        <Route path="/deals" element={<DealsTrackerPage />} />
        <Route path="/ipo" element={<IPOTrackerPage />} />
        <Route path="/videos" element={<VideoInsightsPage />} />
        <Route path="/notifications" element={<NotificationsPage />} />
        <Route path="/risk" element={<RiskAnalyzerPage />} />
        <Route path="/backtest" element={<BacktestingPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/settings" element={<SettingsPage />} />
      </Route>

      {/* Admin Module Routes */}
      <Route
        path="/admin"
        element={
          <AdminRoute>
            <AdminLayout />
          </AdminRoute>
        }
      >
        <Route index element={<AdminDashboard />} />
        <Route path="users" element={<UserManagement />} />
        <Route path="content" element={<ContentManagement />} />
        <Route path="data" element={<StockDataManagement />} />
        <Route path="alerts" element={<AlertsSignalsControl />} />
        <Route path="ai-models" element={<AIModelMonitoring />} />
        <Route path="video-engine" element={<VideoEngineControl />} />
        <Route path="analytics" element={<ReportsAnalytics />} />
        <Route path="notifications" element={<GlobalNotifications />} />
        <Route path="roles" element={<RoleAccessControl />} />
        <Route path="logs" element={<AuditLogs />} />
        <Route path="settings" element={<SystemSettings />} />
      </Route>

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
