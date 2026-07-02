import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Home, Bell, FileText, Settings, QrCode } from 'lucide-react';
import { motion } from 'framer-motion';

const tabs = [
  { label: 'Home', icon: Home, path: '/dashboard' },
  { label: 'Alerts', icon: Bell, path: '/notifications', badge: 1 },
  { label: 'Docs', icon: FileText, path: '/document-vault' },
  { label: 'QR', icon: QrCode, path: '/qr-detail' },
  { label: 'Settings', icon: Settings, path: '/settings' },
];

export default function BottomTabBar() {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <div style={{
      position: 'fixed',
      bottom: 0,
      left: '50%',
      transform: 'translateX(-50%)',
      width: '100%',
      maxWidth: '420px',
      backgroundColor: 'var(--plate-white)',
      borderTop: '1px solid rgba(26,26,26,0.08)',
      display: 'flex',
      zIndex: 100,
      paddingBottom: 'env(safe-area-inset-bottom, 0px)',
    }}>
      {tabs.map((tab) => {
        const isActive = location.pathname === tab.path;
        const Icon = tab.icon;
        return (
          <button
            key={tab.path}
            onClick={() => navigate(tab.path)}
            style={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '10px 4px',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              position: 'relative',
              gap: '4px',
            }}
          >
            {/* Active indicator bar */}
            {isActive && (
              <motion.div
                layoutId="tab-indicator"
                style={{
                  position: 'absolute',
                  top: 0,
                  left: '20%',
                  right: '20%',
                  height: '2px',
                  backgroundColor: 'var(--primary-container)',
                  borderRadius: '0 0 2px 2px',
                }}
              />
            )}

            {/* Notification badge */}
            {tab.badge && !isActive && (
              <div style={{
                position: 'absolute',
                top: '8px',
                left: '50%',
                marginLeft: '4px',
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                backgroundColor: 'var(--alert-red)',
              }} />
            )}

            <Icon
              size={22}
              color={isActive ? 'var(--primary-container)' : 'var(--on-surface-variant)'}
              strokeWidth={isActive ? 2.5 : 1.5}
            />
            <span
              className="text-label-caps"
              style={{
                color: isActive ? 'var(--primary-container)' : 'var(--on-surface-variant)',
                fontSize: '10px',
                letterSpacing: '0.04em',
              }}
            >
              {tab.label}
            </span>
          </button>
        );
      })}
    </div>
  );
}
