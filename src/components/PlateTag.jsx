import React from 'react';
import { CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';

export default function PlateTag({ 
  plateNumber, 
  displayName, 
  isVerified = false, 
  className = '', 
  animate = false 
}) {
  const containerStyle = {
    backgroundColor: 'var(--plate-white)',
    border: '2px solid var(--asphalt)',
    borderRadius: 'var(--radius-md)',
    padding: '12px 16px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column',
    gap: '4px',
    minHeight: '64px',
    position: 'relative'
  };

  const headerStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    width: '100%',
    paddingBottom: '4px',
    borderBottom: '1px solid rgba(26, 26, 26, 0.1)',
    marginBottom: '4px'
  };

  const content = (
    <div style={containerStyle} className={className}>
      {/* Optional IND Header for full plates */}
      {plateNumber && (
        <div style={headerStyle}>
          <span style={{ fontSize: '10px', fontWeight: 'bold', color: 'var(--outline)' }}>IND</span>
          {/* A small dot to represent a rivet or car icon could go here */}
          <div style={{ width: '4px', height: '4px', borderRadius: '50%', backgroundColor: 'var(--outline)' }} />
        </div>
      )}
      
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <span className="text-data-mono" style={{ color: 'var(--asphalt)', fontSize: plateNumber ? '20px' : '16px' }}>
          {plateNumber || displayName}
        </span>
        {isVerified && (
          <CheckCircle size={18} color="var(--verified-green)" style={{ flexShrink: 0 }} />
        )}
      </div>
    </div>
  );

  if (animate) {
    return (
      <motion.div
        initial={{ rotateX: 90, opacity: 0 }}
        animate={{ rotateX: 0, opacity: 1 }}
        transition={{ type: 'spring', damping: 20, stiffness: 100 }}
        style={{ perspective: 1000 }}
      >
        {content}
      </motion.div>
    );
  }

  return content;
}
