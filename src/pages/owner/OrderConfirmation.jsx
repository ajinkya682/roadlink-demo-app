import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Truck, CheckCircle } from 'lucide-react';
import Button from '../../components/Button';

export default function OrderConfirmation() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-fog flex flex-col items-center justify-center px-5 pb-12">
      <motion.div
        className="w-full max-w-sm flex flex-col items-center text-center space-y-6"
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        {/* Animated checkmark */}
        <motion.div
          className="w-24 h-24 bg-verified-green/10 border-2 border-verified-green rounded-2xl flex items-center justify-center"
          initial={{ scale: 0.5 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', damping: 12, stiffness: 150, delay: 0.1 }}
        >
          <svg width="56" height="56" viewBox="0 0 80 80" fill="none">
            <motion.circle
              cx="40" cy="40" r="36"
              stroke="#1E8E5A" strokeWidth="3" fill="rgba(30,142,90,0.08)"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 1 }}
              transition={{ duration: 0.5, ease: 'easeOut', delay: 0.2 }}
            />
            <motion.path
              d="M24 41L35 52L56 30"
              stroke="#1E8E5A" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" fill="none"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 0.4, delay: 0.6, ease: 'easeOut' }}
            />
          </svg>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <h1 className="font-display text-headline-sm text-on-surface mb-1">Order Placed</h1>
          <p className="font-mono text-data-mono text-on-surface-muted">#ORD-987654</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.9, type: 'spring' }}
          className="w-full bg-white border border-outline-light rounded-2xl px-5 py-4 flex items-center gap-4"
        >
          <div className="w-12 h-12 bg-navy/8 rounded-xl flex items-center justify-center flex-shrink-0">
            <Truck size={24} className="text-navy" />
          </div>
          <div className="text-left">
            <p className="font-body text-sm font-semibold text-on-surface">Estimated Delivery</p>
            <p className="font-body text-sm text-on-surface-muted">3 – 5 Business Days</p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.1 }}
          className="w-full"
        >
          <Button fullWidth onClick={() => navigate('/dashboard')}>
            Back to Dashboard
          </Button>
        </motion.div>
      </motion.div>
    </div>
  );
}
