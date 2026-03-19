import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuthStore } from '../../store/authStore'
import { authAPI } from '../../api/client'
import toast from 'react-hot-toast'
import { FiEye, FiEyeOff, FiTrendingUp } from 'react-icons/fi'
import styles from '../../styles/pages/auth/AuthPages.module.scss'
import Captcha from '../../components/auth/Captcha'

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
  const [captchaVerified, setCaptchaVerified] = useState(false)
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
      if (!form.full_name || form.full_name.length < 2) e.full_name = 'Full name is required'
      if (!form.email) e.email = 'Email is required'
      if (!form.password || form.password.length < 8) e.password = 'Password must be at least 8 characters'
      if (form.password !== form.confirm_password) e.confirm_password = 'Passwords do not match'
    }
    if (s === 1) {
      if (!form.username || form.username.length < 3) e.username = 'Username must be at least 3 characters'
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
        <span className={styles.homeIcon}>&larr;</span>
        <span className={styles.homeText}>Back to Home</span>
      </Link>

      <div className={styles.authCard}>
        {/* Left Side: Form Content */}
        <div className={styles.authContent}>
          <Link to="/" className={styles.authBrand}>
            <div className={styles.brandIcon}><FiTrendingUp /></div>
            <div className={styles.brandNameText}>
              <span className={styles.brandMain}>ArthaNova</span>
              <span className={styles.brandSub}>AI for the Indian Investor</span>
            </div>
          </Link>

          <h1 className={styles.authTitle}>Create Your Account</h1>

          {/* Stepper Indicator */}
          <div className={styles.regStepIndicator}>
            <div className={`${styles.regStep} ${step >= 0 ? styles.active : ''} ${step > 0 ? styles.completed : ''}`}>
              <div className={styles.stepNum}>{step > 0 ? '✓' : '1'}</div>
              <span>Details</span>
            </div>
            <div className={styles.stepDivider} />
            <div className={`${styles.regStep} ${step >= 1 ? styles.active : ''} ${step > 1 ? styles.completed : ''}`}>
              <div className={styles.stepNum}>{step > 1 ? '✓' : '2'}</div>
              <span>Profile</span>
            </div>
            <div className={styles.stepDivider} />
            <div className={`${styles.regStep} ${step >= 2 ? styles.active : ''}`}>
              <div className={styles.stepNum}>3</div>
              <span>Preferences</span>
            </div>
          </div>

          <form onSubmit={step === 2 ? handleSubmit : (e) => { e.preventDefault(); handleNext() }} className={styles.authForm}>
            
            {/* Step 0: Initial Details */}
            {step === 0 && (
              <>
                <div className="form-group">
                  <label className={styles.customPasswordLabel}>Full Name</label>
                  <input id="reg-name" name="full_name" type="text" className={`${styles.authFormControl} ${errors.full_name ? styles.isInvalid : ''}`}
                    placeholder="Enter your name" value={form.full_name} onChange={handleChange} />
                  {errors.full_name && <div className="form-error">{errors.full_name}</div>}
                </div>
                
                <div className="form-group">
                  <label className={styles.customPasswordLabel}>Email</label>
                  <input id="reg-email" name="email" type="email" className={`${styles.authFormControl} ${errors.email ? styles.isInvalid : ''}`}
                    placeholder="Enter your email" value={form.email} onChange={handleChange} />
                  {errors.email && <div className="form-error">{errors.email}</div>}
                </div>

                <div className="form-group">
                  <label className={styles.customPasswordLabel}>Create Password</label>
                  <div className={styles.passwordInputContainer}>
                    <input id="reg-password" name="password" type={showPassword ? "text" : "password"} className={`${styles.authFormControl} ${errors.password ? styles.isInvalid : ''}`}
                      placeholder="Set a secure password" value={form.password} onChange={handleChange} />
                    <button type="button" className={styles.passwordToggle} onClick={() => setShowPassword(!showPassword)} tabIndex="-1">
                      {showPassword ? <FiEyeOff /> : <FiEye />}
                    </button>
                  </div>
                  {errors.password && <div className="form-error">{errors.password}</div>}
                </div>

                <div className="form-group">
                  <label className={styles.customPasswordLabel}>Confirm Password</label>
                  <div className={styles.passwordInputContainer}>
                    <input id="reg-confirm" name="confirm_password" type={showConfirmPassword ? "text" : "password"} className={`${styles.authFormControl} ${errors.confirm_password ? styles.isInvalid : ''}`}
                      placeholder="Re-enter your password" value={form.confirm_password} onChange={handleChange} />
                    <button type="button" className={styles.passwordToggle} onClick={() => setShowConfirmPassword(!showConfirmPassword)} tabIndex="-1">
                      {showConfirmPassword ? <FiEyeOff /> : <FiEye />}
                    </button>
                  </div>
                  {errors.confirm_password && <div className="form-error">{errors.confirm_password}</div>}
                </div>
              </>
            )}

            {/* Step 1: Extra Info (Username/Phone) */}
            {step === 1 && (
              <>
                <div className="form-group">
                  <label className={styles.customPasswordLabel}>Choose Username</label>
                  <input id="reg-username" name="username" type="text" className={`${styles.authFormControl} ${errors.username ? styles.isInvalid : ''}`}
                    placeholder="e.g. investor_pro" value={form.username} onChange={handleChange} />
                  {errors.username && <div className="form-error">{errors.username}</div>}
                </div>
                <div className="form-group">
                  <label className={styles.customPasswordLabel}>Phone Number</label>
                  <input id="reg-phone" name="phone" type="tel" className={styles.authFormControl}
                    placeholder="+91 98765-43210" value={form.phone} onChange={handleChange} />
                </div>
              </>
            )}

            {/* Step 2: Risk Profile */}
            {step === 2 && (
              <>
                <div className="form-group">
                  <label className={styles.customPasswordLabel}>Investment Risk Profile</label>
                  <div className={styles.riskOptions}>
                    {['conservative', 'moderate', 'aggressive'].map((r) => (
                      <label key={r} className={`${styles.riskOption} ${form.risk_profile === r ? styles.riskSelected : ''}`}>
                        <input type="radio" name="risk_profile" value={r} checked={form.risk_profile === r} onChange={handleChange} />
                        <div className={styles.riskIcon}>
                          {r === 'conservative' ? '🛡️' : r === 'moderate' ? '⚖️' : '🚀'}
                        </div>
                        <div className={styles.riskLabel}>{r.charAt(0).toUpperCase() + r.slice(1)}</div>
                        <div className={styles.riskDesc}>
                          {r === 'conservative' ? 'Safety first' : r === 'moderate' ? 'Balanced' : 'High growth'}
                        </div>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="form-group">
                  <Captcha onVerify={setCaptchaVerified} />
                  {errors.captcha && <div className="form-error">{errors.captcha}</div>}
                </div>
              </>
            )}

            <div className={styles.authActions} style={{ marginTop: '20px' }}>
              {step > 0 && (
                <button type="button" className={styles.btnSecondaryFallback} onClick={() => setStep((s) => s - 1)}>
                  Back
                </button>
              )}
              <button 
                type="submit" 
                className="btn btn-primary btn-full" 
                style={{ opacity: (step === 2 && !captchaVerified) ? 0.6 : 1 }} 
                disabled={loading || (step === 2 && !captchaVerified)}
              >
                {loading ? <span className="spinner" /> : step === 2 ? 'Create Account' : 'Next Step'}
              </button>
            </div>
          </form>

          <p className={styles.authSwitch}>
            Already have an account? <Link to="/login">Login</Link>
          </p>
        </div>

        {/* Right Side: Illustration */}
        <div className={styles.authIllustrationSide}>
          <img src="/images/auth/register_illustration.png" alt="Register Illustration" />
        </div>
      </div>
    </div>
  )
}
