import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuthStore } from '../../store/authStore'
import { authAPI } from '../../api/client'
import toast from 'react-hot-toast'
import { FiEye, FiEyeOff, FiTrendingUp } from 'react-icons/fi'
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
    <div className={styles.authPageCentered}>
      <Link to="/" className={styles.homeButtonFixed}>
        <span className={styles.homeIcon}>&larr;</span>
        <span className={styles.homeText}>Back to Home</span>
      </Link>

      <div className={styles.authCard}>
        {/* Left Side: Form */}
        <div className={styles.authContent}>
          <Link to="/" className={styles.authBrand}>
            <div className={styles.brandIcon}><FiTrendingUp /></div>
            <div className={styles.brandNameText}>
              <span className={styles.brandMain}>ArthaNova</span>
              <span className={styles.brandSub}>AI for the Indian Investor</span>
            </div>
          </Link>

          <h1 className={styles.authTitle}>Login to Your Account</h1>
          
          <form onSubmit={handleSubmit} className={styles.authForm}>
            <div className="form-group">
              <label className={styles.customPasswordLabel}>Email</label>
              <input
                id="login-email"
                name="email"
                type="email"
                className={`${styles.authFormControl} ${errors.email ? styles.isInvalid : ''}`}
                placeholder="Enter your email"
                value={form.email}
                onChange={handleChange}
                autoComplete="email"
              />
              {errors.email && <div className="form-error">{errors.email}</div>}
            </div>

            <div className="form-group">
              <label className={styles.customPasswordLabel}>
                Password
                <Link to="/forgot-password">Forgot Password?</Link>
              </label>
              <div className={styles.passwordInputContainer}>
                <input
                  id="login-password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  className={`${styles.authFormControl} ${errors.password ? styles.isInvalid : ''}`}
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

            <button type="submit" className="btn btn-primary btn-full" id="login-submit-btn" disabled={loading} style={{ height: '52px', marginTop: '10px' }}>
              {loading ? <span className="spinner" /> : 'Login'}
            </button>
          </form>

          <p className={styles.authSwitch}>
            Don't have an account? <Link to="/register">Sign Up</Link>
          </p>

          {/* Quick Demo Login */}
          <div className={styles.demoBox}>
            <p>Demo accounts</p>
            <div className={styles.demoButtons}>
              <button type="button" className={styles.demoBtn} onClick={() => handleDemoLogin('user')}>
                User Demo
              </button>
              <button type="button" className={styles.demoBtn} onClick={() => handleDemoLogin('admin')}>
                Admin Demo
              </button>
            </div>
          </div>
        </div>

        {/* Right Side: Illustration */}
        <div className={styles.authIllustrationSide}>
          <img src="/images/auth/login_illustration.png" alt="Login Illustration" />
        </div>
      </div>
    </div>
  )
}
