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

  const handleDownload = () => {
    const svgElement = document.getElementById('vehicle-qr-svg');
    if (!svgElement) return;

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();

    const xml = new XMLSerializer().serializeToString(svgElement);
    const svg64 = btoa(unescape(encodeURIComponent(xml)));
    const image64 = 'data:image/svg+xml;base64,' + svg64;

    img.onload = () => {
      const padding = 40;
      canvas.width = img.width + (padding * 2);
      canvas.height = img.height + (padding * 2);
      
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, padding, padding);

      const pngUrl = canvas.toDataURL('image/png');
      const downloadLink = document.createElement('a');
      downloadLink.href = pngUrl;
      downloadLink.download = `RoadLink-QR-${vehicle.plate.replace(/\s/g, '')}.png`;
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);

      setDownloaded(true);
      setTimeout(() => setDownloaded(false), 2500);
    };

    img.src = image64;
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
                id="vehicle-qr-svg"
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
    </div>
  );
}
