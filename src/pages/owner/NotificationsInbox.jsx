import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, Filter } from 'lucide-react';
import AppHeader from '../../components/AppHeader';
import BottomTabBar from '../../components/BottomTabBar';
import styles from './NotificationsInbox.module.css';

const initialNotifs = [
  { id: 1, type: 'Wrong Parking', vehicle: 'Honda Activa', time: '10 min ago', color: '#F5A623', read: false },
  { id: 2, type: 'Vehicle Verified', vehicle: 'Honda Activa', time: '2 hrs ago', color: '#1E8E5A', read: true },
  { id: 3, type: 'Document Expiring', vehicle: 'Insurance', time: 'Yesterday', color: '#D93025', read: true },
];

export default function NotificationsInbox() {
  const navigate = useNavigate();
  const [notifs, setNotifs] = useState(initialNotifs);

  const handleDismiss = (id, e) => {
    e.stopPropagation();
    setNotifs(n => n.filter(x => x.id !== id));
  };

  return (
    <div className={styles.page}>
      <AppHeader title="Alerts" rightSlot={<Filter size={20} />} />

      <div className={styles.content}>
        <AnimatePresence>
          {notifs.length === 0 ? (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className={styles.empty}>
              <div className={styles.emptyIcon}>🔔</div>
              <p>You're all caught up!</p>
            </motion.div>
          ) : (
            <div className={styles.list}>
              {notifs.map((n, i) => (
                <motion.div
                  key={n.id}
                  layout
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -50, transition: { duration: 0.2 } }}
                  transition={{ delay: i * 0.05 }}
                  className={`${styles.card} ${!n.read ? styles.unread : ''}`}
                  onClick={() => navigate('/notification-detail')}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className={styles.indicator} style={{ background: n.color }} />
                  <div className={styles.cardMain}>
                    <div className={styles.cardHeader}>
                      <span className={styles.type}>{n.type}</span>
                      <span className={styles.time}>{n.time}</span>
                    </div>
                    <div className={styles.vehicle}>{n.vehicle}</div>
                  </div>
                  {!n.read && (
                    <button className={styles.resolveBtn} onClick={(e) => handleDismiss(n.id, e)}>
                      <Check size={16} />
                    </button>
                  )}
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
