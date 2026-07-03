import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Download, Truck, HelpCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import AppHeader from '../../components/AppHeader';
import Button from '../../components/Button';
import { useDemoData } from '../../context/DemoContext';

export default function QRDetail() {
  const navigate = useNavigate();
  const { vehicles } = useDemoData();
  const vehicle = vehicles[0] || { plate: 'MH 12 AB 1234', displayName: 'HONDA ACTIVA', qrId: 'ROADLINK-123456' };

  const [downloaded, setDownloaded] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  const handleDownload = () => {
    setDownloaded(true);
    setTimeout(() => setDownloaded(false), 2500);
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
              <img 
                className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-105" 
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuBXznFWQRigemE8PLC-jdYOTe-GVyO_RPVcSVIUJzu5iU7RdIWJEAtqyCTQy9qK-xy5f18Ls0PrqSF5LiZ7nCCzAptWlXLz0rw9yXXe8zmtf7_XirICIvEdYwnFX010JEGks8NcBuq6Va7uvLmIU4_X8CkXDqAvrc7jnA82uhKEaFqzpS2Sj4H2SLdgL1QYYYBBh7YF0EYV-WbWIT0chx5DlEKkBsPc0pKw04bjPLtRPVAQq-WTh-tzVSTiP0YM-v5wn5aeQPcjZQ" 
                alt="Vehicle QR Code" 
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
          <Button variant="secondary" fullWidth onClick={() => navigate('/order-sticker')} className="bg-[#FFAB30] text-[#001B3F] hover:bg-[#FFAB30]/90 border-0 h-[56px]">
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
