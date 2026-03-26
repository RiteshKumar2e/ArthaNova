import { useState, useEffect, useCallback } from 'react'
import { portfolioAPI } from '../api/client'
import toast from 'react-hot-toast'

/**
 * usePortfolio Hook - Fetches and updates portfolio data in real-time
 * @param {number} refreshInterval - Interval in milliseconds (default: 30000ms = 30s)
 */
export const usePortfolio = (refreshInterval = 30000) => {
  const [portfolio, setPortfolio] = useState(null)
  const [analytics, setAnalytics] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [lastUpdate, setLastUpdate] = useState(new Date())

  const fetchPortfolioData = useCallback(async () => {
    try {
      setError(null)
      const [portfolioRes, analyticsRes] = await Promise.all([
        portfolioAPI.get(),
        portfolioAPI.analytics(),
      ])
      setPortfolio(portfolioRes.data)
      setAnalytics(analyticsRes.data)
      setLastUpdate(new Date())
      setLoading(false)
    } catch (err) {
      console.error('Failed to fetch portfolio:', err)
      setError(err.message || 'Failed to fetch portfolio data')
      setLoading(false)
    }
  }, [])

  // Initial fetch
  useEffect(() => {
    fetchPortfolioData()
  }, [fetchPortfolioData])

  // Set up auto-refresh interval
  useEffect(() => {
    if (refreshInterval <= 0) return // Disable auto-refresh if interval is 0 or negative

    const interval = setInterval(() => {
      fetchPortfolioData()
    }, refreshInterval)

    return () => clearInterval(interval)
  }, [refreshInterval, fetchPortfolioData])

  return {
    portfolio,
    analytics,
    loading,
    error,
    lastUpdate,
    refetch: fetchPortfolioData,
  }
}

export default usePortfolio
