import React, { createContext, useContext, useState, useEffect } from 'react';
import { SecureStorage } from '../hooks/useNative';

// ─────────────────────────────────────────────────────────────────────────────
// AppContext
//
// Central app state — replaces DemoContext (which seeded from hardcoded demo
// files). All arrays start empty; data will come from real API calls in Phase 3.
//
// TODO (Phase 3/4): Replace SecureStorage persistence with real access/refresh
// token session management. isAuthenticated here is a local placeholder only.
// ─────────────────────────────────────────────────────────────────────────────

const AppContext = createContext(null);

// ── Empty initial shapes ─────────────────────────────────────────────────────
const EMPTY_USER = {
  id: null,
  name: '',
  phone: '',
  maskedPhone: '',
  avatar: '',
  joinedDate: '',
  notificationPrefs: {
    push: true,
    whatsapp: true,
    sms: true,
    email: false,
  },
};

export function AppProvider({ children }) {
  const [user, setUser]                   = useState(EMPTY_USER);
  const [vehicles, setVehicles]           = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [documents, setDocuments]         = useState([]);
  const [contacts, setContacts]           = useState([]);

  // TODO (Phase 3/4): Replace this local boolean with real JWT-backed session
  // check. Once the backend exists, isAuthenticated should derive from whether
  // a valid access token exists (and is not expired), not from local state.
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const [isInitialized, setIsInitialized] = useState(false);

  // ── Hydrate from device storage on mount ──────────────────────────────────
  useEffect(() => {
    async function loadData() {
      const storedAuth  = await SecureStorage.get('roadlink_auth');
      const storedUser  = await SecureStorage.get('roadlink_user');
      const storedVehicles      = await SecureStorage.get('roadlink_vehicles');
      const storedNotifications = await SecureStorage.get('roadlink_notifications');
      const storedDocuments     = await SecureStorage.get('roadlink_documents');
      const storedContacts      = await SecureStorage.get('roadlink_contacts');

      if (storedAuth)          setIsAuthenticated(storedAuth === true || storedAuth === 'true');
      if (storedUser)          setUser(storedUser);
      if (storedVehicles)      setVehicles(storedVehicles);
      if (storedNotifications) setNotifications(storedNotifications);
      if (storedDocuments)     setDocuments(storedDocuments);
      if (storedContacts)      setContacts(storedContacts);

      setIsInitialized(true);
    }
    loadData();
  }, []);

  // ── Persist mutations to device storage ───────────────────────────────────
  useEffect(() => {
    if (!isInitialized) return;
    SecureStorage.set('roadlink_auth',          isAuthenticated);
    SecureStorage.set('roadlink_user',          user);
    SecureStorage.set('roadlink_vehicles',      vehicles);
    SecureStorage.set('roadlink_notifications', notifications);
    SecureStorage.set('roadlink_documents',     documents);
    SecureStorage.set('roadlink_contacts',      contacts);
  }, [user, vehicles, notifications, documents, contacts, isAuthenticated, isInitialized]);

  // ── Auth actions ──────────────────────────────────────────────────────────
  const signIn = (userProfile) => {
    setUser(userProfile);
    setIsAuthenticated(true);
  };

  const signOut = async () => {
    setIsAuthenticated(false);
    setUser(EMPTY_USER);
    setVehicles([]);
    setNotifications([]);
    setDocuments([]);
    setContacts([]);
    // Clear persisted session
    await SecureStorage.clear();
  };

  // ── Notification actions ──────────────────────────────────────────────────
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

  // ── Vehicle actions ───────────────────────────────────────────────────────
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

  // ── Document actions ──────────────────────────────────────────────────────
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

  // ── Contact actions ───────────────────────────────────────────────────────
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
      const newContacts = prev.map(c =>
        c.id === id
          ? { ...c, ...updatedContact, maskedPhone: maskPhone(updatedContact.phone || c.phone) }
          : c
      );
      if (updatedContact.isPrimary) {
        return newContacts.map(c => ({ ...c, isPrimary: c.id === id }));
      }
      return newContacts;
    });
  };

  // ── User preference actions ───────────────────────────────────────────────
  const updateNotifPref = (key, value) => {
    setUser(prev => ({ ...prev, notificationPrefs: { ...prev.notificationPrefs, [key]: value } }));
  };

  return (
    <AppContext.Provider value={{
      // Auth
      isAuthenticated,
      signIn,
      signOut,
      // Data
      user,
      vehicles,
      notifications,
      documents,
      contacts,
      unreadCount,
      // Notification actions
      markResolved,
      dismissNotification,
      markRead,
      // Vehicle actions
      addVehicle,
      togglePrivacyMode,
      // Document actions
      addDocument,
      removeDocument,
      // Contact actions
      addContact,
      updateContact,
      deleteContact,
      setPrimaryContact,
      // User actions
      updateNotifPref,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useAppData() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useAppData must be used within AppProvider');
  return ctx;
}

// ── Helpers ───────────────────────────────────────────────────────────────────
function maskPhone(phone) {
  const digits = phone.replace(/\D/g, '');
  if (digits.length >= 2) {
    const last2 = digits.slice(-2);
    return `+91 ${digits.slice(2, 4)}•••••${last2}`;
  }
  return phone;
}
