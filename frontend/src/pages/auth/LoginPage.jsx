import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuthStore } from '../../store/authStore'
import { authAPI } from '../../api/client'
import toast from 'react-hot-toast'
import { FiEye, FiEyeOff } from 'react-icons/fi'
import { GoogleLogin } from '@react-oauth/google'
import styles from '../../styles/pages/auth/AuthPages.module.css'

export default function LoginPage() {
  const [form, setForm] = useState({ email: '', password: '', remember_me: false })
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState({})
  const { login } = useAuthStore()
  const navigate = useNavigate()

  const handleGoogleSuccess = async (credentialResponse) => {
    setLoading(true)
    try {
      const res = await authAPI.googleLogin(credentialResponse.credential)
      const { access_token, refresh_token, user } = res.data
      login(user, access_token, refresh_token)
      toast.success(`Welcome, ${user.full_name}!`)

      if (user.role === 'admin' || user.is_admin === true) {
        navigate('/admin')
      } else {
        navigate('/dashboard')
      }
    } catch (err) {
      const msg = err.response?.data?.detail || 'Google Login failed.'
      toast.error(msg)
    } finally {
      setLoading(false)
    }
  }

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
      setForm({ email: 'demo@arthanova.in', password: 'Demo@1234', remember_me: false })
    }
    setErrors({})
    toast(`Form filled for ${type}! Click Login.`, { icon: '📝' })
  }

  return (
    <div className={styles.authPageLight}>
      {/* Decorative Boxes */}
      <div className={`${styles.floatingBox} ${styles.box1}`}></div>
      <div className={`${styles.floatingBox} ${styles.box2}`}></div>
      <div className={`${styles.floatingBox} ${styles.box3}`}></div>

      <Link to="/" className={styles.homeButtonLight}>
        <span className={styles.homeIcon}>&larr;</span>
        <span className={styles.homeText}>Back to Home</span>
      </Link>

      {/* Brand Header */}
      <div className={styles.authBrandLight}>
        <Link to="/" className={styles.brandIconLight}>
          <span>▲</span>
          <span>ARTHANOVA</span>
        </Link>
        <h1 className={styles.authTitleLight}>WELCOME BACK!</h1>
        <p className={styles.authSubtitleLight}>Sign in to access your account</p>
      </div>

      <div className={styles.authCardLight}>

        <form onSubmit={handleSubmit} className={styles.authFormLight}>
          {/* Email Input */}
          <div className={styles.inputGroupLight}>
            <label htmlFor="login-email">EMAIL</label>
            <div className={styles.inputWrapperLight}>
              <input
                id="login-email"
                name="email"
                type="email"
                className={`${styles.inputFieldLight} ${errors.email ? styles.hasError : ''}`}
                placeholder="email@example.com"
                value={form.email}
                onChange={handleChange}
                autoComplete="email"
              />
            </div>
            {errors.email && <div className={styles.errorTextLight}>{errors.email}</div>}
          </div>

          {/* Password Input */}
          <div className={styles.inputGroupLight}>
            <label htmlFor="login-password">PASSWORD</label>
            <div className={styles.inputWrapperLight}>
              <input
                id="login-password"
                name="password"
                type={showPassword ? "text" : "password"}
                className={`${styles.inputFieldLight} ${errors.password ? styles.hasError : ''}`}
                placeholder="Enter your password"
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
                {showPassword ? "HIDE" : "SHOW"}
              </button>
            </div>
            {errors.password && <div className={styles.errorTextLight}>{errors.password}</div>}
          </div>

          {/* Settings Row */}
          <div className={styles.checkboxRowLight}>
            <div className={styles.rememberMeSection}>
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
            <Link to="/forgot-password" className={styles.forgotLinkLight}>
              Forgot Password?
            </Link>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className={styles.submitBtnLight}
            id="login-submit-btn"
            disabled={loading}
          >
            {loading ? <span className={styles.spinnerLight} /> : 'SIGN IN'}
          </button>
        </form>

        {/* Social Login */}
        <div className={styles.socialDividerLight}>
          <span>OR CONTINUE WITH</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'center', margin: '1rem 0' }}>
          <GoogleLogin
            onSuccess={handleGoogleSuccess}
            onError={() => toast.error('Google Sign-In failed')}
            useOneTap
            theme="filled_black"
            shape="rectangular"
            containerProps={{ style: { width: '100%', display: 'flex', justifyContent: 'center' } }}
          />
        </div>

        {/* Sign Up Link */}
        <p className={styles.authSwitchLight}>
          Don't have an account? <Link to="/register">SIGN UP HERE!</Link>
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
