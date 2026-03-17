import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, ArrowRight, Zap, CheckCircle2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';

export default function ResetPasswordPage() {
  const [submitted, setSubmitted] = useState(false);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-slate-50 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none -z-10">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-100/40 rounded-full blur-[100px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-100/40 rounded-full blur-[100px]" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="text-center mb-10">
          <Link to="/" className="inline-flex items-center space-x-2 mb-6">
            <div className="w-10 h-10 bg-slate-900 rounded-xl flex items-center justify-center">
              <Zap className="w-6 h-6 text-blue-400" fill="currentColor" />
            </div>
            <span className="text-2xl font-bold font-outfit tracking-tighter text-slate-900">
              ArthaNova
            </span>
          </Link>
          <h1 className="text-3xl font-bold font-outfit text-slate-900 mb-2">Reset Password</h1>
          <p className="text-slate-500">Enter your email and we'll send you recovery instructions.</p>
        </div>

        <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-xl shadow-slate-200/50">
          {!submitted ? (
            <form className="space-y-6" onSubmit={(e) => { e.preventDefault(); setSubmitted(true); }}>
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700 ml-1">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <Input type="email" placeholder="name@company.com" className="pl-12" required />
                </div>
              </div>

              <Button className="w-full" size="lg">
                Send Reset Link
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </form>
          ) : (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-4"
            >
              <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle2 className="w-8 h-8 text-green-500" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">Check your email</h3>
              <p className="text-slate-500 mb-8">
                We've sent a password reset link to your email address. It will expire in 1 hour.
              </p>
              <Button variant="secondary" className="w-full" onClick={() => setSubmitted(false)}>
                Try another email
              </Button>
            </motion.div>
          )}

          <div className="mt-8 pt-8 border-t border-slate-100 text-center">
            <Link to="/login" className="text-sm font-semibold text-blue-600 hover:text-blue-700">
              Back to Login
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
