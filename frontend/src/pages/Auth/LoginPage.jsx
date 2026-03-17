import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Lock, ArrowRight, Zap, Loader2 } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import useAuthStore from '../../store/authStore';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login, loading, error } = useAuthStore();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    const success = await login(email, password);
    if (success) {
      navigate('/dashboard');
    }
  };

  return (
    <div className="auth-page">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="auth-card-wrap"
      >
        <div className="auth-heading-area">
          <Link to="/" className="auth-logo-block">
            <div className="auth-logo-icon">
              <Zap size={22} fill="currentColor" />
            </div>
            <span className="auth-logo-text">ArthaNova</span>
          </Link>
          <h2>Welcome Back</h2>
          <p>Login to access your personalized intelligence.</p>
        </div>

        <div className="auth-container">
          {error && (
            <div className="auth-error">
              <Zap size={14} />
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
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
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <label>Password</label>
                <Link to="/reset-password" name="forgot-password" id="forgot-password" className="auth-forgot-link">
                  Forgot?
                </Link>
              </div>
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

            <button type="submit" className="auth-submit-btn" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 size={20} style={{ animation: 'spin 1.5s linear infinite' }} />
                  Authenticating...
                </>
              ) : (
                <>
                  Sign In
                  <ArrowRight size={18} />
                </>
              )}
            </button>
          </form>

          <hr className="auth-divider" />

          <p className="auth-footer-link">
            Don't have an account?{' '}
            <Link to="/register">Create Account</Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
