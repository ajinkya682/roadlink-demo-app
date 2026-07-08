import { db } from '../db/database';
import api from '../api';
import { syncManager } from '../sync/SyncManager';


let lastUserRefreshAt = 0;
const USER_TTL_MS = 60 * 1000;

export class UserRepository {
  static forceNextRefresh() {
    lastUserRefreshAt = 0;
  }

  static async getProfile() {
    // 1. Return cached profile immediately if exists
    const cached = await db.user.get('me');
    
    // 2. Fetch fresh data in background
    this.refreshProfileSilently();
    
    return cached; // Return cache (or undefined if first load offline)
  }

  static async refreshProfileSilently() {
    if (!navigator.onLine) return;

    const now = Date.now();
    if (now - lastUserRefreshAt < USER_TTL_MS) return;
    lastUserRefreshAt = now;

    try {
      const res = await api.get('/users/me');
      if (res.data.success) {
        const user = res.data.data.user;
        const phoneDigits = (user.phone || '').replace(/\D/g, '');
        const maskedPhone = phoneDigits.length >= 2 
          ? `+91 ${phoneDigits.slice(2, 4)}•••••${phoneDigits.slice(-2)}` 
          : user.phone;
          
        await db.user.put({
          ...user,
          id: 'me', // MUST be after ...user to prevent override by user._id
          maskedPhone: maskedPhone,
          avatar: user.name ? user.name.split(' ').map(n => n[0]).join('') : 'U',
          joinedDate: new Date(user.createdAt || Date.now()).toLocaleDateString('en-IN', { month: 'short', year: 'numeric' }),
          updatedAt: Date.now()
        });
      }
    } catch (err) {
      console.error('[UserRepository] Background refresh failed:', err);
    }
  }

  static async updateProfile(formDataObj) {
    const updates = formDataObj instanceof FormData 
      ? Object.fromEntries(formDataObj.entries()) 
      : formDataObj;

    if (updates.file) {
      delete updates.file;
    }

    // Optimistic update
    const current = await db.user.get('me') || { id: 'me' };
    const updated = { ...current, ...updates, updatedAt: Date.now() };
    await db.user.put(updated);

    if (navigator.onLine) {
      try {
        await api.patch('/users/me', formDataObj);
      } catch (err) {
        console.error('[UserRepository] Update failed online, queuing:', err);
        await syncManager.enqueueAction('updateProfile', 'PATCH', '/users/me', updates);
      }
    } else {
      // Offline: queue it
      await syncManager.enqueueAction('updateProfile', 'PATCH', '/users/me', updates);
    }
    
    return updated;
  }

  static async updateSettings(settingsData) {
    const current = await db.user.get('me') || { id: 'me' };
    const updated = { ...current, ...settingsData, updatedAt: Date.now() };
    await db.user.put(updated);

    if (navigator.onLine) {
      try {
        await api.patch('/users/settings', settingsData);
      } catch (err) {
        console.error('[UserRepository] Settings update failed online, queuing:', err);
        await syncManager.enqueueAction('updateSettings', 'PATCH', '/users/settings', settingsData);
      }
    } else {
      await syncManager.enqueueAction('updateSettings', 'PATCH', '/users/settings', settingsData);
    }

    return updated;
  }

  static async clear() {
    await db.user.clear();
  }
}
