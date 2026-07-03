import React, { createContext, useContext, useState, useEffect } from 'react';
import { currentUser as initialUser } from '../demo-data/user';
import { vehicles as initialVehicles } from '../demo-data/vehicles';
import { notifications as initialNotifications } from '../demo-data/notifications';
import { documents as initialDocuments } from '../demo-data/documents';
import { emergencyContacts as initialContacts } from '../demo-data/contacts';
import { SecureStorage } from '../hooks/useNative';

const DemoContext = createContext(null);

export function DemoProvider({ children }) {
  const [user, setUser] = useState(initialUser);
  const [vehicles, setVehicles] = useState(initialVehicles);
  const [notifications, setNotifications] = useState(initialNotifications);
  const [documents, setDocuments] = useState(initialDocuments);
  const [contacts, setContacts] = useState(initialContacts);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    async function loadData() {
      const storedUser = await SecureStorage.get('roadlink_user');
      const storedVehicles = await SecureStorage.get('roadlink_vehicles');
      const storedNotifications = await SecureStorage.get('roadlink_notifications');
      const storedDocuments = await SecureStorage.get('roadlink_documents');
      const storedContacts = await SecureStorage.get('roadlink_contacts');

      if (storedUser) setUser(storedUser);
      if (storedVehicles) setVehicles(storedVehicles);
      if (storedNotifications) setNotifications(storedNotifications);
      if (storedDocuments) setDocuments(storedDocuments);
      if (storedContacts) setContacts(storedContacts);
      
      setIsInitialized(true);
    }
    loadData();
  }, []);

  useEffect(() => {
    if (isInitialized) {
      SecureStorage.set('roadlink_user', user);
      SecureStorage.set('roadlink_vehicles', vehicles);
      SecureStorage.set('roadlink_notifications', notifications);
      SecureStorage.set('roadlink_documents', documents);
      SecureStorage.set('roadlink_contacts', contacts);
    }
  }, [user, vehicles, notifications, documents, contacts, isInitialized]);

  // ── Notification actions ────────────────────────────────────
  const markResolved = (id) => {
    setNotifications(prev =>
      prev.map(n => n.id === id ? { ...n, resolved: true, read: true } : n)
    );
  };

  const dismissNotification = (id) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const markRead = (id) => {
    setNotifications(prev =>
      prev.map(n => n.id === id ? { ...n, read: true } : n)
    );
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  // ── Vehicle actions ─────────────────────────────────────────
  const addVehicle = (vehicle) => {
    const newVehicle = {
      ...vehicle,
      id: `v${Date.now()}`,
      isVerified: true,
      privacyMode: false,
      addedDate: new Date().toLocaleDateString('en-IN', { month: 'short', year: 'numeric' }),
      unreadAlerts: 0,
      qrId: `ROADLINK-${vehicle.plate.replace(/\s/g, '')}`,
    };
    setVehicles(prev => [newVehicle, ...prev]);
    return newVehicle;
  };

  const togglePrivacyMode = (vehicleId) => {
    setVehicles(prev =>
      prev.map(v => v.id === vehicleId ? { ...v, privacyMode: !v.privacyMode } : v)
    );
  };

  // ── Document actions ────────────────────────────────────────
  const addDocument = (doc) => {
    const newDoc = { ...doc, id: `d${Date.now()}` };
    setDocuments(prev => {
      const existing = prev.findIndex(d => d.vehicleId === doc.vehicleId && d.type === doc.type);
      if (existing >= 0) {
        const updated = [...prev];
        updated[existing] = newDoc;
        return updated;
      }
      return [...prev, newDoc];
    });
  };

  const removeDocument = (id) => {
    setDocuments(prev => prev.filter(d => d.id !== id));
  };

  // ── Contact actions ─────────────────────────────────────────
  const addContact = (contact) => {
    const newContact = { ...contact, id: `c${Date.now()}`, maskedPhone: maskPhone(contact.phone) };
    if (contact.isPrimary) {
      setContacts(prev => [
        ...prev.map(c => ({ ...c, isPrimary: false })),
        newContact,
      ]);
    } else {
      setContacts(prev => [...prev, newContact]);
    }
  };

  const deleteContact = (id) => {
    setContacts(prev => prev.filter(c => c.id !== id));
  };

  const setPrimaryContact = (id) => {
    setContacts(prev => prev.map(c => ({ ...c, isPrimary: c.id === id })));
  };

  const updateContact = (id, updatedContact) => {
    setContacts(prev => {
      const newContacts = prev.map(c => c.id === id ? { ...c, ...updatedContact, maskedPhone: maskPhone(updatedContact.phone || c.phone) } : c);
      if (updatedContact.isPrimary) {
        return newContacts.map(c => ({ ...c, isPrimary: c.id === id }));
      }
      return newContacts;
    });
  };

  // ── User preferences ────────────────────────────────────────
  const updateNotifPref = (key, value) => {
    setUser(prev => ({ ...prev, notificationPrefs: { ...prev.notificationPrefs, [key]: value } }));
  };

  return (
    <DemoContext.Provider value={{
      user,
      vehicles,
      notifications,
      documents,
      contacts,
      unreadCount,
      markResolved,
      dismissNotification,
      markRead,
      addVehicle,
      togglePrivacyMode,
      addDocument,
      removeDocument,
      addContact,
      updateContact,
      deleteContact,
      setPrimaryContact,
      updateNotifPref,
    }}>
      {children}
    </DemoContext.Provider>
  );
}

export function useDemoData() {
  const ctx = useContext(DemoContext);
  if (!ctx) throw new Error('useDemoData must be used within DemoProvider');
  return ctx;
}

function maskPhone(phone) {
  const digits = phone.replace(/\D/g, '');
  if (digits.length >= 2) {
    const last2 = digits.slice(-2);
    return `+91 ${digits.slice(2, 4)}•••••${last2}`;
  }
  return phone;
}
