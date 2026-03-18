import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuthStore } from '../../store/authStore'
import { authAPI } from '../../api/client'
import toast from 'react-hot-toast'
import styles from '../../styles/pages/auth/AuthPages.module.scss'

export default function LoginPage() {
  const [form, setForm] = useState({ email: '', password: '', remember_me: false })
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState({})
  const { login } = useAuthStore()
  const navigate = useNavigate()

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setForm((p) => ({ ...p, [name]: type === 'checkbox' ? checked : value }))
    setErrors((p) => ({ ...p, [name]: '' }))
  }

  const validate = () => {
    const e = {}
    if (!form.email) e.email = 'Email is required'
    if (!form.password) e.password = 'Password is required'
    return e
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const e2 = validate()
    if (Object.keys(e2).length) { setErrors(e2); return }

    setLoading(true)
    try {
      const res = await authAPI.login(form)
      const { access_token, refresh_token } = res.data
      const meRes = await authAPI.me()
      login(meRes.data, access_token, refresh_token)
      toast.success('Welcome back! 🎉')
      navigate('/dashboard')
    } catch (err) {
      const msg = err.response?.data?.detail || 'Login failed. Please try again.'
      toast.error(msg)
      setErrors({ password: msg })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={styles.authPage}>
      <div className={styles.authLeft}>
        <div className={styles.authBrand}>
          <span className={styles.brandIcon}>▲</span>
          <span className={styles.brandName}>ArthaNova</span>
        </div>
        <div className={styles.authQuote}>
          <blockquote>
            "The stock market is a device for transferring money from the impatient to the patient."
          </blockquote>
          <cite>— Warren Buffett</cite>
        </div>
        <div className={styles.authFeatures}>
          <div className={styles.authFeature}><span>🎯</span> AI-powered opportunity signals</div>
          <div className={styles.authFeature}><span>📊</span> Real-time NSE/BSE data</div>
          <div className={styles.authFeature}><span>💼</span> Portfolio intelligence & risk scoring</div>
          <div className={styles.authFeature}><span>🤖</span> Conversational market AI</div>
        </div>
      </div>

      <div className={styles.authRight}>
        <div className={styles.authCard}>
          <h1 className={styles.authTitle}>Welcome back</h1>
          <p className={styles.authSubtitle}>Sign in to your ArthaNova account</p>

          <form onSubmit={handleSubmit} className={styles.authForm}>
            <div className="form-group">
              <label className="form-label" htmlFor="login-email">Email Address</label>
              <input
                id="login-email"
                name="email"
                type="email"
                className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                placeholder="you@example.com"
                value={form.email}
                onChange={handleChange}
                autoComplete="email"
              />
              {errors.email && <div className="form-error">{errors.email}</div>}
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="login-password">
                Password
                <Link to="/forgot-password" className={styles.forgotLink}>Forgot password?</Link>
              </label>
              <input
                id="login-password"
                name="password"
                type="password"
                className={`form-control ${errors.password ? 'is-invalid' : ''}`}
                placeholder="Enter your password"
                value={form.password}
                onChange={handleChange}
                autoComplete="current-password"
              />
              {errors.password && <div className="form-error">{errors.password}</div>}
            </div>

            <div className={styles.rememberRow}>
              <label className={styles.checkLabel}>
                <input type="checkbox" name="remember_me" checked={form.remember_me} onChange={handleChange} />
                <span>Remember me for 7 days</span>
              </label>
            </div>

            <button type="submit" className="btn btn-primary btn-full" id="login-submit-btn" disabled={loading}>
              {loading ? <span className="spinner" style={{ width: 18, height: 18 }} /> : 'Sign In'}
            </button>
          </form>

          {/* Demo Credentials */}
          <div className={styles.demoBox}>
            <strong>Demo Access:</strong> demo@arthanova.in / Demo@1234
          </div>

          <p className={styles.authSwitch}>
            Don't have an account?{' '}
            <Link to="/register">Create one free →</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
