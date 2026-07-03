import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Truck } from 'lucide-react';
import Button from '../../components/Button';

export default function OrderConfirmation() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#fcf9f8] flex flex-col items-center justify-center px-5 pb-12">
      <motion.div
        className="w-full max-w-sm flex flex-col items-center text-center space-y-8"
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        {/* Animated checkmark */}
        <motion.div
          className="w-24 h-24 bg-[#005230]/5 border-2 border-[#005834] rounded-full flex items-center justify-center shadow-sm"
          initial={{ scale: 0.5 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', damping: 12, stiffness: 150, delay: 0.1 }}
        >
          <svg width="40" height="40" viewBox="0 0 80 80" fill="none">
            <motion.path
              d="M24 41L35 52L56 30"
              stroke="#005834" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" fill="none"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 0.4, delay: 0.5, ease: 'easeOut' }}
            />
          </svg>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="space-y-2"
        >
          <h1 className="font-display text-[28px] font-bold text-[#1c1b1b] tracking-tight">Order Confirmed</h1>
          <p className="font-mono text-[14px] text-[#434751] font-medium tracking-widest bg-black/5 inline-block px-3 py-1 rounded-full">#ORD-987654</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.7, type: 'spring' }}
          className="w-full bg-white border-2 border-[#1c1b1b] rounded-xl px-5 py-5 flex items-center gap-5 shadow-[4px_4px_0px_0px_rgba(28,27,27,0.1)]"
        >
          <div className="w-12 h-12 bg-[#f0eded] border border-black/10 rounded-lg flex items-center justify-center flex-shrink-0">
            <Truck size={24} className="text-[#003470]" />
          </div>
          <div className="text-left">
            <p className="font-display text-[18px] font-bold text-[#1c1b1b]">Estimated Delivery</p>
            <p className="font-body text-[14px] text-[#434751]">3 – 5 Business Days</p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9 }}
          className="w-full pt-4"
        >
          <button 
            onClick={() => navigate('/dashboard')}
            className="w-full bg-[#1c1b1b] text-white py-4 rounded-xl font-bold flex items-center justify-center gap-3 hover:bg-[#2a2a2a] active:scale-95 transition-all"
          >
            <span className="font-body text-[14px] tracking-wider uppercase">BACK TO DASHBOARD</span>
          </button>
        </motion.div>
      </motion.div>
    </div>
  );
}
