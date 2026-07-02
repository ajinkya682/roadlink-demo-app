import React from 'react';

export default function StatusPill({ status, label, className = '' }) {
  let bgColor, textColor;

  switch (status) {
    case 'success':
    case 'verified':
      bgColor = 'rgba(30, 142, 90, 0.1)'; // Verified Green 10%
      textColor = 'var(--verified-green)';
      break;
    case 'error':
    case 'alert':
    case 'emergency':
      bgColor = 'rgba(217, 48, 37, 0.1)'; // Alert Red 10%
      textColor = 'var(--alert-red)';
      break;
    case 'warning':
    case 'pending':
      bgColor = 'rgba(245, 166, 35, 0.1)'; // Signal Amber 10%
      textColor = '#B27600'; // Darker amber for contrast
      break;
    default:
      bgColor = 'rgba(26, 26, 26, 0.05)';
      textColor = 'var(--on-surface-variant)';
      break;
  }

  const style = {
    backgroundColor: bgColor,
    color: textColor,
    padding: '4px 12px',
    borderRadius: 'var(--radius-full)',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    whiteSpace: 'nowrap'
  };

  return (
    <span style={style} className={`text-label-caps ${className}`}>
      {label}
    </span>
  );
}
