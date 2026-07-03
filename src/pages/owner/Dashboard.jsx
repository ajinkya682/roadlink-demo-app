import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Bell, Settings, QrCode, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';
import PlateTag from '../../components/PlateTag';
import BottomTabBar from '../../components/BottomTabBar';
import { useDemoData } from '../../context/DemoContext';

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1, delayChildren: 0.1 } },
};
const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: 'spring', damping: 22, stiffness: 200 } },
};

function greeting() {
  const h = new Date().getHours();
  if (h < 12) return 'Good morning';
  if (h < 17) return 'Good afternoon';
  return 'Good evening';
}

export default function Dashboard() {
  const navigate = useNavigate();
  const { vehicles, user, unreadCount } = useDemoData();

  return (
    <div className="min-h-screen bg-fog pb-24">
      {/* Header */}
      <div className="bg-fog/95 backdrop-blur-md sticky top-0 z-30 border-b border-outline-light/60 px-5 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-display text-headline-sm text-navy">RoadLink</h1>
            <p className="font-body text-xs text-on-surface-muted">{greeting()}, {user.name.split(' ')[0]}</p>
          </div>
          <div className="flex items-center gap-1">
            {/* Bell */}
            <motion.button
              className="relative w-10 h-10 flex items-center justify-center rounded-xl hover:bg-surface-high transition-colors text-on-surface"
              whileTap={{ scale: 0.88 }}
              onClick={() => navigate('/notifications')}
            >
              <Bell size={22} strokeWidth={1.75} />
              {unreadCount > 0 && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute top-1.5 right-1.5 w-4 h-4 bg-alert-red rounded-full flex items-center justify-center text-white font-bold"
                  style={{ fontSize: '8px' }}
                >
                  {unreadCount}
                </motion.span>
              )}
            </motion.button>

            {/* Settings */}
            <motion.button
              className="w-10 h-10 flex items-center justify-center rounded-xl hover:bg-surface-high transition-colors text-on-surface"
              whileTap={{ scale: 0.88 }}
              onClick={() => navigate('/settings')}
            >
              <Settings size={22} strokeWidth={1.75} />
            </motion.button>
          </div>
        </div>
      </div>

      {/* Content */}
      <motion.div
        className="px-5 pt-5 space-y-4"
        variants={stagger}
        initial="hidden"
        animate="show"
      >
        {/* Section label */}
        <motion.p variants={fadeUp} className="font-body text-label-caps text-on-surface-muted uppercase tracking-widest">
          My Vehicles
        </motion.p>

        {/* Vehicle cards */}
        {vehicles.map((v) => (
          <motion.div
            key={v.id}
            variants={fadeUp}
            className="bg-white rounded-2xl border border-outline-light shadow-card overflow-hidden"
            onClick={() => navigate(`/vehicle-detail/${v.id}`)}
            whileTap={{ scale: 0.985 }}
          >
            {/* Card top row */}
            <div className="flex items-start justify-between px-4 pt-4 pb-3">
              <div>
                <h2 className="font-display text-headline-sm text-on-surface">{v.displayName}</h2>
                <p className="font-body text-xs text-on-surface-muted">Added {v.addedDate}</p>
              </div>
              <motion.button
                className="relative w-10 h-10 bg-navy/5 rounded-xl flex items-center justify-center text-navy"
                whileTap={{ scale: 0.88 }}
                onClick={e => { e.stopPropagation(); navigate('/qr-detail'); }}
              >
                <QrCode size={20} />
                {v.unreadAlerts > 0 && (
                  <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-alert-red rounded-full" />
                )}
              </motion.button>
            </div>

            {/* Plate tag */}
            <div className="px-4 pb-3">
              <PlateTag plateNumber={v.plate} isVerified={v.isVerified} size="md" />
            </div>

            {/* Alert banner */}
            {v.unreadAlerts > 0 && (
              <div className="bg-signal-amber/10 border-t border-signal-amber/20 px-4 py-2.5 flex items-center gap-2">
                <span className="w-2 h-2 bg-signal-amber rounded-full animate-pulse" />
                <span className="font-body text-xs font-semibold text-signal-amber">
                  {v.unreadAlerts} new alert{v.unreadAlerts > 1 ? 's' : ''} — tap to view
                </span>
              </div>
            )}

            {/* Privacy mode badge */}
            {v.privacyMode && (
              <div className="bg-verified-green/8 border-t border-verified-green/20 px-4 py-2.5 flex items-center gap-2">
                <span className="w-2 h-2 bg-verified-green rounded-full" />
                <span className="font-body text-xs font-semibold text-verified-green">Privacy Mode Active</span>
              </div>
            )}
          </motion.div>
        ))}

        {/* Add vehicle */}
        <motion.div
          variants={fadeUp}
          className="border-2 border-dashed border-outline-light rounded-2xl px-5 py-4 flex items-center gap-4 hover:border-navy/40 hover:bg-navy/2 transition-colors"
          onClick={() => navigate('/add-vehicle')}
          whileTap={{ scale: 0.97 }}
        >
          <div className="w-10 h-10 bg-navy/8 rounded-xl flex items-center justify-center flex-shrink-0">
            <Plus size={22} className="text-navy" />
          </div>
          <span className="flex-1 font-body font-semibold text-sm text-on-surface-muted">
            Add another vehicle
          </span>
          <ChevronRight size={18} className="text-outline-light" />
        </motion.div>
      </motion.div>

      <BottomTabBar />
    </div>
  );
}
