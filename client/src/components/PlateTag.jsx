import React from 'react';
import { CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '../lib/cn';

const sizeConfig = {
  sm:   { plate: 'px-3 py-1.5 rounded',    number: 'text-sm tracking-widest', ind: 'text-[8px]',  rivet: 'w-1.5 h-1.5', check: 14 },
  md:   { plate: 'px-4 py-2.5 rounded-md', number: 'text-base tracking-widest', ind: 'text-[9px]', rivet: 'w-2 h-2',   check: 16 },
  lg:   { plate: 'px-5 py-3.5 rounded-lg', number: 'text-xl tracking-widest',  ind: 'text-[10px]', rivet: 'w-2 h-2',   check: 20 },
  hero: { plate: 'px-6 py-4 rounded-xl',   number: 'text-2xl tracking-widest', ind: 'text-[11px]', rivet: 'w-2.5 h-2.5', check: 24 },
};

export default function PlateTag({
  plateNumber,
  displayName,
  isVerified = false,
  size = 'md',
  variant = 'default',   // default | alert
  animate: animateEntry = false,
  className = '',
}) {
  const text = plateNumber || displayName || 'MH 00 AA 0000';
  const s = sizeConfig[size] || sizeConfig.md;

  const inner = (
    <div
      className={cn(
        'inline-flex flex-col bg-plate-white shadow-plate',
        'border-2 border-asphalt',
        s.plate,
        variant === 'alert' && 'border-alert-red',
        className,
      )}
    >
      {/* Plate header row */}
      <div className="flex items-center justify-between mb-1">
        <span className={cn('font-mono font-medium text-on-surface-muted uppercase tracking-widest', s.ind)}>
          IND
        </span>
        <div className={cn('rounded-full bg-outline-light', s.rivet)} />
      </div>

      {/* Plate number + verified badge */}
      <div className="flex items-center gap-2">
        <span className={cn('font-mono font-medium text-asphalt leading-none', s.number)}>
          {text}
        </span>
        {isVerified && (
          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', damping: 12, stiffness: 200, delay: 0.2 }}
            className="text-verified-green flex-shrink-0"
          >
            <CheckCircle size={s.check} strokeWidth={2.5} />
          </motion.span>
        )}
      </div>

      {/* Verified label */}
      {isVerified && (
        <span className="mt-1 font-body text-[10px] font-bold uppercase tracking-widest text-verified-green">
          Vehicle Verified
        </span>
      )}
    </div>
  );

  if (animateEntry) {
    return (
      <motion.div
        initial={{ rotateX: 90, opacity: 0 }}
        animate={{ rotateX: 0, opacity: 1 }}
        transition={{ type: 'spring', damping: 18, stiffness: 120 }}
        style={{ perspective: 800 }}
      >
        {inner}
      </motion.div>
    );
  }

  return inner;
}
