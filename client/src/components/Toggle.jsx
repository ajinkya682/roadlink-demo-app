import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '../lib/cn';

/**
 * Reusable animated toggle switch.
 * Tailwind classes for static, framer-motion for thumb animation.
 */
export default function Toggle({ on = false, onChange, disabled = false, id }) {
  return (
    <button
      id={id}
      role="switch"
      aria-checked={on}
      disabled={disabled}
      onClick={() => !disabled && onChange && onChange(!on)}
      className={cn(
        'relative inline-flex items-center w-12 h-7 rounded-full',
        'border-2 transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-navy focus-visible:outline-offset-2',
        on
          ? 'bg-navy border-navy'
          : 'bg-surface-high border-outline-light',
        disabled && 'opacity-50 cursor-not-allowed',
      )}
    >
      <motion.span
        className={cn(
          'absolute w-5 h-5 rounded-full shadow-card',
          on ? 'bg-white' : 'bg-white',
        )}
        animate={{ x: on ? 20 : 2 }}
        transition={{ type: 'spring', damping: 20, stiffness: 300 }}
      />
    </button>
  );
}
