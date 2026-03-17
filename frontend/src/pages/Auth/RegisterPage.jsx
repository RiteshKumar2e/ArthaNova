import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Lock, User, ArrowRight, Zap, Loader2 } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
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
    <div className="auth-wrapper">
      {/* Background Decor */}
      <div className="auth-decor" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md relative z-10"
      >
        <div className="text-center mb-10">
          <Link to="/" className="inline-flex items-center space-x-2 mb-6">
            <div className="w-10 h-10 bg-slate-900 rounded-xl flex items-center justify-center font-bold">
              <Zap className="w-6 h-6 text-blue-400" fill="currentColor" />
            </div>
            <span className="text-2xl font-bold font-outfit tracking-tighter text-slate-900">
              ArthaNova
            </span>
          </Link>
          <h2 className="text-3xl md:text-4xl font-bold font-outfit text-slate-900 mb-2">Create Account</h2>
          <p className="text-slate-500 font-medium">Join the next generation of business intelligence.</p>
        </div>

        <div className="auth-container p-10 bg-white/80 backdrop-blur-xl border border-white rounded-[40px] shadow-2xl">
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-100 text-red-600 text-xs font-bold rounded-2xl flex items-center">
              <Zap className="w-4 h-4 mr-2 shrink-0" />
              {error}
            </div>
          )}

          <form className="space-y-5" onSubmit={handleRegister}>
            <div className="auth-form-group">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Full Name</label>
              <div className="relative mt-2">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <Input 
                  type="text" 
                  placeholder="John Doe" 
                  className="pl-12 h-14 rounded-2xl" 
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="auth-form-group">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Email Address</label>
              <div className="relative mt-2">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <Input 
                  type="email" 
                  placeholder="name@company.com" 
                  className="pl-12 h-14 rounded-2xl" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="auth-form-group">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Password</label>
              <div className="relative mt-2">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <Input 
                  type="password" 
                  placeholder="••••••••" 
                  className="pl-12 h-14 rounded-2xl" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="flex items-center space-x-2 ml-1 mb-6">
              <input type="checkbox" className="rounded border-slate-300 text-blue-600 focus:ring-blue-500" required />
              <span className="text-xs font-medium text-slate-500">
                I agree to the <a href="#" className="underline text-slate-900 font-bold">Terms</a> and <a href="#" className="underline text-slate-900 font-bold">Privacy</a>
              </span>
            </div>

            <Button className="w-full h-14 rounded-2xl shadow-xl shadow-blue-500/20" size="lg" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 w-5 h-5 animate-spin" />
                  Creating Account...
                </>
              ) : (
                <>
                  Get Started
                  <ArrowRight className="ml-2 w-5 h-5" />
                </>
              )}
            </Button>
          </form>

          <div className="mt-8 pt-8 border-t border-slate-100 text-center">
            <p className="text-slate-500 text-xs font-bold uppercase tracking-widest">
              Already have an account?{' '}
              <Link to="/login" className="text-blue-600 hover:text-blue-700">
                Sign In
              </Link>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
