import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Trash2, Phone } from 'lucide-react';
import AppHeader from '../../components/AppHeader';
import Button from '../../components/Button';
import Input from '../../components/Input';
import Toggle from '../../components/Toggle';
import { useDemoData } from '../../context/DemoContext';

const relations = ['Family', 'Friend', 'Colleague', 'Other'];

export default function EmergencyContacts() {
  const { contacts, addContact, deleteContact, setPrimaryContact } = useDemoData();
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: '', phone: '', relation: 'Family', isPrimary: false });

  const handleAdd = () => {
    if (form.name && form.phone.length >= 10) {
      addContact(form);
      setShowForm(false);
      setForm({ name: '', phone: '', relation: 'Family', isPrimary: false });
    }
  };

  return (
    <div className="min-h-screen bg-fog flex flex-col">
      <AppHeader title="Emergency Contacts" />

      <div className="flex-1 px-5 py-5 space-y-5">
        {/* Description */}
        <div className="bg-navy/5 border border-navy/15 rounded-xl px-4 py-3">
          <p className="font-body text-xs text-on-surface-muted">
            If someone reports a serious accident or theft, these contacts will be notified automatically via SMS and WhatsApp.
          </p>
        </div>

        {/* Contact list */}
        <div className="space-y-3">
          <AnimatePresence>
            {contacts.map((c) => (
              <motion.div
                key={c.id}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
                className="bg-white rounded-2xl border border-outline-light px-4 py-4 flex items-center gap-3"
              >
                {/* Avatar */}
                <div className="w-11 h-11 bg-navy/8 rounded-xl flex items-center justify-center font-display text-lg font-semibold text-navy flex-shrink-0">
                  {c.name.charAt(0)}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="font-body text-sm font-semibold text-on-surface">{c.name}</p>
                    {c.isPrimary && (
                      <span className="bg-navy text-white text-[10px] font-bold px-2 py-0.5 rounded-full flex-shrink-0">
                        Primary
                      </span>
                    )}
                  </div>
                  <p className="font-body text-xs text-on-surface-muted">{c.relation}</p>
                  <p className="font-mono text-xs text-on-surface-muted">{c.maskedPhone}</p>
                </div>

                <div className="flex items-center gap-2">
                  {/* Set Primary */}
                  {!c.isPrimary && (
                    <button
                      className="p-2 rounded-xl hover:bg-navy/5 text-on-surface-muted hover:text-navy transition-colors"
                      onClick={() => setPrimaryContact(c.id)}
                      title="Set as primary"
                    >
                      <Phone size={15} />
                    </button>
                  )}
                  {/* Delete */}
                  <button
                    className="p-2 rounded-xl hover:bg-alert-red/8 text-on-surface-muted hover:text-alert-red transition-colors"
                    onClick={() => deleteContact(c.id)}
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Add form */}
        <AnimatePresence>
          {showForm ? (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="bg-white rounded-2xl border border-outline-light p-5 space-y-4"
            >
              <h3 className="font-display text-headline-sm text-on-surface">New Contact</h3>

              <Input label="Full Name" value={form.name}
                onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                placeholder="e.g. Rahul Sharma" />

              <Input label="Phone Number" prefix="+91" type="tel" inputMode="numeric"
                value={form.phone}
                onChange={e => setForm(f => ({ ...f, phone: e.target.value.replace(/\D/g, '').slice(0, 10) }))}
                placeholder="98765 43210" />

              {/* Relation select */}
              <div>
                <p className="font-body text-label-caps text-on-surface-muted uppercase tracking-widest mb-2">Relation</p>
                <div className="flex flex-wrap gap-2">
                  {relations.map(r => (
                    <button
                      key={r}
                      onClick={() => setForm(f => ({ ...f, relation: r }))}
                      className={`px-3 py-1.5 rounded-xl font-body text-sm font-semibold border-2 transition-colors ${
                        form.relation === r
                          ? 'border-navy text-navy bg-navy/5'
                          : 'border-outline-light text-on-surface-muted'
                      }`}
                    >
                      {r}
                    </button>
                  ))}
                </div>
              </div>

              {/* Make primary toggle */}
              <div className="flex items-center justify-between py-2">
                <div>
                  <p className="font-body text-sm font-semibold text-on-surface">Make Primary</p>
                  <p className="font-body text-xs text-on-surface-muted">This contact will be notified first</p>
                </div>
                <Toggle on={form.isPrimary} onChange={v => setForm(f => ({ ...f, isPrimary: v }))} />
              </div>

              <div className="flex gap-3">
                <Button variant="outline" onClick={() => setShowForm(false)}>Cancel</Button>
                <Button
                  className="flex-1"
                  onClick={handleAdd}
                  disabled={!form.name || form.phone.length < 10}
                >
                  Save Contact
                </Button>
              </div>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <Button variant="secondary" fullWidth onClick={() => setShowForm(true)}>
                <Plus size={18} /> Add Emergency Contact
              </Button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Empty state */}
        {contacts.length === 0 && !showForm && (
          <div className="text-center py-8 space-y-2">
            <p className="font-display text-headline-sm text-on-surface">No contacts yet</p>
            <p className="font-body text-body-sm text-on-surface-muted">
              Add at least one contact so we know who to notify in an emergency.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
