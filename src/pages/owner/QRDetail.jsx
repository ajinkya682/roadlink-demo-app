import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Download, RefreshCw, Package, Shield } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import AppHeader from '../../components/AppHeader';
import PlateTag from '../../components/PlateTag';
import Button from '../../components/Button';
import { useDemoData } from '../../context/DemoContext';

export default function QRDetail() {
  const navigate = useNavigate();
  const { vehicles } = useDemoData();
  const vehicle = vehicles[0];

  const [downloaded, setDownloaded] = useState(false);
  const [showRegen, setShowRegen] = useState(false);

  const handleDownload = () => {
    setDownloaded(true);
    setTimeout(() => setDownloaded(false), 2500);
  };

  return (
    <div className="min-h-screen bg-fog flex flex-col">
      <AppHeader title="Vehicle QR" />

      <div className="flex-1 px-5 py-6 flex flex-col items-center gap-6">
        {/* Plate */}
        <PlateTag plateNumber={vehicle.plate} size="md" />

        {/* QR Card with flip-in */}
        <motion.div
          className="bg-white border-2 border-asphalt rounded-2xl p-5 shadow-plate flex flex-col items-center gap-3"
          initial={{ rotateX: 90, opacity: 0 }}
          animate={{ rotateX: 0, opacity: 1 }}
          transition={{ type: 'spring', damping: 16, stiffness: 100, delay: 0.1 }}
          style={{ perspective: 800, transformOrigin: 'center top' }}
        >
          <svg width="180" height="180" viewBox="0 0 160 160" fill="none">
            <rect width="160" height="160" fill="white" />
            <rect x="10" y="10" width="60" height="60" rx="6" fill="#1A1A1A" />
            <rect x="18" y="18" width="44" height="44" rx="4" fill="white" />
            <rect x="26" y="26" width="28" height="28" fill="#1A1A1A" />
            <rect x="90" y="10" width="60" height="60" rx="6" fill="#1A1A1A" />
            <rect x="98" y="18" width="44" height="44" rx="4" fill="white" />
            <rect x="106" y="26" width="28" height="28" fill="#1A1A1A" />
            <rect x="10" y="90" width="60" height="60" rx="6" fill="#1A1A1A" />
            <rect x="18" y="98" width="44" height="44" rx="4" fill="white" />
            <rect x="26" y="106" width="28" height="28" fill="#1A1A1A" />
            <rect x="90" y="90" width="24" height="24" fill="#1A1A1A" rx="3" />
            <rect x="122" y="90" width="28" height="24" fill="#1A1A1A" rx="3" />
            <rect x="90" y="122" width="24" height="28" fill="#1A1A1A" rx="3" />
            <rect x="122" y="122" width="28" height="28" fill="#1A1A1A" rx="3" />
          </svg>
          <p className="font-mono text-xs tracking-wider text-on-surface-muted">{vehicle.qrId}</p>
        </motion.div>

        {/* Privacy note */}
        <div className="flex items-center gap-2 bg-verified-green/8 border border-verified-green/20 rounded-xl px-4 py-3">
          <Shield size={16} className="text-verified-green flex-shrink-0" />
          <p className="font-body text-xs text-on-surface-muted">
            This QR protects your privacy — it acts as a relay, never revealing your number.
          </p>
        </div>

        {/* Actions */}
        <div className="w-full space-y-3">
          <Button variant="secondary" fullWidth onClick={() => navigate('/order-sticker')}>
            <Package size={18} /> Order Sticker
          </Button>

          <Button
            variant="outline"
            fullWidth
            onClick={handleDownload}
          >
            {downloaded ? '✓ Downloaded' : <><Download size={18} /> Download QR</>}
          </Button>

          <button
            className="w-full flex items-center justify-center gap-2 py-3 font-body text-sm text-alert-red/70 hover:text-alert-red transition-colors"
            onClick={() => setShowRegen(true)}
          >
            <RefreshCw size={14} /> Regenerate QR
          </button>
        </div>
      </div>

      {/* Regenerate confirmation modal */}
      <AnimatePresence>
        {showRegen && (
          <motion.div
            className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-asphalt/40 backdrop-blur-sm px-4 pb-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowRegen(false)}
          >
            <motion.div
              className="bg-white rounded-2xl p-6 w-full max-w-sm space-y-4 shadow-sheet"
              initial={{ y: 40, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 40, opacity: 0 }}
              transition={{ type: 'spring', damping: 22, stiffness: 200 }}
              onClick={e => e.stopPropagation()}
            >
              <div className="text-center">
                <div className="w-12 h-12 bg-alert-red/10 rounded-2xl flex items-center justify-center mx-auto mb-3">
                  <RefreshCw size={22} className="text-alert-red" />
                </div>
                <h3 className="font-display text-headline-sm text-on-surface mb-2">Regenerate QR Code?</h3>
                <p className="font-body text-body-sm text-on-surface-muted">
                  The old QR code will stop working immediately. Any printed stickers will need to be replaced.
                </p>
              </div>
              <div className="flex gap-3">
                <Button variant="outline" fullWidth onClick={() => setShowRegen(false)}>Cancel</Button>
                <Button variant="alert" fullWidth onClick={() => setShowRegen(false)}>Regenerate</Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
