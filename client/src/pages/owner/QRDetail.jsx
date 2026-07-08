import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Download, Truck, HelpCircle, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import AppHeader from '../../components/AppHeader';
import Button from '../../components/Button';
import { useAppData } from '../../context/AppContext';

import RoadLinkQR, { downloadRoadLinkQR } from '../../components/RoadLinkQR';

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
  const [showClaimModal, setShowClaimModal] = useState(false);

  useEffect(() => {
    if (vehicle) {
      const vId = vehicle._id || vehicle.id;
      if (!vId) {
         // Mock vehicle case
         if (!vehicle.hasUsedFreeStickerOrder) {
           const timer = setTimeout(() => setShowClaimModal(true), 800);
           return () => clearTimeout(timer);
         }
         return;
      }

      // Check live database to be absolutely sure they haven't used it
      import('../../lib/api').then(({ default: api }) => {
        api.get(`/vehicles/${vId}`)
          .then(res => {
            if (res.data.success) {
              if (!res.data.data.vehicle.hasUsedFreeStickerOrder) {
                setTimeout(() => setShowClaimModal(true), 800);
              }
            }
          })
          .catch(console.error);
      });
    }
  }, [vehicle]);

  const handleDownload = async () => {
    try {
      const url = `${window.location.origin}/scan-landing?qr=${vehicle.qrToken}`;
      const filename = `RoadLink-QR-${vehicle.plate.replace(/\s/g, '')}`;
      await downloadRoadLinkQR(url, filename, "png", 1024);
      setDownloaded(true);
      setTimeout(() => setDownloaded(false), 2500);
    } catch (err) {
      console.error("Failed to download QR code", err);
    }
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
            
            <div className="relative w-full h-full flex items-center justify-center p-2 sm:p-4" style={{ transform: 'translateZ(20px)' }}>
              <div className="w-full h-full transition-transform duration-500 group-hover:scale-105 pointer-events-none">
                <RoadLinkQR url={qrPayload} size={800} />
              </div>
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

          <Button fullWidth onClick={() => navigate('/order-sticker', { state: { vehicle } })} className="bg-signal-amber text-on-surface hover:bg-signal-amber/90 border-0 h-[56px]">
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
        </div>

        {/* Footer Reassurance */}
        <div className="mt-12 text-center max-w-[260px] mx-auto">
          <p className="font-body text-[14px] text-on-surface-muted leading-relaxed opacity-90 italic">
            "This QR code allows others to notify you without ever seeing your mobile number."
          </p>
        </div>
      </main>

      {/* Free Sticker Claim Modal */}
      <AnimatePresence>
        {showClaimModal && (
          <motion.div 
            className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm p-4 sm:p-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div 
              className="w-full max-w-sm bg-white rounded-3xl overflow-hidden shadow-2xl relative"
              initial={{ y: "100%", opacity: 0, scale: 0.95 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              exit={{ y: "100%", opacity: 0, scale: 0.95 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
            >
              <button 
                onClick={() => setShowClaimModal(false)}
                className="absolute top-4 right-4 z-10 bg-black/10 hover:bg-black/20 p-2 rounded-full transition-colors text-white"
              >
                <X size={20} />
              </button>

              {/* Premium Gradient Background */}
              <div className="bg-gradient-to-br from-amber-400 via-orange-500 to-rose-500 p-8 text-center relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-full opacity-20" style={{ backgroundImage: 'radial-gradient(circle at top right, #fff, transparent)' }}></div>
                
                <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg border border-white/30">
                  <Truck size={32} className="text-white" />
                </div>
                
                <h2 className="font-display text-3xl font-bold text-white tracking-tight mb-2 leading-tight">
                  Claim your <br/><span className="text-amber-100 font-extrabold italic">FREE</span> stickers
                </h2>
                <p className="font-body text-sm text-white/90 font-medium">
                  Your protection plan includes a complimentary set of premium reflective stickers.
                </p>
              </div>

              <div className="p-6 bg-white">
                <Button 
                  fullWidth 
                  onClick={() => {
                    setShowClaimModal(false);
                    navigate('/order-sticker', { state: { vehicle } });
                  }}
                  className="bg-navy hover:bg-navy/90 text-white h-[56px] text-[15px] font-bold tracking-widest uppercase shadow-xl shadow-navy/20"
                >
                  Claim Now
                </Button>
                <button 
                  onClick={() => setShowClaimModal(false)}
                  className="w-full mt-4 py-2 text-sm font-bold tracking-wider text-slate-400 hover:text-slate-600 uppercase"
                >
                  Maybe Later
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
