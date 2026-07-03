import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Camera, MapPin, AlertTriangle } from 'lucide-react';
import { motion } from 'framer-motion';
import AppHeader from '../../components/AppHeader';
import Button from '../../components/Button';
import Toggle from '../../components/Toggle';

const stagger = { hidden: {}, show: { transition: { staggerChildren: 0.08 } } };
const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { type: 'spring', damping: 22, stiffness: 200 } },
};

export default function ReportDetail() {
  const navigate = useNavigate();
  const location = useLocation();
  const cat = location.state?.category || { label: 'Wrong Parking', emoji: '🅿️', isAlert: false };

  const [notes, setNotes] = useState('');
  const [locationShare, setLocationShare] = useState(false);
  const [hasPhoto, setHasPhoto] = useState(false);
  const [loading, setLoading] = useState(false);

  const isEmergency = cat.isAlert;

  const handleSend = () => {
    setLoading(true);
    setTimeout(() => navigate('/report-confirmation', { state: { category: cat } }), 1200);
  };

  return (
    <div className="min-h-screen bg-fog flex flex-col">
      <AppHeader title="Report" />

      <div className="flex-1 px-5 py-5 space-y-5">
        {/* Category chip */}
        <motion.div initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.25 }}>
          <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full border-2 font-body font-semibold text-sm ${
            isEmergency
              ? 'border-alert-red bg-alert-red/5 text-alert-red'
              : 'border-outline-light bg-white text-on-surface'
          }`}>
            <span className="text-lg">{cat.emoji}</span>
            {cat.label}
          </div>
        </motion.div>

        {isEmergency ? (
          <motion.div
            variants={stagger}
            initial="hidden"
            animate="show"
            className="space-y-4"
          >
            {/* Emergency warning */}
            <motion.div
              variants={fadeUp}
              className="bg-alert-red/5 border-2 border-alert-red/30 rounded-xl p-4 flex items-start gap-3"
            >
              <AlertTriangle size={20} className="text-alert-red flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-body font-semibold text-alert-red text-sm">Immediate Alert</p>
                <p className="font-body text-sm text-on-surface-muted mt-1">
                  This alerts the owner immediately across all channels — push, SMS, and WhatsApp.
                </p>
              </div>
            </motion.div>

            <motion.div variants={fadeUp}>
              <Button variant="alert" fullWidth onClick={handleSend} isLoading={loading}>
                Send Emergency Alert
              </Button>
            </motion.div>
          </motion.div>
        ) : (
          <motion.div
            variants={stagger}
            initial="hidden"
            animate="show"
            className="space-y-4"
          >
            {/* Notes */}
            <motion.div variants={fadeUp}>
              <label className="block font-body text-label-caps text-on-surface-muted uppercase tracking-widest mb-1.5">
                Notes (Optional)
              </label>
              <textarea
                value={notes}
                onChange={e => setNotes(e.target.value.slice(0, 300))}
                placeholder="e.g. blocking the gate entrance..."
                rows={3}
                className="w-full px-4 py-3 bg-white border border-outline-light rounded-xl font-body text-body-sm text-on-surface resize-none
                  focus:outline-none focus:border-navy focus:ring-2 focus:ring-navy/15 transition-all placeholder:text-outline"
              />
              <div className="text-right font-body text-xs text-outline mt-1">{notes.length}/300</div>
            </motion.div>

            {/* Photo zone */}
            <motion.div variants={fadeUp}>
              <button
                type="button"
                className={`w-full border-2 border-dashed rounded-xl py-6 flex flex-col items-center gap-2 transition-colors ${
                  hasPhoto
                    ? 'border-verified-green bg-verified-green/5'
                    : 'border-outline-light bg-white hover:border-navy/40'
                }`}
                onClick={() => setHasPhoto(v => !v)}
              >
                <Camera size={28} className={hasPhoto ? 'text-verified-green' : 'text-on-surface-muted'} />
                <span className="font-body text-sm font-semibold text-on-surface">
                  {hasPhoto ? '✓ Photo attached' : 'Attach photo or video'}
                </span>
                <span className="font-body text-xs text-on-surface-muted">
                  Optional — helps the owner understand the situation
                </span>
              </button>
            </motion.div>

            {/* Location toggle */}
            <motion.div
              variants={fadeUp}
              className="flex items-center justify-between bg-white rounded-xl border border-outline-light px-4 py-4"
            >
              <div className="flex items-start gap-3">
                <MapPin size={18} className="text-on-surface-muted mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-body text-sm font-semibold text-on-surface">Share my location?</p>
                  <p className="font-body text-xs text-on-surface-muted">Helps the owner find the vehicle faster</p>
                </div>
              </div>
              <Toggle on={locationShare} onChange={setLocationShare} />
            </motion.div>

            <motion.div variants={fadeUp}>
              <Button fullWidth onClick={handleSend} isLoading={loading}>
                Send Notification
              </Button>
            </motion.div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
