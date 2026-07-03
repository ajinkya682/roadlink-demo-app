import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell, Plus, QrCode, ChevronRight, UserCircle, Car, LayoutGrid, Share2 } from 'lucide-react';
import { motion } from 'framer-motion';
import PlateTag from '../../components/PlateTag';
import { useAppData } from '../../context/AppContext';

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

const quickActions = [
  { label: 'Profile',     Icon: UserCircle, action: (nav) => nav('/profile') },
  { label: 'Add Vehicle', Icon: Plus,       action: (nav) => nav('/add-vehicle') },
  { label: 'My Vehicles', Icon: LayoutGrid, action: (nav) => nav('/vehicle-detail') },
  { label: 'Invite',      Icon: Share2,     action: () => alert('Share RoadLink – Coming Soon!') },
];

export default function Dashboard() {
  const navigate = useNavigate();
  const { vehicles, user, unreadCount, refreshVehicles, refreshNotifications } = useAppData();

  useEffect(() => {
    refreshVehicles();
    refreshNotifications();
  }, []);

  return (
    <div className="min-h-screen bg-[#F7F8FA] pb-28">

      {/* ── HEADER ────────────────────────────────────────────── */}
      <div className="bg-gradient-to-b from-[#eef2ff] to-white sticky top-0 z-30 px-5 pt-6 pb-5 border-b border-[#e5e2e1] shadow-sm">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-4">
            {/* Avatar */}
            <div className="w-16 h-16 rounded-full bg-[#1B4B8F] flex items-center justify-center text-white text-[24px] font-display font-bold shrink-0 shadow-md border-2 border-white">
              {user.name.split(' ').map(n => n[0]).join('')}
            </div>
            
            {/* User Info */}
            <div className="flex flex-col">
              <p className="font-body text-[13px] text-[#737782] font-medium mb-0.5">
                {greeting()},
              </p>
              <h1 className="font-display text-[22px] font-bold text-[#1c1b1b] leading-tight">
                {user.name.split(' ')[0]} 👋
              </h1>
              <p className="font-body text-[12px] text-on-surface-muted mt-1 tracking-wider">
                {user.phone.slice(0, 6)} ••••• {user.phone.slice(-3)}
              </p>
            </div>
          </div>

          {/* Bell — only account-level notification entry */}
          <motion.button
            className="relative w-11 h-11 bg-road-navy/5 rounded-full flex items-center justify-center text-road-navy mt-1 shadow-sm border border-road-navy/10"
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
                className="w-[52px] h-[52px] rounded-full flex items-center justify-center bg-road-navy/5 shadow-sm border border-road-navy/10 group-hover:bg-road-navy/10 transition-colors"
              >
                <Icon size={22} strokeWidth={1.75} className="text-road-navy" />
              </div>
              <span className="font-body text-[11px] font-semibold text-on-surface-muted text-center leading-tight whitespace-nowrap">
                {label}
              </span>
            </motion.button>
          ))}
        </div>
      </div>

      {/* ── VEHICLE CARDS ─────────────────────────────────────── */}
      <motion.div
        className="px-4 pt-5 space-y-4"
        variants={stagger}
        initial="hidden"
        animate="show"
      >
        {/* Section label */}
        <motion.div variants={fadeUp} className="flex items-center justify-between">
          <p className="font-body text-[11px] font-bold text-[#737782] uppercase tracking-[0.1em]">
            My Vehicles
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
              <div>
                <h2 className="font-display text-[20px] font-semibold text-[#1c1b1b]">
                  {v.displayName}
                </h2>
                <p className="font-body text-[12px] text-[#737782] mt-0.5">
                  Added {v.addedDate}
                </p>
              </div>

              {/* QR button with per-vehicle alert dot */}
              <motion.button
                className="relative w-10 h-10 bg-road-navy/8 rounded-xl flex items-center justify-center text-road-navy"
                whileTap={{ scale: 0.88 }}
                onClick={(e) => { e.stopPropagation(); navigate('/qr-detail'); }}
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

            {/* Status banner — amber for alerts, green for privacy */}
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

        {/* Add another vehicle card */}
        <motion.div
          variants={fadeUp}
          className="border-2 border-dashed border-outline-light rounded-2xl px-5 py-4 flex items-center gap-4 hover:border-road-navy/40 hover:bg-road-navy/2 transition-colors cursor-pointer bg-white"
          onClick={() => navigate('/add-vehicle')}
          whileTap={{ scale: 0.97 }}
        >
          <div className="w-10 h-10 bg-road-navy/8 rounded-xl flex items-center justify-center flex-shrink-0">
            <Plus size={22} className="text-road-navy" />
          </div>
          <div className="flex-1">
            <span className="font-body font-semibold text-[14px] text-[#434751]">
              Add another vehicle
            </span>
            <p className="font-body text-[12px] text-[#737782]">Get a digital identity for your vehicle</p>
          </div>
          <ChevronRight size={18} className="text-[#c3c6d2]" />
        </motion.div>

        {/* Bottom spacer */}
        <div className="h-4" />
      </motion.div>
    </div>
  );
}
