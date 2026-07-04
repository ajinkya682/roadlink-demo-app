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
        'inline-flex bg-white overflow-hidden shadow-sm items-stretch',
        'border-2 border-[#1c1b1b]/80',
        variant === 'alert' && 'border-alert-red',
        size === 'sm' && 'h-8 rounded',
        size === 'md' && 'h-10 rounded-md',
        size === 'lg' && 'h-12 rounded-lg',
        size === 'hero' && 'h-14 rounded-xl',
        className,
      )}
    >
      {/* Blue IND Strip */}
      <div className={cn(
        'bg-[#003399] flex flex-col items-center justify-between flex-shrink-0 relative py-1',
        size === 'sm' && 'w-5',
        size === 'md' && 'w-6',
        size === 'lg' && 'w-8',
        size === 'hero' && 'w-10'
      )}>
        {/* Ind chakra mock */}
        <div className={cn(
          "rounded-full border border-white/40 flex items-center justify-center mt-0.5",
          size === 'sm' && "w-1.5 h-1.5",
          size === 'md' && "w-2 h-2",
          size === 'lg' && "w-3 h-3",
          size === 'hero' && "w-4 h-4"
        )}>
          <div className="w-[1px] h-[1px] bg-white/60 rounded-full" />
        </div>
        
        <span className={cn(
          'font-mono font-bold text-white tracking-[0.05em]',
          size === 'sm' && 'text-[5px]',
          size === 'md' && 'text-[6px]',
          size === 'lg' && 'text-[8px]',
          size === 'hero' && 'text-[10px]'
        )}>IND</span>
      </div>

      {/* Plate number + verified badge */}
      <div className="flex-1 flex items-center gap-2 px-3 bg-[linear-gradient(to_bottom,#ffffff,#f5f5f5)] relative">
        {/* Rivets */}
        <div className={cn("absolute left-1 top-1 rounded-full bg-black/20", s.rivet)} />
        <div className={cn("absolute right-1 bottom-1 rounded-full bg-black/20", s.rivet)} />

        <span className={cn('font-mono font-bold text-[#1c1b1b] leading-none whitespace-nowrap', s.number)}>
          {text}
        </span>
        {isVerified && (
          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', damping: 12, stiffness: 200, delay: 0.2 }}
            className="text-verified-green flex-shrink-0 ml-1"
          >
            <CheckCircle size={s.check} strokeWidth={2.5} fill="#fff" />
          </motion.span>
        )}
      </div>
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
