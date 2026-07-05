import React from 'react';
import { useNavigate } from 'react-router-dom';
import { QrCode, Search, ChevronRight, Shield, LayoutDashboard, User } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAppData } from '../context/AppContext';
import TopAuthButton from '../components/TopAuthButton';

const stagger = { hidden: {}, show: { transition: { staggerChildren: 0.1 } } };
const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: 'spring', damping: 22, stiffness: 200 } },
};

export default function GuestDashboard() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAppData();

  return (
    <div className="min-h-screen bg-fog flex flex-col relative">
      {/* Top right auth button */}
      <TopAuthButton theme="dark" />

      {/* Hero */}
      <div className="bg-navy px-6 pt-16 pb-16 text-center relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute -top-12 -right-12 w-48 h-48 rounded-full bg-white" />
          <div className="absolute -bottom-8 -left-8 w-32 h-32 rounded-full bg-white" />
        </div>
        <div className="relative z-10">
          <h1 className="font-display text-headline-lg text-white mb-1">RoadLink</h1>
          <p className="font-body text-sm text-white/70">Privacy-first vehicle identity</p>
        </div>
      </div>

      {/* Cards */}
      <motion.div
        className="relative z-20 flex-1 px-5 -mt-8 pb-8 space-y-4"
        variants={stagger}
        initial="hidden"
        animate="show"
      >
        {/* Scan QR */}
        <motion.div
          variants={fadeUp}
          className="bg-white rounded-2xl border border-outline-light shadow-card overflow-hidden"
          onClick={() => navigate('/scanner')}
          whileTap={{ scale: 0.98 }}
        >
          <div className="flex items-center gap-4 p-5">
            <div className="w-14 h-14 bg-navy/10 rounded-xl flex items-center justify-center flex-shrink-0">
              <QrCode size={28} className="text-navy" />
            </div>
            <div className="flex-1">
              <h2 className="font-display text-headline-sm text-on-surface">Scan QR Code</h2>
              <p className="font-body text-body-sm text-on-surface-muted mt-0.5">
                Notify a vehicle owner directly
              </p>
            </div>
            <ChevronRight size={20} className="text-outline-light flex-shrink-0" />
          </div>
          <div className="bg-navy/5 px-5 py-2.5 border-t border-outline-light/50">
            <p className="font-body text-xs text-on-surface-muted">No login needed — just scan and notify</p>
          </div>
        </motion.div>

        {/* Search */}
        <motion.div
          variants={fadeUp}
          className="bg-white rounded-2xl border border-outline-light shadow-card overflow-hidden"
          onClick={() => navigate('/search')}
          whileTap={{ scale: 0.98 }}
        >
          <div className="flex items-center gap-4 p-5">
            <div className="w-14 h-14 bg-signal-amber/10 rounded-xl flex items-center justify-center flex-shrink-0">
              <Search size={28} className="text-signal-amber" />
            </div>
            <div className="flex-1">
              <h2 className="font-display text-headline-sm text-on-surface">Search Vehicle</h2>
              <p className="font-body text-body-sm text-on-surface-muted mt-0.5">
                Find any RoadLink-registered vehicle
              </p>
            </div>
            <ChevronRight size={20} className="text-outline-light flex-shrink-0" />
          </div>
          <div className="bg-signal-amber/5 px-5 py-2.5 border-t border-outline-light/50">
            <p className="font-body text-xs text-on-surface-muted">Search by registration number</p>
          </div>
        </motion.div>

        {/* Privacy note */}
        <motion.div
          variants={fadeUp}
          className="flex items-start gap-3 bg-verified-green/5 border border-verified-green/20 rounded-xl px-4 py-3"
        >
          <Shield size={16} className="text-verified-green mt-0.5 flex-shrink-0" />
          <p className="font-body text-body-sm text-on-surface-muted">
            Owner's phone number is <strong className="text-on-surface">never shown</strong> to anyone. 
            All contact is handled privately through RoadLink.
          </p>
        </motion.div>

        {/* Login prompt */}
        <motion.div variants={fadeUp} className="text-center pt-2">
          <p className="font-body text-body-sm text-on-surface-muted">
            Are you a vehicle owner?{' '}
            <button
              className="text-navy font-semibold underline underline-offset-2"
              onClick={() => navigate('/login')}
            >
              Log In
            </button>
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
}
