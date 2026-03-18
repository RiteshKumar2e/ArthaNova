import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuthStore } from './store/authStore'

// Layouts
import PublicLayout from './layouts/PublicLayout'
import AppLayout from './layouts/AppLayout'

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
  SettingsPage,
  AdminPanelPage
} from './pages/app/PlaceholderPages'

// Route Guards
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useAuthStore()
  return isAuthenticated ? children : <Navigate to="/login" replace />
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

      {/* Protected App Routes */}
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
        <Route path="/admin" element={<AdminPanelPage />} />
      </Route>

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
