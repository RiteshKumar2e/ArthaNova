import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuthStore } from '../../store/authStore'
import { authAPI } from '../../api/client'
import toast from 'react-hot-toast'
import { FiEye, FiEyeOff } from 'react-icons/fi'
import styles from '../../styles/pages/auth/AuthPages.module.scss'

export default function LoginPage() {
  const [form, setForm] = useState({ email: '', password: '', remember_me: false })
  const [showPassword, setShowPassword] = useState(false)
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
      const meRes = await authAPI.me(access_token)
      console.log('Login successful. User data:', meRes.data)
      login(meRes.data, access_token, refresh_token)
      toast.success(`Welcome back, ${meRes.data.full_name}! 🎉`)
      
      // Redirect based on role (or is_admin flag)
      if (meRes.data.role === 'admin' || meRes.data.is_admin === true) {
        console.log('Redirecting to Admin Dashboard...')
        navigate('/admin')
      } else {
        console.log('Redirecting to User Dashboard...')
        navigate('/dashboard')
      }
    } catch (err) {
      const msg = err.response?.data?.detail || 'Login failed. Please try again.'
      toast.error(msg)
      setErrors({ password: msg })
    } finally {
      setLoading(false)
    }
  }

  const handleDemoLogin = (type) => {
    if (type === 'admin') {
      setForm({ email: 'admin@arthanova.in', password: 'Admin@1234', remember_me: false })
    } else {
      setForm({ email: 'user@arthanova.in', password: 'Demo@1234', remember_me: false })
    }
    setErrors({})
    toast(`Form filled for ${type}! Click Sign In.`, { icon: '📝' })
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
        <Link to="/" className={styles.backToHome}>
          &larr; Back to Home
        </Link>
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
              <label className={styles.customPasswordLabel} htmlFor="login-password">
                PASSWORD
                <Link to="/forgot-password" className={styles.forgotLink}>Forgot password?</Link>
              </label>
              <div className={styles.passwordInputContainer}>
                <input
                  id="login-password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  className={`${styles.customPasswordInput} ${errors.password ? 'is-invalid' : ''}`}
                  placeholder="Enter your password"
                  value={form.password}
                  onChange={handleChange}
                  autoComplete="current-password"
                />
                <button 
                  type="button" 
                  className={styles.passwordToggle} 
                  onClick={() => setShowPassword(!showPassword)}
                  tabIndex="-1"
                >
                  {showPassword ? <FiEyeOff /> : <FiEye />}
                </button>
              </div>
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

          {/* Quick Demo Login */}
          <div className={styles.demoBox}>
            <p>Quick Access:</p>
            <div className={styles.demoButtons}>
              <button type="button" className={styles.demoBtn} onClick={() => handleDemoLogin('user')}>
                User
              </button>
              <button type="button" className={styles.demoBtn} onClick={() => handleDemoLogin('admin')}>
                Admin
              </button>
            </div>
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
