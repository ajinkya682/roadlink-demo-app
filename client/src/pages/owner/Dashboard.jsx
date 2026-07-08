import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell, Plus, QrCode, ChevronRight, UserCircle, Car, LayoutGrid, Share2 } from 'lucide-react';
import { motion } from 'framer-motion';
import PlateTag from '../../components/PlateTag';
import VehicleIcon from '../../components/VehicleIcon';
import ShareModal from '../../components/ShareModal';
import PromoCarousel from '../../components/PromoCarousel';
import { useAppData } from '../../context/AppContext';
import { useDialog } from '../../context/DialogContext';

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08, delayChildren: 0.05 } },
};
const fadeUp = {
  hidden: { opacity: 0, y: 18 },
  show: { opacity: 1, y: 0, transition: { type: 'spring', damping: 22, stiffness: 200 } },
};

function greeting() {
  const h = new Date().getHours();
  if (h < 12) return 'Good morning';
  if (h < 17) return 'Good afternoon';
  return 'Good evening';
}

// quickActions moved inside component to access state

export default function Dashboard() {
  const navigate = useNavigate();
  const { vehicles, user, unreadCount, showComingSoon, showUpgradeModal, refreshVehicles } = useAppData();
  const { showAlert } = useDialog();
  const [showShareModal, setShowShareModal] = useState(false);

  useEffect(() => {
    // This will only hit the API if the TTL expired OR a mutation occurred
    refreshVehicles();
  }, [refreshVehicles]);

  const quickActions = [
    { label: 'Profile',     Icon: UserCircle, action: (nav) => nav('/profile') },
    { label: 'Add Vehicle', Icon: Plus,       action: (nav) => vehicles.length >= 5 ? showUpgradeModal() : nav('/add-vehicle') },
    { label: 'My Vehicles', Icon: LayoutGrid, action: (nav) => nav('/vehicles') },
    { label: 'Invite',      Icon: Share2,     action: () => setShowShareModal(true) },
  ];

  const handlePromoAction = (promo) => {
    if (promo.action === 'invite') {
      setShowShareModal(true);
    } else if (promo.actionPath === '/order-sticker') {
      if (!vehicles || vehicles.length === 0) {
        showAlert("Action Required", "Please add a vehicle before ordering a sticker.");
        navigate('/add-vehicle');
        return;
      }
      
      const activeVehicles = vehicles.filter(v => v.protectionStatus !== 'pending_payment');
      
      if (activeVehicles.length === 0) {
        showAlert("Action Required", "Please activate your vehicle first (complete payment / generate QR) before ordering a sticker.");
        return;
      }
      
      // Navigate with the first active vehicle in state so PlanSelection knows which vehicle it is
      navigate(promo.actionPath, { state: { vehicle: activeVehicles[0] } });
    } else if (promo.actionPath) {
      navigate(promo.actionPath);
    }
  };

  return (
    <div className="min-h-screen bg-lavender-gray pb-28">

      {/* ── HEADER ────────────────────────────────────────────── */}
      <div 
        className="rounded-b-3xl sticky top-0 z-30 px-5 pt-6 pb-5 shadow-md"
        style={{ background: 'linear-gradient(135deg, #6D28D9 0%, #312E81 100%)' }}
      >
        <div className="flex items-start justify-between">
          <div 
            onClick={() => navigate('/profile')}
            className="flex items-center gap-4 cursor-pointer active:scale-[0.98] transition-transform rounded-2xl"
          >
            {/* Avatar */}
            <div 
              className="w-16 h-16 rounded-full flex items-center justify-center text-white text-[24px] font-display font-bold shrink-0 shadow-md overflow-hidden"
              style={{ background: 'linear-gradient(135deg, #6D28D9, #312E81)', border: '2px solid white' }}
            >
              {user.avatarUrl ? (
                <img src={user.avatarUrl} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                user.name.split(' ').map(n => n[0]).join('')
              )}
            </div>
            
            {/* User Info */}
            <div className="flex flex-col">
              <p className="font-body text-[13px] text-white/70 font-medium mb-0.5">
                {greeting()},
              </p>
              <h1 className="font-display text-[22px] font-bold text-white leading-tight">
                {user.name.split(' ')[0]} 👋
              </h1>
              <p className="font-body text-[12px] text-white/70 mt-1 tracking-wider">
                {user.phone.slice(0, 6)} ••••• {user.phone.slice(-3)}
              </p>
            </div>
          </div>

          {/* Bell — only account-level notification entry */}
          <motion.button
            className="relative w-11 h-11 rounded-full flex items-center justify-center text-white mt-1 shadow-sm"
            style={{ backgroundColor: 'rgba(255, 255, 255, 0.15)' }}
            whileTap={{ scale: 0.88 }}
            onClick={() => navigate('/notifications')}
          >
            <Bell size={22} strokeWidth={1.75} />
            {unreadCount > 0 && (
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute top-1.5 right-1.5 min-w-[16px] h-4 bg-alert-red rounded-full flex items-center justify-center text-white font-bold px-0.5"
                style={{ fontSize: '9px' }}
              >
                {unreadCount > 9 ? '9+' : unreadCount}
              </motion.span>
            )}
          </motion.button>
        </div>

        {/* ── QUICK ACTIONS ROW ───────────────────────────────── */}
        <div className="flex justify-center gap-4 mt-6 overflow-x-auto pb-1 scrollbar-hide">
          {quickActions.map(({ label, Icon, action }) => (
            <motion.button
              key={label}
              className="flex flex-col items-center gap-2 min-w-[64px] group"
              whileTap={{ scale: 0.90 }}
              onClick={() => action(navigate)}
            >
              <div
                className="w-[52px] h-[52px] rounded-full flex items-center justify-center shadow-sm transition-colors"
                style={{ backgroundColor: 'rgba(255, 255, 255, 0.15)' }}
              >
                <Icon size={22} strokeWidth={1.75} className="text-white" />
              </div>
              <span className="font-body text-[11px] font-semibold text-white/90 text-center leading-tight whitespace-nowrap">
                {label}
              </span>
            </motion.button>
          ))}
        </div>
      </div>

      {/* ── PROMO CAROUSEL ────────────────────────────────────── */}
      <PromoCarousel onAction={handlePromoAction} />

      {/* ── VEHICLE CARDS ─────────────────────────────────────── */}
      <motion.div
        className="px-4 pt-2 space-y-4"
        variants={stagger}
        initial="hidden"
        animate="show"
      >
        {/* Section label */}
        <motion.div variants={fadeUp} className="flex items-center justify-between">
          <p className="font-body text-[11px] font-bold text-deep-indigo uppercase tracking-[0.1em]">
            My Vehicles
          </p>
          <span className="font-body text-[11px] font-semibold text-deep-indigo bg-royal-purple/10 px-2.5 py-1 rounded-full">
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
                className="relative w-10 h-10 bg-royal-purple/10 rounded-xl flex items-center justify-center text-royal-purple"
                whileTap={{ scale: 0.88 }}
                onClick={(e) => { 
                  e.stopPropagation(); 
                  if (v.protectionStatus === 'pending_payment') {
                    navigate('/subscription-payment', { state: { vehicle: v } });
                  } else {
                    navigate('/qr-detail', { state: { vehicle: v } }); 
                  }
                }}
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
            {v.protectionStatus === 'pending_payment' ? (
              <div className="bg-signal-amber/10 border-t border-signal-amber/20 px-4 py-2.5 flex items-center justify-between">
                <div className="flex items-center gap-2">
                   <span className="w-2 h-2 bg-signal-amber rounded-full flex-shrink-0" />
                   <span className="font-body text-[12px] font-semibold text-signal-amber">Pending Payment</span>
                </div>
                <button 
                  onClick={(e) => { e.stopPropagation(); navigate('/subscription-payment', { state: { vehicle: v } }); }}
                  className="font-body text-[10px] uppercase font-bold text-navy tracking-wider"
                >
                  Activate
                </button>
              </div>
            ) : v.protectionStatus === 'lapsed' ? (
              <div className="bg-alert-red/10 border-t border-alert-red/20 px-4 py-2.5 flex items-center gap-2">
                <span className="w-2 h-2 bg-alert-red rounded-full flex-shrink-0" />
                <span className="font-body text-[12px] font-semibold text-alert-red">Protection Lapsed</span>
              </div>
            ) : v.protectionStatus === 'grace_period' ? (
              <div className="bg-signal-amber/10 border-t border-signal-amber/20 px-4 py-2.5 flex items-center gap-2">
                <span className="w-2 h-2 bg-signal-amber rounded-full flex-shrink-0" />
                <span className="font-body text-[12px] font-semibold text-signal-amber">Grace Period - Update Payment</span>
              </div>
            ) : v.unreadAlerts > 0 ? (
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

        {/* Add vehicle card (Empty State) */}
        {vehicles.length < 5 && (
          <motion.div
            variants={fadeUp}
            className="border-2 border-dashed border-royal-purple/20 rounded-2xl px-5 py-4 flex items-center gap-4 hover:border-royal-purple/50 hover:bg-royal-purple/5 transition-colors cursor-pointer bg-white mt-2"
            onClick={() => navigate('/add-vehicle')}
            whileTap={{ scale: 0.97 }}
          >
            <div className="w-10 h-10 bg-royal-purple/10 rounded-xl flex items-center justify-center flex-shrink-0">
              <Plus size={22} className="text-royal-purple" />
            </div>
            <div className="flex-1">
              <span className="font-body font-semibold text-[14px] text-deep-indigo">
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

      <ShareModal isOpen={showShareModal} onClose={() => setShowShareModal(false)} />
    </div>
  );
}
