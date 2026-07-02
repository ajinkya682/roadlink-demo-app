import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Home, Bell, FileText, QrCode, Settings } from 'lucide-react';
import { motion } from 'framer-motion';
import styles from './BottomTabBar.module.css';

const tabs = [
  { label: 'Home',     icon: Home,      path: '/dashboard' },
  { label: 'Alerts',   icon: Bell,      path: '/notifications', badge: true },
  { label: 'Docs',     icon: FileText,  path: '/document-vault' },
  { label: 'QR',       icon: QrCode,    path: '/qr-detail' },
  { label: 'Settings', icon: Settings,  path: '/settings' },
];

export default function BottomTabBar() {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <div className={styles.bar}>
      {tabs.map((tab) => {
        const isActive = location.pathname === tab.path;
        const Icon = tab.icon;
        return (
          <button
            key={tab.path}
            className={`${styles.tab} ${isActive ? styles.active : ''}`}
            onClick={() => navigate(tab.path)}
          >
            {isActive && (
              <motion.div
                layoutId="tab-pill"
                className={styles.pill}
                transition={{ type: 'spring', damping: 20, stiffness: 300 }}
              />
            )}

            <div className={styles.iconWrap}>
              <motion.div
                animate={isActive ? { scale: 1.15 } : { scale: 1 }}
                transition={{ type: 'spring', damping: 15, stiffness: 300 }}
              >
                <Icon
                  size={22}
                  strokeWidth={isActive ? 2.5 : 1.75}
                  color={isActive ? 'var(--primary-container)' : 'var(--on-surface-variant)'}
                />
              </motion.div>
              {tab.badge && (
                <motion.div
                  className={styles.badge}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', delay: 0.3 }}
                />
              )}
            </div>

            <motion.span
              className={styles.label}
              animate={{ opacity: isActive ? 1 : 0, y: isActive ? 0 : 4 }}
              transition={{ duration: 0.15 }}
            >
              {tab.label}
            </motion.span>
          </button>
        );
      })}
    </div>
  );
}
