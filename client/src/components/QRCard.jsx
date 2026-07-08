import React from 'react';
import RoadLinkQR from './RoadLinkQR';
import { Shield } from 'lucide-react';

export default function QRCard({ vehicle }) {
  if (!vehicle) return null;
  const qrUrl = `${window.location.origin}/scan-landing?qr=${vehicle.qrToken}`;

  return (
    <div className="w-[85.6mm] h-[53.98mm] bg-white rounded-xl shadow-lg border border-outline flex flex-row overflow-hidden relative" style={{ width: '85.6mm', height: '53.98mm' }}>
      
      {/* Decorative gradient strip */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-navy via-[#6C4CF5] to-navy" />
      
      {/* Left section: Info */}
      <div className="flex-1 flex flex-col justify-between p-4 pl-5">
        <div>
          <div className="flex items-center gap-1.5 mb-3">
            <img src="/assets/roadlink-logo-qr.png" alt="RoadLink" className="w-5 h-5 object-contain" />
            <span className="font-display font-bold text-navy text-sm tracking-wide">RoadLINK</span>
          </div>
          
          <h2 className="font-display font-bold text-navy text-lg leading-tight uppercase">
            {vehicle.displayName || 'VEHICLE'}
          </h2>
          <p className="font-mono text-[10px] tracking-widest text-on-surface-muted mt-1 bg-surface-low px-2 py-0.5 rounded inline-block">
            {vehicle.plate}
          </p>
        </div>
        
        <div className="flex items-center gap-1.5 text-on-surface-muted">
          <Shield size={12} className="text-[#6C4CF5]" />
          <span className="font-body text-[8px] uppercase tracking-wider font-semibold">Protected Vehicle</span>
        </div>
      </div>
      
      {/* Right section: QR Code */}
      <div className="w-[45%] bg-fog/30 border-l border-outline/30 flex flex-col items-center justify-center p-3 relative">
        <div className="bg-white p-1.5 rounded-lg shadow-sm border border-outline/20">
          <RoadLinkQR url={qrUrl} size={90} />
        </div>
        <p className="font-body text-[8px] font-bold text-navy mt-2 text-center uppercase tracking-wider">
          Scan to report
        </p>
      </div>
    </div>
  );
}
