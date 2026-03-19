import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuthStore } from '../../store/authStore'
import { authAPI } from '../../api/client'
import toast from 'react-hot-toast'
import { FiEye, FiEyeOff } from 'react-icons/fi'
import styles from '../../styles/pages/auth/AuthPages.module.scss'

const STEPS = ['Account', 'Personal', 'Preferences']

export default function RegisterPage() {
  const [step, setStep] = useState(0)
  const [form, setForm] = useState({
    email: '', username: '', full_name: '', password: '', confirm_password: '',
    phone: '', risk_profile: 'moderate',
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState({})
  const { login } = useAuthStore()
  const navigate = useNavigate()

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((p) => ({ ...p, [name]: value }))
    setErrors((p) => ({ ...p, [name]: '' }))
  }

  const validateStep = (s) => {
    const e = {}
    if (s === 0) {
      if (!form.email) e.email = 'Email is required'
      if (!form.username || form.username.length < 3) e.username = 'Username must be at least 3 characters'
      if (!form.password || form.password.length < 8) e.password = 'Password must be at least 8 characters'
      if (form.password !== form.confirm_password) e.confirm_password = 'Passwords do not match'
    }
    if (s === 1) {
      if (!form.full_name || form.full_name.length < 2) e.full_name = 'Full name is required'
    }
    return e
  }

  const handleNext = () => {
    const e = validateStep(step)
    if (Object.keys(e).length) { setErrors(e); return }
    setStep((s) => s + 1)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const { confirm_password, ...payload } = form
      const res = await authAPI.register(payload)
      const { access_token, refresh_token } = res.data
      // Fetch user profile
      const header = { headers: { Authorization: `Bearer ${access_token}` } }
      const meRes = await authAPI.me()
      login(meRes.data || { ...form, id: Date.now() }, access_token, refresh_token)
      toast.success('Account created! Welcome to ArthaNova 🎉')
      navigate('/dashboard')
    } catch (err) {
      const msg = err.response?.data?.detail || 'Registration failed'
      toast.error(msg)
      setErrors({ email: msg })
      setStep(0)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={styles.authPageCentered}>
      <Link to="/" className={styles.homeButtonFixed}>
        <span className={styles.homeText}>&larr; Back to Home</span>
      </Link>

      <div className={styles.authCard}>
          <h1 className={styles.authTitle}>Create Your Account</h1>
          <p className={styles.authSubtitle}>Step {step + 1} of {STEPS.length} — {STEPS[step]}</p>

          <form onSubmit={step === 2 ? handleSubmit : (e) => { e.preventDefault(); handleNext() }} className={styles.authForm}>

            {/* Step 0: Account */}
            {step === 0 && (
              <>
                <div className="form-group">
                  <label className="form-label" htmlFor="reg-email">Email Address</label>
                  <input id="reg-email" name="email" type="email" className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                    placeholder="you@example.com" value={form.email} onChange={handleChange} />
                  {errors.email && <div className="form-error">{errors.email}</div>}
                </div>
                <div className="form-group">
                  <label className="form-label" htmlFor="reg-username">Username</label>
                  <input id="reg-username" name="username" type="text" className={`form-control ${errors.username ? 'is-invalid' : ''}`}
                    placeholder="yourhandle" value={form.username} onChange={handleChange} />
                  {errors.username && <div className="form-error">{errors.username}</div>}
                </div>
                <div className="form-group">
                  <label className={styles.customPasswordLabel} htmlFor="reg-password">PASSWORD</label>
                  <div className={styles.passwordInputContainer}>
                    <input id="reg-password" name="password" type={showPassword ? "text" : "password"} className={`${styles.customPasswordInput} ${errors.password ? 'is-invalid' : ''}`}
                      placeholder="Min 8 chars, 1 uppercase, 1 number" value={form.password} onChange={handleChange} />
                    <button type="button" className={styles.passwordToggle} onClick={() => setShowPassword(!showPassword)} tabIndex="-1">
                      {showPassword ? <FiEyeOff /> : <FiEye />}
                    </button>
                  </div>
                  {errors.password && <div className="form-error">{errors.password}</div>}
                </div>
                <div className="form-group">
                  <label className={styles.customPasswordLabel} htmlFor="reg-confirm">CONFIRM PASSWORD</label>
                  <div className={styles.passwordInputContainer}>
                    <input id="reg-confirm" name="confirm_password" type={showConfirmPassword ? "text" : "password"} className={`${styles.customPasswordInput} ${errors.confirm_password ? 'is-invalid' : ''}`}
                      placeholder="Repeat password" value={form.confirm_password} onChange={handleChange} />
                    <button type="button" className={styles.passwordToggle} onClick={() => setShowConfirmPassword(!showConfirmPassword)} tabIndex="-1">
                      {showConfirmPassword ? <FiEyeOff /> : <FiEye />}
                    </button>
                  </div>
                  {errors.confirm_password && <div className="form-error">{errors.confirm_password}</div>}
                </div>
              </>
            )}

            {/* Step 1: Personal */}
            {step === 1 && (
              <>
                <div className="form-group">
                  <label className="form-label" htmlFor="reg-name">Full Name</label>
                  <input id="reg-name" name="full_name" type="text" className={`form-control ${errors.full_name ? 'is-invalid' : ''}`}
                    placeholder="Your full name" value={form.full_name} onChange={handleChange} />
                  {errors.full_name && <div className="form-error">{errors.full_name}</div>}
                </div>
                <div className="form-group">
                  <label className="form-label" htmlFor="reg-phone">Phone (optional)</label>
                  <input id="reg-phone" name="phone" type="tel" className="form-control"
                    placeholder="+91 9876543210" value={form.phone} onChange={handleChange} />
                </div>
              </>
            )}

            {/* Step 2: Preferences */}
            {step === 2 && (
              <>
                <div className="form-group">
                  <label className="form-label">Investment Risk Profile</label>
                  <div className={styles.riskOptions}>
                    {['conservative', 'moderate', 'aggressive'].map((r) => (
                      <label key={r} className={`${styles.riskOption} ${form.risk_profile === r ? styles.riskSelected : ''}`}>
                        <input type="radio" name="risk_profile" value={r} checked={form.risk_profile === r} onChange={handleChange} />
                        <div className={styles.riskIcon}>
                          {r === 'conservative' ? '🛡️' : r === 'moderate' ? '⚖️' : '🚀'}
                        </div>
                        <div className={styles.riskLabel}>{r.charAt(0).toUpperCase() + r.slice(1)}</div>
                        <div className={styles.riskDesc}>
                          {r === 'conservative' ? 'Low risk, stable returns'
                            : r === 'moderate' ? 'Balanced growth & safety'
                            : 'High risk, high reward'}
                        </div>
                      </label>
                    ))}
                  </div>
                </div>
              </>
            )}

            <div className={styles.authActions}>
              {step > 0 && (
                <button type="button" className="btn btn-secondary" onClick={() => setStep((s) => s - 1)}>
                  ← Back
                </button>
              )}
              <button type="submit" className={`btn btn-primary ${step === 0 ? 'btn-full' : ''}`}
                id={`reg-step-${step}-btn`} disabled={loading}>
                {loading
                  ? <span className="spinner" style={{ width: 18, height: 18 }} />
                  : step === 2 ? 'Create Account 🎉' : 'Continue →'}
              </button>
            </div>
          </form>

          <p className={styles.authSwitch}>
            Already have an account? <Link to="/login">Sign in →</Link>
          </p>

          <p className={styles.termsNote}>
            By creating an account, you agree to our{' '}
            <a href="#">Terms of Service</a> and <a href="#">Privacy Policy</a>.
          </p>
        </div>
    </div>
  )
}
