import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, ChevronRight, QrCode } from 'lucide-react';
import { motion } from 'framer-motion';
import AppHeader from '../../components/AppHeader';
import PlateTag from '../../components/PlateTag';
import VehicleIcon from '../../components/VehicleIcon';
import { useAppData } from '../../context/AppContext';
import { Car } from 'lucide-react';

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08, delayChildren: 0.05 } },
};
const fadeUp = {
  hidden: { opacity: 0, y: 18 },
  show: { opacity: 1, y: 0, transition: { type: 'spring', damping: 22, stiffness: 200 } },
};

export default function Vehicles() {
  const navigate = useNavigate();
  const { vehicles, showUpgradeModal } = useAppData();



  const handleAddVehicle = () => {
    if (vehicles.length >= 5) {
      showUpgradeModal();
    } else {
      navigate('/add-vehicle');
    }
  };

  return (
    <div className="min-h-screen bg-[#F7F8FA] pb-28">
      <AppHeader title="My Vehicles" />

      {/* ── VEHICLE CARDS ─────────────────────────────────────── */}
      <motion.div
        className="px-4 pt-6 space-y-4"
        variants={stagger}
        initial="hidden"
        animate="show"
      >
        {/* Section label */}
        <motion.div variants={fadeUp} className="flex items-center justify-between">
          <p className="font-body text-[11px] font-bold text-[#737782] uppercase tracking-[0.1em]">
            Registered Vehicles
          </p>
          <span className="font-body text-[11px] text-[#737782]">
            {vehicles.length}/5 slots
          </span>
        </motion.div>

        {/* Vehicle cards */}
        {vehicles.map((v) => (
          <motion.div
            key={v.id}
            variants={fadeUp}
            className="bg-white rounded-2xl border border-[#e5e2e1] shadow-[0_1px_6px_rgba(0,0,0,0.05)] overflow-hidden cursor-pointer"
            onClick={() => navigate(`/vehicle-detail/${v.id}`)}
            whileTap={{ scale: 0.985 }}
          >
            {/* Card top row */}
            <div className="flex items-start justify-between px-4 pt-4 pb-3">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-surface-low border border-outline-light/50 flex items-center justify-center overflow-hidden shrink-0">
                  {v.imageUrl ? (
                    <img src={v.imageUrl} alt="Vehicle" className="w-full h-full object-cover" />
                  ) : (
                    <VehicleIcon type={v.type} size={24} className="text-navy" />
                  )}
                </div>
                <div>
                  <h2 className="font-display text-[20px] font-semibold text-[#1c1b1b]">
                    {v.displayName}
                  </h2>
                  <p className="font-body text-[12px] text-[#737782] mt-0.5">
                    Added {v.addedDate}
                  </p>
                </div>
              </div>

              {/* QR button with per-vehicle alert dot */}
              <motion.button
                className="relative w-10 h-10 bg-road-navy/8 rounded-xl flex items-center justify-center text-road-navy"
                whileTap={{ scale: 0.88 }}
                onClick={(e) => { e.stopPropagation(); navigate('/qr-detail', { state: { vehicle: v } }); }}
              >
                <QrCode size={20} strokeWidth={1.75} />
                {v.unreadAlerts > 0 && (
                  <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-alert-red rounded-full border border-white" />
                )}
              </motion.button>
            </div>

            {/* Plate tag */}
            <div className="px-4 pb-3">
              <PlateTag plateNumber={v.plate} isVerified={v.isVerified} size="md" />
            </div>

            {/* Status banner */}
            {v.unreadAlerts > 0 ? (
              <div className="bg-signal-amber/10 border-t border-signal-amber/20 px-4 py-2.5 flex items-center gap-2">
                <span className="w-2 h-2 bg-signal-amber rounded-full animate-pulse flex-shrink-0" />
                <span className="font-body text-[12px] font-semibold text-signal-amber">
                  {v.unreadAlerts} new alert{v.unreadAlerts > 1 ? 's' : ''} — tap to view
                </span>
              </div>
            ) : v.privacyMode ? (
              <div className="bg-verified-green/8 border-t border-verified-green/20 px-4 py-2.5 flex items-center gap-2">
                <span className="w-2 h-2 bg-verified-green rounded-full flex-shrink-0" />
                <span className="font-body text-[12px] font-semibold text-verified-green">Privacy Mode Active</span>
              </div>
            ) : (
              <div className="bg-verified-green/8 border-t border-verified-green/20 px-4 py-2.5 flex items-center gap-2">
                <span className="w-2 h-2 bg-verified-green rounded-full flex-shrink-0" />
                <span className="font-body text-[12px] font-semibold text-verified-green">Active & Protected</span>
              </div>
            )}
          </motion.div>
        ))}

        {/* Add vehicle card */}
        {vehicles.length < 5 && (
          <motion.div
            variants={fadeUp}
            className="border-2 border-dashed border-outline-light rounded-2xl px-5 py-4 flex items-center gap-4 hover:border-road-navy/40 hover:bg-road-navy/2 transition-colors cursor-pointer bg-white mt-4"
            onClick={handleAddVehicle}
            whileTap={{ scale: 0.97 }}
          >
            <div className="w-10 h-10 bg-road-navy/8 rounded-xl flex items-center justify-center flex-shrink-0">
              <Plus size={22} className="text-road-navy" />
            </div>
            <div className="flex-1">
              <span className="font-body font-semibold text-[14px] text-[#434751]">
                Add vehicle
              </span>
              <p className="font-body text-[12px] text-[#737782]">Get a digital identity for your vehicle</p>
            </div>
            <ChevronRight size={18} className="text-[#c3c6d2]" />
          </motion.div>
        )}

        {/* Bottom spacer */}
        <div className="h-4" />
      </motion.div>
    </div>
  );
}
