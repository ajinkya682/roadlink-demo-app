import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Trash2 } from 'lucide-react';
import AppHeader from '../../components/AppHeader';
import Button from '../../components/Button';
import Input from '../../components/Input';
import styles from './EmergencyContacts.module.css';

const initialContacts = [
  { id: 1, name: 'Rahul Sharma', relation: 'Brother', phone: '+91 98765 12345' },
];

export default function EmergencyContacts() {
  const [contacts, setContacts] = useState(initialContacts);
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');

  const handleDelete = (id) => {
    setContacts(c => c.filter(x => x.id !== id));
  };

  const handleAdd = () => {
    if (name && phone) {
      setContacts([...contacts, { id: Date.now(), name, relation: 'Family', phone }]);
      setShowForm(false);
      setName('');
      setPhone('');
    }
  };

  return (
    <div className={styles.page}>
      <AppHeader title="Emergency Contacts" />

      <div className={styles.content}>
        <p className={styles.desc}>
          If someone reports a serious accident or theft, these contacts will be notified automatically via SMS and WhatsApp.
        </p>

        <div className={styles.list}>
          <AnimatePresence>
            {contacts.map((c) => (
              <motion.div
                key={c.id}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.2 }}
                className={styles.card}
              >
                <div>
                  <div className={styles.name}>{c.name}</div>
                  <div className={styles.phone}>{c.phone}</div>
                </div>
                <button className={styles.deleteBtn} onClick={() => handleDelete(c.id)}>
                  <Trash2 size={18} />
                </button>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        <AnimatePresence>
          {showForm ? (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className={styles.formBox}
            >
              <Input label="Full Name" value={name} onChange={e => setName(e.target.value)} />
              <Input label="Phone Number" value={phone} onChange={e => setPhone(e.target.value)} type="tel" />
              <div className={styles.formActions}>
                <Button variant="outline" onClick={() => setShowForm(false)}>Cancel</Button>
                <Button onClick={handleAdd} disabled={!name || !phone}>Save</Button>
              </div>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <Button variant="secondary" fullWidth onClick={() => setShowForm(true)} className={styles.addBtn}>
                <Plus size={18} /> Add Contact
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
