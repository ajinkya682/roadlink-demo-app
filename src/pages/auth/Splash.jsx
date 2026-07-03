import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { QrCode, Shield, Bell, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Button from '../../components/Button';

const slides = [
  {
    Icon: QrCode,
    iconBg: '#1B4B8F',
    title: 'One QR. One Identity.',
    sub: 'The secure digital identity for your vehicle, built for the Indian road.',
    visual: (
      <div className="flex flex-col items-center gap-3 py-4">
        <div className="bg-asphalt/5 border-2 border-asphalt rounded-xl p-4">
          <svg width="100" height="100" viewBox="0 0 100 100" fill="none">
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
        <span className="font-mono text-[11px] text-on-surface-muted tracking-wider">ROADLINK-MH14AB1234</span>
      </div>
    ),
  },
  {
    Icon: Shield,
    iconBg: '#1E8E5A',
    title: 'We Never Show Your Number.',
    sub: 'Anyone can reach you through RoadLink. No one can ever see your phone number.',
    visual: (
      <div className="flex flex-col items-center gap-3 py-4">
        <div className="bg-white border-2 border-asphalt rounded-xl px-6 py-4 w-full max-w-[220px]">
          <div className="font-display font-semibold text-on-surface text-lg mb-1">Honda Activa</div>
          <div className="font-body text-sm line-through text-alert-red/60">+91 98765 43210</div>
          <div className="mt-2 inline-flex items-center gap-1.5 bg-verified-green/10 text-verified-green rounded-full px-3 py-1 text-xs font-bold">
            <Shield size={12} /> Number Hidden
          </div>
        </div>
      </div>
    ),
  },
  {
    Icon: Bell,
    iconBg: '#F5A623',
    title: 'Reported the Moment It Matters.',
    sub: 'From wrong parking to a real emergency — the right people know instantly.',
    visual: (
      <div className="flex flex-col gap-2.5 py-2 w-full max-w-[240px]">
        {[
          { type: 'Wrong Parking', time: 'Just now', color: '#F5A623' },
          { type: 'Vehicle Theft', time: '3 min ago', color: '#D93025' },
          { type: 'Resolved', time: '1 hr ago', color: '#1E8E5A' },
        ].map((n, i) => (
          <motion.div
            key={n.type}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.15 + 0.3 }}
            className="flex items-center gap-3 bg-white rounded-xl px-4 py-3 shadow-card"
          >
            <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: n.color }} />
            <div className="flex-1">
              <div className="font-body text-sm font-semibold text-on-surface">{n.type}</div>
              <div className="font-body text-xs text-on-surface-muted">{n.time}</div>
            </div>
          </motion.div>
        ))}
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
  const { Icon } = slide;

  return (
    <div className="min-h-screen bg-fog flex flex-col px-5 pt-safe">
      {/* Skip */}
      {!isLast && (
        <div className="flex justify-end pt-4 pb-2">
          <button
            className="font-body text-sm font-semibold text-navy px-3 py-2 rounded-lg hover:bg-navy/5 transition-colors"
            onClick={() => navigate('/login')}
          >
            Skip
          </button>
        </div>
      )}

      {/* Card */}
      <div className="flex-1 flex flex-col items-center justify-center py-4">
        <div className="w-full">
          <AnimatePresence mode="wait">
            <motion.div
              key={current}
              className="bg-white rounded-2xl border-2 border-asphalt/10 shadow-card overflow-hidden"
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -40 }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            >
              {/* Card header row */}
              <div className="flex items-center justify-between px-5 pt-4 pb-3 border-b border-outline-light/50">
                <span className="font-mono text-xs font-medium text-on-surface-muted tracking-[0.2em] uppercase">IND</span>
                <div
                  className="w-9 h-9 rounded-xl flex items-center justify-center shadow-card"
                  style={{ background: slide.iconBg }}
                >
                  <Icon size={18} color="#fff" />
                </div>
              </div>

              {/* Visual */}
              <div className="flex justify-center items-center px-5 py-3 min-h-[160px]">
                {slide.visual}
              </div>

              {/* Text */}
              <div className="px-5 pb-5 text-center">
                <h2 className="font-display text-headline-sm text-navy mb-2">{slide.title}</h2>
                <p className="font-body text-body-sm text-on-surface-muted">{slide.sub}</p>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Bottom controls */}
      <div className="pb-10 space-y-5">
        {/* Dots */}
        <div className="flex items-center justify-center gap-2">
          {slides.map((_, i) => (
            <motion.div
              key={i}
              className="h-2 rounded-full bg-navy"
              animate={{ width: current === i ? 24 : 8, opacity: current === i ? 1 : 0.25 }}
              transition={{ type: 'spring', damping: 20, stiffness: 200 }}
            />
          ))}
        </div>

        {isLast ? (
          <div className="space-y-3">
            <Button fullWidth onClick={() => navigate('/login')}>Get Started</Button>
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
  );
}
