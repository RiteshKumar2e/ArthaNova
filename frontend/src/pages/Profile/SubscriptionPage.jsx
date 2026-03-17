import React from 'react';
import { motion } from 'framer-motion';
import { Check, Zap, Shield, Crown, Star, ArrowRight } from 'lucide-react';
import DashboardLayout from '../../layouts/DashboardLayout';
import Button from '../../components/ui/Button';
import { clsx } from "clsx";

const plans = [
  {
    name: 'Standard',
    type: 'Entry Tier',
    price: 'Free',
    description: 'Essential global news with basic AI synthesis.',
    features: ['Standard Feed Access', 'Basic Summary Views', '5 Video Studio Tokens/mo', 'Community Support'],
    icon: Star,
    color: 'slate',
    button: 'Current Plan',
    active: false
  },
  {
    name: 'Intelligence',
    type: 'Most Popular',
    price: '$29',
    description: 'Deep market logic and personalized story arcs.',
    features: ['Deep Analysis Access', 'Unlimited Synthesis', 'Sovereign Map Access', '50 Video Studio Tokens/mo', 'Priority Support'],
    icon: Zap,
    color: 'blue',
    button: 'Upgrade to Intel',
    active: true
  },
  {
    name: 'Sovereign',
    type: 'Institutional',
    price: '$199',
    description: 'Full-scale market predictions and private data nodes.',
    features: ['Predictive Logic Panel', 'Private Data Localization', 'Unlimited Video Studio', 'Direct AI Consultation', 'White-glove Support'],
    icon: Crown,
    color: 'yellow',
    button: 'Go Sovereign',
    active: false
  }
];

export default function SubscriptionPage() {
  return (
    <DashboardLayout>
      <div className="text-center max-w-3xl mx-auto mb-20">
        <h1 className="text-4xl md:text-5xl font-bold font-outfit text-slate-900 mb-6">Master Your Market Logic</h1>
        <p className="text-lg text-slate-500 font-medium leading-relaxed">
          Upgrade your intelligence tier to unlock deep narrative tracking, predictive mapping, and automated media generation.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
        {plans.map((plan, idx) => (
          <motion.div
            key={plan.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className={clsx(
              "premium-card p-10 flex flex-col relative",
              plan.active ? "border-blue-600 ring-4 ring-blue-500/10 shadow-2xl" : "border-slate-100"
            )}
          >
            {plan.active && (
              <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 px-4 py-1.5 bg-blue-600 text-white rounded-full text-[10px] font-bold uppercase tracking-widest shadow-xl">
                Recommended
              </div>
            )}
            
            <div className="mb-10 text-center">
              <div className={clsx(
                "w-16 h-16 rounded-[24px] flex items-center justify-center mx-auto mb-6 shadow-lg",
                plan.color === 'blue' ? "bg-blue-600 text-white" : 
                plan.color === 'yellow' ? "bg-yellow-500 text-white" : "bg-slate-100 text-slate-400"
              )}>
                <plan.icon className="w-8 h-8" />
              </div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-2">{plan.type}</p>
              <h3 className="text-3xl font-bold font-outfit text-slate-900 mb-4">{plan.name}</h3>
              <div className="flex items-baseline justify-center">
                 <span className="text-4xl font-bold font-outfit text-slate-900">{plan.price}</span>
                 {plan.price !== 'Free' && <span className="ml-1 text-slate-400 text-sm font-medium">/mo</span>}
              </div>
              <p className="mt-4 text-sm text-slate-500 font-medium">{plan.description}</p>
            </div>

            <div className="space-y-4 mb-10 flex-grow">
              {plan.features.map(feature => (
                 <div key={feature} className="flex items-start space-x-3">
                    <div className={clsx(
                      "mt-1 w-4 h-4 rounded-full flex items-center justify-center shrink-0",
                      plan.color === 'blue' ? "bg-blue-50 text-blue-600" : 
                      plan.color === 'yellow' ? "bg-yellow-50 text-yellow-600" : "bg-slate-50 text-slate-400"
                    )}>
                       <Check className="w-3 h-3" strokeWidth={3} />
                    </div>
                    <span className="text-sm text-slate-600 font-medium">{feature}</span>
                 </div>
              ))}
            </div>

            <Button 
              className={clsx(
                "w-full h-14 rounded-2xl font-bold uppercase tracking-widest text-[10px] transition-all",
                plan.active ? "bg-blue-600 hover:bg-blue-500 shadow-xl shadow-blue-900/40" : 
                plan.color === 'yellow' ? "bg-yellow-500 hover:bg-yellow-400" : "bg-slate-100 text-slate-900 hover:bg-slate-200"
              )}
            >
              {plan.button}
              {!plan.active && plan.name !== 'Standard' && <ArrowRight className="w-4 h-4 ml-2" />}
            </Button>
          </motion.div>
        ))}
      </div>

      <div className="mt-20 premium-card p-10 bg-slate-900 text-white relative overflow-hidden group">
         <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/10 blur-[120px] -mr-48 -mt-48" />
         <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-10">
            <div className="max-w-2xl">
               <div className="flex items-center space-x-3 mb-6">
                  <Shield className="w-6 h-6 text-blue-400" />
                  <span className="text-[10px] font-bold uppercase tracking-widest text-blue-400">Institutional Intelligence</span>
               </div>
               <h3 className="text-3xl font-bold font-outfit mb-4">Enterprise Sovereign Node</h3>
               <p className="text-slate-400 text-lg leading-relaxed font-medium">
                  Looking for custom data localization and high-throughput sovereign cloud access for your firm? Our institutional team provides dedicated infrastructure deployment.
               </p>
            </div>
            <Button className="bg-white text-slate-900 hover:bg-slate-100 border-none h-14 px-10 rounded-2xl font-bold uppercase tracking-widest whitespace-nowrap shadow-xl">
               Request Custom Demo
            </Button>
         </div>
      </div>
    </DashboardLayout>
  );
}
