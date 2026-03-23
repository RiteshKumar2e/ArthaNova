import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuthStore } from '../../store/authStore'
import { authAPI } from '../../api/client'
import toast from 'react-hot-toast'
import { FiEye, FiEyeOff, FiMail, FiLock, FiTrendingUp } from 'react-icons/fi'
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
      toast.success(`Welcome back, ${meRes.data.full_name}!`)

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
    toast(`Form filled for ${type}! Click Login.`, { icon: '📝' })
  }

  return (
    <div className={styles.authPageLight}>
      <Link to="/" className={styles.homeButtonLight}>
        <span className={styles.homeIcon}>&larr;</span>
        <span className={styles.homeText}>Back to Home</span>
      </Link>

      <div className={styles.authCardLight}>
        {/* Brand Logo */}
        <div className={styles.authBrandLight}>
          <div className={styles.brandIconLight}>
            <FiTrendingUp />
          </div>
          <div className={styles.brandTextLight}>
            Artha<span>Nova</span>
          </div>
        </div>

        {/* Header */}
        <div className={styles.authHeaderLight}>
          <h1 className={styles.authTitleLight}>Welcome Back!</h1>
          <p className={styles.authSubtitleLight}>Sign in to your account</p>
        </div>

        <form onSubmit={handleSubmit} className={styles.authFormLight}>
          {/* Email Input */}
          <div className={styles.inputGroupLight}>
            <div className={styles.inputWrapperLight}>
              <FiMail className={styles.inputIconLight} />
              <input
                id="login-email"
                name="email"
                type="email"
                className={`${styles.inputFieldLight} ${errors.email ? styles.hasError : ''}`}
                placeholder="Email address"
                value={form.email}
                onChange={handleChange}
                autoComplete="email"
              />
            </div>
            {errors.email && <div className={styles.errorTextLight}>{errors.email}</div>}
          </div>

          {/* Password Input */}
          <div className={styles.inputGroupLight}>
            <div className={styles.inputWrapperLight}>
              <FiLock className={styles.inputIconLight} />
              <input
                id="login-password"
                name="password"
                type={showPassword ? "text" : "password"}
                className={`${styles.inputFieldLight} ${styles.inputFieldLightWithToggle} ${errors.password ? styles.hasError : ''}`}
                placeholder="Password"
                value={form.password}
                onChange={handleChange}
                autoComplete="current-password"
              />
              <button
                type="button"
                className={styles.passwordToggleLight}
                onClick={() => setShowPassword(!showPassword)}
                tabIndex="-1"
              >
                {showPassword ? <FiEyeOff /> : <FiEye />}
              </button>
            </div>
            {errors.password && <div className={styles.errorTextLight}>{errors.password}</div>}
          </div>

          {/* Forgot Password Link */}
          <Link to="/forgot-password" className={styles.forgotLinkLight}>
            Forgot Password?
          </Link>

          {/* Remember Me */}
          <div className={styles.checkboxRowLight}>
            <input
              type="checkbox"
              id="remember_me"
              name="remember_me"
              className={styles.checkboxLight}
              checked={form.remember_me}
              onChange={handleChange}
            />
            <label htmlFor="remember_me" className={styles.checkboxLabelLight}>
              Remember me
            </label>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className={styles.submitBtnLight}
            id="login-submit-btn"
            disabled={loading}
          >
            {loading ? <span className={styles.spinnerLight} /> : 'Login'}
          </button>
        </form>

        {/* Sign Up Link */}
        <p className={styles.authSwitchLight}>
          New to ArthaNova? <Link to="/register">Register Now</Link>
        </p>

        {/* Demo Login Buttons */}
        <div className={styles.demoBoxLight}>
          <p>Demo accounts</p>
          <div className={styles.demoBtnsLight}>
            <button type="button" className={styles.demoBtnLight} onClick={() => handleDemoLogin('user')}>
              User Demo
            </button>
            <button type="button" className={styles.demoBtnLight} onClick={() => handleDemoLogin('admin')}>
              Admin Demo
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
