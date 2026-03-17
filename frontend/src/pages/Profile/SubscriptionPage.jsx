import React from 'react';
import { motion } from 'framer-motion';
import { Check, Zap, Shield, Crown, Star, ArrowRight } from 'lucide-react';
import DashboardLayout from '../../layouts/DashboardLayout';
import Button from '../../components/ui/Button';

const PLANS = [
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
    featured: true,
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
      <div className="subscription-hero">
        <h1 style={{ fontSize: '3rem', fontWeight: 900, marginBottom: '24px' }}>Master Your Market Logic</h1>
        <p style={{ fontSize: '1.25rem', color: 'var(--clr-muted)', maxWidth: '800px', margin: '0 auto', lineHeight: 1.6 }}>
          Upgrade your intelligence tier to unlock deep narrative tracking, predictive mapping, and automated media generation.
        </p>
      </div>

      <div className="pricing-grid">
        {PLANS.map((plan, idx) => (
          <motion.div
            key={plan.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className={`pricing-card ${plan.featured ? 'pricing-card--featured' : ''}`}
            style={{ position: 'relative' }}
          >
            {plan.featured && (
              <div 
                className="badge badge-blue" 
                style={{ position: 'absolute', top: 0, left: '50%', transform: 'translate(-50%, -50%)', padding: '8px 20px', borderRadius: '12px', boxShadow: 'var(--shadow-lg)' }}
              >
                Recommended
              </div>
            )}
            
            <div style={{ textAlign: 'center', marginBottom: '40px' }}>
              <div style={{ 
                width: '64px', height: '64px', borderRadius: '20px', margin: '0 auto 24px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                background: plan.color === 'blue' ? 'var(--clr-accent)' : plan.color === 'yellow' ? 'var(--clr-warning)' : 'var(--clr-bg-soft)',
                color: plan.color === 'slate' ? 'var(--clr-muted)' : '#fff',
                boxShadow: plan.color === 'slate' ? 'none' : '0 10px 20px rgba(0,0,0,0.1)'
              }}>
                <plan.icon size={32} />
              </div>
              <p className="intel-counter-lbl" style={{ marginBottom: '8px' }}>{plan.type}</p>
              <h3 style={{ fontSize: '1.75rem', fontWeight: 800, marginBottom: '16px' }}>{plan.name}</h3>
              <div className="price-tag">
                 {plan.price}
                 {plan.price !== 'Free' && <span>/mo</span>}
              </div>
              <p style={{ fontSize: '0.875rem', color: 'var(--clr-muted)', fontWeight: 500 }}>{plan.description}</p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '40px', flex: 1 }}>
              {plan.features.map(feature => (
                 <div key={feature} style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                    <div style={{ 
                      width: '18px', height: '18px', borderRadius: '50%', background: plan.color === 'blue' ? 'var(--clr-accent-lt)' : 'var(--clr-bg-soft)',
                      color: plan.color === 'blue' ? 'var(--clr-accent)' : 'var(--clr-muted)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: '2px'
                    }}>
                       <Check size={12} strokeWidth={4} />
                    </div>
                    <span style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--clr-text)' }}>{feature}</span>
                 </div>
              ))}
            </div>

            <Button 
              variant={plan.featured ? 'primary' : 'secondary'}
              style={{ width: '100%', height: '56px', borderRadius: '16px', fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em' }}
            >
              {plan.button}
              {plan.name !== 'Standard' && !plan.active && <ArrowRight size={16} style={{ marginLeft: '8px' }} />}
            </Button>
          </motion.div>
        ))}
      </div>

      <div className="intelligence-profile" style={{ marginTop: '80px', padding: '60px', borderRadius: '48px', position: 'relative', overflow: 'hidden' }}>
         <div style={{ position: 'absolute', top: 0, right: 0, width: '400px', height: '400px', background: 'rgba(37, 99, 235, 0.1)', filter: 'blur(120px)', marginRight: '-200px', marginTop: '-200px' }} />
         <div style={{ position: 'relative', zIndex: 10, display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '48px' }}>
            <div style={{ maxWidth: '640px' }}>
               <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
                  <Shield size={24} style={{ color: '#60a5fa' }} />
                  <span className="intel-counter-lbl" style={{ margin: 0, color: '#93c5fd' }}>Institutional Intelligence</span>
               </div>
               <h3 style={{ fontSize: '2.5rem', fontWeight: 800, color: '#fff', marginBottom: '20px' }}>Enterprise Sovereign Node</h3>
               <p style={{ color: '#94a3b8', fontSize: '1.125rem', lineHeight: 1.6, fontWeight: 500 }}>
                  Looking for custom data localization and high-throughput sovereign cloud access for your firm? Our institutional team provides dedicated infrastructure deployment.
               </p>
            </div>
            <Button style={{ background: '#fff', color: 'var(--clr-text)', height: '64px', padding: '0 40px', borderRadius: '16px', fontSize: '0.875rem', fontWeight: 800, textTransform: 'uppercase' }}>
               Request Custom Demo
            </Button>
         </div>
      </div>
    </DashboardLayout>
  );
}
