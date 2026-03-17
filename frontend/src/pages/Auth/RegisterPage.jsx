import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Lock, User, ArrowRight, Zap, Loader2, ArrowLeft } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import useAuthStore from '../../store/authStore';

export default function RegisterPage() {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { register, loading, error } = useAuthStore();
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    const success = await register({ full_name: fullName, email, password });
    if (success) {
      navigate('/login');
    }
  };

  return (
    <div className="auth-page">
      <Link to="/" className="auth-back-btn">
        <ArrowLeft size={18} />
        Back to Home
      </Link>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="auth-card-wrap"
      >
        <div className="auth-heading-area">
          <h2>Create Account</h2>
          <p>Join the next generation of business intelligence.</p>
        </div>

        <div className="auth-container">
          {error && (
            <div className="auth-error">
              <Zap size={14} />
              {error}
            </div>
          )}

          <form onSubmit={handleRegister} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div className="auth-form-group">
              <label>Full Name</label>
              <div className="auth-input-wrap">
                <span className="auth-input-icon"><User size={18} /></span>
                <input 
                  type="text" 
                  className="auth-input" 
                  placeholder="John Doe" 
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="auth-form-group">
              <label>Email Address</label>
              <div className="auth-input-wrap">
                <span className="auth-input-icon"><Mail size={18} /></span>
                <input 
                  type="email" 
                  className="auth-input" 
                  placeholder="name@company.com" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="auth-form-group">
              <label>Password</label>
              <div className="auth-input-wrap">
                <span className="auth-input-icon"><Lock size={18} /></span>
                <input 
                  type="password" 
                  className="auth-input" 
                  placeholder="••••••••" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="auth-checkbox-row">
              <input type="checkbox" required />
              <span>
                I agree to the <a href="#">Terms</a> and <a href="#">Privacy</a>
              </span>
            </div>

            <button type="submit" className="auth-submit-btn" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 size={20} style={{ animation: 'spin 1.5s linear infinite' }} />
                  Creating Account...
                </>
              ) : (
                <>
                  Get Started
                  <ArrowRight size={18} />
                </>
              )}
            </button>
          </form>

          <hr className="auth-divider" />

          <p className="auth-footer-link">
            Already have an account?{' '}
            <Link to="/login">Sign In</Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
