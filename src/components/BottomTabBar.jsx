import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Home, Bell, FileText, QrCode, Settings } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '../lib/cn';
import { useDemoData } from '../context/DemoContext';

const tabs = [
  { label: 'Home',     Icon: Home,      path: '/dashboard' },
  { label: 'Alerts',   Icon: Bell,      path: '/notifications', showBadge: true },
  { label: 'Docs',     Icon: FileText,  path: '/document-vault' },
  { label: 'QR',       Icon: QrCode,    path: '/qr-detail' },
  { label: 'Settings', Icon: Settings,  path: '/settings' },
];

export default function BottomTabBar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { unreadCount } = useDemoData();

  return (
    <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-mobile z-50 bg-fog/95 backdrop-blur-md border-t border-outline-light/60 safe-area-pb">
      <div className="flex items-stretch h-16">
        {tabs.map((tab) => {
          const isActive = location.pathname === tab.path ||
            (tab.path === '/qr-detail' && location.pathname === '/qr-detail');
          const { Icon } = tab;
          const badge = tab.showBadge && unreadCount > 0;

          return (
            <button
              key={tab.path}
              className={cn(
                'flex-1 flex flex-col items-center justify-center gap-0.5 relative',
                'transition-colors duration-150',
                isActive ? 'text-navy' : 'text-on-surface-muted',
              )}
              onClick={() => navigate(tab.path)}
            >
              {/* Active background pill */}
              {isActive && (
                <motion.div
                  layoutId="tab-pill"
                  className="absolute inset-x-2 top-1 h-9 rounded-xl bg-navy/8"
                  transition={{ type: 'spring', damping: 20, stiffness: 300 }}
                />
              )}

              {/* Icon + badge wrapper */}
              <div className="relative z-10">
                <motion.div
                  animate={isActive ? { scale: 1.1 } : { scale: 1 }}
                  transition={{ type: 'spring', damping: 15, stiffness: 300 }}
                >
                  <Icon size={22} strokeWidth={isActive ? 2.25 : 1.75} />
                </motion.div>
                {badge && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-1 -right-1.5 w-4 h-4 bg-alert-red rounded-full flex items-center justify-center text-white font-body font-bold"
                    style={{ fontSize: '9px' }}
                  >
                    {unreadCount > 9 ? '9+' : unreadCount}
                  </motion.span>
                )}
              </div>

              {/* Label */}
              <span
                className={cn(
                  'relative z-10 font-body font-medium leading-none transition-all duration-150',
                  isActive ? 'text-[11px] text-navy' : 'text-[10px] text-on-surface-muted',
                )}
              >
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
