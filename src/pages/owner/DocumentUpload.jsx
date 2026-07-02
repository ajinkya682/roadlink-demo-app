import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { UploadCloud, FileText, CheckCircle } from 'lucide-react';
import AppHeader from '../../components/AppHeader';
import Button from '../../components/Button';
import styles from './DocumentUpload.module.css';

const types = ['RC Book', 'Insurance', 'PUC'];

export default function DocumentUpload() {
  const navigate = useNavigate();
  const [docType, setDocType] = useState(types[0]);
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [done, setDone] = useState(false);

  const handleUpload = () => {
    setUploading(true);
    let p = 0;
    const interval = setInterval(() => {
      p += 15;
      if (p >= 100) {
        clearInterval(interval);
        setProgress(100);
        setTimeout(() => {
          setUploading(false);
          setDone(true);
          setTimeout(() => navigate('/document-vault'), 1500);
        }, 400);
      } else {
        setProgress(p);
      }
    }, 150);
  };

  return (
    <div className={styles.page}>
      <AppHeader title="Upload Document" />

      <div className={styles.content}>
        <div className={styles.label}>Select Document Type</div>
        <div className={styles.typeSelector}>
          {types.map(t => (
            <button
              key={t}
              className={`${styles.typeBtn} ${docType === t ? styles.typeActive : ''}`}
              onClick={() => setDocType(t)}
            >
              {docType === t && (
                <motion.div
                  layoutId="doc-type-bg"
                  className={styles.typeBg}
                  transition={{ type: 'spring', damping: 22, stiffness: 300 }}
                />
              )}
              <span className={styles.typeText}>{t}</span>
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          {!file ? (
            <motion.div
              key="empty"
              className={styles.dropZone}
              onClick={() => setFile('mock-file.pdf')}
              whileHover={{ borderColor: 'var(--primary-container)', background: 'rgba(27,75,143,0.03)' }}
              whileTap={{ scale: 0.98 }}
            >
              <UploadCloud size={32} color="var(--primary-container)" />
              <div className={styles.dropTitle}>Tap to select file or photo</div>
              <div className={styles.dropSub}>PDF, JPG, PNG up to 5MB</div>
            </motion.div>
          ) : (
            <motion.div
              key="file"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className={styles.fileCard}
            >
              <div className={styles.fileIcon}><FileText size={20} color="var(--primary-container)" /></div>
              <div className={styles.fileInfo}>
                <div className={styles.fileName}>{docType}_Document.pdf</div>
                <div className={styles.fileSize}>1.2 MB</div>
              </div>
              {!uploading && !done && (
                <button className={styles.removeBtn} onClick={() => setFile(null)}>✕</button>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {uploading && (
          <div className={styles.progressBox}>
            <div className={styles.progressText}>Encrypting and uploading... {progress}%</div>
            <div className={styles.progressBar}>
              <motion.div
                className={styles.progressFill}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.2 }}
              />
            </div>
          </div>
        )}

        {done && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={styles.successBox}
          >
            <CheckCircle size={20} color="var(--verified-green)" />
            Document secured in vault
          </motion.div>
        )}
      </div>

      <div className={styles.bottom}>
        <Button fullWidth disabled={!file || uploading || done} onClick={handleUpload}>
          Securely Upload
        </Button>
      </div>
    </div>
  );
}
