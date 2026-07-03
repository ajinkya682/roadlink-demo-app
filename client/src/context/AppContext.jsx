import React, { createContext, useContext, useState, useEffect } from 'react';
import { SecureStorage } from '../hooks/useNative';

// ─────────────────────────────────────────────────────────────────────────────
// AppContext
//
// Central app state — replaces DemoContext (which seeded from hardcoded demo
// files). All arrays start empty; data will come from real API calls in Phase 3.
import api from '../lib/api';
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

      if (storedAuth === true || storedAuth === 'true') {
        const accessToken = await SecureStorage.get('roadlink_access_token');
        if (accessToken) {
          setIsAuthenticated(true);
        }
      }
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
  const signIn = async (userProfile, accessToken, refreshToken) => {
    setUser(userProfile);
    setIsAuthenticated(true);
    await SecureStorage.set('roadlink_access_token', accessToken);
    await SecureStorage.set('roadlink_refresh_token', refreshToken);
    await SecureStorage.set('roadlink_auth', true);
  };

  const signOut = async () => {
    setIsAuthenticated(false);
    setUser(EMPTY_USER);
    setVehicles([]);
    setNotifications([]);
    setDocuments([]);
    setContacts([]);
    // Clear persisted session
    await SecureStorage.remove('roadlink_access_token');
    await SecureStorage.remove('roadlink_refresh_token');
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

  const refreshNotifications = async () => {
    try {
      const res = await api.get('/reports');
      if (res.data.success) {
        // Map reports to notification format
        const fetchedReports = res.data.data.reports.map(r => ({
          id: r._id,
          type: 'alert',
          title: `Report on ${r.vehicleId.registrationNumber || 'Vehicle'}`,
          message: r.message,
          timestamp: new Date(r.createdAt).toLocaleString('en-IN', { hour: 'numeric', minute: 'numeric', hour12: true }),
          read: r.status === 'resolved',
          resolved: r.status === 'resolved',
          vehicleId: r.vehicleId._id || r.vehicleId
        }));
        setNotifications(fetchedReports);
      }
    } catch (err) {
      console.error('Failed to fetch reports', err);
    }
  };

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

  const refreshVehicles = async () => {
    try {
      const res = await api.get('/vehicles');
      if (res.data.success) {
        // Map backend format to frontend expected format
        const fetchedVehicles = res.data.data.vehicles.map(v => ({
          id: v._id,
          plate: v.registrationNumber,
          make: v.make,
          model: v.model,
          displayName: `${v.make || ''} ${v.model || ''}`.trim() || 'VEHICLE',
          isVerified: v.isVerified,
          privacyMode: v.privacySettings?.showOwnerName === false,
          addedDate: new Date(v.createdAt).toLocaleDateString('en-IN', { month: 'short', year: 'numeric' }),
          unreadAlerts: 0,
          qrToken: v.qrToken,
          qrId: v._id
        }));
        setVehicles(fetchedVehicles);
      }
    } catch (err) {
      console.error('Failed to fetch vehicles', err);
    }
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

  const refreshDocuments = async () => {
    try {
      const res = await api.get('/documents');
      if (res.data.success) {
        // Map backend format to frontend
        const fetchedDocs = res.data.data.documents.map(d => ({
          id: d._id,
          vehicleId: d.vehicleId,
          type: d.documentType,
          number: d.documentNumber,
          expiry: new Date(d.expiryDate).toLocaleDateString('en-IN', { month: 'short', year: 'numeric' }),
          status: new Date(d.expiryDate) < new Date() ? 'expired' : 'valid'
        }));
        setDocuments(fetchedDocs);
      }
    } catch (err) {
      console.error('Failed to fetch documents', err);
    }
  };

  // ── Contact actions ───────────────────────────────────────────────────────
  const refreshContacts = async () => {
    try {
      const res = await api.get('/emergency-contacts');
      if (res.data.success) {
        const fetchedContacts = res.data.data.contacts.map(c => ({
          id: c._id,
          name: c.name,
          phone: c.phone,
          maskedPhone: maskPhone(c.phone),
          relation: c.relationship,
          isPrimary: c.isPrimary
        }));
        setContacts(fetchedContacts);
      }
    } catch (err) {
      console.error('Failed to fetch contacts', err);
    }
  };

  const addContact = async (contact) => {
    try {
      const res = await api.post('/emergency-contacts', {
        name: contact.name,
        phone: contact.phone,
        relationship: contact.relation,
        isPrimary: contact.isPrimary
      });
      if (res.data.success) {
        await refreshContacts();
      }
    } catch (err) {
      console.error('Failed to add contact', err);
      throw err;
    }
  };

  const deleteContact = async (id) => {
    try {
      const res = await api.delete(`/emergency-contacts/${id}`);
      if (res.data.success) {
        setContacts(prev => prev.filter(c => c.id !== id));
      }
    } catch (err) {
      console.error('Failed to delete contact', err);
      throw err;
    }
  };

  const updateContact = async (id, updatedContact) => {
    try {
      const res = await api.patch(`/emergency-contacts/${id}`, {
        name: updatedContact.name,
        phone: updatedContact.phone,
        relationship: updatedContact.relation,
        isPrimary: updatedContact.isPrimary
      });
      if (res.data.success) {
        await refreshContacts();
      }
    } catch (err) {
      console.error('Failed to update contact', err);
      throw err;
    }
  };

  const setPrimaryContact = async (id) => {
    try {
      const res = await api.patch(`/emergency-contacts/${id}`, { isPrimary: true });
      if (res.data.success) {
        await refreshContacts();
      }
    } catch (err) {
      console.error('Failed to set primary', err);
      throw err;
    }
  };

  // ── User preference actions ───────────────────────────────────────────────
  const updateNotifPref = (key, value) => {
    setUser(prev => ({ ...prev, notificationPrefs: { ...prev.notificationPrefs, [key]: value } }));
  };

  return (
    <AppContext.Provider value={{
      isAuthenticated,
      isInitialized,
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
      refreshNotifications,
      // Vehicle actions
      addVehicle,
      togglePrivacyMode,
      refreshVehicles,
      // Document actions
      addDocument,
      removeDocument,
      refreshDocuments,
      // Contact actions
      refreshContacts,
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
