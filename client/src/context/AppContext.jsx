import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { SecureStorage } from '../hooks/useNative';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, X } from 'lucide-react';
import { useLiveQuery } from 'dexie-react-hooks';
import db from '../lib/db/database';
import { UserRepository } from '../lib/repositories/UserRepository';
import { VehicleRepository } from '../lib/repositories/VehicleRepository';
import { DocumentRepository } from '../lib/repositories/DocumentRepository';
import { ContactRepository } from '../lib/repositories/ContactRepository';
import { syncManager } from '../lib/sync/SyncManager';
import api from '../lib/api';

const AppContext = createContext(null);

const EMPTY_USER = {
  id: null,
  name: 'User',
  phone: '',
  maskedPhone: '•••••',
  avatar: 'U',
  joinedDate: '',
  notificationPrefs: {
    push: true,
    whatsapp: true,
    sms: true,
    email: false,
    sound: true,
    haptic: true,
  },
  privacyPrefs: {
    publicVehicleProfile: true,
    displayPhoneNumber: false,
    plateSearchable: true,
    shareAnalytics: false
  },
};

export function AppProvider({ children }) {
  // ── Offline-First State via Dexie ──────────────────────────────────────────
  const userQuery = useLiveQuery(async () => {
    const u = await db.user.get('me');
    return u || null; // null means empty, undefined means loading
  });
  
  const vehiclesQuery = useLiveQuery(async () => {
    const v = await db.vehicles.toArray();
    return v || null;
  });

  const isCacheLoading = userQuery === undefined || vehiclesQuery === undefined;
  
  const user = userQuery || EMPTY_USER;
  const vehicles = vehiclesQuery || [];
  
  const documents = useLiveQuery(() => db.documents.toArray()) || [];
  const contacts = useLiveQuery(() => db.contacts.toArray()) || [];
  
  // Local state for UI only
  const notificationsQuery = useLiveQuery(() => db.notifications.toArray());
  const notifications = notificationsQuery || [];
  const [medicalProfile, setMedicalProfileState] = useState({
    dob: '', address: '', bloodType: '', conditions: '', allergies: '',
    prescriptions: '', devices: '', doctorName: '', doctorPhone: ''
  });

  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  
  const lastNotificationsRefreshRef = useRef(0);
  
  // Global Modals
  const [comingSoonFeature, setComingSoonFeature] = useState(null);
  const showComingSoon = (featureName) => setComingSoonFeature(featureName);

  const [isUpgradeModalOpen, setIsUpgradeModalOpen] = useState(false);
  const showUpgradeModal = () => setIsUpgradeModalOpen(true);
  const hideUpgradeModal = () => setIsUpgradeModalOpen(false);

  // ── Initialization & Migration ────────────────────────────────────────────
  useEffect(() => {
    async function loadData() {
      // 1. Check Auth
      const storedAuth = await SecureStorage.get('roadlink_auth');
      if (storedAuth === true || storedAuth === 'true') {
        const accessToken = await SecureStorage.get('roadlink_access_token');
        if (accessToken) setIsAuthenticated(true);
      }

      // 2. Migration from Legacy SecureStorage to Dexie
      const legacyUser = await SecureStorage.get('roadlink_user');
      if (legacyUser) {
        await db.user.put({ id: 'me', ...legacyUser });
        await SecureStorage.remove('roadlink_user');
      }

      const legacyVehicles = await SecureStorage.get('roadlink_vehicles');
      if (legacyVehicles) {
        await db.vehicles.bulkPut(legacyVehicles);
        await SecureStorage.remove('roadlink_vehicles');
      }

      const legacyDocs = await SecureStorage.get('roadlink_documents');
      if (legacyDocs) {
        await db.documents.bulkPut(legacyDocs);
        await SecureStorage.remove('roadlink_documents');
      }

      const legacyContacts = await SecureStorage.get('roadlink_contacts');
      if (legacyContacts) {
        await db.contacts.bulkPut(legacyContacts);
        await SecureStorage.remove('roadlink_contacts');
      }

      // 3. Load non-migrated stuff
      const storedNotifications = await SecureStorage.get('roadlink_notifications');
      if (storedNotifications && storedNotifications.length > 0) {
        await db.notifications.bulkPut(storedNotifications);
        await SecureStorage.remove('roadlink_notifications');
      }
      const storedMedical = await SecureStorage.get('roadlink_medical_profile');
      if (storedMedical) setMedicalProfileState(storedMedical);

      setIsInitialized(true);

      // 4. Trigger silent refreshes if authenticated
      if (storedAuth === true || storedAuth === 'true') {
        UserRepository.refreshProfileSilently();
        VehicleRepository.refreshVehiclesSilently();
        DocumentRepository.refreshDocumentsSilently();
        ContactRepository.refreshContactsSilently();
      }
    }
    loadData();
  }, []);

  // ── Persist legacy non-migrated state ─────────────────────────────────────
  useEffect(() => {
    if (!isInitialized) return;
    SecureStorage.set('roadlink_auth', isAuthenticated);
    SecureStorage.set('roadlink_medical_profile', medicalProfile);
  }, [notifications, medicalProfile, isAuthenticated, isInitialized]);

  // ── Global Auth Listener & Real-Time Sync (SSE) ───────────────────────────
  useEffect(() => {
    const handleLogout = () => signOut();
    window.addEventListener('auth:logout', handleLogout);

    let eventSource = null;

    const setupSSE = async () => {
      if (isAuthenticated) {
        const token = await SecureStorage.get('roadlink_access_token');
        if (token) {
           const API_URL = import.meta.env.VITE_API_URL || '';
           eventSource = new EventSource(`${API_URL}/stream?token=${token}`);
           
           eventSource.addEventListener('connected', (e) => {
             console.log('[SSE] Stream connected');
           });

           eventSource.addEventListener('NOTIFICATION_CREATED', async (e) => {
             try {
               const notification = JSON.parse(e.data);
               await db.notifications.put(notification);
               // Trigger feedback (haptic/sound)
               import('../services/sound/HapticManager').then(m => m.hapticManager.notification());
             } catch(err) { console.error('[SSE] Error parsing notification', err); }
           });

           eventSource.addEventListener('VEHICLE_UPDATED', async (e) => {
             try {
               const vehicleData = JSON.parse(e.data);
               const v = await db.vehicles.get(vehicleData._id || vehicleData.id);
               if (v) {
                 await db.vehicles.put({ ...v, ...vehicleData, updatedAt: Date.now() });
               } else {
                 await db.vehicles.put({ ...vehicleData, updatedAt: Date.now() });
               }
             } catch(err) { console.error('[SSE] Error parsing vehicle', err); }
           });

           eventSource.onerror = (error) => {
             // SSE natively attempts to reconnect. If it's a 401, we might need a refresh.
           };
        }
      }
    };

    setupSSE();

    return () => {
      window.removeEventListener('auth:logout', handleLogout);
      if (eventSource) {
        eventSource.close();
      }
    };
  }, [isAuthenticated]);

  // ── Auth actions ──────────────────────────────────────────────────────────
  const signIn = async (userProfile, accessToken, refreshToken) => {
    await db.user.put({ id: 'me', ...userProfile });
    setIsAuthenticated(true);
    await SecureStorage.set('roadlink_access_token', accessToken);
    await SecureStorage.set('roadlink_refresh_token', refreshToken);
    await SecureStorage.set('roadlink_auth', true);
    
    UserRepository.refreshProfileSilently();
    VehicleRepository.refreshVehiclesSilently();
    DocumentRepository.refreshDocumentsSilently();
    ContactRepository.refreshContactsSilently();
  };

  const signOut = async () => {
    setIsAuthenticated(false);
    await UserRepository.clear();
    await VehicleRepository.clear();
    await DocumentRepository.clear();
    await ContactRepository.clear();
    await db.notifications.clear();
    
    await SecureStorage.remove('roadlink_access_token');
    await SecureStorage.remove('roadlink_refresh_token');
    await SecureStorage.remove('roadlink_auth');
    await SecureStorage.clear();
  };

  // ── User actions (Delegated to Repo) ──────────────────────────────────────
  const refreshUser = async () => {
    await UserRepository.refreshProfileSilently();
  };

  const updateProfile = async (formData) => {
    return await UserRepository.updateProfile(formData);
  };

  const updateNotifPref = async (key, value) => {
    const newPrefs = { ...user.notificationPrefs, [key]: value };
    await UserRepository.updateSettings({ notificationPrefs: newPrefs });
  };

  const deleteAccount = async () => {
    try { await api.delete('/users/me'); } catch (err) {}
    await SecureStorage.clear();
    sessionStorage.clear();
    document.cookie.split(";").forEach((c) => {
      document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
    });
    window.location.href = '/';
  };

  // ── Vehicle actions ───────────────────────────────────────────────────────


  const updateVehicleInContext = async (id, updates) => {
    // Fallback for simple local updates not fully migrated to repo yet
    const v = await db.vehicles.get(id);
    if (v) {
      await db.vehicles.put({ ...v, ...updates });
    }
  };

  const togglePrivacyMode = async (vehicleId) => {
    const v = await db.vehicles.get(vehicleId);
    if (v) {
      await VehicleRepository.updatePrivacyMode(vehicleId, !v.privacyMode);
    }
  };

  const refreshVehicles = async () => {
    await VehicleRepository.refreshVehiclesSilently();
  };

  // ── Document actions ──────────────────────────────────────────────────────
  const addDocument = async (doc) => {
    const newDoc = { ...doc, id: `d${Date.now()}` };
    await db.documents.put(newDoc);
    // Ideally this goes through repo to sync, but MVP logic was local.
  };

  const removeDocument = async (id) => {
    await DocumentRepository.deleteDocument(id);
  };

  const updateDocument = async (id, updates) => {
    await DocumentRepository.updateDocument(id, updates);
  };

  const refreshDocuments = async () => {
    await DocumentRepository.refreshDocumentsSilently();
  };

  // ── Contact actions ───────────────────────────────────────────────────────
  const refreshContacts = async () => {
    await ContactRepository.refreshContactsSilently();
  };

  const addContact = async (contact) => {
    return await ContactRepository.addContact(contact);
  };

  const deleteContact = async (id) => {
    await ContactRepository.deleteContact(id);
  };

  const updateContact = async (id, updatedContact) => {
    await ContactRepository.updateContact(id, updatedContact);
  };

  const setPrimaryContact = async (id) => {
    await ContactRepository.setPrimaryContact(id);
  };

  // ── Misc ──────────────────────────────────────────────────────────────────
  const setMedicalProfile = async (profile) => {
    setMedicalProfileState(prev => ({ ...prev, ...profile }));
    try {
      await api.patch('/users/me', { medicalProfile: profile });
    } catch (err) {
      await syncManager.enqueueAction('updateMedicalProfile', 'PATCH', '/users/me', { medicalProfile: profile });
    }
  };

  const getRelativeTime = (dateString) => {
    if (!dateString) return '';
    const diff = new Date() - new Date(dateString);
    const minutes = Math.floor(diff / 60000);
    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    const days = Math.floor(hours / 24);
    if (days < 30) return `${days} day${days > 1 ? 's' : ''} ago`;
    const months = Math.floor(days / 30);
    return `${months} month${months > 1 ? 's' : ''} ago`;
  };

  const refreshNotifications = async () => {
    const now = Date.now();
    if (now - lastNotificationsRefreshRef.current < 30000) return;
    lastNotificationsRefreshRef.current = now;

    try {
      const res = await api.get('/reports');
      if (res.data.success) {
        const fetchedReports = res.data.data.reports.map(r => {
          let categoryLabel = 'Alert';
          let emoji = '🔔';
          if (r.category === 'wrong_parking') { categoryLabel = 'Wrong Parking'; emoji = '🅿️'; }
          else if (r.category === 'theft') { categoryLabel = 'Vehicle Theft'; emoji = '🚨'; }
          else if (r.category === 'emergency') { categoryLabel = 'Emergency'; emoji = '⚠️'; }

          return {
            id: r._id,
            type: categoryLabel,
            emoji: emoji,
            category: r.category,
            categoryId: r.category,
            title: `Report on ${r.vehicleId?.registrationNumber || 'Vehicle'}`,
            plate: r.vehicleId?.registrationNumber || 'UNKNOWN',
            message: r.message,
            notes: r.notes || '',
            timestamp: r.createdAt,
            time: getRelativeTime(r.createdAt),
            read: r.status === 'resolved',
            resolved: r.status === 'resolved',
            vehicleId: r.vehicleId?._id || r.vehicleId,
            mediaUrls: r.mediaUrls || [],
            reporterLocation: r.reporterLocation || null,
            isAlert: r.category === 'theft' || r.category === 'emergency'
          };
        });
        await db.notifications.bulkPut(fetchedReports);
      }
    } catch (err) {}
  };

  const markResolved = async (id) => {
    try { await api.patch(`/reports/${id}`, { status: 'resolved' }); } 
    catch (err) { await syncManager.enqueueAction('markResolved', 'PATCH', `/reports/${id}`, { status: 'resolved' }); }
    
    const n = await db.notifications.get(id);
    if (n) {
      await db.notifications.put({ ...n, resolved: true, read: true, status: 'resolved' });
    }
  };

  const dismissNotification = async (id) => {
    await db.notifications.delete(id);
  };
  
  const markRead = async (id) => {
    const n = await db.notifications.get(id);
    if (n) {
      await db.notifications.put({ ...n, read: true });
    }
  };
  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <AppContext.Provider value={{
      isAuthenticated,
      isInitialized,
      signIn,
      signOut,
      showComingSoon,
      showUpgradeModal,
      hideUpgradeModal,
      isCacheLoading,
      // Data
      user,
      vehicles,
      notifications,
      documents,
      contacts,
      medicalProfile,
      unreadCount,
      // Actions
      markResolved, dismissNotification, markRead, refreshNotifications,
      updateVehicleInContext, togglePrivacyMode, refreshVehicles,
      addDocument, updateDocument, removeDocument, refreshDocuments,
      refreshContacts, addContact, updateContact, deleteContact, setPrimaryContact,
      setMedicalProfile, refreshUser, updateProfile, updateNotifPref, deleteAccount,
    }}>
      {children}
      
      {/* Global Coming Soon Modal */}
      <AnimatePresence>
        {comingSoonFeature && (
          <div className="fixed inset-0 z-[999] flex items-center justify-center px-5 pb-safe">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setComingSoonFeature(null)} />
            <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }} transition={{ type: 'spring', damping: 25, stiffness: 300 }} className="relative w-full max-w-sm bg-white rounded-2xl shadow-xl overflow-hidden z-10">
              <div className="bg-gradient-to-br from-road-navy to-[#1a386d] p-6 flex flex-col items-center text-center">
                <div className="w-14 h-14 bg-white/10 rounded-full flex items-center justify-center mb-4"><Sparkles size={28} className="text-white" /></div>
                <h3 className="font-display text-2xl font-bold text-white mb-2">Coming Soon</h3>
                <p className="font-body text-[14px] text-white/90 leading-relaxed max-w-[240px]">We're working hard on bringing you <span className="font-bold">{comingSoonFeature}</span>. Check back in our next big update!</p>
              </div>
              <div className="p-4 bg-white"><button className="w-full py-3.5 bg-road-navy text-white rounded-xl font-body font-semibold text-[15px] hover:bg-road-navy/90 transition-colors" onClick={() => setComingSoonFeature(null)}>Got it</button></div>
              <button className="absolute top-4 right-4 w-8 h-8 bg-black/10 rounded-full flex items-center justify-center text-white hover:bg-black/20 transition-colors" onClick={() => setComingSoonFeature(null)}><X size={18} /></button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Upgrade Modal */}
      <AnimatePresence>
        {isUpgradeModalOpen && (
          <div className="fixed inset-0 z-[999] flex items-center justify-center px-5 pb-safe">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={hideUpgradeModal} />
            <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }} transition={{ type: 'spring', damping: 25, stiffness: 300 }} className="relative w-full max-w-sm bg-white rounded-2xl shadow-xl overflow-hidden z-10">
              <div className="bg-gradient-to-br from-road-navy to-[#1a386d] p-6 flex flex-col items-center text-center">
                <div className="w-14 h-14 bg-white/10 rounded-full flex items-center justify-center mb-4"><Sparkles size={28} className="text-[#feae2c]" /></div>
                <h3 className="font-display text-2xl font-bold text-white mb-2">Upgrade Required</h3>
                <p className="font-body text-[14px] text-white/90 leading-relaxed max-w-[240px]">You have reached the maximum limit of <span className="font-bold">5 vehicles</span>. Please upgrade your account to add more.</p>
              </div>
              <div className="p-4 bg-white space-y-3">
                <button className="w-full py-3.5 bg-[#feae2c] text-[#291800] rounded-xl font-body font-bold text-[15px] hover:bg-[#feae2c]/90 transition-colors shadow-sm" onClick={hideUpgradeModal}>View Upgrade Options</button>
                <button className="w-full py-3.5 bg-white text-on-surface border border-outline-light rounded-xl font-body font-semibold text-[15px] hover:bg-surface-low transition-colors" onClick={hideUpgradeModal}>Not Now</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </AppContext.Provider>
  );
}

export function useAppData() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useAppData must be used within AppProvider');
  return ctx;
}
