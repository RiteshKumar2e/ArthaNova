import { useState, useEffect } from 'react'
import styles from '../../styles/pages/auth/AuthPages.module.scss'

export default function Captcha({ onVerify }) {
  const [status, setStatus] = useState('idle') // idle, loading, success

  const handleClick = () => {
    if (status !== 'idle') return
    setStatus('loading')
    
    // Simulate verification delay
    setTimeout(() => {
      setStatus('success')
      if (onVerify) onVerify(true)
    }, 1200)
  }

  return (
    <div className={styles.captchaContainer}>
      <div 
        className={`${styles.captchaBox} ${status === 'success' ? styles.captchaVerified : ''}`}
        onClick={handleClick}
      >
        <div className={styles.captchaLeft}>
          <div className={`${styles.captchaCheckbox} ${status === 'loading' ? styles.loading : ''}`}>
            {status === 'success' && (
              <svg className={styles.checkmark} viewBox="0 0 52 52">
                <circle className={styles.checkmarkCircle} cx="26" cy="26" r="25" fill="none" />
                <path className={styles.checkmarkCheck} fill="none" d="M14.1 27.2l7.1 7.2 16.7-16.8" />
              </svg>
            )}
            {status === 'loading' && <div className={styles.captchaSpinner} />}
          </div>
          <span className={styles.captchaText}>I'm not a robot</span>
        </div>
        
        <div className={styles.captchaRight}>
          <div className={styles.recaptchaLogo}>
            <svg viewBox="0 0 24 24" width="32" height="32">
              <path fill="#4A90E2" d="M12,2C6.48,2,2,6.48,2,12s4.48,10,10,10s10-4.48,10-10S17.52,2,12,2z M12,20c-4.41,0-8-3.59-8-8s3.59-8,8-8s8,3.59,8,8 S16.41,20,12,20z M11,7h2v6h-2V7z M11,15h2v2h-2V15z" />
              <path fill="#4A90E2" d="M12,4c-4.41,0-8,3.59-8,8c0,1.4,0.36,2.71,1,3.85l1.73-1C6.27,13.91,6,12.98,6,12c0-3.31,2.69-6,6-6s6,2.69,6,6 c0,0.98-0.27,1.91-0.73,2.85l1.73,1c0.64-1.14,1-2.45,1-3.85C20,7.59,16.41,4,12,4z" />
            </svg>
          </div>
          <span className={styles.recaptchaLabel}>reCAPTCHA</span>
          <div className={styles.captchaLinks}>
            <a href="#">Privacy</a> - <a href="#">Terms</a>
          </div>
        </div>
      </div>
    </div>
  )
}
