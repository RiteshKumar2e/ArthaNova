import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, ArrowRight, Zap, CheckCircle2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import Button from '../../components/ui/Button';

export default function ForgotPasswordPage() {
  const [submitted, setSubmitted] = useState(false);

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
          <h1 className="text-3xl font-bold font-outfit text-slate-900 leading-tight mb-3">Recovery Access</h1>
          <p className="text-slate-500 font-medium">Enter your credentials to receive a secure recovery bypass.</p>
        </div>

        <div className="space-y-6">
          {!submitted ? (
            <form className="space-y-8" onSubmit={(e) => { e.preventDefault(); setSubmitted(true); }}>
              <div className="auth-form-group">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Work Email</label>
                <div className="relative">
                  <Mail className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input 
                    type="email" 
                    placeholder="name@company.com" 
                    className="auth-input pl-14" 
                    required 
                  />
                </div>
              </div>

              <Button className="w-full h-14 rounded-2xl shadow-xl shadow-blue-200">
                Dispatch Recovery Link
                <ArrowRight className="ml-2 w-5 h-5 shadow-sm" />
              </Button>
            </form>
          ) : (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-6"
            >
              <div className="w-20 h-20 bg-green-50 rounded-[32px] flex items-center justify-center mx-auto mb-8 shadow-inner">
                <CheckCircle2 className="w-10 h-10 text-green-500" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 font-outfit mb-3">Transmission Successful</h3>
              <p className="text-slate-500 font-medium mb-10">
                A verification link has been sent. Please check your inbox and spam folders.
              </p>
              <Button variant="outline" className="w-full h-14 rounded-2xl" onClick={() => setSubmitted(false)}>
                Resynchronize Email
              </Button>
            </motion.div>
          )}

          <div className="pt-8 border-t border-slate-50 text-center">
            <Link to="/login" className="text-[10px] font-bold text-slate-400 hover:text-blue-600 uppercase tracking-[0.2em] transition-colors">
              Return to Login Portal
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
