import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Trash2, Edit2, ShieldCheck, User, UserPlus, Info, AlertTriangle, Activity, Heart, FileText, ChevronDown, ChevronUp } from 'lucide-react';
import AppHeader from '../../components/AppHeader';
import Button from '../../components/Button';
import Input from '../../components/Input';
import Toggle from '../../components/Toggle';
import { useAppData } from "../../context/AppContext";

const relations = ['Family', 'Friend', 'Colleague', 'Spouse', 'Brother', 'Other'];

export default function EmergencyContacts() {
  const { contacts, medicalProfile, setMedicalProfile, addContact, updateContact, deleteContact } = useAppData();
  

  
  // Section toggle states
  const [openSection, setOpenSection] = useState('medical'); // 'medical' or 'contacts'
  const [isEditingMedical, setIsEditingMedical] = useState(false);
  const [medicalForm, setMedicalForm] = useState(medicalProfile);
  const isProfileEmpty = !medicalProfile.dob && !medicalProfile.bloodType && !medicalProfile.conditions;

  // Sync when medicalProfile changes
  useEffect(() => {
    setMedicalForm(medicalProfile);
  }, [medicalProfile]);

  // Modal states for contacts
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  
  // Selected contact for edit/delete
  const [selectedContact, setSelectedContact] = useState(null);
  
  // Form state
  const [form, setForm] = useState({ name: '', phone: '', relation: 'Family', isPrimary: false });

  const openAddModal = () => {
    setForm({ name: '', phone: '', relation: 'Family', isPrimary: false });
    setShowAddModal(true);
  };

  const openEditModal = (contact) => {
    setSelectedContact(contact);
    setForm({ 
      name: contact.name, 
      phone: contact.phone || contact.maskedPhone.replace(/\D/g, '').replace('91', ''),
      relation: contact.relation, 
      isPrimary: contact.isPrimary 
    });
    setShowEditModal(true);
  };

  const openDeleteModal = (contact) => {
    setSelectedContact(contact);
    setShowDeleteModal(true);
  };

  const handleSaveContact = () => {
    if (form.name && form.phone.length >= 10) {
      if (showEditModal && selectedContact) {
        updateContact(selectedContact.id, form);
      } else {
        addContact(form);
      }
      closeModals();
    }
  };

  const handleDeleteContact = () => {
    if (selectedContact) {
      deleteContact(selectedContact.id);
      closeModals();
    }
  };

  const closeModals = () => {
    setShowAddModal(false);
    setShowEditModal(false);
    setShowDeleteModal(false);
    setSelectedContact(null);
  };

  const handleSaveMedical = () => {
    setMedicalProfile(medicalForm);
    setIsEditingMedical(false);
  };

  const modalAnimation = {
    initial: { opacity: 0, scale: 0.95, y: 20 },
    animate: { opacity: 1, scale: 1, y: 0 },
    exit: { opacity: 0, scale: 0.95, y: 20 },
    transition: { type: 'spring', damping: 25, stiffness: 300 }
  };
  const overlayAnimation = {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 }
  };

  return (
    <div className="min-h-screen bg-[#fcf9f8] text-[#1c1b1b] font-body pb-24">
      <AppHeader title="Emergency & Medical Profile" />

      <main className="max-w-2xl mx-auto px-4 pt-6 space-y-6">
        {/* Reassurance Header */}
        <div className="bg-[#f6f3f2] p-4 rounded-xl flex gap-3 items-start border border-[#e5e2e1]">
          <ShieldCheck size={24} className="text-[#005834] shrink-0 mt-0.5" />
          <p className="font-body text-[14px] text-[#434751] italic leading-snug">
            This information is securely stored and globally available across all your vehicles. It is only accessed by authorized responders during critical emergencies.
          </p>
        </div>

        {/* ── MEDICAL INFORMATION SECTION ── */}
        <section className="bg-white rounded-2xl border border-[#e5e2e1] overflow-hidden shadow-sm">
          <button 
            className="w-full flex items-center justify-between p-5 hover:bg-[#fcf9f8] transition-colors"
            onClick={() => setOpenSection(openSection === 'medical' ? null : 'medical')}
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#ffdad6]/40 flex items-center justify-center text-[#ba1a1a]">
                <Activity size={20} />
              </div>
              <div className="text-left">
                <h2 className="font-display text-[18px] font-semibold text-[#1c1b1b]">Medical ID & Details</h2>
                <p className="font-body text-[13px] text-[#737782]">Personal and critical health info</p>
              </div>
            </div>
            {openSection === 'medical' ? <ChevronUp size={20} className="text-[#737782]" /> : <ChevronDown size={20} className="text-[#737782]" />}
          </button>

          <AnimatePresence>
            {openSection === 'medical' && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden border-t border-[#e5e2e1]"
              >
                <div className="p-5 space-y-6 bg-[#fcf9f8]/50">
                  {!isEditingMedical ? (
                    <div className="space-y-6">
                      {isProfileEmpty && (
                        <div 
                          className="bg-signal-amber/10 border border-signal-amber/20 rounded-xl p-4 flex items-center gap-3 cursor-pointer hover:bg-signal-amber/20 transition-colors" 
                          onClick={() => setIsEditingMedical(true)}
                        >
                          <AlertTriangle size={20} className="text-signal-amber shrink-0" />
                          <div>
                            <h4 className="font-body text-[14px] font-semibold text-signal-amber">Medical ID Incomplete</h4>
                            <p className="font-body text-[12px] text-signal-amber/80 mt-0.5">Tap here to add your medical details for emergencies.</p>
                          </div>
                        </div>
                      )}

                      {/* Personal Details */}
                      <div>
                        <h3 className="font-body text-[12px] font-bold text-[#737782] uppercase tracking-wider mb-3">Personal Details</h3>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <p className="font-body text-[11px] text-[#737782]">Date of Birth</p>
                            <p className="font-body text-[14px] font-medium">{medicalProfile.dob || 'Not provided'}</p>
                          </div>
                          <div>
                            <p className="font-body text-[11px] text-[#737782]">Blood Type</p>
                            <p className="font-body text-[14px] font-medium text-[#ba1a1a] font-bold">{medicalProfile.bloodType || 'Not provided'}</p>
                          </div>
                          <div className="col-span-2">
                            <p className="font-body text-[11px] text-[#737782]">Home Address</p>
                            <p className="font-body text-[14px] font-medium">{medicalProfile.address || 'Not provided'}</p>
                          </div>
                        </div>
                      </div>

                      <div className="h-px bg-[#e5e2e1]" />

                      {/* Medical Information */}
                      {(medicalProfile.conditions || medicalProfile.allergies || medicalProfile.prescriptions || medicalProfile.devices) && (
                        <>
                          <div>
                            <h3 className="font-body text-[12px] font-bold text-[#737782] uppercase tracking-wider mb-3">Health Information</h3>
                            <div className="space-y-4">
                              {medicalProfile.conditions && (
                                <div>
                                  <p className="font-body text-[11px] text-[#737782]">Medical Conditions</p>
                                  <p className="font-body text-[14px] font-medium">{medicalProfile.conditions}</p>
                                </div>
                              )}
                              {medicalProfile.allergies && (
                                <div>
                                  <p className="font-body text-[11px] text-[#737782]">Allergies</p>
                                  <p className="font-body text-[14px] font-medium">{medicalProfile.allergies}</p>
                                </div>
                              )}
                              {medicalProfile.prescriptions && (
                                <div>
                                  <p className="font-body text-[11px] text-[#737782]">Prescriptions</p>
                                  <p className="font-body text-[14px] font-medium">{medicalProfile.prescriptions}</p>
                                </div>
                              )}
                              {medicalProfile.devices && (
                                <div>
                                  <p className="font-body text-[11px] text-[#737782]">Medical Devices</p>
                                  <p className="font-body text-[14px] font-medium">{medicalProfile.devices}</p>
                                </div>
                              )}
                            </div>
                          </div>
                          
                          <div className="h-px bg-[#e5e2e1] my-5" />
                        </>
                      )}

                      {/* Primary Doctor */}
                      {(medicalProfile.doctorName || medicalProfile.doctorPhone) && (
                        <div className="mb-5">
                          <h3 className="font-body text-[12px] font-bold text-[#737782] uppercase tracking-wider mb-3">Primary Doctor</h3>
                          <div className="grid grid-cols-2 gap-4">
                            {medicalProfile.doctorName && (
                              <div>
                                <p className="font-body text-[11px] text-[#737782]">Name</p>
                                <p className="font-body text-[14px] font-medium">{medicalProfile.doctorName}</p>
                              </div>
                            )}
                            {medicalProfile.doctorPhone && (
                              <div>
                                <p className="font-body text-[11px] text-[#737782]">Contact</p>
                                <p className="font-body text-[14px] font-medium">{medicalProfile.doctorPhone}</p>
                              </div>
                            )}
                          </div>
                        </div>
                      )}

                      <Button fullWidth variant="outline" onClick={() => setIsEditingMedical(true)}>
                        <Edit2 size={18} className="mr-2" /> Edit Medical ID
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-5">
                      <div className="space-y-4">
                        <h3 className="font-body text-[12px] font-bold text-[#737782] uppercase tracking-wider">Personal Details</h3>
                        <div className="grid grid-cols-2 gap-3">
                          <Input label="DOB" type="date" value={medicalForm.dob || ''} onChange={e => setMedicalForm(f => ({ ...f, dob: e.target.value }))} />
                          <div className="flex flex-col gap-1.5">
                            <label className="font-body text-[12px] font-bold text-on-surface-muted uppercase tracking-[0.08em]">
                              Blood Type
                            </label>
                            <div className="flex items-center gap-2 rounded-lg border bg-white border-outline-light focus-within:border-navy focus-within:ring-2 focus-within:ring-navy/15 transition-all duration-150">
                              <select 
                                value={medicalForm.bloodType || ''} 
                                onChange={e => setMedicalForm(f => ({ ...f, bloodType: e.target.value }))}
                                className="flex-1 min-w-0 py-[15px] px-4 bg-transparent font-body text-body-md text-on-surface focus:outline-none"
                              >
                                <option value="">Select</option>
                                <option value="A+">A+</option>
                                <option value="A-">A-</option>
                                <option value="B+">B+</option>
                                <option value="B-">B-</option>
                                <option value="AB+">AB+</option>
                                <option value="AB-">AB-</option>
                                <option value="O+">O+</option>
                                <option value="O-">O-</option>
                                <option value="Unknown">Unknown</option>
                              </select>
                            </div>
                          </div>
                        </div>
                        <Input label="Home Address" value={medicalForm.address || ''} onChange={e => setMedicalForm(f => ({ ...f, address: e.target.value }))} />
                      </div>

                      <div className="space-y-4">
                        <h3 className="font-body text-[12px] font-bold text-[#737782] uppercase tracking-wider">Health Information</h3>
                        <Input label="Medical Conditions (e.g., Diabetes, Asthma)" value={medicalForm.conditions} onChange={e => setMedicalForm(f => ({ ...f, conditions: e.target.value }))} />
                        <Input label="Allergies (Medications, Food, etc.)" value={medicalForm.allergies} onChange={e => setMedicalForm(f => ({ ...f, allergies: e.target.value }))} />
                        <Input label="Current Prescriptions & Dosages" value={medicalForm.prescriptions} onChange={e => setMedicalForm(f => ({ ...f, prescriptions: e.target.value }))} />
                        <Input label="Medical Devices (e.g., Pacemaker)" value={medicalForm.devices} onChange={e => setMedicalForm(f => ({ ...f, devices: e.target.value }))} />
                      </div>

                      <div className="space-y-4">
                        <h3 className="font-body text-[12px] font-bold text-[#737782] uppercase tracking-wider">Primary Doctor</h3>
                        <Input label="Doctor's Name" value={medicalForm.doctorName} onChange={e => setMedicalForm(f => ({ ...f, doctorName: e.target.value }))} casing="words" />
                        <Input label="Doctor's Contact Number" value={medicalForm.doctorPhone} onChange={e => setMedicalForm(f => ({ ...f, doctorPhone: e.target.value }))} />
                      </div>

                      <div className="flex gap-3 pt-2">
                        <Button fullWidth variant="outline" onClick={() => setIsEditingMedical(false)}>Cancel</Button>
                        <Button fullWidth onClick={handleSaveMedical}>Save Medical ID</Button>
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </section>

        {/* ── EMERGENCY CONTACTS SECTION ── */}
        <section className="bg-white rounded-2xl border border-[#e5e2e1] overflow-hidden shadow-sm">
          <button 
            className="w-full flex items-center justify-between p-5 hover:bg-[#fcf9f8] transition-colors"
            onClick={() => setOpenSection(openSection === 'contacts' ? null : 'contacts')}
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#003470]/10 flex items-center justify-center text-[#003470]">
                <Heart size={20} />
              </div>
              <div className="text-left">
                <h2 className="font-display text-[18px] font-semibold text-[#1c1b1b]">Emergency Contacts</h2>
                <p className="font-body text-[13px] text-[#737782]">{contacts.length}/5 Registered contacts</p>
              </div>
            </div>
            {openSection === 'contacts' ? <ChevronUp size={20} className="text-[#737782]" /> : <ChevronDown size={20} className="text-[#737782]" />}
          </button>

          <AnimatePresence>
            {openSection === 'contacts' && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden border-t border-[#e5e2e1]"
              >
                <div className="p-5 space-y-4 bg-[#fcf9f8]/50">
                  <AnimatePresence mode="popLayout">
                    {contacts.map((c) => (
                      <motion.div
                        key={c.id}
                        layout
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
                        className="bg-white p-4 rounded-xl border border-[#e5e2e1] flex items-start gap-4 hover:border-[#003470]/30 transition-colors group"
                      >
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${c.isPrimary ? 'bg-[#003470]/10 text-[#003470]' : 'bg-[#eae7e7] text-[#434751]'}`}>
                          {c.isPrimary ? <ShieldCheck size={20} className="fill-current/20" /> : <User size={20} />}
                        </div>
                        
                        <div className="flex-1 space-y-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <h3 className="font-display text-[16px] font-semibold text-[#1c1b1b]">{c.name}</h3>
                            {c.isPrimary && (
                              <span className="bg-[#003470] text-white px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-tighter">Primary</span>
                            )}
                          </div>
                          <p className="font-body text-[12px] text-[#434751]">{c.relation}</p>
                          <p className="font-mono text-[13px] font-medium text-[#003470] mt-1 tracking-wider">{c.maskedPhone}</p>
                        </div>
                        
                        <div className="flex flex-col gap-1">
                          <button 
                            onClick={() => openEditModal(c)}
                            className="p-1.5 rounded-full hover:bg-[#eae7e7] transition-colors text-[#737782] hover:text-[#1c1b1b]"
                          >
                            <Edit2 size={16} strokeWidth={2} />
                          </button>
                          <button 
                            onClick={() => openDeleteModal(c)}
                            className="p-1.5 rounded-full hover:bg-[#ffdad6]/50 transition-colors text-[#ba1a1a]"
                          >
                            <Trash2 size={16} strokeWidth={2} />
                          </button>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>

                  {contacts.length < 5 && (
                    <button 
                      onClick={openAddModal}
                      className="w-full bg-[#feae2c] text-[#291800] flex items-center justify-center gap-2 py-3 px-6 rounded-xl font-bold active:scale-[0.98] transition-all shadow-sm border border-[#835500]/20 group mt-2"
                    >
                      <Plus size={18} className="font-bold group-hover:rotate-90 transition-transform" strokeWidth={2.5} />
                      <span className="font-body text-[12px] font-bold tracking-[0.08em] uppercase">Add New Contact</span>
                    </button>
                  )}

                  {contacts.length === 0 && (
                    <motion.div 
                      initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                      className="text-center p-6 border-2 border-dashed border-[#c3c6d2] rounded-xl mt-2"
                    >
                      <p className="font-body text-[13px] text-[#737782]">
                        No emergency contacts added yet. Please add at least one close contact.
                      </p>
                    </motion.div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </section>

      </main>

      {/* MODALS */}
      <AnimatePresence>
        {(showAddModal || showEditModal) && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div {...overlayAnimation} className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={closeModals} />
            <motion.div {...modalAnimation} className="bg-white rounded-2xl p-6 w-full max-w-md relative z-10 shadow-xl overflow-hidden flex flex-col max-h-[90vh]">
              <h3 className="font-display text-[24px] font-semibold text-[#1c1b1b] mb-6">
                {showEditModal ? 'Edit Contact' : 'New Contact'}
              </h3>

              <div className="space-y-5 overflow-y-auto pr-2 pb-2">
                <Input label="Full Name" value={form.name} casing="words"
                  onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                  placeholder="e.g. Rahul Sharma" />

                <Input label="Phone Number" prefix="+91" type="tel" inputMode="numeric"
                  value={form.phone}
                  onChange={e => setForm(f => ({ ...f, phone: e.target.value.replace(/\D/g, '').slice(0, 10) }))}
                  placeholder="98765 43210" />

                <div>
                  <p className="font-body text-[12px] font-bold tracking-[0.08em] text-[#737782] uppercase mb-3">Relation</p>
                  <div className="flex flex-wrap gap-2">
                    {relations.map(r => (
                      <button
                        key={r}
                        onClick={() => setForm(f => ({ ...f, relation: r }))}
                        className={`px-4 py-2 rounded-xl font-body text-[14px] font-semibold border-2 transition-colors ${
                          form.relation === r
                            ? 'border-[#003470] text-[#003470] bg-[#003470]/5'
                            : 'border-[#e5e2e1] text-[#434751] hover:bg-[#f6f3f2]'
                        }`}
                      >
                        {r}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex items-center justify-between py-2 border-t border-[#e5e2e1] mt-2 pt-4">
                  <div>
                    <p className="font-body text-[16px] font-semibold text-[#1c1b1b]">Make Primary</p>
                    <p className="font-body text-[12px] text-[#434751]">This contact will be notified first</p>
                  </div>
                  <Toggle on={form.isPrimary} onChange={v => setForm(f => ({ ...f, isPrimary: v }))} />
                </div>
              </div>

              <div className="flex gap-3 mt-6 pt-4 border-t border-[#e5e2e1]">
                <Button variant="outline" className="flex-1" onClick={closeModals}>Cancel</Button>
                <Button className="flex-1 bg-[#1B4B8F] text-white border-none" onClick={handleSaveContact} disabled={!form.name || form.phone.length < 10}>
                  {showEditModal ? 'Save Changes' : 'Add Contact'}
                </Button>
              </div>
            </motion.div>
          </div>
        )}

        {showDeleteModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div {...overlayAnimation} className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={closeModals} />
            <motion.div {...modalAnimation} className="bg-white rounded-2xl p-6 w-full max-w-sm relative z-10 shadow-2xl text-center">
              <div className="w-16 h-16 rounded-full bg-[#ffdad6] mx-auto mb-4 flex items-center justify-center">
                <AlertTriangle size={32} className="text-[#ba1a1a]" />
              </div>
              <h3 className="font-display text-[24px] font-semibold text-[#1c1b1b] mb-2">Delete Contact?</h3>
              <p className="font-body text-[16px] text-[#434751] mb-8">
                Are you sure you want to remove <strong className="text-[#1c1b1b] font-semibold">{selectedContact?.name}</strong> from your emergency contacts? This action cannot be undone.
              </p>
              
              <div className="flex flex-col gap-3">
                <button 
                  onClick={handleDeleteContact}
                  className="w-full bg-[#ba1a1a] text-white font-body text-[14px] font-bold tracking-[0.08em] uppercase py-3.5 rounded-xl hover:bg-[#93000a] active:scale-[0.98] transition-all"
                >
                  Yes, Delete Contact
                </button>
                <button 
                  onClick={closeModals}
                  className="w-full bg-white text-[#434751] border-2 border-[#e5e2e1] font-body text-[14px] font-bold tracking-[0.08em] uppercase py-3.5 rounded-xl hover:bg-[#f6f3f2] active:scale-[0.98] transition-all"
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
