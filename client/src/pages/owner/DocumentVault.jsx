import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, Plus, FileText, Car, Cloud, User, CheckCircle, AlertTriangle, AlertCircle, RefreshCw } from 'lucide-react';
import AppHeader from '../../components/AppHeader';
import { useAppData } from '../../context/AppContext';
import { documentStatusMeta } from '../../demo-data/documents';

const stagger = { hidden: {}, show: { transition: { staggerChildren: 0.08 } } };
const fadeUp = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0, transition: { type: 'spring', damping: 20, stiffness: 200 } } };

function DocCard({ doc, vehicle, onClick }) {
  const docType = doc.type || '';
  const isRC = docType.toLowerCase().includes('rc') || docType.toLowerCase().includes('registration');
  const isIns = docType.toLowerCase().includes('insur');
  const isPUC = docType.toLowerCase().includes('puc') || docType.toLowerCase().includes('pollution');
  const isLicense = docType.toLowerCase().includes('licen');

  let Icon = FileText;
  let subtitle = 'Uploaded Document';
  
  if (isRC) { Icon = Car; subtitle = 'Vehicle Identification Document'; }
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
            <Icon size={24} className="text-navy" />
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
               <div className="px-2 py-1 border-r-2 border-on-surface flex items-center justify-center">MH 12</div>
               <div className="px-2 py-1 flex items-center justify-center">AB 1234</div>
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

export default function DocumentVault() {
  const navigate = useNavigate();
  const { documents, vehicles, refreshDocuments, refreshVehicles } = useAppData();
  
  useEffect(() => {
    refreshVehicles();
    refreshDocuments();
  }, []);

  const activeVehicle = vehicles[0];
  const vehicleId = activeVehicle?.id || null;

  // Show all documents for the user's vehicles
  const vehicleDocs = vehicleId ? documents.filter(d => d.vehicleId === vehicleId) : documents;

  const expiredCount = vehicleDocs.filter(d => d.status === 'expired').length;
  const expiringCount = vehicleDocs.filter(d => d.status === 'expiring').length;

  return (
    <div className="min-h-screen bg-fog pb-24 relative">
      <AppHeader title="Document Vault" rightSlot={<Shield size={20} className="text-verified-green" />} />

      <div className="px-5 pt-5 space-y-5">
        {/* Privacy banner */}
        <div className="flex items-start gap-3 bg-white border border-outline-light rounded-2xl px-5 py-4 shadow-sm">
          <Shield size={18} className="text-verified-green flex-shrink-0 mt-0.5" />
          <p className="font-body text-[13px] text-on-surface-muted leading-relaxed">
            Documents are <strong className="text-on-surface">end-to-end encrypted</strong>. We cannot read them.
          </p>
        </div>

        {/* Alerts */}
        {(expiredCount > 0 || expiringCount > 0) && (
          <div className="space-y-3">
            {expiredCount > 0 && (
               <div className="bg-alert-red/10 border border-alert-red/20 rounded-2xl px-5 py-3.5 flex items-center gap-3">
                 <span className="w-2 h-2 bg-alert-red rounded-full animate-pulse flex-shrink-0" />
                 <p className="font-body text-[13px] font-semibold text-alert-red">
                   {expiredCount} document{expiredCount > 1 ? 's' : ''} expired — action required
                 </p>
               </div>
            )}
            {expiringCount > 0 && (
               <div className="bg-signal-amber/10 border border-signal-amber/20 rounded-2xl px-5 py-3.5 flex items-center gap-3">
                 <span className="w-2 h-2 bg-signal-amber rounded-full flex-shrink-0" />
                 <p className="font-body text-[13px] font-semibold text-signal-amber">
                   {expiringCount} document{expiringCount > 1 ? 's' : ''} expiring soon
                 </p>
               </div>
            )}
          </div>
        )}

        {/* Vertical Document List */}
        <motion.div
          className="flex flex-col gap-4"
          variants={stagger}
          initial="hidden"
          animate="show"
        >
          {vehicleDocs.map((doc, index) => (
            <DocCard 
              key={doc._id || doc.id || index} 
              doc={doc} 
              vehicle={activeVehicle}
              onClick={() => navigate('/document-upload', { state: { type: doc.type || '', vehicleId } })} 
            />
          ))}

          {/* Persistent "Add Document" Button at the bottom of the list */}
          <motion.button
            variants={fadeUp}
            className="w-full border-2 border-dashed border-[#dcd9d9] bg-transparent rounded-[24px] py-8 flex flex-col items-center justify-center gap-3 hover:bg-surface-low hover:border-navy/30 transition-all group mt-2"
            onClick={() => navigate('/document-upload', { state: { type: '', vehicleId } })}
            whileTap={{ scale: 0.98 }}
          >
            <div className="w-14 h-14 rounded-full border-2 border-navy border-dashed flex items-center justify-center text-navy group-hover:bg-navy/5 transition-colors">
              <Plus size={24} strokeWidth={2.5} />
            </div>
            {vehicleDocs.length === 0 ? (
              <p className="font-body text-sm font-semibold text-on-surface-muted mt-2">Tap to add your first document</p>
            ) : null}
          </motion.button>
        </motion.div>
      </div>
      
    </div>
  );
}
