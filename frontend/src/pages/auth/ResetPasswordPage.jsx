import { useState, useEffect } from 'react'
import { Link, useSearchParams, useNavigate } from 'react-router-dom'
import { authAPI } from '../../api/client'
import toast from 'react-hot-toast'
import styles from '../../styles/pages/auth/AuthPages.module.css'

export default function ResetPasswordPage() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const token = searchParams.get('token')

  const [form, setForm] = useState({ new_password: '', confirm: '' })
  const [loading, setLoading] = useState(false)
  const [done, setDone] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  // If no token in URL, redirect to forgot-password
  useEffect(() => {
    if (!token) {
      toast.error('Invalid or missing reset link. Please request a new one.')
      navigate('/forgot-password', { replace: true })
    }
  }, [token, navigate])

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (form.new_password !== form.confirm) {
      toast.error('Passwords do not match')
      return
    }
    if (form.new_password.length < 8) {
      toast.error('Password must be at least 8 characters')
      return
    }
    setLoading(true)
    try {
      await authAPI.resetPassword({ token, new_password: form.new_password })
      setDone(true)
      toast.success('Password reset successfully!')
    } catch (err) {
      const msg = err?.response?.data?.detail || 'Invalid or expired reset link'
      toast.error(msg)
    } finally {
      setLoading(false)
    }
  }

  if (!token) return null

  return (
    <div className={styles.authPageLight}>
      <div className={`${styles.floatingBox} ${styles.box1}`}></div>
      <div className={`${styles.floatingBox} ${styles.box2}`}></div>
      <div className={`${styles.floatingBox} ${styles.box3}`}></div>

      <div className={styles.authCardLight}>
        <div className={styles.authBrandLight}>
          <Link to="/" className={styles.brandIconLight}>
            <span>▲</span>
            <span>ARTHANOVA</span>
          </Link>
        </div>

        {!done ? (
          <>
            <h1 className={styles.authTitleLight} style={{ textAlign: 'center', marginBottom: '0.5rem' }}>
              RESET PASSWORD
            </h1>
            <p className={styles.authSubtitleLight} style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
              Enter your new password below.
            </p>

            <form onSubmit={handleSubmit} className={styles.authFormLight}>
              <div className={styles.inputGroupLight}>
                <label htmlFor="new-pw">NEW PASSWORD</label>
                <div className={styles.inputWrapperLight}>
                  <input
                    id="new-pw"
                    type={showPassword ? 'text' : 'password'}
                    className={styles.inputFieldLight}
                    placeholder="Min 8 characters"
                    value={form.new_password}
                    onChange={(e) => setForm((p) => ({ ...p, new_password: e.target.value }))}
                    autoFocus
                  />
                  <button
                    type="button"
                    className={styles.passwordToggleLight}
                    onClick={() => setShowPassword(!showPassword)}
                    tabIndex="-1"
                  >
                    {showPassword ? 'HIDE' : 'SHOW'}
                  </button>
                </div>
              </div>

              <div className={styles.inputGroupLight}>
                <label htmlFor="confirm-pw">CONFIRM PASSWORD</label>
                <div className={styles.inputWrapperLight}>
                  <input
                    id="confirm-pw"
                    type={showConfirmPassword ? 'text' : 'password'}
                    className={styles.inputFieldLight}
                    placeholder="Repeat new password"
                    value={form.confirm}
                    onChange={(e) => setForm((p) => ({ ...p, confirm: e.target.value }))}
                  />
                  <button
                    type="button"
                    className={styles.passwordToggleLight}
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    tabIndex="-1"
                  >
                    {showConfirmPassword ? 'HIDE' : 'SHOW'}
                  </button>
                </div>
              </div>

              <button type="submit" className={styles.submitBtnLight} disabled={loading}>
                {loading ? <span className={styles.spinnerLight} /> : 'SET NEW PASSWORD'}
              </button>
            </form>
          </>
        ) : (
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🎉</div>
            <h2 className={styles.authTitleLight} style={{ fontSize: '1.5rem', marginBottom: '0.75rem' }}>
              PASSWORD UPDATED!
            </h2>
            <p className={styles.authSubtitleLight} style={{ color: '#555', marginBottom: '1.5rem', lineHeight: '1.5' }}>
              Your password has been reset successfully.<br />You can now log in with your new password.
            </p>
            <Link to="/login" className={styles.submitBtnLight} style={{ textDecoration: 'none', display: 'block', textAlign: 'center' }}>
              GO TO LOGIN →
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
