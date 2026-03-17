import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, ArrowRight, RefreshCcw, Zap } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import Button from '../../components/ui/Button';

export default function OTPPage() {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [timer, setTimer] = useState(30);
  const navigate = useNavigate();

  useEffect(() => {
    const interval = setInterval(() => {
      setTimer((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleChange = (index, value) => {
    if (isNaN(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value.substring(value.length - 1);
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 5) {
      document.getElementById(`otp-${index + 1}`).focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      document.getElementById(`otp-${index - 1}`).focus();
    }
  };

  return (
    <div className="auth-wrapper">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="auth-container"
      >
        <div className="text-center mb-10">
          <Link to="/" className="inline-flex items-center space-x-2 mb-8">
            <div className="w-12 h-12 bg-slate-900 rounded-2xl flex items-center justify-center shadow-xl">
              <Zap className="w-7 h-7 text-blue-400" fill="currentColor" />
            </div>
          </Link>
          <h1 className="text-3xl font-bold font-outfit text-slate-900 leading-tight mb-3">Identity Verification</h1>
          <p className="text-slate-500 font-medium">We've dispatched a secure 6-digit code to your email.</p>
        </div>

        <div className="space-y-8">
          <div className="flex justify-center space-x-3">
            {otp.map((digit, idx) => (
              <input
                key={idx}
                id={`otp-${idx}`}
                type="text"
                maxLength={1}
                value={digit}
                onChange={(e) => handleChange(idx, e.target.value)}
                onKeyDown={(e) => handleKeyDown(idx, e)}
                className="w-12 h-16 text-center text-xl font-bold bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10 outline-none transition-all"
              />
            ))}
          </div>

          <Button 
            className="w-full h-14 rounded-2xl shadow-xl shadow-blue-200" 
            onClick={() => navigate('/dashboard')}
          >
            Authenticate Profile
            <ArrowRight className="ml-2 w-5 h-5 shadow-sm" />
          </Button>

          <div className="flex flex-col items-center space-y-6 pt-4">
            <p className="text-sm text-slate-500 font-bold uppercase tracking-widest">
              {timer > 0 ? (
                `Resend code in ${timer}s`
              ) : (
                <button className="text-blue-600 font-bold hover:text-blue-700 flex items-center transition-colors">
                  <RefreshCcw className="w-4 h-4 mr-2" /> Resend Protocol
                </button>
              )}
            </p>
            <Link to="/login" className="text-[10px] font-bold text-slate-400 hover:text-slate-600 uppercase tracking-[0.2em] transition-colors">
              Abort to Login
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
