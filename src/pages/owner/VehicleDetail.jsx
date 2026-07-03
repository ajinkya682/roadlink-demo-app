import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { QrCode, Shield, FileText, Phone, ChevronRight, Edit3, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import AppHeader from '../../components/AppHeader';
import PlateTag from '../../components/PlateTag';
import Toggle from '../../components/Toggle';
import BottomTabBar from '../../components/BottomTabBar';
import { useDemoData } from '../../context/DemoContext';

const tabs = ['Overview', 'Documents', 'Contacts', 'QR'];

export default function VehicleDetail() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { vehicles, notifications, documents, contacts, togglePrivacyMode } = useDemoData();

  // Use first vehicle as default
  const vehicle = vehicles.find(v => v.id === id) || vehicles[0];
  const [activeTab, setActiveTab] = useState(0);

  const recentNotifs = notifications
    .filter(n => n.vehicleId === vehicle.id)
    .slice(0, 3);

  const vehicleDocs = documents.filter(d => d.vehicleId === vehicle.id);

  const statusColor = (s) => ({
    valid: 'text-verified-green bg-verified-green/10',
    expiring: 'text-signal-amber bg-signal-amber/10',
    expired: 'text-alert-red bg-alert-red/10',
    missing: 'text-outline bg-surface-high',
  }[s] || '');

  return (
    <div className="min-h-screen bg-fog pb-24">
      <AppHeader title="Vehicle Info" rightSlot={<Edit3 size={20} />} />

      {/* Plate hero */}
      <div className="bg-white border-b border-outline-light px-5 py-5 flex flex-col items-center gap-3">
        <PlateTag plateNumber={vehicle.plate} displayName={vehicle.displayName} isVerified={vehicle.isVerified} size="lg" />
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 bg-verified-green rounded-full" />
          <span className="font-body text-xs font-semibold text-verified-green">Active & Protected</span>
        </div>
      </div>

      {/* Tab bar */}
      <div className="bg-white border-b border-outline-light flex sticky top-14 z-20">
        {tabs.map((tab, i) => (
          <button
            key={tab}
            className={`flex-1 py-3 font-body text-sm font-semibold relative transition-colors ${
              activeTab === i ? 'text-navy' : 'text-on-surface-muted'
            }`}
            onClick={() => setActiveTab(i)}
          >
            {tab}
            {activeTab === i && (
              <motion.div
                layoutId="v-tab-line"
                className="absolute bottom-0 left-3 right-3 h-0.5 bg-navy rounded-full"
                transition={{ type: 'spring', damping: 20, stiffness: 300 }}
              />
            )}
          </button>
        ))}
      </div>

      {/* Tab content */}
      <div className="px-5 pt-5">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.18 }}
            className="space-y-4"
          >
            {/* ── OVERVIEW ── */}
            {activeTab === 0 && (
              <>
                {/* Vehicle info */}
                <div className="bg-white rounded-2xl border border-outline-light divide-y divide-outline-light overflow-hidden">
                  {[
                    ['Make / Model', `${vehicle.make} ${vehicle.model}`],
                    ['Year', vehicle.year],
                    ['Color', vehicle.color],
                    ['Nickname', vehicle.nickname || '—'],
                  ].map(([label, val]) => (
                    <div key={label} className="flex items-center justify-between px-4 py-3">
                      <span className="font-body text-xs text-on-surface-muted uppercase tracking-widest font-bold">{label}</span>
                      <span className="font-body text-sm text-on-surface font-medium">{val}</span>
                    </div>
                  ))}
                </div>

                {/* Privacy toggle */}
                <div className="bg-white rounded-2xl border border-outline-light px-4 py-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 bg-verified-green/10 rounded-xl flex items-center justify-center">
                      <Shield size={18} className="text-verified-green" />
                    </div>
                    <div>
                      <p className="font-body text-sm font-semibold text-on-surface">Privacy Mode</p>
                      <p className="font-body text-xs text-on-surface-muted">Hide your name when scanned</p>
                    </div>
                  </div>
                  <Toggle on={vehicle.privacyMode} onChange={() => togglePrivacyMode(vehicle.id)} />
                </div>

                {/* Recent alerts */}
                {recentNotifs.length > 0 && (
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <p className="font-body text-label-caps text-on-surface-muted uppercase tracking-widest">Recent Alerts</p>
                      <button
                        className="font-body text-xs font-semibold text-navy"
                        onClick={() => navigate('/notifications')}
                      >
                        View all
                      </button>
                    </div>
                    <div className="bg-white rounded-2xl border border-outline-light divide-y divide-outline-light overflow-hidden">
                      {recentNotifs.map(n => (
                        <div
                          key={n.id}
                          className="flex items-center gap-3 px-4 py-3 cursor-pointer hover:bg-surface-low transition-colors"
                          onClick={() => navigate(`/notification-detail/${n.id}`)}
                        >
                          <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: n.color }} />
                          <div className="flex-1">
                            <p className="font-body text-sm font-semibold text-on-surface">{n.type}</p>
                            <p className="font-body text-xs text-on-surface-muted">{n.time}</p>
                          </div>
                          {n.resolved && <Check size={14} className="text-verified-green" />}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </>
            )}

            {/* ── DOCUMENTS ── */}
            {activeTab === 1 && (
              <div className="grid grid-cols-2 gap-3">
                {vehicleDocs.map(doc => (
                  <div
                    key={doc.id}
                    className="bg-white rounded-xl border border-outline-light p-4 cursor-pointer hover:border-navy/30 transition-colors"
                    onClick={() => navigate('/document-upload')}
                  >
                    <div className={`inline-flex px-2 py-0.5 rounded-full text-xs font-bold mb-2 ${statusColor(doc.status)}`}>
                      {doc.expiry}
                    </div>
                    <p className="font-body text-sm font-semibold text-on-surface">{doc.type}</p>
                    {doc.number && <p className="font-mono text-xs text-on-surface-muted mt-0.5">{doc.number}</p>}
                  </div>
                ))}
              </div>
            )}

            {/* ── CONTACTS ── */}
            {activeTab === 2 && (
              <div className="space-y-3">
                {contacts.map(c => (
                  <div key={c.id} className="bg-white rounded-xl border border-outline-light px-4 py-3 flex items-center gap-3">
                    <div className="w-10 h-10 bg-navy/8 rounded-xl flex items-center justify-center font-display font-semibold text-navy text-sm flex-shrink-0">
                      {c.name.charAt(0)}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <p className="font-body text-sm font-semibold text-on-surface">{c.name}</p>
                        {c.isPrimary && (
                          <span className="bg-navy text-white text-[10px] font-bold px-2 py-0.5 rounded-full">Primary</span>
                        )}
                      </div>
                      <p className="font-body text-xs text-on-surface-muted">{c.relation} · {c.maskedPhone}</p>
                    </div>
                  </div>
                ))}
                <button
                  className="w-full border-2 border-dashed border-outline-light rounded-xl py-4 font-body text-sm font-semibold text-on-surface-muted flex items-center justify-center gap-2"
                  onClick={() => navigate('/emergency-contacts')}
                >
                  Manage Contacts
                </button>
              </div>
            )}

            {/* ── QR ── */}
            {activeTab === 3 && (
              <div className="flex flex-col items-center gap-5 py-4">
                <motion.div
                  className="bg-white rounded-2xl border-2 border-asphalt p-5 shadow-plate"
                  initial={{ rotateX: 90, opacity: 0 }}
                  animate={{ rotateX: 0, opacity: 1 }}
                  transition={{ type: 'spring', damping: 16, stiffness: 100 }}
                  style={{ perspective: 800, transformOrigin: 'center top' }}
                >
                  <svg width="160" height="160" viewBox="0 0 160 160" fill="none">
                    <rect width="160" height="160" fill="white" />
                    <rect x="10" y="10" width="60" height="60" rx="6" fill="#1A1A1A" />
                    <rect x="18" y="18" width="44" height="44" rx="4" fill="white" />
                    <rect x="26" y="26" width="28" height="28" fill="#1A1A1A" />
                    <rect x="90" y="10" width="60" height="60" rx="6" fill="#1A1A1A" />
                    <rect x="98" y="18" width="44" height="44" rx="4" fill="white" />
                    <rect x="106" y="26" width="28" height="28" fill="#1A1A1A" />
                    <rect x="10" y="90" width="60" height="60" rx="6" fill="#1A1A1A" />
                    <rect x="18" y="98" width="44" height="44" rx="4" fill="white" />
                    <rect x="26" y="106" width="28" height="28" fill="#1A1A1A" />
                    <rect x="90" y="90" width="24" height="24" fill="#1A1A1A" rx="3" />
                    <rect x="122" y="90" width="28" height="24" fill="#1A1A1A" rx="3" />
                    <rect x="90" y="122" width="24" height="28" fill="#1A1A1A" rx="3" />
                    <rect x="122" y="122" width="28" height="28" fill="#1A1A1A" rx="3" />
                  </svg>
                </motion.div>
                <p className="font-mono text-xs tracking-wider text-on-surface-muted">{vehicle.qrId}</p>
                <div className="flex gap-3 w-full">
                  <button
                    className="flex-1 border-2 border-navy text-navy rounded-xl py-3 font-body text-sm font-semibold flex items-center justify-center gap-2"
                    onClick={() => navigate('/qr-detail')}
                  >
                    <QrCode size={16} /> Full QR Page
                  </button>
                  <button
                    className="flex-1 bg-signal-amber text-asphalt rounded-xl py-3 font-body text-sm font-semibold"
                    onClick={() => navigate('/order-sticker')}
                  >
                    Order Sticker
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      <BottomTabBar />
    </div>
  );
}
