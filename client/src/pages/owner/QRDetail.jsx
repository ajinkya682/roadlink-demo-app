import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Download, Truck, HelpCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import AppHeader from '../../components/AppHeader';
import Button from '../../components/Button';
import { useAppData } from '../../context/AppContext';

import { QRCodeSVG } from 'qrcode.react';

export default function QRDetail() {
  const navigate = useNavigate();
  const location = useLocation();
  const { vehicles } = useAppData();
  
  // Safe fallback if no vehicle exists yet (e.g. testing directly)
  const vehicle = location.state?.vehicle || vehicles[0] || { plate: 'MH 12 AB 1234', displayName: 'HONDA ACTIVA', qrId: 'ROADLINK-123456' };

  // Use real signed QR token from POST /vehicles if available, else fallback
  const qrToken = location.state?.qrToken || vehicle?.qrToken || 'RL-123456-DF';
  const qrPayload = `${window.location.origin}/scan-landing?qr=${qrToken}`;

  const [downloaded, setDownloaded] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [showRegenerateDialog, setShowRegenerateDialog] = useState(false);

  const handleDownload = () => {
    setDownloaded(true);
    setTimeout(() => setDownloaded(false), 2500);
  };

  const handleRegenerate = () => {
    setShowRegenerateDialog(false);
    // Real app would make API call here
    alert('QR Regenerated successfully!');
  };

  useEffect(() => {
    const handleMouseMove = (e) => {
      // Parallax effect matches HTML
      const xAxis = (window.innerWidth / 2 - e.pageX) / 45;
      const yAxis = (window.innerHeight / 2 - e.pageY) / 45;
      setMousePos({ x: xAxis, y: yAxis });
    };
    
    // Only enable on desktop/non-touch
    if (window.matchMedia("(pointer: fine)").matches) {
      window.addEventListener('mousemove', handleMouseMove);
      return () => window.removeEventListener('mousemove', handleMouseMove);
    }
  }, []);

  return (
    <div className="min-h-screen bg-fog flex flex-col relative z-0">
      <AppHeader 
        title={<span className="text-navy font-bold tracking-wide uppercase">VEHICLE IDENTITY</span>}
        onBack={() => navigate(-1)}
        rightSlot={
          <button className="text-on-surface-muted hover:opacity-80 transition-opacity active:scale-95">
            <HelpCircle size={22} />
          </button>
        }
      />

      <main className="flex-grow flex flex-col items-center justify-center px-5 pt-10 pb-16 max-w-md mx-auto w-full">
        {/* Plate Tag Framed QR */}
        <div className="w-full flex flex-col items-center">
          <motion.div 
            className="bg-white border-2 border-asphalt rounded-xl w-full aspect-square flex items-center justify-center relative overflow-hidden group shadow-card"
            style={{ 
              transform: `rotateY(${mousePos.x}deg) rotateX(${mousePos.y}deg)`, 
              perspective: '1000px',
              transformStyle: 'preserve-3d'
            }}
            initial={{ rotateX: 90, opacity: 0 }}
            animate={{ rotateX: 0, opacity: 1 }}
            transition={{ type: 'spring', damping: 18, stiffness: 100 }}
          >
            {/* Subtle internal pattern for depth */}
            <div 
              className="absolute inset-0 opacity-[0.03] pointer-events-none" 
              style={{ backgroundImage: 'radial-gradient(#1A1A1A 1px, transparent 1px)', backgroundSize: '20px 20px' }}
            />
            
            <div className="relative w-full h-full flex items-center justify-center p-6" style={{ transform: 'translateZ(20px)' }}>
              <QRCodeSVG 
                value={qrPayload}
                size={280}
                level="Q"
                className="w-full h-full transition-transform duration-500 group-hover:scale-105"
                fgColor="#1A1A1A"
                bgColor="transparent"
              />
            </div>
          </motion.div>

          {/* Vehicle Display Name */}
          <div className="mt-8 text-center">
            <p className="font-body text-[11px] font-bold tracking-[0.08em] uppercase text-on-surface-muted mb-1.5">REGISTERED VEHICLE</p>
            <h2 className="font-display text-[26px] font-bold text-on-surface uppercase tracking-wide">{vehicle.displayName}</h2>
            <div className="flex items-center justify-center gap-2 mt-1">
              <span className="inline-block w-2 h-2 bg-tertiary-container rounded-full animate-pulse"></span>
              <span className="font-mono text-[14px] tracking-widest text-on-surface-muted font-medium">{vehicle.plate}</span>
            </div>
          </div>
        </div>

        {/* Action Hierarchy */}
        <div className="w-full mt-10 space-y-4 px-2">
          <Button fullWidth onClick={() => navigate('/dashboard')} className="h-[56px]">
            <span className="font-body text-[13px] font-bold tracking-widest uppercase">CONTINUE TO DASHBOARD</span>
          </Button>

          <Button fullWidth onClick={() => navigate('/order-sticker')} className="bg-signal-amber text-on-surface hover:bg-signal-amber/90 border-0 h-[56px]">
            <Truck size={20} /> 
            <span className="font-body text-[13px] font-bold tracking-widest uppercase ml-1">ORDER STICKER</span>
          </Button>

          <Button variant="outline" fullWidth onClick={handleDownload} className="border-2 border-navy text-navy hover:bg-navy/5 h-[56px]">
            {downloaded ? (
              <span className="font-body text-[13px] font-bold tracking-widest uppercase">✓ DOWNLOADED</span>
            ) : (
              <><Download size={18} /> <span className="font-body text-[13px] font-bold tracking-widest uppercase ml-1">DOWNLOAD QR</span></>
            )}
          </Button>

          <button 
            onClick={() => setShowRegenerateDialog(true)}
            className="w-full py-4 text-alert-red font-body text-[13px] font-bold tracking-widest uppercase hover:underline transition-all"
          >
            REGENERATE QR
          </button>
        </div>

        {/* Regenerate Dialog */}
        <AnimatePresence>
          {showRegenerateDialog && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-asphalt/50">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-2xl"
              >
                <h3 className="font-display text-[20px] font-bold text-on-surface mb-2">Regenerate QR?</h3>
                <p className="font-body text-[14px] text-on-surface-muted mb-6">
                  This will immediately invalidate your current QR code. Any existing stickers will stop working. Are you sure?
                </p>
                <div className="flex gap-3">
                  <Button variant="outline" className="flex-1 border-outline-light" onClick={() => setShowRegenerateDialog(false)}>
                    CANCEL
                  </Button>
                  <Button className="flex-1 bg-alert-red hover:bg-alert-red/90" onClick={handleRegenerate}>
                    REGENERATE
                  </Button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* Footer Reassurance */}
        <div className="mt-12 text-center max-w-[260px] mx-auto">
          <p className="font-body text-[14px] text-on-surface-muted leading-relaxed opacity-90 italic">
            "This QR code allows others to notify you without ever seeing your mobile number."
          </p>
        </div>
      </main>
    </div>
  );
}
