import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Shield } from 'lucide-react';
import { reportCategories } from '../../demo-data/categories';
import { scannedVehicle } from '../../demo-data/scannedVehicle';

const containerVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.04, delayChildren: 0.1 } },
};
const itemVariants = {
  hidden: { opacity: 0, y: 16, scale: 0.95 },
  show: { opacity: 1, y: 0, scale: 1, transition: { type: 'spring', damping: 20, stiffness: 200 } },
};

export default function ScanLanding() {
  const navigate = useNavigate();

  const handleCategory = (cat) => {
    navigate('/report-detail', { state: { category: cat } });
  };

  return (
    <div className="bg-[#F7F8FA] text-[#1c1b1b] font-body min-h-screen flex flex-col">
      <main className="flex-grow container mx-auto px-4 md:px-10 py-8 max-w-2xl">
        <header className="flex flex-col items-center justify-center gap-4 mb-10 mt-4">
          <div className="flex items-center gap-3">
            <div className="bg-white rounded-lg px-4 py-2 flex items-center justify-center border-2 border-[#1A1A1A] shadow-[2px_2px_0px_0px_rgba(26,26,26,0.1)]">
              <span className="font-mono text-[14px] text-[#1c1b1b] font-medium tracking-widest uppercase">
                {scannedVehicle.displayName}
              </span>
            </div>
            {scannedVehicle.isVerified && (
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#1E8E5A]/10 text-[#1E8E5A] border border-[#1E8E5A]/20">
                <span className="material-symbols-outlined text-[16px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                  verified
                </span>
                <span className="font-body text-[12px] font-bold tracking-widest uppercase">VERIFIED</span>
              </div>
            )}
          </div>
          <h1 className="font-display text-[20px] font-semibold text-[#1c1b1b] text-center opacity-80">
            Report an issue with this vehicle
          </h1>
        </header>

        <motion.section
          className="grid grid-cols-2 gap-4"
          variants={containerVariants}
          initial="hidden"
          animate="show"
        >
          {reportCategories.map((cat) => {
            const isRedAlert = cat.isAlert;
            const isFullWidth = cat.fullWidth;
            
            return (
              <motion.button
                key={cat.id}
                variants={itemVariants}
                whileTap={{ scale: 0.96 }}
                onClick={() => handleCategory(cat)}
                className={`
                  flex flex-col items-center justify-center gap-3 p-6 rounded-xl transition-colors min-h-[110px]
                  ${isFullWidth ? 'col-span-2 flex-row' : ''}
                  ${isRedAlert 
                    ? 'bg-white border-2 border-[#ba1a1a]/60 shadow-sm hover:bg-[#ba1a1a]/5' 
                    : 'bg-white border border-[#1c1b1b]/10 hover:border-[#003470]/30'
                  }
                `}
              >
                <span
                  className={`material-symbols-outlined ${isRedAlert ? 'text-[#ba1a1a]' : 'text-[#003470]'}`}
                  style={isRedAlert ? { fontVariationSettings: "'FILL' 1" } : {}}
                >
                  {cat.icon}
                </span>
                <span
                  className={`font-body text-[12px] font-bold tracking-widest uppercase text-center ${
                    isRedAlert ? 'text-[#ba1a1a]' : 'text-[#1c1b1b]'
                  }`}
                >
                  {cat.label}
                </span>
              </motion.button>
            );
          })}
        </motion.section>

        <div className="mt-12 flex justify-center">
          <div className="bg-[#003470]/5 rounded-2xl p-6 border border-[#003470]/10 flex items-start gap-4 max-w-sm">
            <span className="material-symbols-outlined text-[#003470] mt-1">info</span>
            <div className="flex flex-col">
              <p className="font-body text-[14px] text-[#1c1b1b]/70 leading-relaxed">
                Selecting an option will immediately notify the vehicle owner via a privacy-protected link. Do not use this service for harassment.
              </p>
            </div>
          </div>
        </div>
      </main>

      <footer className="w-full py-8 px-4 text-center flex flex-col items-center gap-4 border-t border-[#1c1b1b]/5 mt-4">
        <p className="font-body text-[14px] text-[#434751]">This page never shows the owner's phone number.</p>
        <div className="flex items-center gap-2">
          <span className="font-display text-[18px] tracking-tight text-[#003470] font-bold">RoadLink</span>
          <span className="font-mono text-[10px] bg-[#1c1b1b]/5 px-2 py-0.5 rounded text-[#1c1b1b]/60">v2.4.0</span>
        </div>
      </footer>
    </div>
  );
}
