import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldAlert, AlertTriangle, Lightbulb, FileWarning, CheckCircle, Bell, ChevronRight, ShieldCheck } from 'lucide-react';
import AppHeader from '../../components/AppHeader';
import BottomTabBar from '../../components/BottomTabBar';
import { useDemoData } from '../../context/DemoContext';

const filters = ['All', 'Unresolved', 'Resolved'];

const getNotificationStyle = (type, resolved) => {
  if (resolved) {
    return {
      borderClass: 'border-[#005834]', // tertiary-container
      bgClass: 'bg-[#90f7ba]/30', // tertiary-fixed
      iconColor: 'text-[#005834]',
      Icon: CheckCircle,
      cardOpacity: 'opacity-80 hover:opacity-100 bg-white/80'
    };
  }

  switch(type) {
    case 'Vehicle Theft':
      return {
        borderClass: 'border-[#ba1a1a]', // error
        bgClass: 'bg-[#ffdad6]/30', // error-container
        iconColor: 'text-[#ba1a1a]',
        Icon: ShieldAlert,
        cardOpacity: 'bg-white'
      };
    case 'Wrong Parking':
      return {
        borderClass: 'border-[#835500]', // secondary
        bgClass: 'bg-[#feae2c]/20', // secondary-container
        iconColor: 'text-[#835500]',
        Icon: AlertTriangle,
        cardOpacity: 'bg-white'
      };
    case 'Document Expiring':
      return {
        borderClass: 'border-[#1b4b8f]', // primary-container
        bgClass: 'bg-[#d7e2ff]/30', // primary-fixed
        iconColor: 'text-[#003470]', // primary
        Icon: FileWarning,
        cardOpacity: 'bg-white'
      };
    case 'Vehicle Verified':
      return {
        borderClass: 'border-[#005834]',
        bgClass: 'bg-[#90f7ba]/30',
        iconColor: 'text-[#005834]',
        Icon: ShieldCheck,
        cardOpacity: 'bg-white'
      };
    default:
      return {
        borderClass: 'border-[#1b4b8f]',
        bgClass: 'bg-[#d7e2ff]/30',
        iconColor: 'text-[#003470]',
        Icon: Bell,
        cardOpacity: 'bg-white'
      };
  }
};

export default function NotificationsInbox() {
  const navigate = useNavigate();
  const { notifications, markRead } = useDemoData();
  const [filter, setFilter] = useState('All');

  const filtered = notifications.filter(n => {
    if (filter === 'Unresolved') return !n.resolved;
    if (filter === 'Resolved') return n.resolved;
    return true;
  });

  const handleNotificationClick = (n) => {
    if (!n.read) markRead(n.id);
    navigate(`/notification-detail/${n.id}`);
  };

  return (
    <div className="min-h-screen bg-[#F7F8FA] text-[#1c1b1b] font-body pb-24">
      <AppHeader title="Notifications" />

      <main className="max-w-2xl mx-auto px-4 pt-6 w-full space-y-6">
        {/* Filter Bar */}
        <section className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
          {filters.map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-6 py-2 rounded-full font-body text-[12px] font-bold tracking-[0.08em] uppercase transition-all active:scale-95 whitespace-nowrap ${
                filter === f 
                  ? 'bg-[#1b4b8f] text-[#9cbdff]' 
                  : 'bg-[#f0eded] text-[#434751] hover:bg-[#eae7e7] border border-[#737782]/10'
              }`}
            >
              {f}
            </button>
          ))}
        </section>

        {/* Notification Feed */}
        <div className="pb-10">
          <AnimatePresence mode="popLayout">
            {filtered.length === 0 ? (
              <motion.div
                key="empty-state"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="flex flex-col items-center justify-center py-20 gap-3 text-center"
              >
                <div className="w-14 h-14 bg-[#f0eded] rounded-2xl flex items-center justify-center text-[#434751]">
                  <Bell size={24} />
                </div>
                <p className="font-display text-[20px] font-semibold text-[#1c1b1b]">No reports yet.</p>
                <p className="font-body text-[14px] text-[#737782]">That's a good thing.</p>
              </motion.div>
            ) : (
              filtered.map((n, i) => {
                const style = getNotificationStyle(n.type, n.resolved);
                return (
                  <motion.article
                    key={n.id}
                    layout
                    initial={{ opacity: 0, scale: 0.95, y: 10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
                    transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                    onClick={() => handleNotificationClick(n)}
                    className={`mb-4 rounded-xl border-l-4 ${style.borderClass} ${style.cardOpacity} shadow-[0_1px_3px_rgba(0,0,0,0.05)] flex items-start p-4 transition-transform hover:translate-x-1 duration-200 cursor-pointer group origin-top`}
                  >
                    <div className={`mr-4 flex-shrink-0 ${style.bgClass} p-2 rounded-lg`}>
                      <style.Icon size={24} className={style.iconColor} />
                    </div>
                    
                    <div className="flex-grow">
                      <div className="flex justify-between items-start mb-1">
                        <h3 className={`font-display text-[20px] font-semibold ${n.resolved ? 'text-[#434751]' : 'text-[#1c1b1b]'}`}>
                          {n.type}
                        </h3>
                        <span className="font-body text-[14px] text-[#c3c6d2]">{n.time}</span>
                      </div>
                      
                      {n.plate && (
                        <div className="flex items-center gap-3 mb-2">
                          <span className="border border-[#1c1b1b]/15 shadow-sm bg-white font-mono text-[14px] font-medium px-2 py-0.5 rounded text-[#1c1b1b]">
                            {n.plate}
                          </span>
                        </div>
                      )}
                      
                      <p className={`font-body text-[16px] line-clamp-2 ${n.resolved ? 'text-[#434751]/70' : 'text-[#434751]'}`}>
                        {n.notes}
                      </p>
                    </div>

                    {/* Right side indicators */}
                    <div className="ml-3 self-center flex items-center justify-center min-w-[24px]">
                      {!n.read && !n.resolved ? (
                        <div className="w-3 h-3 bg-[#ba1a1a] rounded-full shadow-sm shadow-[#ba1a1a]/40 group-active:opacity-30 transition-opacity"></div>
                      ) : n.resolved ? (
                        <CheckCircle size={20} className="text-[#005834]" />
                      ) : (
                        <ChevronRight size={24} className="text-[#c3c6d2] opacity-0 group-hover:opacity-100 transition-opacity" />
                      )}
                    </div>
                  </motion.article>
                );
              })
            )}
          </AnimatePresence>
        </div>
      </main>

      <BottomTabBar />
    </div>
  );
}
