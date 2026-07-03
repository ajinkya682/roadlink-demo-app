import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell, Plus, QrCode, ChevronRight, UserCircle, Car, LayoutGrid, Share2 } from 'lucide-react';
import { motion } from 'framer-motion';
import PlateTag from '../../components/PlateTag';
import { useDemoData } from '../../context/DemoContext';

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
  { label: 'Profile',     Icon: UserCircle, action: (nav) => nav('/profile'),       color: '#EEF2FF' },
  { label: 'Add Vehicle', Icon: Plus,       action: (nav) => nav('/add-vehicle'),   color: '#FFF7E6' },
  { label: 'My Vehicles', Icon: LayoutGrid, action: (nav) => nav('/vehicle-detail'),color: '#E8F5EE' },
  { label: 'Invite',      Icon: Share2,     action: () => alert('Share RoadLink – Coming Soon!'), color: '#FCF0FF' },
];

export default function Dashboard() {
  const navigate = useNavigate();
  const { vehicles, user, unreadCount } = useDemoData();

  return (
    <div className="min-h-screen bg-[#F7F8FA] pb-28">

      {/* ── HEADER ────────────────────────────────────────────── */}
      <div className="bg-white sticky top-0 z-30 px-5 pt-5 pb-4 border-b border-[#e5e2e1]/60">
        <div className="flex items-start justify-between">
          <div>
            <p className="font-body text-[13px] text-[#737782] font-medium mb-0.5">
              {greeting()}
            </p>
            <h1 className="font-display text-[26px] font-bold text-[#003470] leading-tight">
              {user.name.split(' ')[0]} 👋
            </h1>
            <p className="font-body text-[12px] text-[#737782] mt-0.5">
              {vehicles.length} vehicle{vehicles.length !== 1 ? 's' : ''} registered
            </p>
          </div>

          {/* Bell — only account-level notification entry */}
          <motion.button
            className="relative w-11 h-11 bg-[#f6f3f2] rounded-full flex items-center justify-center text-[#1c1b1b] mt-1"
            whileTap={{ scale: 0.88 }}
            onClick={() => navigate('/notifications')}
          >
            <Bell size={22} strokeWidth={1.75} />
            {unreadCount > 0 && (
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute top-1.5 right-1.5 min-w-[16px] h-4 bg-[#ba1a1a] rounded-full flex items-center justify-center text-white font-bold px-0.5"
                style={{ fontSize: '9px' }}
              >
                {unreadCount > 9 ? '9+' : unreadCount}
              </motion.span>
            )}
          </motion.button>
        </div>

        {/* ── QUICK ACTIONS ROW ───────────────────────────────── */}
        <div className="flex justify-center gap-4 mt-5 overflow-x-auto pb-1 scrollbar-hide">
          {quickActions.map(({ label, Icon, action, color }) => (
            <motion.button
              key={label}
              className="flex flex-col items-center gap-2 min-w-[64px]"
              whileTap={{ scale: 0.90 }}
              onClick={() => action(navigate)}
            >
              <div
                className="w-[52px] h-[52px] rounded-full flex items-center justify-center shadow-sm"
                style={{ background: color }}
              >
                <Icon size={22} strokeWidth={1.75} className="text-[#003470]" />
              </div>
              <span className="font-body text-[11px] font-semibold text-[#434751] text-center leading-tight whitespace-nowrap">
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
                className="relative w-10 h-10 bg-[#003470]/8 rounded-xl flex items-center justify-center text-[#003470]"
                whileTap={{ scale: 0.88 }}
                onClick={(e) => { e.stopPropagation(); navigate('/qr-detail'); }}
              >
                <QrCode size={20} strokeWidth={1.75} />
                {v.unreadAlerts > 0 && (
                  <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-[#ba1a1a] rounded-full border border-white" />
                )}
              </motion.button>
            </div>

            {/* Plate tag */}
            <div className="px-4 pb-3">
              <PlateTag plateNumber={v.plate} isVerified={v.isVerified} size="md" />
            </div>

            {/* Status banner — amber for alerts, green for privacy */}
            {v.unreadAlerts > 0 ? (
              <div className="bg-[#F5A623]/10 border-t border-[#F5A623]/20 px-4 py-2.5 flex items-center gap-2">
                <span className="w-2 h-2 bg-[#F5A623] rounded-full animate-pulse flex-shrink-0" />
                <span className="font-body text-[12px] font-semibold text-[#835500]">
                  {v.unreadAlerts} new alert{v.unreadAlerts > 1 ? 's' : ''} — tap to view
                </span>
              </div>
            ) : v.privacyMode ? (
              <div className="bg-[#1E8E5A]/8 border-t border-[#1E8E5A]/20 px-4 py-2.5 flex items-center gap-2">
                <span className="w-2 h-2 bg-[#1E8E5A] rounded-full flex-shrink-0" />
                <span className="font-body text-[12px] font-semibold text-[#005834]">Privacy Mode Active</span>
              </div>
            ) : (
              <div className="bg-[#1E8E5A]/8 border-t border-[#1E8E5A]/20 px-4 py-2.5 flex items-center gap-2">
                <span className="w-2 h-2 bg-[#1E8E5A] rounded-full flex-shrink-0" />
                <span className="font-body text-[12px] font-semibold text-[#005834]">Active & Protected</span>
              </div>
            )}
          </motion.div>
        ))}

        {/* Add another vehicle card */}
        <motion.div
          variants={fadeUp}
          className="border-2 border-dashed border-[#c3c6d2] rounded-2xl px-5 py-4 flex items-center gap-4 hover:border-[#003470]/40 hover:bg-[#003470]/2 transition-colors cursor-pointer bg-white"
          onClick={() => navigate('/add-vehicle')}
          whileTap={{ scale: 0.97 }}
        >
          <div className="w-10 h-10 bg-[#003470]/8 rounded-xl flex items-center justify-center flex-shrink-0">
            <Plus size={22} className="text-[#003470]" />
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
