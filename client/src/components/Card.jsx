import React from 'react';
import { motion } from 'framer-motion';

export default function Card({ children, className = '', onClick }) {
  const style = {
    backgroundColor: 'var(--surface-container-lowest)',
    border: '1px solid rgba(26, 26, 26, 0.1)',
    borderRadius: 'var(--radius-lg)',
    padding: '16px',
    width: '100%',
    cursor: onClick ? 'pointer' : 'default'
  };

  if (onClick) {
    return (
      <motion.div 
        whileTap={{ scale: 0.98 }}
        style={style} 
        className={className} 
        onClick={onClick}
      >
        {children}
      </motion.div>
    );
  }

  return (
    <div style={style} className={className}>
      {children}
    </div>
  );
}
