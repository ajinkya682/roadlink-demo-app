import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { UploadCloud, FileText, CheckCircle, Lock } from 'lucide-react';
import AppHeader from '../../components/AppHeader';
import Button from '../../components/Button';
import Input from '../../components/Input';
import { useAppData } from '../../context/AppContext';
import api from '../../lib/api';

export default function DocumentUpload() {
  const navigate = useNavigate();
  const location = useLocation();
  const docType = location.state?.type || 'RC Book';
  const vehicleId = location.state?.vehicleId;
  const [file, setFile] = useState(null);
  const [expiryDate, setExpiryDate] = useState('');
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [done, setDone] = useState(false);
  const [error, setError] = useState(null);

  const handleUpload = async () => {
    if (!vehicleId) return setError('Missing vehicle ID');
    
    setUploading(true);
    setError(null);
    setProgress(20);

    try {
      const formData = new FormData();
      formData.append('vehicleId', vehicleId);
      formData.append('documentType', docType);
      if (expiryDate) formData.append('expiryDate', expiryDate);
      
      // Since UI mocks the file picker, we create a mock blob for the upload
      const mockBlob = new Blob(['Mock PDF Content'], { type: 'application/pdf' });
      formData.append('file', mockBlob, 'document.pdf');

      const res = await api.post('/documents', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        },
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          setProgress(Math.max(20, percentCompleted));
        }
      });

      if (res.data.success) {
        setProgress(100);
        setTimeout(() => {
          setUploading(false);
          setDone(true);
          setTimeout(() => navigate('/document-vault'), 1800);
        }, 400);
      } else {
        throw new Error(res.data.error?.message || 'Failed to upload document');
      }
    } catch (err) {
      setError(err.response?.data?.error?.message || err.message || 'Upload failed');
      setUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-fog flex flex-col">
      <AppHeader title="Upload Document" />

      <div className="flex-1 px-5 py-5 space-y-5">
        {/* Document type selector */}
        <div>
          <p className="font-body text-label-caps text-on-surface-muted uppercase tracking-widest mb-2">Document Type</p>
          <div className="bg-white px-4 py-3 border border-outline-light rounded-xl font-body text-sm font-semibold text-on-surface">
            {docType}
          </div>
        </div>

        {/* Upload zone */}
        <AnimatePresence mode="wait">
          {!file ? (
            <motion.button
              key="empty"
              type="button"
              className="w-full border-2 border-dashed border-outline-light rounded-2xl py-10 flex flex-col items-center gap-3 bg-white hover:border-navy/40 hover:bg-navy/2 transition-colors"
              onClick={() => setFile('mock-file.pdf')}
              whileTap={{ scale: 0.98 }}
            >
              <div className="w-14 h-14 bg-navy/8 rounded-2xl flex items-center justify-center">
                <UploadCloud size={28} className="text-navy" />
              </div>
              <div className="text-center">
                <p className="font-body text-sm font-semibold text-on-surface">Tap to select file or photo</p>
                <p className="font-body text-xs text-on-surface-muted mt-1">PDF, JPG, PNG — up to 10MB</p>
              </div>
            </motion.button>
          ) : (
            <motion.div
              key="file"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white border border-outline-light rounded-2xl px-4 py-3 flex items-center gap-3"
            >
              <div className="w-10 h-10 bg-navy/8 rounded-xl flex items-center justify-center flex-shrink-0">
                <FileText size={20} className="text-navy" />
              </div>
              <div className="flex-1">
                <p className="font-body text-sm font-semibold text-on-surface">{docType.replace(' ', '_')}_Document.pdf</p>
                <p className="font-body text-xs text-on-surface-muted">1.2 MB</p>
              </div>
              {!uploading && !done && (
                <button
                  className="w-7 h-7 bg-surface-high rounded-full flex items-center justify-center font-body text-xs text-on-surface-muted hover:bg-alert-red/10 hover:text-alert-red transition-colors"
                  onClick={() => setFile(null)}
                >
                  ✕
                </button>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Expiry date */}
        <Input
          label="Expiry Date (Optional)"
          type="date"
          value={expiryDate}
          onChange={e => setExpiryDate(e.target.value)}
        />

        {/* Progress bar */}
        {uploading && (
          <div className="space-y-2">
            <div className="flex justify-between">
              <p className="font-body text-xs font-semibold text-navy flex items-center gap-1.5">
                <Lock size={12} /> Encrypting and uploading...
              </p>
              <p className="font-mono text-xs font-bold text-navy tabular-nums">{progress}%</p>
            </div>
            <div className="h-2 bg-surface-high rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-navy rounded-full"
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.2 }}
              />
            </div>
          </div>
        )}

        {/* Success */}
        {done && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-3 bg-verified-green/8 border border-verified-green/20 rounded-xl px-4 py-3"
          >
            <CheckCircle size={20} className="text-verified-green flex-shrink-0" />
            <div>
              <p className="font-body text-sm font-semibold text-verified-green">Document secured in vault</p>
              <p className="font-body text-xs text-on-surface-muted">Stored securely, encrypted — only you can access it</p>
            </div>
          </motion.div>
        )}
        
        {error && <p className="text-red-500 text-sm font-body text-center">{error}</p>}
      </div>

      <div className="px-5 pb-10 pt-4 border-t border-outline-light bg-fog">
        <Button fullWidth disabled={!file || uploading || done} onClick={handleUpload}>
          <Lock size={16} /> Save Document
        </Button>
      </div>
    </div>
  );
}
