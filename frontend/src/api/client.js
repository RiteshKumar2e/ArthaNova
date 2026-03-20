import axios from 'axios'
import { useAuthStore } from '../store/authStore'

const api = axios.create({
  baseURL: '/api/v1',
  headers: { 'Content-Type': 'application/json' },
  timeout: 15000,
})

// Attach token to every request
api.interceptors.request.use((config) => {
  const { accessToken } = useAuthStore.getState()
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`
  }
  return config
})

// Auto-refresh token on 401
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true
      const { refreshToken, updateTokens, logout } = useAuthStore.getState()

      if (refreshToken) {
        try {
          const response = await axios.post('/api/v1/auth/refresh', { refresh_token: refreshToken })
          const { access_token, refresh_token } = response.data
          updateTokens(access_token, refresh_token)
          originalRequest.headers.Authorization = `Bearer ${access_token}`
          return api(originalRequest)
        } catch {
          logout()
          window.location.href = '/'
        }
      } else {
        logout()
        window.location.href = '/'
      }
    }

    return Promise.reject(error)
  }
)

export default api

// ─── API Modules ──────────────────────────────────────────────────────────────

export const authAPI = {
  login: (data) => api.post('/auth_debug/login', data),
  register: (data) => api.post('/auth_debug/register', data),
  logout: () => api.post('/auth_debug/logout'),
  me: (token) => {
    const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {}
    return api.get('/auth_debug/me', config)
  },
  forgotPassword: (email) => api.post('/auth_debug/forgot-password', { email }),
  resetPassword: (data) => api.post('/auth_debug/reset-password', data),
  changePassword: (data) => api.post('/auth_debug/change-password', data),
}

export const stocksAPI = {
  list: (params) => api.get('/stocks/', { params }),
  getDetail: (symbol) => api.get(`/stocks/${symbol}`),
  getOHLCV: (symbol, period) => api.get(`/stocks/${symbol}/ohlcv`, { params: { period } }),
  marketOverview: () => api.get('/stocks/market-overview'),
  sectors: () => api.get('/stocks/sectors'),
}

export const portfolioAPI = {
  get: () => api.get('/portfolio/'),
  addHolding: (data) => api.post('/portfolio/holdings', data),
  removeHolding: (id) => api.delete(`/portfolio/holdings/${id}`),
  analytics: () => api.get('/portfolio/analytics'),
}

export const aiAPI = {
  chat: (data) => api.post('/ai/chat', data),
  getSessions: () => api.get('/ai/chat/sessions'),
  getSession: (id) => api.get(`/ai/chat/sessions/${id}`),
  deleteSession: (id) => api.delete(`/ai/chat/sessions/${id}`),
  opportunityRadar: () => api.get('/ai/opportunity-radar'),
  chartPatterns: (symbol) => api.get(`/ai/chart-patterns/${symbol}`),
}

export const newsAPI = {
  list: (params) => api.get('/news/', { params }),
  sentimentSummary: () => api.get('/news/sentiment-summary'),
}

export const ipoAPI = {
  list: (params) => api.get('/ipo/', { params }),
  getDetail: (id) => api.get(`/ipo/${id}`),
}

export const insiderAPI = {
  list: (params) => api.get('/insider/', { params }),
}

export const dealsAPI = {
  list: (params) => api.get('/deals/', { params }),
}

export const alertsAPI = {
  list: () => api.get('/alerts/'),
  create: (data) => api.post('/alerts/', data),
  update: (id, data) => api.put(`/alerts/${id}`, data),
  delete: (id) => api.delete(`/alerts/${id}`),
}

export const backtestAPI = {
  run: (data) => api.post('/backtest/', data),
  history: () => api.get('/backtest/'),
}

export const userAPI = {
  getProfile: () => api.get('/users/me'),
  updateProfile: (data) => api.put('/users/me', data),
  listUsers: () => api.get('/users/'),
}
