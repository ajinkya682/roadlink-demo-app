import React from 'react';
import RoadLinkQR from './RoadLinkQR';
import { ShieldAlert } from 'lucide-react';
import roadlinkLogo from '../assets/roadlink-logo-qr.png';

export default function QRSticker({ vehicle }) {
  if (!vehicle) return null;
  const qrUrl = `${window.location.origin}/scan-landing?qr=${vehicle.qrToken}`;

  return (
    <div className="w-[60mm] h-[60mm] bg-navy rounded-[15mm] shadow-xl border-4 border-[#6C4CF5] flex flex-col items-center justify-center p-3 relative overflow-hidden text-white" style={{ width: '60mm', height: '60mm' }}>
      
      {/* Decorative top pattern */}
      <div className="absolute top-0 w-full h-8 bg-[#6C4CF5]/20 flex items-center justify-center">
        <span className="font-display font-bold text-[8px] tracking-[0.2em] uppercase opacity-70">
          SECURE VEHICLE IDENTIFICATION
        </span>
      </div>
      
      {/* Brand */}
      <div className="flex items-center gap-1.5 mt-4 mb-2 z-10">
        <img src={roadlinkLogo} alt="RoadLink" className="w-6 h-6 object-contain drop-shadow-md" />
        <span className="font-display font-bold text-lg tracking-wide text-white drop-shadow-md">RoadLINK</span>
      </div>
      
      {/* QR Code container */}
      <div className="bg-white p-2 rounded-xl shadow-inner z-10">
        <RoadLinkQR url={qrUrl} size={100} />
      </div>
      
      {/* Actions */}
      <div className="mt-3 flex flex-col items-center z-10">
        <h3 className="font-display font-extrabold text-[15px] tracking-widest text-[#6C4CF5] uppercase">
          SCAN TO REPORT
        </h3>
        <div className="flex items-center gap-1 mt-0.5">
          <ShieldAlert size={10} className="text-white/70" />
          <span className="font-body text-[9px] text-white/90">Help protect this vehicle</span>
        </div>
      </div>
    </div>
  );
}
