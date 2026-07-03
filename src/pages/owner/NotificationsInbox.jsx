import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Check } from 'lucide-react';
import AppHeader from '../../components/AppHeader';
import BottomTabBar from '../../components/BottomTabBar';
import { useDemoData } from '../../context/DemoContext';

const filters = ['All', 'Unresolved', 'Resolved'];

export default function NotificationsInbox() {
  const navigate = useNavigate();
  const { notifications, markResolved, dismissNotification } = useDemoData();
  const [filter, setFilter] = useState('All');

  const filtered = notifications.filter(n => {
    if (filter === 'Unresolved') return !n.resolved;
    if (filter === 'Resolved') return n.resolved;
    return true;
  });

  return (
    <div className="min-h-screen bg-fog pb-24">
      <AppHeader title="Alerts" />

      {/* Filter tabs */}
      <div className="bg-fog/95 backdrop-blur-md sticky top-14 z-20 border-b border-outline-light/60 px-5 py-2 flex gap-2">
        {filters.map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`relative px-4 py-1.5 rounded-full font-body text-sm font-semibold transition-colors ${
              filter === f ? 'bg-navy text-white' : 'bg-surface-high text-on-surface-muted hover:bg-surface-highest'
            }`}
          >
            {f}
            {f === 'Unresolved' && notifications.filter(n => !n.resolved).length > 0 && (
              <span className="ml-1.5 bg-alert-red text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                {notifications.filter(n => !n.resolved).length}
              </span>
            )}
          </button>
        ))}
      </div>

      <div className="px-5 pt-4">
        <AnimatePresence>
          {filtered.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col items-center justify-center py-20 gap-3 text-center"
            >
              <div className="w-14 h-14 bg-surface-high rounded-2xl flex items-center justify-center text-2xl">
                🔔
              </div>
              <p className="font-display text-headline-sm text-on-surface">No reports yet.</p>
              <p className="font-body text-body-sm text-on-surface-muted">That's a good thing.</p>
            </motion.div>
          ) : (
            <div className="space-y-3">
              {filtered.map((n, i) => (
                <motion.div
                  key={n.id}
                  layout
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -60, transition: { duration: 0.2 } }}
                  transition={{ delay: i * 0.04 }}
                  className={`bg-white rounded-2xl border overflow-hidden cursor-pointer shadow-card ${
                    !n.read ? 'border-navy/20' : 'border-outline-light'
                  }`}
                  onClick={() => navigate(`/notification-detail/${n.id}`)}
                  whileTap={{ scale: 0.985 }}
                >
                  <div className="flex items-stretch">
                    {/* Color indicator bar */}
                    <div className="w-1 flex-shrink-0 rounded-l-2xl" style={{ background: n.color }} />

                    <div className="flex-1 px-4 py-3 flex items-center gap-3">
                      {/* Emoji */}
                      <span className="text-xl flex-shrink-0">{n.emoji}</span>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <span className={`font-body text-sm font-semibold truncate ${!n.read ? 'text-on-surface' : 'text-on-surface-muted'}`}>
                            {n.type}
                          </span>
                          <span className="font-body text-xs text-outline flex-shrink-0 whitespace-nowrap">{n.time}</span>
                        </div>
                        <p className="font-body text-xs text-on-surface-muted truncate mt-0.5">{n.vehicle}</p>
                      </div>

                      {/* Unread dot / resolve button */}
                      {!n.read && !n.resolved ? (
                        <button
                          className="flex-shrink-0 w-8 h-8 bg-verified-green/10 rounded-xl flex items-center justify-center text-verified-green transition-colors hover:bg-verified-green hover:text-white"
                          onClick={(e) => { e.stopPropagation(); markResolved(n.id); }}
                        >
                          <Check size={15} />
                        </button>
                      ) : n.resolved ? (
                        <span className="flex-shrink-0 w-8 h-8 bg-verified-green/10 rounded-xl flex items-center justify-center">
                          <Check size={14} className="text-verified-green" />
                        </span>
                      ) : null}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </AnimatePresence>
      </div>

      <BottomTabBar />
    </div>
  );
}
