import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuthStore } from '../../store/authStore'
import { authAPI } from '../../api/client'
import toast from 'react-hot-toast'
import { FiEye, FiEyeOff, FiMail, FiLock, FiUser, FiPhone, FiAtSign, FiTrendingUp } from 'react-icons/fi'
import styles from '../../styles/pages/auth/AuthPages.module.scss'

const STEPS = ['Details', 'Profile', 'Preferences']

export default function RegisterPage() {
  const [step, setStep] = useState(0)
  const [form, setForm] = useState({
    email: '', username: '', full_name: '', password: '', confirm_password: '',
    phone: '', risk_profile: 'moderate', agree_terms: false
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState({})

  const { login } = useAuthStore()
  const navigate = useNavigate()

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setForm((p) => ({ ...p, [name]: type === 'checkbox' ? checked : value }))
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
      const { confirm_password, agree_terms, ...payload } = form
      const res = await authAPI.register(payload)
      const { access_token, refresh_token } = res.data
      const meRes = await authAPI.me()
      login(meRes.data || { ...form, id: Date.now() }, access_token, refresh_token)
      toast.success('Account created! Welcome to ArthaNova')
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
          <h1 className={styles.authTitleLight}>Create Your Account</h1>
          <p className={styles.authSubtitleLight}>Join ArthaNova and start investing smarter</p>
        </div>

        {/* Step Indicator */}
        <div className={styles.regStepIndicatorLight}>
          <div className={`${styles.regStepLight} ${step >= 0 ? styles.active : ''} ${step > 0 ? styles.completed : ''}`}>
            <div className={styles.stepNumLight}>{step > 0 ? '✓' : '1'}</div>
            <span>Details</span>
          </div>
          <div className={styles.stepDividerLight} />
          <div className={`${styles.regStepLight} ${step >= 1 ? styles.active : ''} ${step > 1 ? styles.completed : ''}`}>
            <div className={styles.stepNumLight}>{step > 1 ? '✓' : '2'}</div>
            <span>Profile</span>
          </div>
          <div className={styles.stepDividerLight} />
          <div className={`${styles.regStepLight} ${step >= 2 ? styles.active : ''}`}>
            <div className={styles.stepNumLight}>3</div>
            <span>Preferences</span>
          </div>
        </div>

        <form onSubmit={step === 2 ? handleSubmit : (e) => { e.preventDefault(); handleNext() }} className={styles.authFormLight}>

          {/* Step 0: Basic Details */}
          {step === 0 && (
            <>
              {/* Full Name */}
              <div className={styles.inputGroupLight}>
                <div className={styles.inputWrapperLight}>
                  <FiUser className={styles.inputIconLight} />
                  <input
                    id="reg-name"
                    name="full_name"
                    type="text"
                    className={`${styles.inputFieldLight} ${errors.full_name ? styles.hasError : ''}`}
                    placeholder="Full Name"
                    value={form.full_name}
                    onChange={handleChange}
                  />
                </div>
                {errors.full_name && <div className={styles.errorTextLight}>{errors.full_name}</div>}
              </div>

              {/* Email */}
              <div className={styles.inputGroupLight}>
                <div className={styles.inputWrapperLight}>
                  <FiMail className={styles.inputIconLight} />
                  <input
                    id="reg-email"
                    name="email"
                    type="email"
                    className={`${styles.inputFieldLight} ${errors.email ? styles.hasError : ''}`}
                    placeholder="Email address"
                    value={form.email}
                    onChange={handleChange}
                  />
                </div>
                {errors.email && <div className={styles.errorTextLight}>{errors.email}</div>}
              </div>

              {/* Password */}
              <div className={styles.inputGroupLight}>
                <div className={styles.inputWrapperLight}>
                  <FiLock className={styles.inputIconLight} />
                  <input
                    id="reg-password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    className={`${styles.inputFieldLight} ${styles.inputFieldLightWithToggle} ${errors.password ? styles.hasError : ''}`}
                    placeholder="Password"
                    value={form.password}
                    onChange={handleChange}
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

              {/* Confirm Password */}
              <div className={styles.inputGroupLight}>
                <div className={styles.inputWrapperLight}>
                  <FiLock className={styles.inputIconLight} />
                  <input
                    id="reg-confirm"
                    name="confirm_password"
                    type={showConfirmPassword ? "text" : "password"}
                    className={`${styles.inputFieldLight} ${styles.inputFieldLightWithToggle} ${errors.confirm_password ? styles.hasError : ''}`}
                    placeholder="Confirm Password"
                    value={form.confirm_password}
                    onChange={handleChange}
                  />
                  <button
                    type="button"
                    className={styles.passwordToggleLight}
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    tabIndex="-1"
                  >
                    {showConfirmPassword ? <FiEyeOff /> : <FiEye />}
                  </button>
                </div>
                {errors.confirm_password && <div className={styles.errorTextLight}>{errors.confirm_password}</div>}
              </div>

              {/* Terms Agreement */}
              <div className={styles.checkboxRowLight}>
                <input
                  type="checkbox"
                  id="agree_terms"
                  name="agree_terms"
                  className={styles.checkboxLight}
                  checked={form.agree_terms}
                  onChange={handleChange}
                />
                <label htmlFor="agree_terms" className={styles.checkboxLabelLight}>
                  I agree to <a href="/terms" target="_blank">Terms & Conditions</a>
                </label>
              </div>
            </>
          )}

          {/* Step 1: Profile Info */}
          {step === 1 && (
            <>
              {/* Username */}
              <div className={styles.inputGroupLight}>
                <div className={styles.inputWrapperLight}>
                  <FiAtSign className={styles.inputIconLight} />
                  <input
                    id="reg-username"
                    name="username"
                    type="text"
                    className={`${styles.inputFieldLight} ${errors.username ? styles.hasError : ''}`}
                    placeholder="Choose a username"
                    value={form.username}
                    onChange={handleChange}
                  />
                </div>
                {errors.username && <div className={styles.errorTextLight}>{errors.username}</div>}
              </div>

              {/* Phone */}
              <div className={styles.inputGroupLight}>
                <div className={styles.inputWrapperLight}>
                  <FiPhone className={styles.inputIconLight} />
                  <input
                    id="reg-phone"
                    name="phone"
                    type="tel"
                    className={styles.inputFieldLight}
                    placeholder="Phone Number (Optional)"
                    value={form.phone}
                    onChange={handleChange}
                  />
                </div>
              </div>
            </>
          )}

          {/* Step 2: Risk Profile */}
          {step === 2 && (
            <div className={styles.inputGroupLight}>
              <div className={styles.riskOptionsLight}>
                {['conservative', 'moderate', 'aggressive'].map((r) => (
                  <label
                    key={r}
                    className={`${styles.riskOptionLight} ${form.risk_profile === r ? styles.riskSelectedLight : ''}`}
                  >
                    <input
                      type="radio"
                      name="risk_profile"
                      value={r}
                      checked={form.risk_profile === r}
                      onChange={handleChange}
                    />
                    <div className={styles.riskIconLight}>
                      {r === 'conservative' ? '🛡️' : r === 'moderate' ? '⚖️' : '🚀'}
                    </div>
                    <div className={styles.riskLabelLight}>{r.charAt(0).toUpperCase() + r.slice(1)}</div>
                    <div className={styles.riskDescLight}>
                      {r === 'conservative' ? 'Safety first' : r === 'moderate' ? 'Balanced' : 'High growth'}
                    </div>
                  </label>
                ))}
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className={styles.authActionsLight}>
            {step > 0 && (
              <button
                type="button"
                className={styles.backBtnLight}
                onClick={() => setStep((s) => s - 1)}
              >
                Back
              </button>
            )}
            <button
              type="submit"
              className={styles.nextBtnLight}
              disabled={loading}
            >
              {loading ? <span className={styles.spinnerLight} /> : step === 2 ? 'Sign Up' : 'Next Step'}
            </button>
          </div>
        </form>

        {/* Login Link */}
        <p className={styles.authSwitchLight}>
          Already have an account? <Link to="/login">Login Here</Link>
        </p>
      </div>
    </div>
  )
}
