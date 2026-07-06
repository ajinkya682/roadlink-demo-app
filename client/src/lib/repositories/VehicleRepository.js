import { db } from '../db/database';
import api from '../api';
import { syncManager } from '../sync/SyncManager';


let lastVehicleRefreshAt = 0;
const VEHICLE_TTL_MS = 60 * 1000;

export class VehicleRepository {
  static async getVehicles() {
    const cached = await db.vehicles.toArray();
    // Sort locally by date or whatever criteria (default is usually order of insertion or id)
    
    this.refreshVehiclesSilently();
    return cached;
  }

  static async refreshVehiclesSilently() {
    if (!navigator.onLine) return;

    const now = Date.now();
    if (now - lastVehicleRefreshAt < VEHICLE_TTL_MS) return;
    lastVehicleRefreshAt = now;

    try {
      const res = await api.get('/vehicles');
      if (res.data.success) {
        const vehicles = res.data.data.vehicles.map(v => ({
          id: v._id,
          plate: v.registrationNumber,
          type: v.type || 'four-wheeler',
          make: v.make,
          model: v.model,
          year: v.year,
          color: v.color,
          nickname: v.nickname,
          imageUrl: v.imageUrl,
          displayName: `${v.make || ''} ${v.model || ''}`.trim() || 'VEHICLE',
          isVerified: v.isVerified,
          privacyMode: v.showOwnerName === false,
          addedDate: new Date(v.createdAt).toLocaleDateString('en-IN', { month: 'short', year: 'numeric' }),
          unreadAlerts: 0,
          qrToken: v.qrToken,
          qrId: v._id,
          protectionStatus: v.protectionStatus || 'pending_payment',
          updatedAt: Date.now()
        }));

        // Bulk put updates existing keys and inserts new ones
        await db.vehicles.bulkPut(vehicles);
        
        // Handle deletions: if a vehicle is in db but not in API response, delete it
        const fetchedIds = new Set(vehicles.map(v => v.id));
        const allCached = await db.vehicles.toArray();
        const toDelete = allCached.filter(v => !fetchedIds.has(v.id)).map(v => v.id);
        if (toDelete.length > 0) {
          await db.vehicles.bulkDelete(toDelete);
        }
      }
    } catch (err) {
      console.error('[VehicleRepository] Background refresh failed:', err);
    }
  }

  static async createVehicle(formData) {
    const res = await api.post('/vehicles', formData, {
      headers: { 'Content-Type': undefined }
    });
    const v = res.data.data.vehicle;
    
    const newVehicle = {
      id: v._id,
      plate: v.registrationNumber,
      type: v.type || 'four-wheeler',
      make: v.make,
      model: v.model,
      year: v.year,
      color: v.color,
      nickname: v.nickname,
      imageUrl: v.imageUrl,
      displayName: `${v.make || ''} ${v.model || ''}`.trim() || 'VEHICLE',
      isVerified: v.isVerified,
      privacyMode: v.showOwnerName === false,
      addedDate: new Date(v.createdAt || Date.now()).toLocaleDateString('en-IN', { month: 'short', year: 'numeric' }),
      unreadAlerts: 0,
      qrToken: v.qrToken,
      qrId: v._id,
      protectionStatus: v.protectionStatus || 'pending_payment',
      updatedAt: Date.now()
    };

    await db.vehicles.put(newVehicle);
    return newVehicle;
  }

  static async updatePrivacyMode(id, newMode) {
    const v = await db.vehicles.get(id);
    if (!v) return;

    v.privacyMode = newMode;
    await db.vehicles.put(v);

    const payload = { showOwnerName: !newMode };
    if (navigator.onLine) {
      try {
        await api.patch(`/vehicles/${id}`, payload);
      } catch (err) {
        await syncManager.enqueueAction('updateVehiclePrivacy', 'PATCH', `/vehicles/${id}`, payload);
      }
    } else {
      await syncManager.enqueueAction('updateVehiclePrivacy', 'PATCH', `/vehicles/${id}`, payload);
    }
    return v;
  }

  static async clear() {
    await db.vehicles.clear();
  }
}
