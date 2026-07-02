import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FileText, Plus, Shield, UploadCloud } from 'lucide-react';
import AppHeader from '../../components/AppHeader';
import BottomTabBar from '../../components/BottomTabBar';
import styles from './DocumentVault.module.css';

const stagger = { hidden: {}, show: { transition: { staggerChildren: 0.1 } } };
const fadeUp = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0, transition: { type: 'spring', damping: 20, stiffness: 200 } } };

const initialDocs = [
  { id: 1, type: 'RC Book', number: 'MH14AB1234', status: 'valid', expiry: 'Lifetime' },
  { id: 2, type: 'Insurance', number: 'POL-987654321', status: 'expiring', expiry: '12 days left' },
  { id: 3, type: 'PUC', number: 'PUC-MH14-876', status: 'expired', expiry: 'Expired' },
];

function DocCard({ doc, onClick }) {
  const [flipped, setFlipped] = useState(false);

  const getStatusColor = (status) => {
    if (status === 'valid') return 'var(--verified-green)';
    if (status === 'expiring') return 'var(--secondary-container)';
    return 'var(--alert-red)';
  };

  return (
    <motion.div variants={fadeUp} className={styles.cardWrapper}>
      <motion.div
        className={styles.cardInner}
        animate={{ rotateY: flipped ? 180 : 0 }}
        transition={{ type: 'spring', damping: 20, stiffness: 120 }}
        onClick={() => setFlipped(!flipped)}
        style={{ transformStyle: 'preserve-3d' }}
      >
        {/* Front */}
        <div className={styles.cardFront} style={{ borderTop: `4px solid ${getStatusColor(doc.status)}` }}>
          <div className={styles.cardHeader}>
            <div className={styles.docType}><FileText size={18} /> {doc.type}</div>
            <div className={styles.statusLabel} style={{ color: getStatusColor(doc.status) }}>
              {doc.expiry}
            </div>
          </div>
          <div className={styles.docNumber}>{doc.number}</div>
          {doc.status !== 'valid' && (
            <motion.div
              className={styles.glow}
              style={{ background: getStatusColor(doc.status) }}
              animate={{ opacity: [0, 0.15, 0] }}
              transition={{ repeat: Infinity, duration: 2 }}
            />
          )}
        </div>

        {/* Back */}
        <div className={styles.cardBack}>
          <div className={styles.backActions}>
            <button className={styles.backBtn} onClick={(e) => { e.stopPropagation(); onClick(); }}>
              <UploadCloud size={20} /> Update Document
            </button>
            <button className={styles.backBtn} style={{ color: 'var(--alert-red)' }}>
              Remove
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function DocumentVault() {
  const navigate = useNavigate();

  return (
    <div className={styles.page}>
      <AppHeader title="Vault" rightSlot={<Shield size={20} color="var(--verified-green)" />} />

      <div className={styles.content}>
        <div className={styles.privacyBanner}>
          <Shield size={16} /> Documents are encrypted. We cannot read them.
        </div>

        <motion.div variants={stagger} initial="hidden" animate="show" className={styles.grid}>
          {initialDocs.map(doc => (
            <DocCard key={doc.id} doc={doc} onClick={() => navigate('/document-upload')} />
          ))}

          <motion.div
            variants={fadeUp}
            className={styles.addCard}
            onClick={() => navigate('/document-upload')}
            whileHover={{ borderColor: 'var(--primary-container)' }}
            whileTap={{ scale: 0.97 }}
          >
            <Plus size={24} color="var(--primary-container)" />
            <span>Add Document</span>
          </motion.div>
        </motion.div>
      </div>

      <BottomTabBar />
    </div>
  );
}
