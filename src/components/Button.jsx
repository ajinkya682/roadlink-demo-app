import React from 'react';
import { motion } from 'framer-motion';

export default function Button({ 
  children, 
  variant = 'primary', // primary, secondary, alert, outline
  fullWidth = false,
  onClick,
  disabled = false,
  className = '',
  type = 'button'
}) {
  let bgColor, textColor, border;

  switch (variant) {
    case 'secondary':
      bgColor = 'var(--signal-amber)';
      textColor = 'var(--asphalt)';
      border = 'none';
      break;
    case 'alert':
      bgColor = 'var(--alert-red)';
      textColor = 'var(--on-error)';
      border = 'none';
      break;
    case 'outline':
      bgColor = 'transparent';
      textColor = 'var(--primary)';
      border = '1px solid var(--primary)';
      break;
    case 'primary':
    default:
      bgColor = 'var(--primary-container)';
      textColor = 'var(--on-primary)';
      border = 'none';
      break;
  }

  const baseStyle = {
    backgroundColor: bgColor,
    color: textColor,
    border: border,
    borderRadius: 'var(--radius-lg)',
    padding: '14px 24px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    width: fullWidth ? '100%' : 'auto',
    cursor: disabled ? 'not-allowed' : 'pointer',
    opacity: disabled ? 0.6 : 1,
    transition: 'background-color 0.2s ease',
    boxShadow: variant === 'primary' && !disabled ? '0px 4px 12px rgba(26, 26, 26, 0.1)' : 'none'
  };

  return (
    <motion.button
      type={type}
      whileTap={disabled ? {} : { scale: 0.98 }}
      style={baseStyle}
      onClick={onClick}
      disabled={disabled}
      className={`text-body-lg ${className}`}
    >
      {children}
    </motion.button>
  );
}
