import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Download, RefreshCw, Package } from 'lucide-react';
import { motion } from 'framer-motion';
import AppHeader from '../../components/AppHeader';
import PlateTag from '../../components/PlateTag';
import Button from '../../components/Button';
import styles from './QRDetail.module.css';

// Mock QR SVG
function QRCode() {
  return (
    <svg width="160" height="160" viewBox="0 0 160 160" fill="none">
      <rect width="160" height="160" fill="white" />
      <rect x="10" y="10" width="60" height="60" rx="6" fill="#1A1A1A" />
      <rect x="18" y="18" width="44" height="44" rx="4" fill="white" />
      <rect x="26" y="26" width="28" height="28" fill="#1A1A1A" />
      <rect x="90" y="10" width="60" height="60" rx="6" fill="#1A1A1A" />
      <rect x="98" y="18" width="44" height="44" rx="4" fill="white" />
      <rect x="106" y="26" width="28" height="28" fill="#1A1A1A" />
      <rect x="10" y="90" width="60" height="60" rx="6" fill="#1A1A1A" />
      <rect x="18" y="98" width="44" height="44" rx="4" fill="white" />
      <rect x="26" y="106" width="28" height="28" fill="#1A1A1A" />
      <rect x="90" y="90" width="24" height="24" fill="#1A1A1A" rx="3" />
      <rect x="122" y="90" width="28" height="24" fill="#1A1A1A" rx="3" />
      <rect x="90" y="122" width="24" height="28" fill="#1A1A1A" rx="3" />
      <rect x="122" y="122" width="28" height="28" fill="#1A1A1A" rx="3" />
    </svg>
  );
}

export default function QRDetail() {
  const navigate = useNavigate();
  const [downloaded, setDownloaded] = useState(false);

  const handleDownload = () => {
    setDownloaded(true);
    setTimeout(() => setDownloaded(false), 2500);
  };

  return (
    <div className={styles.page}>
      <AppHeader title="Vehicle QR" />

      <div className={styles.content}>
        {/* Plate */}
        <PlateTag plateNumber="MH 14 AB 1234" size="md" />

        {/* QR Card with flip-in */}
        <motion.div
          className={styles.qrCard}
          initial={{ rotateX: 90, opacity: 0 }}
          animate={{ rotateX: 0, opacity: 1 }}
          transition={{ type: 'spring', damping: 16, stiffness: 100, delay: 0.1 }}
          style={{ perspective: 800, transformOrigin: 'center top' }}
        >
          <QRCode />
          <p className={styles.qrId}>ROADLINK-MH14AB1234</p>
        </motion.div>

        <p className={styles.privacy}>
          This QR protects your privacy — it acts as a relay, never revealing your number.
        </p>

        {/* Actions */}
        <div className={styles.actions}>
          <Button variant="secondary" fullWidth onClick={() => navigate('/order-sticker')}>
            <Package size={18} /> Order Sticker
          </Button>

          <Button variant="outline" fullWidth onClick={handleDownload}>
            {downloaded ? '✓ Downloaded' : <><Download size={18} /> Download QR</>}
          </Button>

          <button className={styles.regenerate} onClick={() => {}}>
            <RefreshCw size={14} /> Regenerate QR
          </button>
        </div>
      </div>
    </div>
  );
}
