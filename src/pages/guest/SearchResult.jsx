import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search } from 'lucide-react';
import Button from '../../components/Button';
import PlateTag from '../../components/PlateTag';
import styles from './SearchResult.module.css';

export default function SearchResult() {
  const navigate = useNavigate();
  const location = useLocation();
  const plate = location.state?.plate || 'MH 14 AB 1234';
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1200);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className={styles.page}>
      {loading ? (
        <div className={styles.center}>
          <motion.div
            animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
            transition={{ repeat: Infinity, duration: 1.5 }}
            className={styles.searchIcon}
          >
            <Search size={32} color="var(--primary-container)" />
          </motion.div>
          <div className={styles.loadingText}>Searching secure registry...</div>
        </div>
      ) : (
        <div className={styles.content}>
          <div className={styles.top}>
            <div className={styles.resultLabel}>Vehicle Found</div>
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ type: 'spring', damping: 20 }}
            >
              <PlateTag plateNumber={plate} displayName="Honda Activa" isVerified size="lg" />
            </motion.div>
          </div>

          <motion.div
            className={styles.actions}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <Button fullWidth onClick={() => navigate('/report-detail', { state: { category: { label: 'General Alert', icon: '🔔' } } })}>
              Notify Owner
            </Button>
            <Button variant="outline" fullWidth onClick={() => navigate('/search')}>
              Search Another
            </Button>
            <p className={styles.privacyNote}>The owner's privacy is protected. They will receive your alert without sharing their number.</p>
          </motion.div>
        </div>
      )}
    </div>
  );
}
