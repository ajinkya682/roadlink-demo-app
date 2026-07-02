import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { QrCode, Shield, FileText, ChevronRight, Edit3 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import AppHeader from '../../components/AppHeader';
import PlateTag from '../../components/PlateTag';
import styles from './VehicleDetail.module.css';

const tabs = ['Overview', 'Documents', 'Settings'];

export default function VehicleDetail() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState(0);

  return (
    <div className={styles.page}>
      <AppHeader title="Vehicle Info" rightSlot={<Edit3 size={20} />} />

      {/* Sticky Plate Hero */}
      <div className={styles.hero}>
        <PlateTag plateNumber="MH 14 AB 1234" displayName="Honda Activa" isVerified size="lg" />
        <div className={styles.status}>
          <span className={styles.statusDot} />
          Active & Protected
        </div>
      </div>

      {/* Tab Slider */}
      <div className={styles.tabBar}>
        {tabs.map((tab, i) => (
          <button
            key={tab}
            className={`${styles.tab} ${activeTab === i ? styles.tabActive : ''}`}
            onClick={() => setActiveTab(i)}
          >
            {tab}
            {activeTab === i && (
              <motion.div
                layoutId="v-tab-line"
                className={styles.tabLine}
                transition={{ type: 'spring', damping: 20, stiffness: 300 }}
              />
            )}
          </button>
        ))}
      </div>

      {/* Content Area */}
      <div className={styles.content}>
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            className={styles.tabPanel}
          >
            {activeTab === 0 && (
              <div className={styles.panelFlow}>
                <div className={styles.card} onClick={() => navigate('/qr-detail')}>
                  <div className={styles.cardLeft}>
                    <QrCode size={24} color="var(--primary-container)" />
                    <div>
                      <div className={styles.cardTitle}>Vehicle QR</div>
                      <div className={styles.cardSub}>View, download, or order sticker</div>
                    </div>
                  </div>
                  <ChevronRight size={20} color="var(--outline-variant)" />
                </div>
                
                <div className={styles.card}>
                  <div className={styles.cardLeft}>
                    <Shield size={24} color="var(--verified-green)" />
                    <div>
                      <div className={styles.cardTitle}>Privacy Mode</div>
                      <div className={styles.cardSub}>Hide your name when scanned</div>
                    </div>
                  </div>
                  <div className={styles.toggle}><div className={styles.toggleThumb} /></div>
                </div>
              </div>
            )}

            {activeTab === 1 && (
              <div className={styles.panelFlow}>
                <div className={styles.card} onClick={() => navigate('/document-vault')}>
                  <div className={styles.cardLeft}>
                    <FileText size={24} color="var(--secondary-container)" />
                    <div>
                      <div className={styles.cardTitle}>Document Vault</div>
                      <div className={styles.cardSub}>3 documents securely stored</div>
                    </div>
                  </div>
                  <ChevronRight size={20} color="var(--outline-variant)" />
                </div>
              </div>
            )}

            {activeTab === 2 && (
              <div className={styles.panelFlow}>
                <div className={styles.dangerCard}>
                  <div>
                    <div className={styles.dangerTitle}>Remove Vehicle</div>
                    <div className={styles.dangerSub}>Deactivates QR instantly</div>
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
