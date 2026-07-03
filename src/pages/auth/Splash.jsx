import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { QrCode, ArrowRight, Ban, XCircle, Unlock, AlertTriangle, Car, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Button from '../../components/Button';

const slides = [
  {
    title: 'One QR. One identity.',
    sub: 'The digital identity for your vehicle, built for the Indian road.',
    visual: (
      <div className="flex flex-col items-center justify-center w-full min-h-[260px]">
        <motion.div 
          className="transform -rotate-2 hover:rotate-0 transition-transform duration-500"
        >
          <div className="bg-white border-2 border-navy p-4 rounded-xl shadow-card flex flex-col items-center w-[250px]">
            <div className="flex items-center justify-between w-full mb-3 border-b border-outline-light pb-2">
              <span className="font-body text-xs font-bold tracking-widest text-on-surface-muted">IND</span>
              <Car size={20} className="text-navy" />
            </div>
            <div className="font-mono text-3xl tracking-widest text-on-surface py-2">
              DL 01 AA 1234
            </div>
            <div className="mt-4 bg-white p-2 border border-outline-light rounded-lg">
              <svg width="80" height="80" viewBox="0 0 100 100" fill="none">
                <rect x="5" y="5" width="40" height="40" rx="6" fill="#1A1A1A" />
                <rect x="13" y="13" width="24" height="24" rx="3" fill="#F7F8FA" />
                <rect x="19" y="19" width="12" height="12" fill="#1A1A1A" />
                <rect x="55" y="5" width="40" height="40" rx="6" fill="#1A1A1A" />
                <rect x="63" y="13" width="24" height="24" rx="3" fill="#F7F8FA" />
                <rect x="69" y="19" width="12" height="12" fill="#1A1A1A" />
                <rect x="5" y="55" width="40" height="40" rx="6" fill="#1A1A1A" />
                <rect x="13" y="63" width="24" height="24" rx="3" fill="#F7F8FA" />
                <rect x="19" y="69" width="12" height="12" fill="#1A1A1A" />
                <rect x="55" y="55" width="12" height="12" fill="#1A1A1A" rx="2" />
                <rect x="73" y="55" width="12" height="12" fill="#1A1A1A" rx="2" />
                <rect x="55" y="73" width="12" height="12" fill="#1A1A1A" rx="2" />
                <rect x="73" y="73" width="22" height="12" fill="#1A1A1A" rx="2" />
              </svg>
            </div>
          </div>
        </motion.div>
      </div>
    ),
  },
  {
    title: 'We never show your number',
    sub: 'Report incidents and receive alerts without ever exposing your private contact details.',
    visual: (
      <div className="flex flex-col items-center justify-center w-full min-h-[260px]">
        <div className="flex items-center gap-4 w-full justify-center">
          {/* Old way */}
          <div className="relative bg-surface-high w-32 h-44 rounded-lg overflow-hidden border border-outline-light flex items-center justify-center grayscale opacity-70">
            <div className="absolute inset-0 flex flex-col justify-evenly opacity-30 px-3">
               <div className="h-1 bg-asphalt rounded w-full"></div>
               <div className="h-1 bg-asphalt rounded w-3/4"></div>
               <div className="h-1 bg-asphalt rounded w-5/6"></div>
               <div className="h-1 bg-asphalt rounded w-1/2"></div>
            </div>
            <XCircle size={52} className="text-alert-red z-10 opacity-90" strokeWidth={2.5} />
          </div>
          {/* Arrow */}
          <ArrowRight size={24} className="text-outline-light flex-shrink-0" />
          {/* New way */}
          <div className="bg-white w-32 h-44 rounded-lg border-2 border-navy shadow-card flex flex-col items-center justify-center p-3">
            <div className="w-full aspect-square bg-white border border-outline-light rounded flex items-center justify-center mb-3 shadow-sm">
              <QrCode size={36} className="text-navy" strokeWidth={1.5} />
            </div>
            <div className="w-full h-2 bg-navy/15 rounded-full mb-1.5"></div>
            <div className="w-2/3 h-2 bg-outline-light/60 rounded-full"></div>
          </div>
        </div>
      </div>
    ),
  },
  {
    title: 'Reported the moment it matters',
    sub: 'Instant alerts that reach the right person, right when they need to know.',
    visual: (
      <div className="flex flex-col items-center justify-center w-full min-h-[260px]">
        <div className="grid grid-cols-2 gap-3 w-full max-w-[280px]">
          {[
            { icon: Ban, label: 'Wrong Parking', color: 'text-signal-amber' },
            { icon: XCircle, label: 'Obstruction', color: 'text-signal-amber' },
            { icon: Unlock, label: 'Theft', color: 'text-alert-red' },
            { icon: AlertTriangle, label: 'Emergency', color: 'text-navy' },
          ].map((item, i) => (
            <div key={i} className="bg-white p-4 border border-outline-light rounded-xl flex flex-col items-center text-center gap-2.5 transition-all hover:border-navy shadow-sm">
              <item.icon size={32} className={item.color} />
              <span className="font-body text-[11px] font-bold uppercase tracking-wider text-on-surface leading-tight">{item.label}</span>
            </div>
          ))}
        </div>
      </div>
    ),
  },
];

export default function Splash() {
  const navigate = useNavigate();
  const [current, setCurrent] = useState(0);

  const next = () => { if (current < slides.length - 1) setCurrent(c => c + 1); };
  const isLast = current === slides.length - 1;
  const slide = slides[current];

  return (
    <div className="min-h-screen bg-fog flex flex-col relative overflow-hidden">
      {/* Header */}
      <header className="flex justify-end items-center h-16 w-full px-5 absolute top-0 z-50">
        {!isLast && (
          <button
            className="font-display text-headline-sm font-semibold text-navy hover:opacity-80 transition-opacity active:scale-95"
            onClick={() => navigate('/login')}
          >
            Skip
          </button>
        )}
      </header>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col items-center justify-center w-full pt-16 pb-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={current}
            className="w-full flex flex-col items-center text-center px-6 max-w-md"
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -40 }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          >
            {/* Visual Graphic */}
            <div className="w-full mb-8">
              {slide.visual}
            </div>

            {/* Text Content */}
            <h1 className="font-display text-[26px] leading-tight md:text-headline-lg font-semibold text-navy mb-3 tracking-tight">
              {slide.title}
            </h1>
            <p className="font-body text-[15px] leading-relaxed text-on-surface-muted max-w-[280px] mx-auto">
              {slide.sub}
            </p>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Bottom controls */}
      <div className="pb-10 pt-4 w-full px-5 max-w-md mx-auto space-y-6 relative z-50 mb-safe">
        {/* Dots */}
        <div className="flex items-center justify-center gap-3">
          {slides.map((_, i) => (
            <motion.div
              key={i}
              className="h-2.5 rounded-full bg-navy"
              animate={{ 
                width: current === i ? 10 : 10, 
                opacity: current === i ? 1 : 0.25,
                scale: current === i ? 1.25 : 1 
              }}
              transition={{ type: 'spring', damping: 20, stiffness: 300 }}
            />
          ))}
        </div>

        {/* Buttons */}
        <div>
          {isLast ? (
            <div className="space-y-3">
              <Button variant="secondary" fullWidth onClick={() => navigate('/login')}>
                Get Started <ArrowRight size={18} />
              </Button>
              <Button variant="outline" fullWidth onClick={() => navigate('/guest-dashboard')}>
                Continue as Guest
              </Button>
            </div>
          ) : (
            <Button fullWidth onClick={next}>
              Next <ChevronRight size={18} />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
