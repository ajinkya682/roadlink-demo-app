import React, { useState, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Camera, MapPin, AlertTriangle, X } from 'lucide-react';
import { motion } from 'framer-motion';
import AppHeader from '../../components/AppHeader';
import Button from '../../components/Button';
import Toggle from '../../components/Toggle';
import api from '../../lib/api';
import { useDialog } from '../../context/DialogContext';
import TopAuthButton from '../../components/TopAuthButton';

const stagger = { hidden: {}, show: { transition: { staggerChildren: 0.08 } } };
const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { type: 'spring', damping: 22, stiffness: 200 } },
};

export default function ReportDetail() {
  const navigate = useNavigate();
  const location = useLocation();
  const { showAlert } = useDialog();
  const cat = location.state?.category || { label: 'Wrong Parking', emoji: '🅿️', isAlert: false };

  const [notes, setNotes] = useState('');
  const [locationShare, setLocationShare] = useState(false);
  const [locationCoords, setLocationCoords] = useState(null);
  
  const fileInputRef = useRef(null);
  const [hasPhoto, setHasPhoto] = useState(false);
  const [photoBlob, setPhotoBlob] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);
  
  const [loading, setLoading] = useState(false);

  const token = location.state?.token || '';
  const isEmergency = cat.isAlert;

  const compressImage = (file) => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const MAX_WIDTH = 1200;
          const MAX_HEIGHT = 1200;
          let width = img.width;
          let height = img.height;

          if (width > height) {
            if (width > MAX_WIDTH) {
              height *= MAX_WIDTH / width;
              width = MAX_WIDTH;
            }
          } else {
            if (height > MAX_HEIGHT) {
              width *= MAX_HEIGHT / height;
              height = MAX_HEIGHT;
            }
          }
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, width, height);
          
          canvas.toBlob((blob) => resolve(blob), 'image/jpeg', 0.8);
        };
        img.src = e.target.result;
      };
      reader.readAsDataURL(file);
    });
  };

  const handlePhotoSelect = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setHasPhoto(true);
    const compressedBlob = await compressImage(file);
    setPhotoBlob(compressedBlob);
    setPhotoPreview(URL.createObjectURL(compressedBlob));
  };
  
  const clearPhoto = (e) => {
    e.stopPropagation();
    setHasPhoto(false);
    setPhotoBlob(null);
    setPhotoPreview(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  }

  const handleLocationToggle = async (val) => {
    if (!val) {
      setLocationShare(false);
      setLocationCoords(null);
      return;
    }
    
    // User wants to turn it on
    try {
      const pos = await new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, { timeout: 10000 });
      });
      setLocationCoords({ lat: pos.coords.latitude, lng: pos.coords.longitude });
      setLocationShare(true);
    } catch(err) {
      console.error('Failed to get location', err);
      showAlert(
        'Location Services Disabled',
        'Please enable device location and grant browser permissions to share your exact coordinates.'
      );
      setLocationShare(false);
      setLocationCoords(null);
    }
  };

  const handleSend = async () => {
    setLoading(true);
    try {
      if (token) {
        const formData = new FormData();
        formData.append('qrToken', token);
        formData.append('category', cat.id || cat.label.toLowerCase().replace(/ /g, '_'));
        formData.append('notes', notes);
        if (locationCoords) {
          formData.append('reporterLocation', JSON.stringify(locationCoords));
        }
        if (photoBlob) {
          formData.append('media', photoBlob, 'photo.jpg');
        }

        await api.post('/reports', formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
      }
      setTimeout(() => navigate('/report-confirmation', { state: { category: cat } }), 800);
    } catch (err) {
      console.error('Failed to submit report', err);
      setLoading(false);
      showAlert('Error', 'Failed to send report: ' + (err.response?.data?.error?.message || err.message));
    }
  };

  return (
    <div className="min-h-screen bg-fog flex flex-col">
      <AppHeader title="Report" rightSlot={<TopAuthButton className="" />} />

      <div className="flex-1 px-5 py-5 space-y-5">
        <motion.div initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.25 }}>
          <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full border-2 font-body font-semibold text-sm ${
            isEmergency
              ? 'border-alert-red bg-alert-red/5 text-alert-red'
              : 'border-outline-light bg-white text-on-surface'
          }`}>
            <span className="material-symbols-outlined text-[18px]">{cat.icon || 'local_parking'}</span>
            {cat.label}
          </div>
        </motion.div>

        {isEmergency ? (
          <motion.div variants={stagger} initial="hidden" animate="show" className="space-y-4">
            <motion.div variants={fadeUp} className="bg-alert-red/5 border-2 border-alert-red/30 rounded-xl p-4 flex items-start gap-3">
              <AlertTriangle size={20} className="text-alert-red flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-body font-semibold text-alert-red text-sm">Immediate Alert</p>
                <p className="font-body text-sm text-on-surface-muted mt-1">
                  This alerts the owner immediately across all channels — push, SMS, and WhatsApp.
                </p>
              </div>
            </motion.div>
            <motion.div variants={fadeUp}>
              <Button variant="alert" fullWidth onClick={handleSend} isLoading={loading}>
                Send Emergency Alert
              </Button>
            </motion.div>
          </motion.div>
        ) : (
          <motion.div variants={stagger} initial="hidden" animate="show" className="space-y-4">
            <motion.div variants={fadeUp}>
              <label className="block font-body text-label-caps text-on-surface-muted uppercase tracking-widest mb-1.5">
                Notes (Optional)
              </label>
              <textarea
                value={notes}
                onChange={e => setNotes(e.target.value.slice(0, 300))}
                placeholder="e.g. blocking the gate entrance..."
                rows={3}
                className="w-full px-4 py-3 bg-white border border-outline-light rounded-xl font-body text-body-sm text-on-surface resize-none focus:outline-none focus:border-navy focus:ring-2 focus:ring-navy/15 transition-all placeholder:text-outline"
              />
              <div className="text-right font-body text-xs text-outline mt-1">{notes.length}/300</div>
            </motion.div>

            <motion.div variants={fadeUp}>
              <input 
                type="file" 
                accept="image/*" 
                className="hidden" 
                ref={fileInputRef} 
                onChange={handlePhotoSelect} 
              />
              <div
                className={`relative w-full border-2 border-dashed rounded-xl py-6 flex flex-col items-center gap-2 transition-colors cursor-pointer overflow-hidden ${
                  hasPhoto ? 'border-verified-green bg-verified-green/5' : 'border-outline-light bg-white hover:border-navy/40'
                }`}
                onClick={() => !hasPhoto && fileInputRef.current?.click()}
              >
                {photoPreview ? (
                  <>
                    <img src={photoPreview} alt="Preview" className="absolute inset-0 w-full h-full object-cover opacity-30" />
                    <button onClick={clearPhoto} className="absolute top-2 right-2 p-1 bg-white/80 rounded-full text-on-surface hover:bg-white z-10">
                      <X size={16} />
                    </button>
                    <div className="z-10 flex flex-col items-center">
                      <Camera size={28} className="text-verified-green" />
                      <span className="font-body text-sm font-semibold text-on-surface mt-2">✓ Photo attached</span>
                    </div>
                  </>
                ) : (
                  <>
                    <Camera size={28} className="text-on-surface-muted" />
                    <span className="font-body text-sm font-semibold text-on-surface">Attach photo</span>
                    <span className="font-body text-xs text-on-surface-muted">Optional — helps the owner understand the situation</span>
                  </>
                )}
              </div>
            </motion.div>

            <motion.div variants={fadeUp} className="flex items-center justify-between bg-white rounded-xl border border-outline-light px-4 py-4">
              <div className="flex items-start gap-3">
                <MapPin size={18} className="text-on-surface-muted mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-body text-sm font-semibold text-on-surface">Share my location?</p>
                  <p className="font-body text-xs text-on-surface-muted">Helps the owner find the vehicle faster</p>
                </div>
              </div>
              <Toggle on={locationShare} onChange={handleLocationToggle} />
            </motion.div>

            <motion.div variants={fadeUp}>
              <Button fullWidth onClick={handleSend} isLoading={loading}>
                Send Notification
              </Button>
            </motion.div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
