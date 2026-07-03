import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, Shield, Phone, FileText, User, ChevronRight, LogOut, Trash2 } from 'lucide-react';
import AppHeader from '../../components/AppHeader';
import BottomTabBar from '../../components/BottomTabBar';
import Toggle from '../../components/Toggle';
import { useDemoData } from '../../context/DemoContext';

export default function Settings() {
  const navigate = useNavigate();
  const { user, updateNotifPref } = useDemoData();
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  return (
    <div className="min-h-screen bg-fog pb-24">
      <AppHeader title="Settings" />

      <div className="px-5 pt-5 space-y-6">
        {/* Profile card */}
        <div className="bg-white rounded-2xl border border-outline-light px-5 py-4 flex items-center gap-4">
          <div className="w-14 h-14 bg-navy rounded-2xl flex items-center justify-center font-display text-xl font-semibold text-white flex-shrink-0">
            {user.avatar}
          </div>
          <div className="flex-1">
            <p className="font-display text-headline-sm text-on-surface">{user.name}</p>
            <p className="font-body text-xs text-on-surface-muted">{user.maskedPhone}</p>
            <p className="font-body text-xs text-on-surface-muted">Member since {user.joinedDate}</p>
          </div>
        </div>

        {/* Notifications section */}
        <div>
          <p className="font-body text-label-caps text-on-surface-muted uppercase tracking-widest mb-3 px-1">Notifications</p>
          <div className="bg-white rounded-2xl border border-outline-light divide-y divide-outline-light overflow-hidden">
            {[
              { key: 'push', label: 'Push Notifications', sub: null },
              { key: 'whatsapp', label: 'WhatsApp Alerts', sub: 'Instant messages from guests' },
              { key: 'sms', label: 'SMS Fallback', sub: 'If WhatsApp is unreachable' },
              { key: 'email', label: 'Email Digest', sub: 'Daily summary of activity' },
            ].map(({ key, label, sub }) => (
              <div key={key} className="flex items-center justify-between px-4 py-3.5">
                <div>
                  <p className="font-body text-sm font-semibold text-on-surface">{label}</p>
                  {sub && <p className="font-body text-xs text-on-surface-muted">{sub}</p>}
                </div>
                <Toggle
                  on={user.notificationPrefs[key]}
                  onChange={val => updateNotifPref(key, val)}
                />
              </div>
            ))}
            {/* Emergency always-on note */}
            <div className="px-4 py-3 bg-alert-red/4">
              <p className="font-body text-xs text-alert-red font-medium">
                🚨 Emergency &amp; Theft alerts are always sent, regardless of these settings.
              </p>
            </div>
          </div>
        </div>

        {/* Account & Privacy */}
        <div>
          <p className="font-body text-label-caps text-on-surface-muted uppercase tracking-widest mb-3 px-1">Account &amp; Privacy</p>
          <div className="bg-white rounded-2xl border border-outline-light divide-y divide-outline-light overflow-hidden">
            {[
              { icon: User, label: 'My Profile', action: () => navigate('/profile') },
              { icon: Phone, label: 'Emergency Contacts', action: () => navigate('/emergency-contacts') },
              { icon: Shield, label: 'Privacy Controls', action: () => navigate('/privacy-controls') },
            ].map(({ icon: Icon, label, action }) => (
              <motion.button
                key={label}
                className="w-full flex items-center gap-3 px-4 py-4 text-left"
                onClick={action}
                whileTap={{ backgroundColor: 'rgba(26,26,26,0.04)' }}
              >
                <Icon size={20} className="text-on-surface-muted flex-shrink-0" />
                <span className="flex-1 font-body text-sm font-semibold text-on-surface">{label}</span>
                <ChevronRight size={18} className="text-outline-light" />
              </motion.button>
            ))}
          </div>
        </div>

        {/* Support */}
        <div>
          <p className="font-body text-label-caps text-on-surface-muted uppercase tracking-widest mb-3 px-1">Support</p>
          <div className="bg-white rounded-2xl border border-outline-light divide-y divide-outline-light overflow-hidden">
            <motion.button
              className="w-full flex items-center gap-3 px-4 py-4 text-left"
              onClick={() => navigate('/terms')}
              whileTap={{ backgroundColor: 'rgba(26,26,26,0.04)' }}
            >
              <FileText size={20} className="text-on-surface-muted flex-shrink-0" />
              <span className="flex-1 font-body text-sm font-semibold text-on-surface">Terms &amp; Privacy Policy</span>
              <ChevronRight size={18} className="text-outline-light" />
            </motion.button>
            <motion.button
              className="w-full flex items-center gap-3 px-4 py-4 text-left"
              onClick={() => setShowLogoutConfirm(true)}
              whileTap={{ backgroundColor: 'rgba(26,26,26,0.04)' }}
            >
              <LogOut size={20} className="text-on-surface-muted flex-shrink-0" />
              <span className="flex-1 font-body text-sm font-semibold text-on-surface">Log Out</span>
            </motion.button>
          </div>
        </div>

        {/* Danger zone */}
        <div>
          <div className="bg-white rounded-2xl border border-outline-light overflow-hidden">
            <motion.button
              className="w-full flex items-center gap-3 px-4 py-4 text-left"
              onClick={() => setShowDeleteConfirm(true)}
              whileTap={{ backgroundColor: 'rgba(217,48,37,0.05)' }}
            >
              <Trash2 size={20} className="text-alert-red flex-shrink-0" />
              <span className="font-body text-sm font-semibold text-alert-red">Delete Account</span>
            </motion.button>
          </div>
        </div>
      </div>

      {/* Delete confirm modal */}
      <AnimatePresence>
        {showDeleteConfirm && (
          <motion.div
            className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-asphalt/40 backdrop-blur-sm px-4 pb-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowDeleteConfirm(false)}
          >
            <motion.div
              className="bg-white rounded-2xl p-6 w-full max-w-sm space-y-4 shadow-sheet"
              initial={{ y: 40 }}
              animate={{ y: 0 }}
              exit={{ y: 40 }}
              transition={{ type: 'spring', damping: 22 }}
              onClick={e => e.stopPropagation()}
            >
              <div className="text-center">
                <div className="w-12 h-12 bg-alert-red/10 rounded-2xl flex items-center justify-center mx-auto mb-3">
                  <Trash2 size={22} className="text-alert-red" />
                </div>
                <h3 className="font-display text-headline-sm text-on-surface mb-2">Delete Account?</h3>
                <p className="font-body text-body-sm text-on-surface-muted">
                  All your vehicles, documents, and contacts will be permanently deleted. This cannot be undone.
                </p>
              </div>
              <div className="flex gap-3">
                <button
                  className="flex-1 border-2 border-outline-light rounded-xl py-3 font-body text-sm font-semibold text-on-surface"
                  onClick={() => setShowDeleteConfirm(false)}
                >
                  Cancel
                </button>
                <button
                  className="flex-1 bg-alert-red text-white rounded-xl py-3 font-body text-sm font-semibold"
                  onClick={() => navigate('/')}
                >
                  Delete
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Logout confirm modal */}
      <AnimatePresence>
        {showLogoutConfirm && (
          <motion.div
            className="fixed inset-0 z-[100] flex items-center justify-center bg-asphalt/40 backdrop-blur-sm px-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowLogoutConfirm(false)}
          >
            <motion.div
              className="bg-white rounded-2xl p-6 w-full max-w-sm text-center shadow-2xl relative"
              initial={{ scale: 0.95, opacity: 0, y: 10 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 10 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              onClick={e => e.stopPropagation()}
            >
              <div className="w-16 h-16 bg-[#003470]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <LogOut size={32} className="text-[#003470]" />
              </div>
              <h3 className="font-display text-[24px] font-semibold text-on-surface mb-2">Log Out?</h3>
              <p className="font-body text-[16px] text-on-surface-muted mb-6">
                Are you sure you want to log out of your account? You will need to sign in again to access your digital plates.
              </p>
              <div className="flex flex-col gap-3">
                <button
                  className="w-full bg-[#1B4B8F] text-white font-body text-[14px] font-bold tracking-[0.08em] uppercase py-3.5 rounded-xl hover:bg-[#153a6f] active:scale-[0.98] transition-all"
                  onClick={() => navigate('/')}
                >
                  Yes, Log Out
                </button>
                <button
                  className="w-full bg-white text-on-surface-variant border-2 border-outline-light font-body text-[14px] font-bold tracking-[0.08em] uppercase py-3.5 rounded-xl hover:bg-surface-container-low active:scale-[0.98] transition-all"
                  onClick={() => setShowLogoutConfirm(false)}
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <BottomTabBar />
    </div>
  );
}
