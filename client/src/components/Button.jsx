import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { cn } from '../lib/cn';

export default function Button({
  children,
  variant = 'primary',
  fullWidth = false,
  onClick,
  disabled = false,
  isLoading = false,
  className = '',
  type = 'button',
}) {
  const [ripples, setRipples] = useState([]);

  const handleClick = (e) => {
    if (disabled || isLoading) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const id = Date.now();
    setRipples(r => [...r, { x, y, id }]);
    setTimeout(() => setRipples(r => r.filter(rp => rp.id !== id)), 700);
    onClick && onClick(e);
  };

  const base = cn(
    'relative overflow-hidden inline-flex items-center justify-center gap-2',
    'font-body font-semibold text-body-md rounded-lg',
    'min-h-[52px] px-6 select-none transition-opacity duration-150',
    'focus-visible:outline-2 focus-visible:outline-navy focus-visible:outline-offset-2',
    fullWidth && 'w-full',
    (disabled || isLoading) && 'opacity-50 cursor-not-allowed',
  );

  const variants = {
    primary: 'bg-navy text-white shadow-float',
    secondary: 'bg-signal-amber text-asphalt shadow-float',
    outline: 'bg-transparent text-navy border-2 border-navy',
    alert: 'bg-alert-red text-white shadow-float',
    ghost: 'bg-transparent text-on-surface-muted',
    destructive: 'bg-transparent text-alert-red border-2 border-alert-red',
  };

  return (
    <motion.button
      type={type}
      className={cn(base, variants[variant], className)}
      whileTap={!disabled && !isLoading ? { scale: 0.97 } : {}}
      onClick={handleClick}
      disabled={disabled || isLoading}
    >
      <span className="relative z-10 flex items-center gap-2">
        {isLoading ? (
          <span className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
        ) : children}
      </span>

      {ripples.map(r => (
        <span
          key={r.id}
          className="ripple-element"
          style={{ left: r.x, top: r.y }}
        />
      ))}
    </motion.button>
  );
}
