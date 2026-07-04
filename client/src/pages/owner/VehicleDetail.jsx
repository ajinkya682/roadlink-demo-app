import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { QrCode, Shield, FileText, Phone, ChevronRight, Edit3, Check, Plus } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import AppHeader from '../../components/AppHeader';
import PlateTag from '../../components/PlateTag';
import Toggle from '../../components/Toggle';
import Input from '../../components/Input';
import Button from '../../components/Button';
import { useAppData } from '../../context/AppContext';
import api from '../../lib/api';
import { QRCodeSVG } from 'qrcode.react';

const tabs = ['Overview', 'Documents', 'Contacts', 'QR'];

export default function VehicleDetail() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { vehicles, notifications, documents, contacts, updateVehicleInContext } = useAppData();

  // Initial fallback to context, then update via API
  const contextVehicle = vehicles.find(v => v.id === id) || vehicles[0];
  const [vehicle, setVehicle] = useState(contextVehicle);
  const [activeTab, setActiveTab] = useState(0);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({});
  const [isSaving, setIsSaving] = useState(false);

  React.useEffect(() => {
    async function loadVehicle() {
      if (!id) return;
      try {
        const res = await api.get(`/vehicles/${id}`);
        if (res.data.success) {
          const v = res.data.data.vehicle;
          setVehicle({
            id: v._id,
            plate: v.registrationNumber,
            make: v.make,
            model: v.model,
            displayName: `${v.make || ''} ${v.model || ''}`.trim() || 'VEHICLE',
            isVerified: v.isVerified,
            privacyMode: v.showOwnerName === false,
            addedDate: new Date(v.createdAt).toLocaleDateString('en-IN', { month: 'short', year: 'numeric' }),
            unreadAlerts: 0,
            qrId: v._id,
            qrToken: v.qrToken,
            nickname: v.nickname,
            color: v.color || 'Unknown',
            year: v.year || new Date(v.createdAt).getFullYear(),
          });
        }
      } catch (err) {
        console.error('Failed to fetch vehicle', err);
      }
    }
    loadVehicle();
  }, [id]);

  if (vehicles.length === 0) {
    return (
      <div className="min-h-screen bg-[#F7F8FA] pb-24 flex flex-col">
        <AppHeader title="My Vehicles" />
        <div className="px-5 pt-6 flex-1">
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0, transition: { type: 'spring', damping: 22, stiffness: 200 } }}
            className="border-2 border-dashed border-outline-light rounded-2xl px-5 py-4 flex items-center gap-4 hover:border-navy/40 hover:bg-navy/2 transition-colors cursor-pointer bg-white"
            onClick={() => navigate('/add-vehicle')}
            whileTap={{ scale: 0.97 }}
          >
            <div className="w-10 h-10 bg-navy/8 rounded-xl flex items-center justify-center flex-shrink-0">
              <Plus size={22} className="text-navy" />
            </div>
            <div className="flex-1">
              <span className="font-body font-semibold text-[14px] text-[#434751]">
                Add vehicle
              </span>
              <p className="font-body text-[12px] text-[#737782]">Get a digital identity for your vehicle</p>
            </div>
            <ChevronRight size={18} className="text-[#c3c6d2]" />
          </motion.div>
        </div>
      </div>
    );
  }

  if (!vehicle) {
    return (
      <div className="min-h-screen bg-fog pb-24 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-navy"></div>
      </div>
    );
  }

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

  const handleEditClick = () => {
    if (isEditing) {
      // Cancel edit
      setIsEditing(false);
    } else {
      // Start edit
      setEditForm({
        make: vehicle.make || '',
        model: vehicle.model || '',
        year: vehicle.year || '',
        color: vehicle.color || '',
        nickname: vehicle.nickname || '',
        privacyMode: vehicle.privacyMode,
      });
      setIsEditing(true);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const payload = {
        make: editForm.make,
        model: editForm.model,
        year: editForm.year,
        color: editForm.color,
        nickname: editForm.nickname,
        showOwnerName: !editForm.privacyMode
      };
      const res = await api.patch(`/vehicles/${vehicle.id}`, payload);
      if (res.data.success) {
        const v = res.data.data.vehicle;
        const updatedFields = {
          make: v.make,
          model: v.model,
          year: v.year || editForm.year,
          color: v.color || editForm.color,
          nickname: v.nickname,
          privacyMode: v.showOwnerName === false,
          displayName: `${v.make || ''} ${v.model || ''}`.trim() || 'VEHICLE'
        };
        setVehicle(prev => ({ ...prev, ...updatedFields }));
        updateVehicleInContext(vehicle.id, updatedFields);
        setIsEditing(false);
      }
    } catch (err) {
      console.error(err);
      alert('Failed to save vehicle details');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-fog pb-24">
      <AppHeader 
        title="Vehicle Info" 
        rightSlot={
          isEditing ? null : (
            <button onClick={handleEditClick} className="p-2 text-on-surface-muted hover:text-navy transition-colors">
              <Edit3 size={20} />
            </button>
          )
        } 
      />

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
                  {!isEditing ? (
                    [
                      ['Make', vehicle.make || '—'],
                      ['Model', vehicle.model || '—'],
                      ['Year', vehicle.year || '—'],
                      ['Color', vehicle.color || '—'],
                      ['Nickname', vehicle.nickname || '—'],
                    ].map(([label, val]) => (
                      <div key={label} className="flex items-center justify-between px-4 py-3">
                        <span className="font-body text-xs text-on-surface-muted uppercase tracking-widest font-bold">{label}</span>
                        <span className="font-body text-sm text-on-surface font-medium">{val}</span>
                      </div>
                    ))
                  ) : (
                    <div className="p-4 space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <Input label="MAKE" value={editForm.make} onChange={e => setEditForm({...editForm, make: e.target.value})} />
                        <Input label="MODEL" value={editForm.model} onChange={e => setEditForm({...editForm, model: e.target.value})} />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <Input label="YEAR" value={editForm.year} onChange={e => setEditForm({...editForm, year: e.target.value})} />
                        <Input label="COLOR" value={editForm.color} onChange={e => setEditForm({...editForm, color: e.target.value})} />
                      </div>
                      <Input label="NICKNAME" value={editForm.nickname} onChange={e => setEditForm({...editForm, nickname: e.target.value})} />
                    </div>
                  )}
                </div>

                {/* Privacy toggle */}
                <div className="bg-white rounded-2xl border border-outline-light px-4 py-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 bg-verified-green/10 rounded-xl flex items-center justify-center">
                      <Shield size={22} className={(isEditing ? editForm.privacyMode : vehicle.privacyMode) ? 'text-verified-green' : 'text-outline'} />
                    </div>
                    <div>
                      <h4 className="font-body text-sm font-semibold text-on-surface">Privacy Mode</h4>
                      <p className="font-body text-xs text-on-surface-muted">Hide name when scanned</p>
                    </div>
                  </div>
                  <Toggle 
                    on={isEditing ? editForm.privacyMode : vehicle.privacyMode} 
                    onChange={async (newVal) => {
                      if (isEditing) {
                        setEditForm(prev => ({ ...prev, privacyMode: newVal }));
                      } else {
                        // Optimistic update
                        setVehicle(prev => ({ ...prev, privacyMode: newVal }));
                        updateVehicleInContext(vehicle.id, { privacyMode: newVal });
                        try {
                          await api.patch(`/vehicles/${vehicle.id}`, { showOwnerName: !newVal });
                        } catch (err) {
                          console.error(err);
                          // Revert on failure
                          setVehicle(prev => ({ ...prev, privacyMode: !newVal }));
                          updateVehicleInContext(vehicle.id, { privacyMode: !newVal });
                        }
                      }
                    }} 
                  />
                </div>

                {isEditing && (
                  <div className="flex gap-3 pt-2">
                    <button className="flex-1 py-3 text-on-surface-muted font-body font-semibold border-2 border-outline-light rounded-xl hover:bg-surface-low transition-colors" onClick={handleEditClick}>
                      Cancel
                    </button>
                    <div className="flex-1">
                      <Button fullWidth onClick={handleSave} isLoading={isSaving}>Save Changes</Button>
                    </div>
                  </div>
                )}

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
                  <QRCodeSVG 
                    value={`${window.location.origin}/scan-landing?qr=${vehicle.qrToken}`}
                    size={160}
                    level="Q"
                    className="w-full h-full"
                    fgColor="#1A1A1A"
                    bgColor="transparent"
                  />
                </motion.div>
                <p className="font-mono text-xs tracking-wider text-on-surface-muted">{vehicle.qrToken}</p>
                <div className="flex w-full">
                  <button
                    className="flex-1 border-2 border-navy text-navy rounded-xl py-3 font-body text-sm font-semibold flex items-center justify-center gap-2 hover:bg-navy/5 transition-colors"
                    onClick={() => navigate('/qr-detail')}
                  >
                    <QrCode size={16} /> Full QR Page
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
