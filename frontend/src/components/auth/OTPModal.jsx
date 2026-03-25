import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import styles from '../../styles/pages/auth/OTPModal.module.css';

export default function OTPModal({ email, fullName, otpToken, onComplete, onBack }) {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes
  const [attemptMessage, setAttemptMessage] = useState('');

  // Timer countdown
  useEffect(() => {
    if (timeLeft <= 0) return;
    const timer = setInterval(() => {
      setTimeLeft((t) => t - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [timeLeft]);

  const handleInputChange = (index, value) => {
    const numValue = value.replace(/\D/g, ''); // Only digits
    if (numValue.length > 1) return;

    const newOtp = [...otp];
    newOtp[index] = numValue;
    setOtp(newOtp);

    // Auto-focus next input
    if (numValue && index < 5) {
      document.getElementById(`otp-input-${index + 1}`)?.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      document.getElementById(`otp-input-${index - 1}`)?.focus();
    }
    if (e.key === 'Enter' && otp.every((digit) => digit)) {
      handleVerifyOTP();
    }
  };

  const handleVerifyOTP = async () => {
    const otpValue = otp.join('');

    if (otpValue.length !== 6) {
      setAttemptMessage('❌ Please enter all 6 digits');
      return;
    }

    setLoading(true);
    setAttemptMessage('');

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/auth/google/otp-verify`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email,
            otp: otpValue,
            fullName,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setAttemptMessage(`❌ ${data.error || 'Verification failed'}`);
        setOtp(['', '', '', '', '', '']);
        return;
      }

      toast.success('✅ Login successful!', { icon: '🎉' });
      onComplete(data);
    } catch (error) {
      setAttemptMessage(`❌ ${error.message}`);
      setOtp(['', '', '', '', '', '']);
    } finally {
      setLoading(false);
    }
  };

  const handleResendOTP = async () => {
    setLoading(true);
    try {
      // Call resend endpoint (you'll need to create this)
      toast.success('✉️ OTP resent to your email');
      setOtp(['', '', '', '', '', '']);
      setTimeLeft(300); // Reset to 5 minutes
      setAttemptMessage('');
    } catch (error) {
      toast.error('Failed to resend OTP');
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const isExpired = timeLeft <= 0;
  const allFilled = otp.every((digit) => digit);

  return (
    <div className={styles.backdrop}>
      <div className={styles.modal}>
        {/* Close Button */}
        <button className={styles.closeBtn} onClick={onBack}>
          ✕
        </button>

        {/* Header */}
        <div className={styles.header}>
          <div className={styles.headerIcon}>🔐</div>
          <h2 className={styles.title}>Verify Your Identity</h2>
          <p className={styles.subtitle}>
            Enter the 6-digit code sent to <strong>{email}</strong>
          </p>
        </div>

        {/* OTP Input Section */}
        <div className={styles.otpSection}>
          <div className={styles.otpInputContainer}>
            {otp.map((digit, index) => (
              <input
                key={index}
                id={`otp-input-${index}`}
                type="text"
                maxLength="1"
                value={digit}
                onChange={(e) => handleInputChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                className={styles.otpInput}
                placeholder="•"
                disabled={loading}
                autoFocus={index === 0}
              />
            ))}
          </div>

          {/* Attempt Message */}
          {attemptMessage && (
            <div className={styles.attemptMessage}>{attemptMessage}</div>
          )}

          {/* Timer and Resend */}
          <div className={styles.timerSection}>
            <div className={`${styles.timer} ${isExpired ? styles.expired : ''}`}>
              {isExpired ? (
                <span>⏰ OTP Expired</span>
              ) : (
                <span>⏱️ {formatTime(timeLeft)}</span>
              )}
            </div>

            {isExpired ? (
              <p className={styles.expiredText}>
                Your OTP has expired. Please request a new one.
              </p>
            ) : (
              <p className={styles.resendPrompt}>
                Didn't receive the code?{' '}
                <button
                  type="button"
                  className={styles.resendLink}
                  onClick={handleResendOTP}
                  disabled={loading}
                >
                  Resend OTP
                </button>
              </p>
            )}
          </div>
        </div>

        {/* Security Note */}
        <div className={styles.securityNote}>
          <span className={styles.lockIcon}>🛡️</span>
          <p>
            Never share this code with anyone. ArthaNova support will never ask for your OTP.
          </p>
        </div>

        {/* Action Buttons */}
        <div className={styles.actions}>
          <button
            type="button"
            className={styles.backBtn}
            onClick={onBack}
            disabled={loading}
          >
            ← Back to Login
          </button>
          <button
            type="button"
            className={`${styles.verifyBtn} ${allFilled && !isExpired && !loading ? styles.active : ''}`}
            onClick={handleVerifyOTP}
            disabled={!allFilled || isExpired || loading}
          >
            {loading ? (
              <>
                <span className={styles.spinner}></span> Verifying...
              </>
            ) : (
              'Verify OTP'
            )}
          </button>
        </div>

        {/* Help Text */}
        <p className={styles.helpText}>
          Having trouble? Check your spam folder or{' '}
          <span className={styles.contactLink}>contact support</span>
        </p>
      </div>
    </div>
  );
}
