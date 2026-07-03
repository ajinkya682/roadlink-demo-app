import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '../lib/cn';

export default function AppHeader({ title, rightSlot, onBack, transparent = false }) {
  const navigate = useNavigate();
  const handleBack = onBack || (() => navigate(-1));

  return (
    <motion.header
      className={cn(
        'sticky top-0 z-40 flex items-center justify-between px-4',
        'h-14 min-h-[56px]',
        transparent
          ? 'bg-transparent'
          : 'bg-fog/95 backdrop-blur-md border-b border-outline-light/60',
      )}
    >
      {/* Back button */}
      <motion.button
        className={cn(
          'flex items-center justify-center w-10 h-10 -ml-2 rounded-xl',
          'text-on-surface transition-colors',
          transparent ? 'bg-white/80 backdrop-blur shadow-card' : 'hover:bg-surface-high',
        )}
        onClick={handleBack}
        whileTap={{ scale: 0.88 }}
      >
        <ChevronLeft size={22} strokeWidth={2.5} />
      </motion.button>

      {/* Title */}
      {title && (
        <h1 className="flex-1 text-center font-display text-headline-sm text-on-surface">
          {title}
        </h1>
      )}

      {/* Right slot */}
      <div className="flex items-center justify-end w-10">
        {rightSlot ? (
          <span className="flex items-center justify-center text-on-surface-muted">
            {rightSlot}
          </span>
        ) : null}
      </div>
    </motion.header>
  );
}
