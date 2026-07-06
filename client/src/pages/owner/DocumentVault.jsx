import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, Plus, FileText, Car, Cloud, User, CheckCircle, AlertTriangle, AlertCircle, RefreshCw } from 'lucide-react';
import AppHeader from '../../components/AppHeader';
import DocCard from '../../components/DocCard';
import { useAppData } from '../../context/AppContext';
import { documentStatusMeta } from '../../demo-data/documents';

const stagger = { hidden: {}, show: { transition: { staggerChildren: 0.08 } } };
const fadeUp = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0, transition: { type: 'spring', damping: 20, stiffness: 200 } } };


export default function DocumentVault() {
  const navigate = useNavigate();
  const { documents, vehicles } = useAppData();
  


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
              vehicles={vehicles}
              onClick={() => navigate(`/document-detail/${doc.id}`)} 
            />
          ))}

          {/* Persistent "Add Document" Button at the bottom of the list */}
          <motion.button
            variants={fadeUp}
            className="w-full border-2 border-dashed border-[#dcd9d9] bg-transparent rounded-[24px] py-8 flex flex-col items-center justify-center gap-3 hover:bg-surface-low hover:border-navy/30 transition-all group mt-2"
            onClick={() => {
              if (vehicles.length === 0) {
                navigate('/add-vehicle');
              } else {
                navigate('/document-upload', { state: { type: '', vehicleId } });
              }
            }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="w-14 h-14 rounded-full border-2 border-navy border-dashed flex items-center justify-center text-navy group-hover:bg-navy/5 transition-colors">
              <Plus size={24} strokeWidth={2.5} />
            </div>
            <p className="font-body text-sm font-semibold text-on-surface-muted mt-2">
              {vehicles.length === 0 
                ? "Tap to add a vehicle first" 
                : vehicleDocs.length === 0 
                  ? "Tap to add your first document" 
                  : ""}
            </p>
          </motion.button>
        </motion.div>
      </div>
      
    </div>
  );
}
