import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Trash2, Edit2, ShieldCheck, User, UserPlus, Info, AlertTriangle } from 'lucide-react';
import AppHeader from '../../components/AppHeader';
import Button from '../../components/Button';
import Input from '../../components/Input';
import Toggle from '../../components/Toggle';
import { useAppData } from "../../context/AppContext";

const relations = ['Family', 'Friend', 'Colleague', 'Spouse', 'Brother', 'Other'];

export default function EmergencyContacts() {
  const { contacts, addContact, updateContact, deleteContact } = useAppData();
  
  // Modal states
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

  const handleSave = () => {
    if (form.name && form.phone.length >= 10) {
      if (showEditModal && selectedContact) {
        updateContact(selectedContact.id, form);
      } else {
        addContact(form);
      }
      closeModals();
    }
  };

  const handleDelete = () => {
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
      <AppHeader title="Emergency Contacts" />

      <main className="max-w-2xl mx-auto px-4 pt-6 space-y-8">
        {/* Action Section */}
        <section className="flex flex-col gap-4">
          <button 
            onClick={openAddModal}
            disabled={contacts.length >= 5}
            className="w-full bg-[#feae2c] text-[#291800] flex items-center justify-center gap-3 py-4 px-6 rounded-xl font-bold active:scale-[0.98] transition-all shadow-[0px_4px_12px_rgba(26,26,26,0.08)] border border-[#835500]/20 group disabled:opacity-50 disabled:active:scale-100"
          >
            <Plus size={20} className="font-bold group-hover:rotate-90 transition-transform" strokeWidth={2.5} />
            <span className="font-body text-[12px] font-bold tracking-[0.08em] uppercase">Add Emergency Contact</span>
          </button>
        </section>

        {/* Contacts List */}
        <section className="space-y-4">
          <div className="flex justify-between items-center px-1">
            <h2 className="font-display text-[20px] font-semibold text-[#1c1b1b]">Registered Contacts</h2>
            <span className="font-body text-[12px] font-bold tracking-[0.08em] text-[#737782] uppercase">{contacts.length}/5 Slots</span>
          </div>

          <div className="space-y-4">
            <AnimatePresence mode="popLayout">
              {contacts.map((c) => (
                <motion.div
                  key={c.id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
                  className="bg-white p-5 rounded-xl border border-[#e5e2e1] flex items-start gap-4 hover:border-[#003470]/30 transition-colors group"
                >
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 ${c.isPrimary ? 'bg-[#003470]/10 text-[#003470]' : 'bg-[#eae7e7] text-[#434751]'}`}>
                    {c.isPrimary ? <ShieldCheck size={24} className="fill-current/20" /> : <User size={24} />}
                  </div>
                  
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-display text-[20px] font-semibold text-[#1c1b1b]">{c.name}</h3>
                      {c.isPrimary && (
                        <span className="bg-[#003470] text-white px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-tighter">Primary Contact</span>
                      )}
                    </div>
                    <p className="font-body text-[14px] text-[#434751]">{c.relation}</p>
                    <p className="font-mono text-[14px] font-medium text-[#003470] mt-2 tracking-wider">{c.maskedPhone}</p>
                  </div>
                  
                  <div className="flex flex-col gap-2">
                    <button 
                      onClick={() => openEditModal(c)}
                      className="p-2 rounded-full hover:bg-[#eae7e7] transition-colors text-[#737782] hover:text-[#1c1b1b] active:scale-90"
                    >
                      <Edit2 size={20} strokeWidth={2} />
                    </button>
                    <button 
                      onClick={() => openDeleteModal(c)}
                      className="p-2 rounded-full hover:bg-[#ffdad6]/50 transition-colors text-[#ba1a1a] active:scale-90"
                    >
                      <Trash2 size={20} strokeWidth={2} />
                    </button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            {/* Empty Slot State */}
            {contacts.length === 0 && (
              <motion.div 
                initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                onClick={openAddModal}
                className="border-2 border-dashed border-[#c3c6d2] rounded-xl p-8 flex flex-col items-center justify-center text-center gap-3 bg-white hover:bg-[#f6f3f2] active:scale-[0.98] transition-all cursor-pointer group"
              >
                <div className="w-10 h-10 rounded-full bg-[#f6f3f2] flex items-center justify-center border border-[#c3c6d2]/50 group-hover:bg-white transition-colors">
                  <UserPlus size={20} className="text-[#737782] group-hover:text-[#003470] transition-colors" />
                </div>
                <p className="font-body text-[14px] text-[#737782] italic max-w-[250px] group-hover:text-[#434751] transition-colors">
                  Add at least one contact so we know who to notify in an emergency.
                </p>
              </motion.div>
            )}
          </div>
        </section>

        {/* Reassurance Footer */}
        <footer className="pt-4 border-t border-[#1c1b1b]/5">
          <div className="bg-[#f6f3f2] p-4 rounded-lg flex gap-3 items-start">
            <Info size={20} className="text-[#005834] shrink-0 mt-0.5" />
            <p className="font-body text-[14px] text-[#434751] italic leading-snug">
              Emergency contacts are only notified during critical theft or safety events. Your data remains encrypted and is only accessed by automated legal protocols.
            </p>
          </div>
        </footer>
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
                <Input label="Full Name" value={form.name}
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
                <Button className="flex-1 bg-[#1B4B8F] text-white border-none" onClick={handleSave} disabled={!form.name || form.phone.length < 10}>
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
                  onClick={handleDelete}
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
