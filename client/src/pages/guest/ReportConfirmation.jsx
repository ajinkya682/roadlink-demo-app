import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle, Phone } from 'lucide-react';
import Button from '../../components/Button';

export default function ReportConfirmation() {
  const navigate = useNavigate();
  const location = useLocation();
  const cat = location.state?.category || { label: 'Wrong Parking', isAlert: false };

  return (
    <div className="min-h-screen bg-fog flex flex-col items-center justify-center px-5 pb-12">
      <motion.div
        className="w-full max-w-sm flex flex-col items-center text-center space-y-6"
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        {/* Checkmark in plate-tag shape */}
        <motion.div
          className="w-24 h-24 bg-verified-green/10 border-2 border-verified-green rounded-2xl flex items-center justify-center"
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', damping: 12, stiffness: 150, delay: 0.1 }}
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', damping: 10, stiffness: 200, delay: 0.35 }}
          >
            <CheckCircle size={44} className="text-verified-green" strokeWidth={2} />
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <h1 className="font-display text-headline-sm text-on-surface mb-2">Notification Sent</h1>
          <p className="font-body text-body-sm text-on-surface-muted">
            The owner has been notified about the <strong>{cat.label}</strong>. No further action needed.
          </p>
        </motion.div>

        {/* Emergency: show emergency numbers */}
        {cat.isAlert && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="w-full bg-alert-red/5 border-2 border-alert-red/30 rounded-xl p-4 space-y-3"
          >
            <p className="font-body text-sm font-semibold text-alert-red">
              If this is a genuine emergency, call now:
            </p>
            <div className="flex flex-col gap-2">
              <a
                href="tel:112"
                className="flex items-center justify-center gap-2 bg-alert-red text-white rounded-xl py-3 font-body font-bold text-sm"
              >
                <Phone size={16} /> Call 112 — National Emergency
              </a>
              <a
                href="tel:108"
                className="flex items-center justify-center gap-2 border-2 border-alert-red text-alert-red rounded-xl py-3 font-body font-semibold text-sm"
              >
                <Phone size={16} /> Call 108 — Ambulance
              </a>
            </div>
          </motion.div>
        )}

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9 }}
          className="w-full"
        >
          <Button variant="outline" fullWidth onClick={() => navigate('/guest-dashboard')}>
            Done
          </Button>
        </motion.div>
      </motion.div>
    </div>
  );
}
