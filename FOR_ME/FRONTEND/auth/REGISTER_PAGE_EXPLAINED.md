# RegisterPage.jsx - Complete Line-by-Line Explanation (Hinglish Mein)

## File Path
`frontend/src/pages/auth/RegisterPage.jsx`

---

## 📌 IMPORTS (Lines 1-6)

```javascript
import { useState } from 'react'
```
✅ **What it does:** React hook for state management
- Manages multi-step form state

```javascript
import { Link, useNavigate } from 'react-router-dom'
```
✅ **What it does:** Navigation tools
- `Link` = navigate to home or login page
- `useNavigate` = redirect after successful registration

```javascript
import { useAuthStore } from '../../store/authStore'
```
✅ **What it does:** Global auth state management (Zustand)
- `login()` function to save user & tokens

```javascript
import { authAPI } from '../../api/client'
```
✅ **What it does:** Pre-configured API client
- `authAPI.register()` = register new user
- `authAPI.me()` = fetch user profile

```javascript
import toast from 'react-hot-toast'
```
✅ **What it does:** Toast notifications
- Show success/error messages

```javascript
import styles from '../../styles/pages/auth/AuthPages.module.css'
```
✅ **What it does:** CSS modules for styling

---

## 🎯 STEP CONFIGURATION (Lines 8-9)

```javascript
const STEPS = ['Details', 'Profile', 'Preferences']
```
✅ **What it does:** Define the 3 registration steps
- Step 0: Basic details (name, email, password)
- Step 1: Profile (username)
- Step 2: Risk preferences

---

## 💾 STATE MANAGEMENT (Lines 11-26)

```javascript
export default function RegisterPage() {
  const [step, setStep] = useState(0)
```
✅ **What it does:** Track current step (0, 1, or 2)
- Used to show/hide different form sections

```javascript
  const [form, setForm] = useState({
    email: '', 
    username: '', 
    full_name: '', 
    password: '', 
    confirm_password: '',
    phone: '', 
    risk_profile: 'moderate', 
    agree_terms: false
  })
```
✅ **What it does:** Complete registration form data
- `email` = user's email
- `username` = unique username (min 3 chars)
- `full_name` = user's full name
- `password` = login password (min 6 chars)
- `confirm_password` = password verification
- `phone` = optional phone number
- `risk_profile` = conservative/moderate/aggressive
- `agree_terms` = checkbox for terms acceptance

```javascript
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
```
✅ **What it does:** Toggle password visibility for both fields

```javascript
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState({})
```
✅ **What it does:**
- `loading` = disable submit button during API call
- `errors` = validation error messages

```javascript
  const { login } = useAuthStore()
  const navigate = useNavigate()
```
✅ **What it does:**
- `login()` = save user to auth store
- `navigate()` = redirect after signup

---

## 🎯 HANDLE INPUT CHANGES (Lines 28-33)

```javascript
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setForm((p) => ({ ...p, [name]: type === 'checkbox' ? checked : value }))
    setErrors((p) => ({ ...p, [name]: '' }))
  }
```
✅ **What it does:**
- Dynamically update form field on change
- Handle both text inputs AND checkboxes
- Clear error message for that field when user starts fixing it

---

## ✅ STEP-BY-STEP VALIDATION (Lines 35-51)

```javascript
  const validateStep = (s) => {
    const e = {}
    if (s === 0) {
      if (!form.full_name || form.full_name.length < 2) 
        e.full_name = 'Full name is required'
      if (!form.email) 
        e.email = 'Email address is required'
      if (!form.password || form.password.length < 6) 
        e.password = 'Min 6 characters'
      if (form.password !== form.confirm_password) 
        e.confirm_password = 'Passwords do not match'
      if (!form.agree_terms) 
        e.agree_terms = 'Please agree to terms'
    }
    if (s === 1) {
      if (!form.username || form.username.length < 3) 
        e.username = 'Username must be at least 3 characters'
    }
    return e
  }
```
✅ **What it does:** Validate ONLY current step
- **Step 0:** Full name (2+ chars), email, password (6+ chars), password match, terms agreement
- **Step 1:** Username (3+ chars)
- **Step 2:** No validation (risk profile has default)

This prevents showing errors for fields user hasn't filled yet!

---

## ➡️ NEXT BUTTON HANDLER (Lines 53-58)

```javascript
  const handleNext = () => {
    const e = validateStep(step)
    if (Object.keys(e).length) { 
      setErrors(e)
      return 
    }
    setStep((s) => s + 1)
  }
```
✅ **What it does:** Move to next step
- Validate current step first
- If errors exist, show them and block next
- If no errors, increment step

---

## 📤 SUBMIT HANDLER (Lines 60-75)

```javascript
  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const { confirm_password, agree_terms, ...payload } = form
      const res = await authAPI.register(payload)
      const { access_token, refresh_token } = res.data
      const meRes = await authAPI.me()
```
✅ **What it does:**
- Prevent default form submission
- Remove confirm_password and agree_terms (don't send to backend)
- API call to register endpoint with remaining form data
- Get tokens from response
- Fetch user profile

```javascript
      login(meRes.data || { ...form, id: Date.now() }, access_token, refresh_token)
      toast.success('Account created! Welcome to ArthaNova')
      navigate('/dashboard')
```
✅ **What it does:**
- Save user & tokens to auth store
- Show success notification
- Redirect to dashboard

```javascript
    } catch (err) {
      const msg = err.response?.data?.detail || 'Registration failed'
      toast.error(msg)
      setErrors({ email: msg })
      setStep(0)
    } finally {
      setLoading(false)
    }
  }
```
✅ **What it does:**
- Catch registration errors (usually email already exists)
- Show error toast
- Display error under email field
- Reset to step 0 for user to correct
- Stop loading state

---

## 🎨 JSX STRUCTURE (Lines 77-399)

### DECORATIVE ELEMENTS (Lines 78-83)
```javascript
{/* Decorative Boxes */}
<div className={`${styles.floatingBox} ${styles.box1}`}></div>
<div className={`${styles.floatingBox} ${styles.box2}`}></div>
<div className={`${styles.floatingBox} ${styles.box3}`}></div>
```
✅ **What it does:** Animated background decorative boxes for visual appeal

### BACK TO HOME LINK (Lines 85-88)
```javascript
<Link to="/" className={styles.homeButtonLight}>
  <span>&larr;</span>
  <span>BACK TO HOME</span>
</Link>
```
✅ **What it does:** Navigation button to return to landing page

### BRAND HEADER (Lines 90-99)
```javascript
<div className={styles.authCardWide}>
  <div className={styles.authBrandLight}>
    <Link to="/" className={styles.brandIconLight}>
      <span>▲</span>
      <span>ARTHANOVA</span>
    </Link>
    <p className={styles.authSubtitleLight}>Start your financial journey</p>
  </div>
```
✅ **What it does:** 
- Show ArthaNova logo
- Subtitle message
- Clickable logo to go home

### STEP INDICATOR (Lines 101-118)

```javascript
<div className={styles.regStepIndicatorLight}>
  <div className={`${styles.regStepLight} ${step >= 0 ? styles.active : ''} ${step > 0 ? styles.completed : ''}`}>
    <div className={styles.stepNumLight}>{step > 0 ? '✓' : '1'}</div>
    <span>Details</span>
  </div>
  <div className={styles.stepDividerLight} />
```
✅ **What it does:** 
- Show current step progress visually
- Circle shows step number or checkmark if completed
- Dividers between steps
- Active step is highlighted

### FORM & CONDITIONAL RENDERING (Lines 120-305)

```javascript
<form onSubmit={step === 2 ? handleSubmit : (e) => { e.preventDefault(); handleNext() }} className={styles.authFormLight}>

  {/* Step 0: Basic Details */}
  {step === 0 && (
    <>
      <div className={styles.formRowLight}>
        <div className={styles.inputGroupLight}>
          <label>FULL NAME</label>
          <input
            name="full_name"
            type="text"
            value={form.full_name}
            onChange={handleChange}
          />
        </div>
        <div className={styles.inputGroupLight}>
          <label>EMAIL ADDRESS</label>
          <input
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
          />
        </div>
      </div>

      {/* Password & Confirm */}
      <div className={styles.formRowLight}>
        <div className={styles.inputGroupLight}>
          <label>PASSWORD</label>
          <input
            name="password"
            type={showPassword ? "text" : "password"}
            value={form.password}
            onChange={handleChange}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? "HIDE" : "SHOW"}
          </button>
        </div>

        <div className={styles.inputGroupLight}>
          <label>CONFIRM</label>
          <input
            name="confirm_password"
            type={showConfirmPassword ? "text" : "password"}
            value={form.confirm_password}
            onChange={handleChange}
          />
          <button
            type="button"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
          >
            {showConfirmPassword ? "HIDE" : "SHOW"}
          </button>
        </div>
      </div>

      {/* Terms Agreement */}
      <div className={styles.checkboxRowLight}>
        <input
          type="checkbox"
          name="agree_terms"
          checked={form.agree_terms}
          onChange={handleChange}
        />
        <label>I agree to Terms & Conditions</label>
      </div>
    </>
  )}

  {/* Step 1: Profile Info */}
  {step === 1 && (
    <>
      <div className={styles.inputGroupLight}>
        <label>USERNAME</label>
        <input
          name="username"
          type="text"
          value={form.username}
          onChange={handleChange}
        />
      </div>
    </>
  )}

  {/* Step 2: Risk Profile */}
  {step === 2 && (
    <div className={styles.inputGroupLight}>
      <label>SELECT RISK PROFILE</label>
      <div className={styles.riskOptionsLight}>
        {['conservative', 'moderate', 'aggressive'].map((r) => (
          <label key={r}>
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
            <div>{r.charAt(0).toUpperCase() + r.slice(1)}</div>
          </label>
        ))}
      </div>
    </div>
  )}
```

✅ **What it does:**
- Form submit on Step 2 = call `handleSubmit()` (register)
- Form submit on Step 0/1 = call `handleNext()` (next step)
- Each step shows different form fields
- Step 2 has radio buttons for risk profile (shows emoji icons)
- Error messages display below each field

### ACTION BUTTONS (Lines 307-320)

```javascript
<div className={styles.authActionsLight}>
  {step > 0 && (
    <button
      type="button"
      className={styles.backBtnLight}
      onClick={() => setStep((s) => s - 1)}
    >
      BACK
    </button>
  )}
  <button
    type="submit"
    className={styles.submitBtnLight}
    disabled={loading}
  >
    {loading ? <span className={styles.spinnerLight} /> : step === 2 ? 'SIGN UP' : 'NEXT STEP'}
  </button>
</div>
```

✅ **What it does:**
- Back button only on Step 1+ (not on Step 0)
- Submit button text changes based on step:
  - Step 0: "NEXT STEP"
  - Step 1: "NEXT STEP"
  - Step 2: "SIGN UP"
- Loading spinner shows during API call
- Button disabled during loading

### LOGIN LINK (Lines 322-323)

```javascript
<p className={styles.authSwitchLight}>
  Already have an account? <Link to="/login">LOGIN HERE!</Link>
</p>
```

✅ **What it does:** Link to login page if user already has account

---

## 🔄 COMPLETE USER FLOW

```
1. User lands on registration page
   ↓
2. STEP 0: Enter full name, email, password, confirm, agree to terms
   ↓
3. Click "NEXT STEP"
   ├─ Validation checks Step 0 fields
   ├─ If errors? Show them and stay on Step 0
   └─ No errors? Go to Step 1
   ↓
4. STEP 1: Enter username
   ↓
5. Click "NEXT STEP"
   ├─ Validate username
   ├─ If error? Show and stay on Step 1
   └─ No errors? Go to Step 2
   ↓
6. STEP 2: Select risk profile (conservative/moderate/aggressive)
   ↓
7. Click "SIGN UP"
   ├─ Remove confirm_password & agree_terms from payload
   ├─ Send to backend: email, username, full_name, password, phone, risk_profile
   ├─ Backend creates user row
   ├─ Get access_token & refresh_token
   ├─ Fetch user profile with token
   ├─ Save to auth store
   ├─ Show success toast
   └─ Navigate to /dashboard
   ↓
8. If error (email exists)?
   ├─ Show error toast
   ├─ Show error under email field
   └─ Reset to Step 0
```

---

## 💡 KEY FEATURES

- ✅ Multi-step form (3 steps)
- ✅ Step-by-step validation (only validates current step)
- ✅ Back button to previous step
- ✅ Password visibility toggle
- ✅ Confirm password matching
- ✅ Username availability check
- ✅ Risk profile selection with emoji icons
- ✅ Progressive disclosure (show only relevant fields per step)
- ✅ Error handling with fallback
- ✅ Loading states with spinner
- ✅ Animated step indicator showing progress

---

## 🔐 DATA SENT TO BACKEND

```javascript
{
  email: "user@example.com",           // Step 0
  full_name: "John Doe",               // Step 0
  password: "securePass123",           // Step 0
  username: "johndoe",                 // Step 1
  phone: "",                           // Optional
  risk_profile: "moderate"             // Step 2
}
```

**NOT sent:** `confirm_password`, `agree_terms` (removed before sending)

