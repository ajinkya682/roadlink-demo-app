import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, Plus, UploadCloud, Trash2 } from 'lucide-react';
import AppHeader from '../../components/AppHeader';
import BottomTabBar from '../../components/BottomTabBar';
import { useDemoData } from '../../context/DemoContext';
import { documentStatusMeta } from '../../demo-data/documents';

const stagger = { hidden: {}, show: { transition: { staggerChildren: 0.08 } } };
const fadeUp = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0, transition: { type: 'spring', damping: 20, stiffness: 200 } } };

function DocCard({ doc, onClick }) {
  const [flipped, setFlipped] = useState(false);
  const meta = documentStatusMeta[doc.status] || documentStatusMeta.missing;

  return (
    <motion.div variants={fadeUp} className="relative" style={{ perspective: 800 }}>
      <motion.div
        className="relative rounded-2xl cursor-pointer"
        animate={{ rotateY: flipped ? 180 : 0 }}
        transition={{ type: 'spring', damping: 20, stiffness: 120 }}
        style={{ transformStyle: 'preserve-3d', minHeight: 120 }}
        onClick={() => setFlipped(f => !f)}
      >
        {/* Front */}
        <div
          className="absolute inset-0 bg-white rounded-2xl border border-outline-light overflow-hidden p-4"
          style={{ backfaceVisibility: 'hidden', borderTop: `4px solid ${meta.border}` }}
        >
          <div className="flex justify-between items-start mb-2">
            <span className="font-body text-sm font-bold text-on-surface">{doc.type}</span>
            <span
              className="text-xs font-bold px-2 py-0.5 rounded-full"
              style={{ color: meta.color, background: meta.bg }}
            >
              {doc.expiry}
            </span>
          </div>
          {doc.number && (
            <p className="font-mono text-xs text-on-surface-muted tracking-wider">{doc.number}</p>
          )}
          <p className="font-body text-[10px] text-outline mt-2">Tap to manage</p>

          {/* Pulse animation for expired/expiring */}
          {(doc.status === 'expired' || doc.status === 'expiring') && (
            <motion.div
              className="absolute inset-0 rounded-2xl"
              style={{ background: meta.color }}
              animate={{ opacity: [0, 0.06, 0] }}
              transition={{ repeat: Infinity, duration: 2.5 }}
            />
          )}
        </div>

        {/* Back */}
        <div
          className="absolute inset-0 bg-surface-low rounded-2xl border border-outline-light p-4 flex flex-col gap-3 justify-center"
          style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
        >
          <button
            className="flex items-center gap-2 w-full bg-navy text-white rounded-xl py-3 px-3 font-body text-sm font-semibold justify-center"
            onClick={(e) => { e.stopPropagation(); onClick(); }}
          >
            <UploadCloud size={16} /> Update Document
          </button>
          <button
            className="flex items-center gap-2 w-full border border-alert-red/30 text-alert-red rounded-xl py-2.5 px-3 font-body text-sm font-semibold justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            <Trash2 size={14} /> Remove
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function DocumentVault() {
  const navigate = useNavigate();
  const { documents } = useDemoData();
  const vehicleDocs = documents.filter(d => d.vehicleId === 'v1');

  const expiredCount = vehicleDocs.filter(d => d.status === 'expired').length;
  const expiringCount = vehicleDocs.filter(d => d.status === 'expiring').length;

  return (
    <div className="min-h-screen bg-fog pb-24">
      <AppHeader title="Document Vault" rightSlot={<Shield size={20} className="text-verified-green" />} />

      <div className="px-5 pt-5 space-y-4">
        {/* Privacy banner */}
        <div className="flex items-center gap-3 bg-verified-green/8 border border-verified-green/20 rounded-xl px-4 py-3">
          <Shield size={16} className="text-verified-green flex-shrink-0" />
          <p className="font-body text-xs text-on-surface-muted">
            Documents are <strong>end-to-end encrypted.</strong> We cannot read them.
          </p>
        </div>

        {/* Alerts */}
        {(expiredCount > 0 || expiringCount > 0) && (
          <div className="space-y-2">
            {expiredCount > 0 && (
              <div className="bg-alert-red/8 border border-alert-red/20 rounded-xl px-4 py-2.5 flex items-center gap-2">
                <span className="w-2 h-2 bg-alert-red rounded-full animate-pulse" />
                <p className="font-body text-xs font-semibold text-alert-red">
                  {expiredCount} document{expiredCount > 1 ? 's' : ''} expired — action required
                </p>
              </div>
            )}
            {expiringCount > 0 && (
              <div className="bg-signal-amber/8 border border-signal-amber/20 rounded-xl px-4 py-2.5 flex items-center gap-2">
                <span className="w-2 h-2 bg-signal-amber rounded-full" />
                <p className="font-body text-xs font-semibold text-signal-amber">
                  {expiringCount} document{expiringCount > 1 ? 's' : ''} expiring soon
                </p>
              </div>
            )}
          </div>
        )}

        {/* Document grid */}
        <motion.div
          className="grid grid-cols-2 gap-3"
          variants={stagger}
          initial="hidden"
          animate="show"
        >
          {vehicleDocs.map(doc => (
            <DocCard key={doc.id} doc={doc} onClick={() => navigate('/document-upload')} />
          ))}

          {/* Add card */}
          <motion.div
            variants={fadeUp}
            className="border-2 border-dashed border-outline-light rounded-2xl flex flex-col items-center justify-center gap-2 py-8 cursor-pointer hover:border-navy/40 transition-colors"
            onClick={() => navigate('/document-upload')}
            whileTap={{ scale: 0.97 }}
          >
            <div className="w-9 h-9 bg-navy/8 rounded-xl flex items-center justify-center">
              <Plus size={20} className="text-navy" />
            </div>
            <span className="font-body text-xs font-semibold text-on-surface-muted text-center">Add Document</span>
          </motion.div>
        </motion.div>
      </div>

      <BottomTabBar />
    </div>
  );
}
