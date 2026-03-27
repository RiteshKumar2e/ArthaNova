import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuthStore } from '../../store/authStore'
import { authAPI } from '../../api/client'
import toast from 'react-hot-toast'
import { FiEye, FiEyeOff } from 'react-icons/fi'
import { GoogleLogin, useGoogleLogin } from '@react-oauth/google'
import OTPModal from '../../components/auth/OTPModal'
import styles from '../../styles/pages/auth/AuthPages.module.css'

// Check if Google Client ID is configured
if (!import.meta.env.VITE_GOOGLE_CLIENT_ID) {
  console.warn('⚠️ VITE_GOOGLE_CLIENT_ID not configured. Google Sign-In will not work. Add it to .env file.')
}

export default function LoginPage() {
  const [form, setForm] = useState({ email: '', password: '', remember_me: false })
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState({})
  const [otpState, setOtpState] = useState(null) // { email, fullName, otpToken }
  const { login } = useAuthStore()
  const navigate = useNavigate()
  const [googleWidth, setGoogleWidth] = useState(400)

  useEffect(() => {
    const handleResize = () => {
      // 48px is typical padding/margin allowance for mobile
      const width = Math.min(400, window.innerWidth - 48)
      setGoogleWidth(width)
    }
    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const handleGoogleError = () => {
    const msg = import.meta.env.VITE_GOOGLE_CLIENT_ID 
      ? 'Google Sign-In failed. Please check your browser settings or Google OAuth configuration.' 
      : 'Google Sign-In not configured. Please add VITE_GOOGLE_CLIENT_ID to your .env file. See .env.example for setup instructions.'
    console.error('Google Sign-In Error:', msg)
    toast.error(msg)
  }

  const handleGoogleSuccess = async (credentialResponse) => {
    setLoading(true)
    try {
      // Step 1: Request OTP from backend
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/auth/google/otp-request`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            idToken: credentialResponse.credential,
          }),
        }
      )

      // Check if response is JSON before parsing
      const contentType = response.headers.get('content-type');
      let data;
      
      if (contentType?.includes('application/json')) {
        data = await response.json()
      } else {
        throw new Error(`Expected JSON response but got ${contentType || 'unknown content type'} (HTTP ${response.status})`)
      }

      if (!response.ok) {
        throw new Error(data.message || data.error || 'Failed to request OTP')
      }

      // Show OTP modal
      setOtpState({
        email: data.email,
        fullName: data.fullName,
        otpToken: data.otp_token,
        idToken: credentialResponse.credential,
        accessToken: null,
      })

      toast.success('✉️ OTP sent to your email')
    } catch (err) {
      const msg = err.message || 'Failed to initiate Google login'
      console.error('Google Success Error:', err)
      toast.error(msg)
    } finally {
      setLoading(false)
    }
  }

  const handleCustomGoogleSuccess = async (authResponse) => {
    setLoading(true)
    try {
      // Step 1: Request OTP from backend using the access token
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/auth/google/otp-request`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            accessToken: authResponse.access_token,
          }),
        }
      )

      // Check if response is JSON before parsing
      const contentType = response.headers.get('content-type');
      let data;
      
      if (contentType?.includes('application/json')) {
        data = await response.json()
      } else {
        throw new Error(`Expected JSON response but got ${contentType || 'unknown content type'} (HTTP ${response.status})`)
      }

      if (!response.ok) {
        throw new Error(data.message || data.error || 'Failed to request OTP')
      }

      // Show OTP modal
      setOtpState({
        email: data.email,
        fullName: data.fullName,
        otpToken: data.otp_token,
        idToken: null,
        accessToken: authResponse.access_token,
      })

      toast.success('✉️ OTP sent to your email')
    } catch (err) {
      const msg = err.message || 'Failed to initiate Google login'
      console.error('Google Success Error:', err)
      toast.error(msg)
    } finally {
      setLoading(false)
    }
  }

  const loginWithGoogle = useGoogleLogin({
    onSuccess: handleCustomGoogleSuccess,
    onError: handleGoogleError,
  })

  const handleOTPComplete = async (data) => {
    try {
      // Step 2: OTP verified successfully
      const { user, access_token, refresh_token } = data

      // Save to auth store
      if (user && access_token) {
        login(user, access_token, refresh_token)
        toast.success(`🎉 Welcome, ${user.full_name}!`)

        // Redirect based on role
        if (user.role === 'admin' || user.is_admin === true) {
          navigate('/admin')
        } else {
          navigate('/dashboard')
        }
      } else {
        // If backend doesn't return tokens yet, still close modal
        setOtpState(null)
        toast.success('Login successful!')
        navigate('/dashboard')
      }
    } catch (err) {
      console.error('OTP Complete Error:', err)
      toast.error('Failed to complete login')
    }
  }

  const handleOTPBack = () => {
    setOtpState(null)
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

  return (
    <div className={styles.authPageLight}>
      {/* Decorative Boxes */}
      <div className={`${styles.floatingBox} ${styles.box1}`}></div>
      <div className={`${styles.floatingBox} ${styles.box2}`}></div>
      <div className={`${styles.floatingBox} ${styles.box3}`}></div>

      <Link to="/" className={styles.homeButtonLight}>
        <span>&larr;</span>
        <span>BACK TO HOME</span>
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
          {import.meta.env.VITE_GOOGLE_CLIENT_ID ? (
            <button
              type="button"
              className={styles.googleBtnLight}
              onClick={() => loginWithGoogle()}
              disabled={loading}
            >
              <img 
                src="https://www.gstatic.com/images/branding/product/1x/gsa_512dp.png" 
                alt="Google" 
              />
              {loading ? 'PROCESSING...' : 'SIGN IN WITH GOOGLE'}
            </button>
          ) : (
            <div style={{ 
              width: '100%', 
              padding: '12px', 
              background: '#fff8dc', 
              border: '2px solid #ff9800',
              textAlign: 'center',
              fontSize: '0.85rem',
              color: '#666'
            }}>
              Google Sign-In is not configured. See .env.example for setup.
            </div>
          )}
        </div>

        {/* Sign Up Link */}
        <p className={styles.authSwitchLight}>
          Don't have an account? <Link to="/register">SIGN UP HERE!</Link>
        </p>

      </div>

      {/* OTP Modal */}
      {otpState && (
        <OTPModal
          email={otpState.email}
          fullName={otpState.fullName}
          otpToken={otpState.otpToken}
          idToken={otpState.idToken}
          accessToken={otpState.accessToken}
          onComplete={handleOTPComplete}
          onBack={handleOTPBack}
        />
      )}
    </div>
  )
}
