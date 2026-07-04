import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Truck, CheckCircle, Download } from 'lucide-react';

export default function OrderConfirmation() {
  const navigate = useNavigate();
  const location = useLocation();
  const { orderId } = location.state || { orderId: 'RL-9823-XQ' };

  return (
    <div className="min-h-screen bg-[#F7F8FA] text-[#1c1b1b] flex flex-col font-body relative z-0">
      {/* Background Decorative Micro-Interaction */}
      <div className="fixed inset-0 pointer-events-none -z-10 opacity-30">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(#00347010_1px,transparent_1px)] [background-size:24px_24px]"></div>
      </div>

      <main className="flex-grow flex items-center justify-center px-4 py-12">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="max-w-md w-full bg-white rounded-xl border border-black/5 shadow-[0px_4px_24px_rgba(0,0,0,0.02)] p-8 text-center"
        >
          {/* Checkmark Animation Container */}
          <div className="mb-6 flex justify-center">
            {/* Entry Animation */}
            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", damping: 18, stiffness: 200, delay: 0.1 }}
            >
              {/* Looping Scale Animation */}
              <motion.div 
                animate={{ scale: [1, 1.08, 1] }}
                transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
                className="w-24 h-24 rounded-full bg-[#1E8E5A]/10 flex items-center justify-center relative"
              >
                <svg width="56" height="56" viewBox="0 0 56 56" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <motion.circle 
                    cx="28" cy="28" r="28" 
                    fill="#1E8E5A"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.2 }}
                  />
                  <motion.path 
                    d="M16 28L24 36L40 19" 
                    stroke="white" 
                    strokeWidth="4.5" 
                    strokeLinecap="round" 
                    strokeLinejoin="round"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 0.5, ease: "easeOut", delay: 0.5 }}
                  />
                </svg>
              </motion.div>
            </motion.div>
          </div>

          {/* Headline */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.3 }}
          >
            <h1 className="font-display text-[32px] font-semibold tracking-tight text-[#1c1b1b] mb-2">Order placed</h1>
            <p className="font-body text-[16px] text-[#434751] mb-8">Your request has been processed successfully.</p>
          </motion.div>

          {/* Signature Plate-Tag Device */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, delay: 0.5 }}
            className="mb-8 flex flex-col items-center w-full"
          >
            <div className="font-body text-[12px] font-bold tracking-[0.08em] text-[#434751] uppercase mb-3 text-center">ORDER REFERENCE</div>
            <div className="border-[2px] border-[#1A1A1A] bg-white px-8 py-3 rounded-lg inline-flex items-center justify-center hover:bg-black/5 transition-colors cursor-default mb-4">
              <span className="font-mono text-[22px] font-semibold text-[#1A1A1A] tracking-[0.1em]">{orderId}</span>
            </div>
            
            <button 
              onClick={() => {
                // In a real app, fetch receipt URL from /v1/orders/${orderId}/receipt and open it
                alert('Downloading receipt...');
              }}
              className="flex items-center justify-center space-x-2 border-2 border-[#1E3A8A] text-[#1E3A8A] font-body text-[14px] font-bold tracking-[0.08em] uppercase py-2 px-6 rounded-lg hover:bg-slate-50 active:scale-[0.98] transition-all"
            >
              <Download size={18} />
              <span>Download Receipt (PDF)</span>
            </button>
          </motion.div>

          {/* Meta Information Bento-ish Layout */}
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.7 }}
            className="grid grid-cols-1 gap-4 mb-10"
          >
            <div className="bg-[#F7F8FA] p-5 rounded-lg border border-black/5 flex flex-col items-center">
              <Truck size={28} className="text-[#003470] mb-2" strokeWidth={1.5} />
              <span className="font-body text-[12px] font-bold tracking-[0.08em] text-[#434751] uppercase mb-1">ESTIMATED DELIVERY</span>
              <span className="font-display text-[20px] font-semibold text-[#1c1b1b]">Arriving by Oct 24</span>
            </div>
          </motion.div>

          {/* Primary Action */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.9 }}
            className="space-y-4"
          >
            <button 
              onClick={() => navigate('/dashboard')}
              className="w-full bg-[#1B4B8F] text-white font-body text-[14px] font-bold tracking-[0.08em] uppercase py-4 rounded-xl hover:bg-[#153a6f] active:scale-[0.98] transition-all shadow-md"
            >
              BACK TO DASHBOARD
            </button>
            <button 
              onClick={() => navigate('/order-history')}
              className="w-full bg-transparent text-[#003470] font-body text-[14px] font-bold tracking-[0.08em] uppercase py-2 hover:underline active:scale-[0.98] transition-all"
            >
              VIEW ORDER HISTORY
            </button>
          </motion.div>
        </motion.div>
      </main>
    </div>
  );
}
