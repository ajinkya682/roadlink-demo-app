import React from 'react';
import { motion } from 'framer-motion';
import { FileText, Car, Cloud, User, CheckCircle, AlertTriangle, AlertCircle, RefreshCw } from 'lucide-react';
import VehicleIcon from './VehicleIcon';

const fadeUp = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0, transition: { type: 'spring', damping: 20, stiffness: 200 } } };

export default function DocCard({ doc, vehicles, onClick }) {
  const docType = doc.type || '';
  const vehicle = vehicles.find(v => v.id === doc.vehicleId) || vehicles[0];
  const isRC = docType.toLowerCase().includes('rc') || docType.toLowerCase().includes('registration');
  const isIns = docType.toLowerCase().includes('insur');
  const isPUC = docType.toLowerCase().includes('puc') || docType.toLowerCase().includes('pollution');
  const isLicense = docType.toLowerCase().includes('licen');

  let Icon = FileText;
  let subtitle = 'Uploaded Document';
  
  if (isRC) { subtitle = 'Vehicle Identification Document'; }
  else if (isIns) { Icon = FileText; subtitle = doc.number ? `Policy #${doc.number}` : 'Vehicle Insurance Policy'; }
  else if (isPUC) { Icon = Cloud; subtitle = 'Emission Compliance Certificate'; }
  else if (isLicense) { Icon = User; subtitle = 'Driver Identification'; }

  // Use status to determine tags
  let tagBg = 'bg-verified-green/15';
  let tagText = 'text-verified-green';
  let TagIcon = CheckCircle;
  let tagLabel = 'VERIFIED';
  let dateColor = 'text-on-surface';

  if (doc.status === 'expired') {
    tagBg = 'bg-alert-red/15';
    tagText = 'text-alert-red';
    TagIcon = AlertCircle;
    tagLabel = 'EXPIRED';
    dateColor = 'text-alert-red line-through';
  } else if (doc.status === 'expiring') {
    tagBg = 'bg-signal-amber/15';
    tagText = 'text-signal-amber';
    TagIcon = AlertTriangle;
    tagLabel = 'EXPIRING SOON';
    dateColor = 'text-signal-amber';
  }

  // Format date safely
  const formattedExpiry = doc.expiry || 'LIFETIME';

  return (
    <motion.div variants={fadeUp} className="bg-white rounded-2xl border border-outline-light overflow-hidden shadow-sm">
      <div className="p-5 cursor-pointer hover:bg-surface-low transition-colors" onClick={onClick}>
        {/* Top Header Row */}
        <div className="flex justify-between items-start mb-4">
          <div className="w-12 h-12 rounded-xl bg-surface-low border border-outline-light/50 flex items-center justify-center">
            {isRC ? (
              <VehicleIcon type={vehicle?.type} size={24} className="text-navy" />
            ) : (
              <Icon size={24} className="text-navy" />
            )}
          </div>
          <div className={`px-2.5 py-1 rounded-full flex items-center gap-1.5 ${tagBg}`}>
            <TagIcon size={12} className={tagText} strokeWidth={3} />
            <span className={`font-body text-[10px] font-extrabold tracking-wider uppercase ${tagText}`}>
              {tagLabel}
            </span>
          </div>
        </div>

        {/* Title Row */}
        <div>
          <h2 className="font-display text-[18px] font-bold text-on-surface mb-0.5">{doc.type || 'Unknown Document'}</h2>
          <p className="font-body text-[13px] text-on-surface-muted">{subtitle}</p>
        </div>

        {/* Dotted Divider */}
        <div className="border-t border-dashed border-outline-light my-4"></div>

        {/* Date Row */}
        <div className="flex justify-between items-end">
          <p className="font-body text-[10px] font-extrabold text-on-surface-muted uppercase tracking-widest">
            {doc.status === 'expired' ? 'EXPIRED ON' : (isRC ? 'VALID UNTIL' : 'EXPIRY DATE')}
          </p>
          <p className={`font-mono text-sm font-bold tracking-wider ${dateColor}`}>
            {formattedExpiry}
          </p>
        </div>
      </div>

      {/* Footer Area */}
      <div className="bg-[#fcfafa] px-5 py-3 border-t border-outline-light flex justify-between items-center min-h-[56px]">
        {/* Left Action / Badge */}
        {doc.status === 'expired' ? (
          <button className="flex items-center gap-2 text-alert-red hover:bg-alert-red/5 px-2 py-1.5 rounded transition-colors font-body text-[11px] font-extrabold uppercase tracking-widest">
             <RefreshCw size={14} /> Re-certify Immediately
          </button>
        ) : doc.status === 'expiring' ? (
          <button className="bg-[#9B6D19] text-white px-4 py-2 rounded-lg font-body text-[11px] font-extrabold uppercase tracking-widest shadow-sm active:scale-95 transition-all">
             Renew Now
          </button>
        ) : (
          isRC && vehicle?.plate ? (
            <div className="border-2 border-on-surface rounded flex font-mono text-[11px] font-bold overflow-hidden bg-white">
               <div className="px-2 py-1 border-r-2 border-on-surface flex items-center justify-center">
                 {vehicle.plate.substring(0, 4)}
               </div>
               <div className="px-2 py-1 flex items-center justify-center">
                 {vehicle.plate.substring(4)}
               </div>
            </div>
          ) : (
             <div></div> // empty spacer
          )
        )}
        
        {/* Right Action */}
        <button 
          className="font-body text-[11px] font-extrabold text-navy hover:text-navy/70 uppercase tracking-widest px-2"
          onClick={onClick}
        >
          {isRC ? 'View PDF' : 'Details'}
        </button>
      </div>
    </motion.div>
  );
}
