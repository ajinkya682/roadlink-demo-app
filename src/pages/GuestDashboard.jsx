import React from 'react';
import { useNavigate } from 'react-router-dom';
import { QrCode, Search, Smartphone } from 'lucide-react';
import Button from '../components/Button';
import styles from './GuestDashboard.module.css';

export default function GuestDashboard() {
  const navigate = useNavigate();

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <h1 className={styles.title}>RoadLink Guest</h1>
        <p className={styles.sub}>Report a vehicle without an account.</p>
      </div>

      <div className={styles.content}>
        <div className={styles.card} onClick={() => navigate('/scan-landing')}>
          <div className={styles.cardVisual} style={{ background: 'var(--primary-container)', color: '#fff' }}>
            <QrCode size={32} />
          </div>
          <div className={styles.cardText}>
            <div className={styles.cardTitle}>Scan QR Code</div>
            <div className={styles.cardDesc}>Tap to simulate scanning a sticker</div>
          </div>
        </div>

        <div className={styles.card} onClick={() => navigate('/search')}>
          <div className={styles.cardVisual} style={{ background: 'rgba(26,26,26,0.08)', color: 'var(--on-surface-variant)' }}>
            <Search size={32} />
          </div>
          <div className={styles.cardText}>
            <div className={styles.cardTitle}>Search by Number Plate</div>
            <div className={styles.cardDesc}>Don't have the QR? Search manually.</div>
          </div>
        </div>

        <div className={styles.ownerBox}>
          <Smartphone size={24} color="var(--primary-container)" />
          <div className={styles.ownerText}>
            <div className={styles.ownerTitle}>Are you a vehicle owner?</div>
            <div className={styles.ownerSub}>Log in to manage your vehicles and alerts.</div>
          </div>
          <Button variant="ghost" onClick={() => navigate('/login')}>Log In</Button>
        </div>
      </div>
    </div>
  );
}
