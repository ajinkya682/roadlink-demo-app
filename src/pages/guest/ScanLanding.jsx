import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Shield } from 'lucide-react';
import PlateTag from '../../components/PlateTag';
import { reportCategories } from '../../demo-data/categories';
import { scannedVehicle } from '../../demo-data/scannedVehicle';

const containerVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.04, delayChildren: 0.2 } },
};
const itemVariants = {
  hidden: { opacity: 0, y: 16, scale: 0.95 },
  show: { opacity: 1, y: 0, scale: 1, transition: { type: 'spring', damping: 20, stiffness: 200 } },
};

export default function ScanLanding() {
  const navigate = useNavigate();

  const handleCategory = (cat) => {
    navigate('/report-detail', { state: { category: cat } });
  };

  return (
    <div className="min-h-screen bg-fog flex flex-col pb-8">
      {/* Plate hero */}
      <div className="bg-navy/5 px-5 pt-8 pb-6 flex flex-col items-center border-b border-outline-light/50">
        <PlateTag
          plateNumber={scannedVehicle.plate}
          displayName={scannedVehicle.displayName}
          isVerified={scannedVehicle.isVerified}
          size="lg"
          animateEntry
        />
        <p className="mt-4 font-display text-headline-sm text-on-surface text-center">
          What's happening with this vehicle?
        </p>
      </div>

      {/* Category grid */}
      <div className="px-4 py-5 flex-1">
        <motion.div
          className="grid grid-cols-3 gap-3"
          variants={containerVariants}
          initial="hidden"
          animate="show"
        >
          {reportCategories.map((cat) => (
            <motion.button
              key={cat.id}
              variants={itemVariants}
              whileTap={{ scale: 0.94 }}
              onClick={() => handleCategory(cat)}
              className={`
                flex flex-col items-center justify-center gap-2 rounded-xl p-3 min-h-[88px]
                border-2 transition-colors duration-150 font-body
                ${cat.isAlert
                  ? 'border-alert-red bg-alert-red/5 hover:bg-alert-red/10'
                  : 'border-outline-light bg-white hover:bg-surface-low hover:border-navy/30'
                }
              `}
            >
              <span className="text-2xl leading-none" role="img" aria-label={cat.label}>
                {cat.emoji}
              </span>
              <span className={`text-[11px] font-semibold leading-tight text-center ${cat.isAlert ? 'text-alert-red' : 'text-on-surface'}`}>
                {cat.label}
              </span>
            </motion.button>
          ))}
        </motion.div>
      </div>

      {/* Footer */}
      <footer className="px-5 pt-2 pb-6 text-center border-t border-outline-light/50">
        <div className="flex items-center justify-center gap-2 mb-1">
          <Shield size={13} className="text-verified-green" />
          <p className="font-body text-xs text-on-surface-muted">
            This page never shows the owner's phone number.
          </p>
        </div>
        <span className="font-display text-sm font-semibold text-navy/50">RoadLink</span>
      </footer>
    </div>
  );
}
