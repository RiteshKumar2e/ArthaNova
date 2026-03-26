import { useState } from 'react'
import { Link } from 'react-router-dom'
import { authAPI } from '../../api/client'
import toast from 'react-hot-toast'
import styles from '../../styles/pages/auth/AuthPages.module.css'

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
    <div className={styles.authPageLight}>
      <div className={`${styles.floatingBox} ${styles.box1}`}></div>
      <div className={`${styles.floatingBox} ${styles.box2}`}></div>
      <div className={`${styles.floatingBox} ${styles.box3}`}></div>

      <Link to="/login" className={styles.homeButtonLight}>
        <span>&larr;</span>
        <span>BACK TO LOGIN</span>
      </Link>

      <div className={styles.authCardLight}>
        <div className={styles.authBrandLight}>
          <Link to="/" className={styles.brandIconLight}>
            <span>▲</span>
            <span>ARTHANOVA</span>
          </Link>
        </div>

        {!sent ? (
          <>
            <h1 className={styles.authTitleLight} style={{ textAlign: 'center' }}>FORGOT PASSWORD?</h1>
            <p className={styles.authSubtitleLight} style={{ marginBottom: '1.5rem', textAlign: 'center' }}>
              Enter your email and we'll send you a reset link.
            </p>

            <form onSubmit={handleSubmit} className={styles.authFormLight}>
              <div className={styles.inputGroupLight}>
                <label htmlFor="fp-email">EMAIL ADDRESS</label>
                <div className={styles.inputWrapperLight}>
                  <input 
                    id="fp-email" 
                    type="email" 
                    className={styles.inputFieldLight} 
                    placeholder="you@example.com"
                    value={email} 
                    onChange={(e) => setEmail(e.target.value)} 
                  />
                </div>
              </div>
              <button type="submit" className={styles.submitBtnLight} disabled={loading}>
                {loading ? <span className={styles.spinnerLight} /> : 'SEND RESET LINK'}
              </button>
            </form>
          </>
        ) : (
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>✅</div>
            <h2 className={styles.authTitleLight} style={{ fontSize: '1.5rem' }}>CHECK YOUR EMAIL</h2>
            <p className={styles.authSubtitleLight} style={{ color: '#000', marginTop: '1rem', lineHeight: '1.5' }}>
              We sent a password reset link to <br/><strong>{email}</strong>.<br/>The link expires in 1 hour.
            </p>
          </div>
        )}
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
    if (form.new_password.length < 8) { toast.error('Password must be at least 8 characters'); return }
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
            <h1 className={styles.authTitleLight} style={{ textAlign: 'center', marginBottom: '1.5rem' }}>RESET PASSWORD</h1>
            <form onSubmit={handleSubmit} className={styles.authFormLight}>
              <div className={styles.inputGroupLight}>
                <label htmlFor="reset-token">RESET TOKEN</label>
                <div className={styles.inputWrapperLight}>
                  <input 
                    id="reset-token" 
                    className={styles.inputFieldLight} 
                    placeholder="Paste token from email"
                    value={form.token} 
                    onChange={(e) => setForm((p) => ({ ...p, token: e.target.value }))} 
                  />
                </div>
              </div>

              <div className={styles.inputGroupLight}>
                <label htmlFor="new-pw">NEW PASSWORD</label>
                <div className={styles.inputWrapperLight}>
                  <input 
                    id="new-pw" 
                    type={showPassword ? "text" : "password"} 
                    className={styles.inputFieldLight} 
                    placeholder="Min 8 characters"
                    value={form.new_password} 
                    onChange={(e) => setForm((p) => ({ ...p, new_password: e.target.value }))} 
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
              </div>

              <div className={styles.inputGroupLight}>
                <label htmlFor="confirm-pw">CONFIRM PASSWORD</label>
                <div className={styles.inputWrapperLight}>
                  <input 
                    id="confirm-pw" 
                    type={showConfirmPassword ? "text" : "password"} 
                    className={styles.inputFieldLight}
                    placeholder="Min 8 characters"
                    value={form.confirm} 
                    onChange={(e) => setForm((p) => ({ ...p, confirm: e.target.value }))} 
                  />
                  <button 
                    type="button" 
                    className={styles.passwordToggleLight} 
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)} 
                    tabIndex="-1"
                  >
                    {showConfirmPassword ? "HIDE" : "SHOW"}
                  </button>
                </div>
              </div>

              <button type="submit" className={styles.submitBtnLight} disabled={loading}>
                {loading ? <span className={styles.spinnerLight} /> : 'RESET PASSWORD'}
              </button>
            </form>
          </>
        ) : (
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🎉</div>
            <h2 className={styles.authTitleLight} style={{ fontSize: '1.5rem', marginBottom: '1.5rem' }}>PASSWORD RESET!</h2>
            <Link to="/login" className={styles.submitBtnLight} style={{ textDecoration: 'none' }}>SIGN IN NOW</Link>
          </div>
        )}
      </div>
    </div>
  )
}

export default ForgotPasswordPage
