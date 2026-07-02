import React, { useState } from 'react';
import { motion } from 'framer-motion';
import styles from './Button.module.css';

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
    setTimeout(() => setRipples(r => r.filter(rp => rp.id !== id)), 600);
    onClick && onClick(e);
  };

  return (
    <motion.button
      type={type}
      className={`${styles.btn} ${styles[variant]} ${fullWidth ? styles.full : ''} ${disabled || isLoading ? styles.disabled : ''} ${className}`}
      whileTap={!disabled && !isLoading ? { scale: 0.97 } : {}}
      onClick={handleClick}
      disabled={disabled || isLoading}
    >
      <span className={styles.content}>
        {isLoading ? (
          <span className={styles.spinner} />
        ) : children}
      </span>
      {ripples.map(r => (
        <span
          key={r.id}
          className={styles.ripple}
          style={{ left: r.x, top: r.y }}
        />
      ))}
    </motion.button>
  );
}
