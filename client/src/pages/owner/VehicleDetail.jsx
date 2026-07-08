import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { QrCode, Shield, FileText, Phone, ChevronRight, Edit3, Check, Plus, AlertTriangle, Trash2, X } from 'lucide-react';
import AppHeader from '../../components/AppHeader';
import PlateTag from '../../components/PlateTag';
import Toggle from '../../components/Toggle';
import DocCard from '../../components/DocCard';
import VehicleIcon from '../../components/VehicleIcon';
import Input from '../../components/Input';
import Button from '../../components/Button';
import { useAppData } from '../../context/AppContext';
import { useDialog } from '../../context/DialogContext';
import api from '../../lib/api';
import RoadLinkQR from '../../components/RoadLinkQR';

const tabs = ['Overview', 'Documents', 'Contacts', 'QR'];
const relations = ['Family', 'Friend', 'Colleague', 'Spouse', 'Brother', 'Other'];

export default function VehicleDetail() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { vehicles, notifications, documents, contacts, medicalProfile, updateVehicleInContext } = useAppData();
  const { showAlert, showConfirm } = useDialog();

  // Initial fallback to context, then update via API
  const contextVehicle = vehicles.find(v => v.id === id);
  const [vehicle, setVehicle] = useState(contextVehicle);
  const [notFound, setNotFound] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({});
  const [isSaving, setIsSaving] = useState(false);
  
  // Vehicle-specific contacts state
  const [vehicleContacts, setVehicleContacts] = useState([]);
  const [showAddContact, setShowAddContact] = useState(false);
  const [contactForm, setContactForm] = useState({ name: '', phone: '', relation: 'Family', isPrimary: false });

  // Image upload state
  const fileInputRef = React.useRef(null);
  const [showImageOptions, setShowImageOptions] = useState(false);

  const handleImageClick = () => {
    const currentImageUrl = isEditing && editForm.imageUrl !== undefined ? editForm.imageUrl : vehicle.imageUrl;
    if (currentImageUrl) {
      setShowImageOptions(true);
    } else {
      fileInputRef.current?.click();
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const img = new Image();
        img.onload = async () => {
          const canvas = document.createElement('canvas');
          const MAX_SIZE = 400; // Compress to avoid 413 payload too large
          let width = img.width;
          let height = img.height;

          if (width > height) {
            if (width > MAX_SIZE) {
              height *= MAX_SIZE / width;
              width = MAX_SIZE;
            }
          } else {
            if (height > MAX_SIZE) {
              width *= MAX_SIZE / height;
              height = MAX_SIZE;
            }
          }
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, width, height);
          const base64String = canvas.toDataURL('image/jpeg', 0.8);
          
          try {
            const res = await api.patch(`/vehicles/${id}`, { imageUrl: base64String });
            if (res.data.success) {
              const updatedVehicle = res.data.data.vehicle;
              setVehicle(prev => ({ ...prev, imageUrl: updatedVehicle.imageUrl }));
              if (isEditing) {
                setEditForm(prev => ({ ...prev, imageUrl: updatedVehicle.imageUrl }));
              }
            }
          } catch (err) {
            console.error('Failed to update image', err);
          }
        };
        img.src = reader.result;
      };
      reader.readAsDataURL(file);
    }
    // reset input
    e.target.value = '';
  };

  const handleRemoveImage = async () => {
    setShowImageOptions(false);
    try {
      const res = await api.patch(`/vehicles/${id}`, { imageUrl: null });
      if (res.data.success) {
        setVehicle(prev => ({ ...prev, imageUrl: null }));
        if (isEditing) {
          setEditForm(prev => ({ ...prev, imageUrl: null }));
        }
      }
    } catch (err) {
      console.error('Failed to remove image', err);
    }
  };

  React.useEffect(() => {
    async function loadVehicle() {
      if (!id) {
        navigate('/vehicles');
        return;
      }
      try {
        const res = await api.get(`/vehicles/${id}`);
        if (res.data.success) {
          const v = res.data.data.vehicle;
          if (!v) {
            setNotFound(true);
            return;
          }
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
            imageUrl: v.imageUrl,
            protectionStatus: v.protectionStatus || 'pending_payment',
            refundGuaranteeExpiresAt: v.refundGuaranteeExpiresAt,
            hasUsedFreeStickerOrder: v.hasUsedFreeStickerOrder
          });
        } else {
          setNotFound(true);
        }
      } catch (err) {
        console.error('Failed to fetch vehicle', err);
        if (err.response && err.response.status === 404) {
          setNotFound(true);
        }
      }
    }
    loadVehicle();
  }, [id]);

  React.useEffect(() => {
    async function loadContacts() {
      try {
        const res = await api.get(`/emergency-contacts?vehicleId=${id}`);
        if (res.data.success) {
          setVehicleContacts(res.data.data.contacts.map(c => ({
            id: c._id,
            name: c.name,
            phone: c.phone,
            maskedPhone: c.phone.replace(/.(?=.{4})/g, 'x'),
            relation: c.relation,
            isPrimary: c.priority === 1
          })));
        }
      } catch (err) {
        console.error('Failed to load vehicle contacts', err);
      }
    }
    if (id) loadContacts();
  }, [id]);

  if (vehicles.length === 0 && !id) {
    navigate('/vehicles');
    return null;
  }

  if (notFound) {
    return (
      <div className="min-h-screen bg-fog pb-24 flex flex-col items-center justify-center px-6">
        <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-sm mb-6 border border-outline-light/50">
          <AlertTriangle size={32} className="text-signal-amber" />
        </div>
        <h1 className="font-display text-2xl font-bold text-navy mb-2 text-center">Vehicle Not Found</h1>
        <p className="font-body text-[14px] text-on-surface-muted text-center max-w-[280px] mb-8 leading-relaxed">
          The vehicle you are looking for may have been removed, or the link is invalid.
        </p>
        <Button 
          onClick={() => navigate('/dashboard', { replace: true })}
          className="w-full max-w-[240px]"
        >
          Go to Dashboard
        </Button>
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
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
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
        type: editForm.type,
        showOwnerName: !editForm.privacyMode
      };
      
      if (editForm.imageUrl !== undefined) {
        payload.imageUrl = editForm.imageUrl;
      }

      const res = await api.patch(`/vehicles/${vehicle.id}`, payload);
      if (res.data.success) {
        const v = res.data.data.vehicle;
        const updatedFields = {
          make: v.make,
          model: v.model,
          year: v.year || editForm.year,
          color: v.color || editForm.color,
          nickname: v.nickname,
          type: v.type || editForm.type,
          privacyMode: v.showOwnerName === false,
          displayName: `${v.make || ''} ${v.model || ''}`.trim() || 'VEHICLE',
          ...(editForm.imageUrl !== undefined && { imageUrl: editForm.imageUrl })
        };
        setVehicle(prev => ({ ...prev, ...updatedFields }));
        updateVehicleInContext(vehicle.id, updatedFields);
        setIsEditing(false);
      }
    } catch (err) {
      console.error(err);
      showAlert('Error', 'Failed to save vehicle details');
    } finally {
      setIsSaving(false);
    }
  };

  const handleAddContact = async () => {
    if (!contactForm.name || !contactForm.phone) return;
    try {
      const res = await api.post('/emergency-contacts', {
        vehicleId: vehicle.id,
        name: contactForm.name,
        phone: contactForm.phone,
        relation: contactForm.relation,
        priority: contactForm.isPrimary ? 1 : 2
      });
      if (res.data.success) {
        setShowAddContact(false);
        setContactForm({ name: '', phone: '', relation: 'Family', isPrimary: false });
        
        const res2 = await api.get(`/emergency-contacts?vehicleId=${id}`);
        if (res2.data.success) {
          setVehicleContacts(res2.data.data.contacts.map(c => ({
            id: c._id,
            name: c.name,
            phone: c.phone,
            maskedPhone: c.phone.replace(/.(?=.{4})/g, 'x'),
            relation: c.relation,
            isPrimary: c.priority === 1
          })));
        }
      }
    } catch (err) {
      console.error(err);
      showAlert('Error', 'Failed to add contact');
    }
  };

  const handleDeleteContact = async (contactId) => {
    const confirmed = await showConfirm('Delete Contact', 'Are you sure you want to delete this contact?');
    if (confirmed) {
      try {
        await api.delete(`/emergency-contacts/${contactId}`);
        setVehicleContacts(prev => prev.filter(c => c.id !== contactId));
      } catch (err) {
        console.error(err);
      }
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
      <div className="bg-white border-b border-outline-light px-5 py-5 flex flex-col items-center gap-3 relative">
        <input type="file" accept="image/*" ref={fileInputRef} className="hidden" onChange={handleFileChange} />
        <button 
          onClick={handleImageClick}
          className="relative group w-20 h-20 rounded-full border-4 border-white shadow-sm overflow-hidden mb-2 bg-surface-low flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-navy/50 transition-all active:scale-95"
        >
          {(() => {
            const currentImageUrl = isEditing && editForm.imageUrl !== undefined ? editForm.imageUrl : vehicle.imageUrl;
            const currentType = isEditing && editForm.type !== undefined ? editForm.type : vehicle.type;
            return currentImageUrl ? (
              <img src={currentImageUrl} alt="Vehicle" className="w-full h-full object-cover" />
            ) : (
              <VehicleIcon type={currentType} size={32} className="text-navy" />
            );
          })()}
          <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
            <Edit3 size={20} className="text-white" />
          </div>
          {!(isEditing && editForm.imageUrl !== undefined ? editForm.imageUrl : vehicle.imageUrl) && (
            <div className="absolute bottom-1 right-1 w-5 h-5 bg-navy rounded-full flex items-center justify-center border-2 border-white">
              <Plus size={12} className="text-white" />
            </div>
          )}
        </button>
        <PlateTag plateNumber={vehicle.plate} displayName={vehicle.displayName} isVerified={vehicle.isVerified} size="lg" />
        
        {/* Protection Status Badges */}
        {vehicle.protectionStatus === 'active' && (
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 bg-verified-green rounded-full" />
            <span className="font-body text-xs font-semibold text-verified-green">Active & Protected</span>
          </div>
        )}
        {vehicle.protectionStatus === 'pending_payment' && (
          <div className="flex flex-col items-center mt-2 w-full max-w-sm">
            <div className="flex items-center gap-1.5 mb-2">
              <span className="w-2 h-2 bg-signal-amber rounded-full" />
              <span className="font-body text-xs font-semibold text-signal-amber">Action Required: Pending Payment</span>
            </div>
            <button 
              onClick={() => navigate('/subscription-payment', { state: { vehicle } })}
              className="w-full bg-navy text-white text-sm font-semibold py-2 rounded-xl"
            >
              Activate Protection
            </button>
          </div>
        )}
        {vehicle.protectionStatus === 'lapsed' && (
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 bg-alert-red rounded-full" />
            <span className="font-body text-xs font-semibold text-alert-red">Protection Lapsed</span>
          </div>
        )}
        {vehicle.protectionStatus === 'grace_period' && (
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 bg-signal-amber rounded-full" />
            <span className="font-body text-xs font-semibold text-signal-amber">Grace Period - Update Payment</span>
          </div>
        )}
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
                        <Input label="Make" value={editForm.make || ''} onChange={e => setEditForm({ ...editForm, make: e.target.value })} casing="words" />
                        <Input label="Model" value={editForm.model || ''} onChange={e => setEditForm({ ...editForm, model: e.target.value })} casing="words" />
                      </div>
                      
                      <div className="mt-4">
                        <label className="block font-body text-[12px] font-bold tracking-[0.08em] text-on-surface-muted uppercase mb-3">
                          VEHICLE TYPE
                        </label>
                        <div className="grid grid-cols-3 gap-3">
                          {['two-wheeler', 'four-wheeler', 'commercial'].map(t => (
                            <button
                              key={t}
                              onClick={() => setEditForm({ ...editForm, type: t })}
                              className={`flex flex-col items-center justify-center py-4 rounded-xl border-2 transition-colors ${
                                editForm.type === t
                                  ? 'border-navy bg-navy/5 text-navy' 
                                  : 'border-outline-light bg-white text-[#737782] hover:bg-surface-low'
                              }`}
                            >
                              <VehicleIcon type={t} size={32} />
                              <span className="font-body text-[11px] font-bold mt-2 uppercase tracking-widest">{t.replace('-', ' ')}</span>
                            </button>
                          ))}
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4 mt-4">
                        <Input label="YEAR" value={editForm.year} onChange={e => setEditForm({...editForm, year: e.target.value})} />
                        <Input label="COLOR" value={editForm.color} onChange={e => setEditForm({...editForm, color: e.target.value})} casing="words" />
                      </div>
                      <Input label="NICKNAME" value={editForm.nickname} onChange={e => setEditForm({...editForm, nickname: e.target.value})} casing="words" />
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
                  <div className="mt-4">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-display text-[20px] font-bold text-[#1c1b1b]">Recent Notifications</h3>
                      <button
                        className="font-body text-[12px] font-bold tracking-[0.08em] uppercase text-[#1b4b8f] hover:text-[#003470] transition-colors"
                        onClick={() => navigate('/notifications')}
                      >
                        VIEW ALL
                      </button>
                    </div>
                    <div className="space-y-3">
                      {recentNotifs.map(n => {
                        let iconBg = 'bg-[#d7e2ff]/50';
                        let iconColor = 'text-[#003470]';
                        
                        const t = (n.type || '').toLowerCase();
                        if (t.includes('parking') || n.category === 'wrong_parking') {
                          iconBg = 'bg-[#feae2c]/30';
                          iconColor = 'text-[#835500]';
                        } else if (t.includes('emergency') || t.includes('theft') || n.category === 'theft') {
                          iconBg = 'bg-[#ffdad6]/50';
                          iconColor = 'text-[#ba1a1a]';
                        } else if (n.resolved || t.includes('verified')) {
                          iconBg = 'bg-[#90f7ba]/40';
                          iconColor = 'text-[#005834]';
                        }

                        const tLower = (n.type || '').toLowerCase();
                        const cLower = (n.category || '').toLowerCase();
                        
                        let iconName = 'info';
                        if (tLower.includes('wrong parking') || cLower.includes('wrong_parking')) iconName = 'local_parking';
                        else if (tLower.includes('blocking')) iconName = 'block';
                        else if (tLower.includes('hit') || cLower.includes('hit_and_run')) iconName = 'car_crash';
                        else if (tLower.includes('damage')) iconName = 'build';
                        else if (tLower.includes('fire')) iconName = 'fire_truck';
                        else if (tLower.includes('theft') || cLower.includes('theft')) iconName = 'lock_reset';
                        else if (tLower.includes('tow')) iconName = 'minor_crash';
                        else if (tLower.includes('headlight')) iconName = 'light_mode';
                        else if (tLower.includes('window')) iconName = 'sensor_window';
                        else if (tLower.includes('accident') || tLower.includes('emergency share')) iconName = 'emergency_share';
                        else if (tLower.includes('emergency')) iconName = 'e911_emergency';
                        else if (tLower.includes('lost')) iconName = 'location_searching';
                        else if (tLower.includes('abandoned')) iconName = 'delete_forever';

                        return (
                          <div
                            key={n.id}
                            className="bg-white rounded-2xl border border-[#1c1b1b]/10 shadow-sm p-4 flex items-center gap-4 cursor-pointer hover:border-[#1c1b1b]/20 hover:-translate-y-0.5 transition-all"
                            onClick={() => navigate(`/notification-detail/${n.id}`)}
                          >
                            <div className={`w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 ${iconBg}`}>
                               <span className={`material-symbols-outlined text-[24px] ${iconColor}`}>
                                 {iconName}
                               </span>
                            </div>
                            <div className="flex-1">
                              <h4 className="font-display text-[16px] font-bold text-[#1c1b1b]">{n.type}</h4>
                              <p className="font-body text-[14px] text-[#434751] mt-0.5 line-clamp-1">{n.message || n.notes || "Report processed."}</p>
                            </div>
                            <p className="font-body text-[13px] text-[#737782] whitespace-nowrap self-start mt-1">{n.time}</p>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                )}

                {/* Refund & Cancel Section */}
                {vehicle.protectionStatus === 'active' && vehicle.refundGuaranteeExpiresAt && new Date() < new Date(vehicle.refundGuaranteeExpiresAt) && (
                  <div className="mt-6 bg-alert-red/5 border border-alert-red/20 rounded-xl p-4">
                     <h4 className="font-body text-sm font-bold text-alert-red mb-2">Cancel & Refund</h4>
                     <p className="font-body text-xs text-on-surface-muted mb-3">You are within your 7-day money-back guarantee. If you haven't received free physical stickers yet, you can cancel and refund.</p>
                     <button
                        className="text-alert-red text-xs font-bold uppercase tracking-wider hover:underline"
                        onClick={async () => {
                           if (await showConfirm('Cancel & Refund', 'Are you sure you want to cancel your subscription and request a refund?')) {
                             try {
                               const res = await api.post(`/subscriptions/cancel-refund/${vehicle.id}`);
                               if (res.data.success) {
                                 showAlert('Success', res.data.data.message);
                                 setVehicle(prev => ({ ...prev, protectionStatus: 'pending_payment' }));
                               }
                             } catch (err) {
                               showAlert('Error', err.response?.data?.error?.message || 'Failed to process refund');
                             }
                           }
                        }}
                     >
                       REQUEST REFUND
                     </button>
                  </div>
                )}
                {/* Delete Vehicle Section */}
                <div className="mt-8 mb-4">
                   <button
                      className="w-full bg-alert-red/10 text-alert-red border border-alert-red/20 font-body text-sm font-bold py-3 rounded-xl hover:bg-alert-red hover:text-white transition-colors uppercase tracking-widest flex items-center justify-center gap-2"
                      onClick={async () => {
                         if (await showConfirm('Delete Vehicle', 'Are you sure you want to permanently delete this vehicle? This will remove all associated contacts, QR codes, and orders, but your uploaded documents will be preserved.')) {
                           try {
                             const res = await api.delete(`/vehicles/${vehicle.id || vehicle._id}`);
                             if (res.data.success) {
                               // No need to show alert as we navigate away, but could be useful if dashboard expects it.
                               navigate('/dashboard');
                             }
                           } catch (err) {
                             showAlert('Error', err.response?.data?.error?.message || 'Failed to delete vehicle');
                           }
                         }
                      }}
                   >
                     <span className="material-symbols-outlined text-[18px]">delete_forever</span>
                     Delete Vehicle
                   </button>
                </div>

              </>
            )}

            {/* ── DOCUMENTS ── */}
            {activeTab === 1 && (
              <div className="flex flex-col gap-4">
                {vehicleDocs.map(doc => (
                  <DocCard 
                    key={doc.id || doc._id} 
                    doc={doc} 
                    vehicles={vehicles}
                    onClick={() => navigate(`/document-detail/${doc.id}`)} 
                  />
                ))}
                {vehicleDocs.length === 0 && (
                  <div className="text-center p-6 border-2 border-dashed border-outline-light rounded-xl mt-2">
                    <p className="font-body text-[13px] text-on-surface-muted">
                      No documents added yet.
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* ── CONTACTS ── */}
            {activeTab === 2 && (() => {
              const isProfileEmpty = !medicalProfile.dob && !medicalProfile.bloodType && !medicalProfile.conditions;
              return (
              <div className="space-y-4">
                {/* Medical ID Summary */}
                <div 
                  className="bg-white rounded-2xl border border-outline-light p-4 flex items-center justify-between cursor-pointer hover:bg-surface-low transition-colors"
                  onClick={() => navigate('/emergency-contacts')}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${isProfileEmpty ? 'bg-signal-amber/10 text-signal-amber' : 'bg-alert-red/10 text-alert-red'}`}>
                      {isProfileEmpty ? <AlertTriangle size={20} /> : <Shield size={20} />}
                    </div>
                    <div>
                      <h4 className="font-body text-sm font-semibold text-on-surface">Medical ID</h4>
                      <p className="font-body text-xs text-on-surface-muted">
                        {isProfileEmpty ? 'Setup Medical Info (Required)' : `Blood Type: ${medicalProfile.bloodType || 'Not set'}`}
                      </p>
                    </div>
                  </div>
                  {!isProfileEmpty && medicalProfile.bloodType && <Check size={18} className="text-verified-green" />}
                </div>

                <div className="space-y-3">
                  {vehicleContacts.map(c => (
                    <div key={c.id} className="bg-white rounded-xl border border-outline-light px-4 py-3 flex items-center justify-between group">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-navy/8 rounded-xl flex items-center justify-center font-display font-semibold text-navy text-sm flex-shrink-0">
                          {c.name.charAt(0)}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <p className="font-body text-sm font-semibold text-on-surface">{c.name}</p>
                            {c.isPrimary && (
                              <span className="bg-navy text-white text-[10px] font-bold px-2 py-0.5 rounded-full">Primary</span>
                            )}
                          </div>
                          <p className="font-body text-xs text-on-surface-muted">{c.relation} · {c.maskedPhone}</p>
                        </div>
                      </div>
                      <button onClick={() => handleDeleteContact(c.id)} className="p-2 text-alert-red hover:bg-alert-red/10 rounded-full transition-colors opacity-0 group-hover:opacity-100">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  ))}
                  
                  {vehicleContacts.length === 0 && (
                    <div className="text-center p-6 border-2 border-dashed border-outline-light rounded-xl">
                      <p className="font-body text-[13px] text-on-surface-muted">
                        No vehicle-specific emergency contacts.
                      </p>
                    </div>
                  )}
                </div>

                {vehicleContacts.length < 2 && (
                  <button 
                    onClick={() => setShowAddContact(true)}
                    className="w-full bg-white text-navy border-2 border-dashed border-navy/30 hover:border-navy/50 hover:bg-navy/5 rounded-xl py-3.5 font-body text-sm font-semibold flex items-center justify-center gap-2 transition-colors mt-2"
                  >
                    <Plus size={18} /> Add Contact for this Vehicle
                  </button>
                )}
                
                <button
                  className="w-full bg-surface-low text-on-surface-muted rounded-xl py-3.5 font-body text-sm font-semibold flex items-center justify-center gap-2 hover:bg-outline-light/50 transition-colors mt-2"
                  onClick={() => navigate('/emergency-contacts')}
                >
                  Manage Global Medical ID & Contacts
                </button>
              </div>
              );
            })()}

            {/* ── QR ── */}
            {activeTab === 3 && (
              <div className="flex flex-col items-center gap-5 py-4">
                {vehicle.protectionStatus !== 'active' ? (
                   <div className="bg-white rounded-2xl border-2 border-outline-light p-8 text-center max-w-sm">
                      <div className="w-16 h-16 bg-surface-low rounded-full flex items-center justify-center mx-auto mb-4">
                         <QrCode size={32} className="text-on-surface-muted" />
                      </div>
                      <h4 className="font-display text-lg font-bold text-on-surface mb-2">Digital ID Locked</h4>
                      <p className="font-body text-sm text-on-surface-muted mb-6">
                        Your QR token is inactive because your vehicle protection is not active.
                      </p>
                      {vehicle.protectionStatus === 'pending_payment' && (
                        <Button fullWidth onClick={() => navigate('/subscription-payment', { state: { vehicle } })}>
                          ACTIVATE NOW
                        </Button>
                      )}
                   </div>
                ) : (
                  <>
                    <motion.div
                      className="bg-white rounded-2xl border-2 border-asphalt p-4 shadow-plate flex items-center justify-center"
                      initial={{ rotateX: 90, opacity: 0 }}
                      animate={{ rotateX: 0, opacity: 1 }}
                      transition={{ type: 'spring', damping: 16, stiffness: 100 }}
                      style={{ perspective: 800, transformOrigin: 'center top', width: 200, height: 200 }}
                    >
                      <RoadLinkQR url={`${window.location.origin}/scan-landing?qr=${vehicle.qrToken}`} size={160} />
                    </motion.div>
                    <p className="font-mono text-xs tracking-wider text-on-surface-muted">{vehicle.qrToken}</p>
                    <div className="flex w-full">
                      <button
                        className="flex-1 border-2 border-navy text-navy rounded-xl py-3 font-body text-sm font-semibold flex items-center justify-center gap-2 hover:bg-navy/5 transition-colors"
                        onClick={() => navigate('/qr-detail', { state: { vehicle } })}
                      >
                        <QrCode size={16} /> Full QR Page
                      </button>
                    </div>
                  </>
                )}
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Add Contact Modal */}
      <AnimatePresence>
        {showAddContact && (
          <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 pb-0">
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }} 
              className="absolute inset-0 bg-black/40 backdrop-blur-sm" 
              onClick={() => setShowAddContact(false)} 
            />
            <motion.div 
              initial={{ y: "100%" }} 
              animate={{ y: 0 }} 
              exit={{ y: "100%" }} 
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="w-full max-w-md bg-white rounded-t-[2rem] sm:rounded-2xl p-6 relative z-10 shadow-xl max-h-[90vh] overflow-y-auto"
            >
              <div className="flex justify-between items-center mb-6">
                <h3 className="font-display text-xl font-bold text-on-surface">Add Vehicle Contact</h3>
                <button onClick={() => setShowAddContact(false)} className="p-2 text-on-surface-muted hover:text-navy hover:bg-surface-low rounded-full transition-colors">
                  <X size={20} />
                </button>
              </div>

              <div className="space-y-5">
                <Input label="Full Name" value={contactForm.name} casing="words"
                  onChange={e => setContactForm(f => ({ ...f, name: e.target.value }))}
                  placeholder="e.g. Rahul Sharma" />

                <Input label="Phone Number" prefix="+91" type="tel" inputMode="numeric"
                  value={contactForm.phone}
                  onChange={e => setContactForm(f => ({ ...f, phone: e.target.value.replace(/\D/g, '').slice(0, 10) }))}
                  placeholder="98765 43210" />

                <div>
                  <p className="font-body text-[12px] font-bold tracking-[0.08em] text-on-surface-muted uppercase mb-3">Relation</p>
                  <div className="flex flex-wrap gap-2">
                    {relations.map(r => (
                      <button
                        key={r}
                        onClick={() => setContactForm(f => ({ ...f, relation: r }))}
                        className={`px-4 py-2 rounded-xl font-body text-sm font-semibold border-2 transition-colors ${
                          contactForm.relation === r
                            ? 'border-navy text-navy bg-navy/5'
                            : 'border-outline-light text-on-surface hover:bg-surface-low'
                        }`}
                      >
                        {r}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex items-center justify-between py-2 border-t border-outline-light mt-2 pt-4">
                  <div>
                    <p className="font-body text-base font-semibold text-on-surface">Make Primary</p>
                    <p className="font-body text-xs text-on-surface-muted">This contact will be notified first</p>
                  </div>
                  <Toggle on={contactForm.isPrimary} onChange={v => setContactForm(f => ({ ...f, isPrimary: v }))} />
                </div>

                <div className="pt-2">
                  <Button fullWidth onClick={handleAddContact} disabled={!contactForm.name || contactForm.phone.length < 10}>
                    Save Contact
                  </Button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Image Options Modal */}
      <AnimatePresence>
        {showImageOptions && (
          <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 pb-0">
             <motion.div 
               initial={{opacity:0}} 
               animate={{opacity:1}} 
               exit={{opacity:0}} 
               className="absolute inset-0 bg-black/40 backdrop-blur-sm" 
               onClick={() => setShowImageOptions(false)} 
             />
             <motion.div 
               initial={{y:"100%"}} 
               animate={{y:0}} 
               exit={{y:"100%"}} 
               transition={{ type: 'spring', damping: 25, stiffness: 300 }}
               className="w-full max-w-md bg-white rounded-t-[2rem] sm:rounded-2xl p-6 relative z-10 shadow-xl space-y-3 pb-8 sm:pb-6"
             >
                <h3 className="font-display text-xl font-bold text-on-surface text-center mb-4">Vehicle Photo</h3>
                <button 
                  onClick={() => { setShowImageOptions(false); fileInputRef.current?.click(); }}
                  className="w-full py-4 bg-navy/5 hover:bg-navy/10 text-navy font-semibold rounded-xl transition-colors text-center"
                >
                  Change Photo
                </button>
                <button 
                  onClick={handleRemoveImage}
                  className="w-full py-4 bg-alert-red/5 hover:bg-alert-red/10 text-alert-red font-semibold rounded-xl transition-colors text-center"
                >
                  Remove Photo
                </button>
                <button 
                  onClick={() => setShowImageOptions(false)}
                  className="w-full py-4 text-on-surface-muted font-semibold hover:bg-surface-low rounded-xl transition-colors text-center mt-2"
                >
                  Cancel
                </button>
             </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
