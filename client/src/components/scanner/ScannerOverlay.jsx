import React from 'react';
import { motion } from 'framer-motion';

export default function ScannerOverlay({ scanned, errorFlash }) {
  return (
    <div className="absolute inset-0 z-10 flex flex-col pointer-events-none">
      {/* Top dark area */}
      <div className="flex-1 bg-black/60 backdrop-blur-[2px]" />

      {/* Center cutout area */}
      <div className="flex justify-center w-full">
        <div className="flex-1 bg-black/60 backdrop-blur-[2px]" />
        
        {/* The Clear Cutout */}
        <div className="relative w-[70vw] max-w-[320px] aspect-square">
          {/* 4 Corner Brackets */}
          <motion.div
            className={`absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 rounded-tl-2xl shadow-lg ${errorFlash ? 'border-alert-red' : 'border-[#1E8E5A]'}`}
          />
          <motion.div
            className={`absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 rounded-tr-2xl shadow-lg ${errorFlash ? 'border-alert-red' : 'border-[#1E8E5A]'}`}
          />
          <motion.div
            className={`absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 rounded-bl-2xl shadow-lg ${errorFlash ? 'border-alert-red' : 'border-[#1E8E5A]'}`}
          />
          <motion.div
            className={`absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 rounded-br-2xl shadow-lg ${errorFlash ? 'border-alert-red' : 'border-[#1E8E5A]'}`}
          />

          {/* Scanning Laser Line */}
          {!scanned && (
            <motion.div
              className="absolute left-0 w-full h-1 bg-[#1E8E5A] shadow-[0_0_15px_3px_rgba(30,142,90,0.7)]"
              animate={{ top: ['5%', '95%', '5%'] }}
              transition={{
                duration: 2.5,
                repeat: Infinity,
                ease: 'linear'
              }}
            />
          )}

          {/* Success flash */}
          {scanned && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 1, 0] }}
              transition={{ duration: 0.4 }}
              className="absolute inset-0 bg-white/80 rounded-2xl"
            />
          )}
        </div>
        
        <div className="flex-1 bg-black/60 backdrop-blur-[2px]" />
      </div>

      {/* Bottom dark area */}
      <div className="flex-[1.5] bg-black/60 backdrop-blur-[2px] flex flex-col items-center justify-start pt-8 pb-10">
        <p className="text-white/80 font-body text-sm font-medium text-center px-8 mb-10 drop-shadow-md">
          Point your camera at a QR code to scan it.
        </p>
      </div>
    </div>
  );
}
