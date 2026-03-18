import { useState } from 'react'
import { Link } from 'react-router-dom'
import { authAPI } from '../../api/client'
import toast from 'react-hot-toast'
import { FiEye, FiEyeOff } from 'react-icons/fi'
import styles from '../../styles/pages/auth/AuthPages.module.scss'

export function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!email) { toast.error('Please enter your email'); return }
    setLoading(true)
    try {
      await authAPI.forgotPassword(email)
      setSent(true)
    } catch {
      toast.error('Failed to send reset email')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={styles.simpleAuth}>
      <div className={styles.simpleCard}>
        <Link to="/" className={styles.simpleBrand}>
          <span>▲</span> ArthaNova
        </Link>
        {!sent ? (
          <>
            <h1 className={styles.authTitle}>Forgot Password?</h1>
            <p className={styles.authSubtitle}>Enter your email and we'll send you a reset link.</p>
            <form onSubmit={handleSubmit} className={styles.authForm}>
              <div className="form-group">
                <label className="form-label" htmlFor="fp-email">Email Address</label>
                <input id="fp-email" type="email" className="form-control" placeholder="you@example.com"
                  value={email} onChange={(e) => setEmail(e.target.value)} />
              </div>
              <button type="submit" className="btn btn-primary btn-full" disabled={loading}>
                {loading ? 'Sending...' : 'Send Reset Link'}
              </button>
            </form>
          </>
        ) : (
          <div className={styles.successBox}>
            <div className={styles.successIcon}>✅</div>
            <h2>Check Your Email</h2>
            <p>We sent a password reset link to <strong>{email}</strong>. The link expires in 1 hour.</p>
          </div>
        )}
        <p className={styles.authSwitch}><Link to="/login">← Back to Login</Link></p>
      </div>
    </div>
  )
}

export function ResetPasswordPage() {
  const [form, setForm] = useState({ token: '', new_password: '', confirm: '' })
  const [loading, setLoading] = useState(false)
  const [done, setDone] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (form.new_password !== form.confirm) { toast.error('Passwords do not match'); return }
    setLoading(true)
    try {
      await authAPI.resetPassword({ token: form.token, new_password: form.new_password })
      setDone(true)
      toast.success('Password reset successfully!')
    } catch {
      toast.error('Invalid or expired reset token')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={styles.simpleAuth}>
      <div className={styles.simpleCard}>
        <Link to="/" className={styles.simpleBrand}><span>▲</span> ArthaNova</Link>
        {!done ? (
          <>
            <h1 className={styles.authTitle}>Reset Password</h1>
            <form onSubmit={handleSubmit} className={styles.authForm}>
              <div className="form-group">
                <label className="form-label" htmlFor="reset-token">Reset Token</label>
                <input id="reset-token" className="form-control" placeholder="Paste token from email"
                  value={form.token} onChange={(e) => setForm((p) => ({ ...p, token: e.target.value }))} />
              </div>
              <div className="form-group">
                <label className={styles.customPasswordLabel} htmlFor="new-pw">NEW PASSWORD</label>
                <div className={styles.passwordInputContainer}>
                  <input id="new-pw" type={showPassword ? "text" : "password"} className={styles.customPasswordInput} placeholder="Min 8 characters"
                    value={form.new_password} onChange={(e) => setForm((p) => ({ ...p, new_password: e.target.value }))} />
                  <button type="button" className={styles.passwordToggle} onClick={() => setShowPassword(!showPassword)} tabIndex="-1">
                    {showPassword ? <FiEyeOff /> : <FiEye />}
                  </button>
                </div>
              </div>
              <div className="form-group">
                <label className={styles.customPasswordLabel} htmlFor="confirm-pw">CONFIRM PASSWORD</label>
                <div className={styles.passwordInputContainer}>
                  <input id="confirm-pw" type={showConfirmPassword ? "text" : "password"} className={styles.customPasswordInput}
                    value={form.confirm} onChange={(e) => setForm((p) => ({ ...p, confirm: e.target.value }))} />
                  <button type="button" className={styles.passwordToggle} onClick={() => setShowConfirmPassword(!showConfirmPassword)} tabIndex="-1">
                    {showConfirmPassword ? <FiEyeOff /> : <FiEye />}
                  </button>
                </div>
              </div>
              <button type="submit" className="btn btn-primary btn-full" disabled={loading}>
                {loading ? 'Resetting...' : 'Reset Password'}
              </button>
            </form>
          </>
        ) : (
          <div className={styles.successBox}>
            <div className={styles.successIcon}>🎉</div>
            <h2>Password Reset!</h2>
            <Link to="/login" className="btn btn-primary">Sign In Now</Link>
          </div>
        )}
      </div>
    </div>
  )
}

export default ForgotPasswordPage
