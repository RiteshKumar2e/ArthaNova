import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuthStore } from '../../store/authStore'
import { authAPI } from '../../api/client'
import toast from 'react-hot-toast'
import { FiEye, FiEyeOff } from 'react-icons/fi'
import { GoogleLogin } from '@react-oauth/google'
import OTPModal from '../../components/auth/OTPModal'
import styles from '../../styles/pages/auth/AuthPages.module.css'

export default function AdminLoginPage() {
  const [form, setForm] = useState({ email: '', password: '', remember_me: false })
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState({})
  const [otpState, setOtpState] = useState(null) // { email, fullName, otpToken }
  const { login } = useAuthStore()
  const navigate = useNavigate()

  const handleGoogleError = () => {
    toast.error('Google Sign-In failed. Please check your browser settings.')
  }

  const handleGoogleSuccess = async (credentialResponse) => {
    setLoading(true)
    try {
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

      const data = await response.json()
      if (!response.ok) throw new Error(data.message || 'Failed to request OTP')

      setOtpState({
        email: data.email,
        fullName: data.fullName,
        otpToken: data.otp_token,
      })

      toast.success('✉️ Admin OTP sent to your secure email')
    } catch (err) {
      toast.error(err.message || 'Failed to initiate Google login')
    } finally {
      setLoading(false)
    }
  }

  const handleOTPComplete = async (data) => {
    try {
      const { user, access_token, refresh_token } = data

      // Admin Security Check
      if (user && (user.role === 'admin' || user.is_admin === true)) {
        login(user, access_token, refresh_token)
        toast.success(`🛠️ Welcome back, Admin ${user.full_name}!`)
        navigate('/admin')
      } else {
        toast.error('🛑 Access Denied: This portal is for Administrators only.')
        setOtpState(null)
      }
    } catch (err) {
      toast.error('Failed to complete Admin authentication')
    }
  }

  const handleOTPBack = () => setOtpState(null)

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setForm((p) => ({ ...p, [name]: type === 'checkbox' ? checked : value }))
    setErrors((p) => ({ ...p, [name]: '' }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.email || !form.password) {
      setErrors({
        email: !form.email ? 'EMAIL IS REQUIRED' : '',
        password: !form.password ? 'PASSWORD IS REQUIRED' : ''
      })
      return
    }

    setLoading(true)
    try {
      const res = await authAPI.login(form)
      const { access_token, refresh_token } = res.data
      const meRes = await authAPI.me(access_token)
      const userData = meRes.data

      // Admin Security Check
      if (userData.role === 'admin' || userData.is_admin === true) {
        login(userData, access_token, refresh_token)
        toast.success(`🛠️ Welcome back, Admin ${userData.full_name}!`)
        navigate('/admin')
      } else {
        toast.error('🛑 Access Denied: You do not have Administrator privileges.')
      }
    } catch (err) {
      toast.error(err.response?.data?.detail || 'Admin authentication failed.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={styles.authPageLight}>
      <div className={`${styles.floatingBox} ${styles.box1}`} style={{ background: '#FFD700' }}></div>
      <div className={`${styles.floatingBox} ${styles.box2}`} style={{ background: '#000' }}></div>
      <div className={`${styles.floatingBox} ${styles.box3}`} style={{ background: '#FF3131' }}></div>

      <Link to="/" className={styles.homeButtonLight}>
        <span>&larr;</span>
        <span>Back to Portal</span>
      </Link>

      <div className={styles.authBrandLight}>
        <div className={styles.brandIconLight} style={{ background: '#000', color: '#FFD700', border: '4px solid #FFD700' }}>
          <span>▲</span>
          <span>ADMIN</span>
        </div>
        <h1 className={styles.authTitleLight}>COMMAND CENTER</h1>
        <p className={styles.authSubtitleLight} style={{ color: '#000' }}>SECURE ADMINISTRATIVE ACCESS</p>
      </div>

      <div className={styles.authCardLight} style={{ border: '4px solid #000', boxShadow: '12px 12px 0px #000' }}>
        <form onSubmit={handleSubmit} className={styles.authFormLight}>
          <div className={styles.inputGroupLight}>
            <label>ADMIN EMAIL</label>
            <input
              type="email"
              name="email"
              className={`${styles.inputFieldLight} ${errors.email ? styles.hasError : ''}`}
              placeholder="admin@arthanova.in"
              value={form.email}
              onChange={handleChange}
            />
            {errors.email && <div className={styles.errorTextLight}>{errors.email}</div>}
          </div>

          <div className={styles.inputGroupLight}>
            <label>Password</label>
            <div className={styles.inputWrapperLight}>
              <input
                name="password"
                type={showPassword ? "text" : "password"}
                className={`${styles.inputFieldLight} ${errors.password ? styles.hasError : ''}`}
                placeholder="••••••••••••"
                value={form.password}
                onChange={handleChange}
              />
              <button
                type="button"
                className={styles.passwordToggleLight}
                onClick={() => setShowPassword(!showPassword)}
                style={{ background: '#000', color: '#fff' }}
              >
                {showPassword ? "HIDE" : "SHOW"}
              </button>
            </div>
            {errors.password && <div className={styles.errorTextLight}>{errors.password}</div>}
          </div>

          <button type="submit" className={styles.submitBtnLight} disabled={loading} style={{ background: '#000' }}>
            {loading ? <span className={styles.spinnerLight} /> : 'AUTHORIZE SESSION'}
          </button>
        </form>

        <div className={styles.socialDividerLight}>
          <span>SSO AUTHORIZATION</span>
        </div>

        <div style={{ display: 'flex', justifyContent: 'center', margin: '1rem 0' }}>
          <GoogleLogin
            onSuccess={handleGoogleSuccess}
            onError={handleGoogleError}
            useOneTap={false}
          />
        </div>

      </div>

      {otpState && (
        <OTPModal
          email={otpState.email}
          fullName={otpState.fullName}
          otpToken={otpState.otpToken}
          onComplete={handleOTPComplete}
          onBack={handleOTPBack}
        />
      )}
    </div>
  )
}
