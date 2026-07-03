import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { MapPin, Navigation, Check, AlertTriangle } from 'lucide-react';
import { motion } from 'framer-motion';
import AppHeader from '../../components/AppHeader';
import PlateTag from '../../components/PlateTag';
import Button from '../../components/Button';
import { useAppData } from '../../context/AppContext';

export default function NotificationDetail() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { notifications, markResolved } = useAppData();

  const notif = notifications.find(n => n.id === id) || notifications[0];
  const [resolved, setResolved] = useState(notif?.resolved || false);

  const handleResolve = () => {
    setResolved(true);
    markResolved(notif.id);
    setTimeout(() => navigate(-1), 1000);
  };

  // Mock map grid pattern as background
  const mapPattern = `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' stroke='%23c3c6d2' stroke-width='0.5'%3E%3Cpath d='M0 0h40v40H0z'/%3E%3C/g%3E%3C/svg%3E")`;

  return (
    <div className="min-h-screen bg-fog flex flex-col relative overflow-hidden">
      <AppHeader title="Alert Detail" transparent />

      {/* Mock map background */}
      <motion.div
        className="h-60 relative overflow-hidden"
        style={{
          background: `linear-gradient(135deg, #e8f0f7 0%, #dde8f3 50%, #ccd9eb 100%)`,
          backgroundImage: mapPattern,
        }}
        initial={{ filter: 'blur(8px)', scale: 1.05 }}
        animate={{ filter: 'blur(0px)', scale: 1 }}
        transition={{ duration: 0.6 }}
      >
        {/* Road lines for map feel */}
        <div className="absolute inset-0 flex flex-col justify-center pointer-events-none opacity-30">
          <div className="h-8 bg-gray-400/40 w-full" />
          <div className="h-16" />
          <div className="h-6 bg-gray-400/40 w-full" />
        </div>

        {/* Location pin */}
        {notif?.locationShared && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="relative">
              <motion.div
                className="absolute -inset-6 rounded-full bg-alert-red/20"
                animate={{ scale: [1, 1.5, 1], opacity: [0.6, 0, 0.6] }}
                transition={{ repeat: Infinity, duration: 2 }}
              />
              <div className="w-10 h-10 bg-alert-red rounded-full flex items-center justify-center shadow-float">
                <MapPin size={20} color="#fff" fill="#fff" />
              </div>
            </div>
          </div>
        )}
      </motion.div>

      {/* Bottom sheet */}
      <motion.div
        className="flex-1 bg-fog rounded-t-3xl -mt-4 relative z-10 shadow-sheet"
        initial={{ y: '60%' }}
        animate={{ y: 0 }}
        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
      >
        {/* Handle */}
        <div className="flex justify-center pt-3 pb-5">
          <div className="w-10 h-1.5 bg-outline-light rounded-full" />
        </div>

        <div className="px-5 space-y-4 pb-10">
          {/* Header row */}
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xl">{notif?.emoji}</span>
                <h2 className="font-display text-headline-sm text-on-surface">{notif?.type}</h2>
              </div>
              <p className="font-body text-xs text-on-surface-muted">{notif?.time}</p>
            </div>
            <PlateTag plateNumber={notif?.plate} size="sm" />
          </div>

          {/* Notes */}
          {notif?.notes && (
            <div className="bg-white border border-outline-light rounded-xl px-4 py-3">
              <p className="font-body text-sm text-on-surface italic">"{notif.notes}"</p>
            </div>
          )}

          {/* Location row */}
          {notif?.locationShared && notif?.location && (
            <div className="bg-white border border-outline-light rounded-xl px-4 py-3 flex items-center gap-3">
              <div className="w-9 h-9 bg-navy/8 rounded-xl flex items-center justify-center flex-shrink-0">
                <MapPin size={18} className="text-navy" />
              </div>
              <div className="flex-1">
                <p className="font-body text-sm font-semibold text-on-surface">{notif.location}</p>
                <p className="font-body text-xs text-on-surface-muted">Location shared by reporter</p>
              </div>
              <a
                href={`https://maps.google.com/?q=${notif.lat},${notif.lng}`}
                target="_blank"
                rel="noopener noreferrer"
                onClick={e => e.stopPropagation()}
                className="w-9 h-9 bg-navy text-white rounded-xl flex items-center justify-center"
              >
                <Navigation size={16} />
              </a>
            </div>
          )}

          {/* Escalate for theft/emergency */}
          {notif?.isAlert && (
            <div className="bg-alert-red/5 border border-alert-red/20 rounded-xl px-4 py-3 flex items-start gap-3">
              <AlertTriangle size={18} className="text-alert-red flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-body text-sm font-semibold text-alert-red">Escalation available</p>
                <p className="font-body text-xs text-on-surface-muted mt-0.5">File a police report or contact emergency services.</p>
                <a href="tel:100" className="font-body text-xs font-bold text-alert-red mt-1 block">Call 100 — Police</a>
              </div>
            </div>
          )}

          {/* Resolve action */}
          <motion.div animate={resolved ? { scale: 0.98, opacity: 0.9 } : {}}>
            <Button
              fullWidth
              onClick={handleResolve}
              variant={resolved ? 'ghost' : 'outline'}
              className={resolved
                ? 'border-2 border-verified-green text-verified-green bg-verified-green/5'
                : 'border-2 border-outline-light text-on-surface'
              }
            >
              {resolved ? <><Check size={18} /> Marked as Resolved</> : 'Mark as Resolved'}
            </Button>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}
