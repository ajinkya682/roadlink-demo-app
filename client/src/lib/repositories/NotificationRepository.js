import { Capacitor } from '@capacitor/core';
import { PushNotifications } from '@capacitor/push-notifications';
import { initializeApp } from 'firebase/app';
import { getMessaging, getToken, onMessage } from 'firebase/messaging';
import { syncManager } from '../sync/SyncManager';
import db from '../db/database';
import { SecureStorage } from '../../hooks/useNative';

class NotificationRepository {
  constructor() {
    this.firebaseConfig = {
      apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "YOUR_API_KEY",
      projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "YOUR_PROJECT_ID",
      messagingSenderId: import.meta.env.VITE_FIREBASE_SENDER_ID || "YOUR_SENDER_ID",
      appId: import.meta.env.VITE_FIREBASE_APP_ID || "YOUR_APP_ID"
    };

    this.sseInstance = null;
    this.reconnectTimer = null;
    this.retryCount = 0;
    this.MAX_RETRIES = 5;
    this.isMounted = true;
    this.deviceId = null;
    
    // Defer firebase init until init() is called
  }

  async getOrCreateDeviceId() {
    if (this.deviceId) return this.deviceId;
    
    let id = await SecureStorage.get('roadlink_device_id');
    if (!id) {
      id = 'dev_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
      await SecureStorage.set('roadlink_device_id', id);
    }
    this.deviceId = id;
    return id;
  }

  async init(accessToken) {
    this.isMounted = true;
    
    // 1. Initialize Firebase if Web
    try {
      if (!Capacitor.isNativePlatform() && !this.app) {
        this.app = initializeApp(this.firebaseConfig);
        this.messaging = getMessaging(this.app);
        
        onMessage(this.messaging, (payload) => {
          console.log('[NotificationRepository] Received foreground Web Push: ', payload);
          this.handleIncomingPayload(payload.data, false);
        });
      }
    } catch (e) {
      console.warn('[NotificationRepository] Firebase init error: ', e);
    }

    // 2. Start SSE
    this.connectSSE(accessToken);

    // 3. Register Device for Push
    await this.registerDeviceToken();
  }

  disconnectSSE() {
    if (this.sseInstance) {
      this.sseInstance.close();
      this.sseInstance = null;
    }
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
      this.reconnectTimer = null;
    }
  }

  cleanup() {
    this.isMounted = false;
    this.disconnectSSE();
  }

  connectSSE(token) {
    this.disconnectSSE();
    if (!token || !this.isMounted) return;

    const API_URL = import.meta.env.VITE_API_URL || '';
    this.sseInstance = new EventSource(`${API_URL}/stream?token=${token}`);
    
    this.sseInstance.addEventListener('connected', () => {
      console.log('[SSE] Stream connected');
      this.retryCount = 0;
    });

    this.sseInstance.addEventListener('NOTIFICATION_CREATED', async (e) => {
      try {
        const notification = JSON.parse(e.data);
        await this.handleIncomingPayload(notification, true);
      } catch(err) { console.error('[SSE] Error parsing notification', err); }
    });

    this.sseInstance.addEventListener('VEHICLE_UPDATED', async (e) => {
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

    this.sseInstance.onerror = (error) => {
      console.error('[SSE] Connection error. Closing instance to prevent spam.');
      this.cleanup();

      if (this.retryCount >= this.MAX_RETRIES) {
        console.warn('[SSE] Max retries reached. Stopping reconnection attempts.');
        return;
      }

      const delay = Math.min(30000, 2000 * Math.pow(2, this.retryCount));
      this.retryCount++;
      
      this.reconnectTimer = setTimeout(() => {
        if (this.isMounted) this.connectSSE(token);
      }, delay);
    };
  }

  async registerDeviceToken() {
    if (Capacitor.isNativePlatform()) {
      return this.registerCapacitorPush();
    } else {
      return this.registerWebPush();
    }
  }

  async registerCapacitorPush() {
    try {
      let permStatus = await PushNotifications.checkPermissions();
      if (permStatus.receive === 'prompt') {
        permStatus = await PushNotifications.requestPermissions();
      }

      if (permStatus.receive !== 'granted') {
        console.warn('User denied push permissions');
        return;
      }

      // Android Notification Channels
      if (Capacitor.getPlatform() === 'android') {
        await PushNotifications.createChannel({
          id: 'emergency_alerts',
          name: 'Emergency Alerts',
          description: 'High priority alerts for vehicle theft and emergencies',
          importance: 5, // High
          visibility: 1, // Public
          vibration: true
        });
        await PushNotifications.createChannel({
          id: 'general_alerts',
          name: 'General Updates',
          description: 'General notifications regarding your vehicle',
          importance: 3, // Default
          visibility: 1,
          vibration: true
        });
      }

      await PushNotifications.register();

      PushNotifications.addListener('registration', async (token) => {
        const deviceId = await this.getOrCreateDeviceId();
        this.sendTokenToBackend(token.value, Capacitor.getPlatform(), deviceId);
      });

      PushNotifications.addListener('pushNotificationReceived', (notification) => {
        this.handleIncomingPayload(notification.data, false);
      });

      PushNotifications.addListener('pushNotificationActionPerformed', (notification) => {
        const data = notification.notification.data;
        if (data && data.url) {
          window.location.href = data.url;
        }
      });

    } catch (err) {
      console.error('[NotificationRepository] Failed to register Capacitor push:', err);
    }
  }

  async registerWebPush() {
    if (!('serviceWorker' in navigator) || !('PushManager' in window)) {
      console.warn('[NotificationRepository] Web Push not supported in this browser.');
      return;
    }

    try {
      const permission = await Notification.requestPermission();
      if (permission === 'granted') {
        const registration = await navigator.serviceWorker.register('/firebase-messaging-sw.js');
        
        const vapidKey = import.meta.env.VITE_FIREBASE_VAPID_KEY;
        if (!vapidKey || vapidKey === "YOUR_VAPID_KEY") {
          console.warn('[NotificationRepository] VAPID Key is missing or invalid. Skipping Web Push registration until configured.');
          return;
        }

        const currentToken = await getToken(this.messaging, {
          vapidKey,
          serviceWorkerRegistration: registration
        });

        if (currentToken) {
          const deviceId = await this.getOrCreateDeviceId();
          await this.sendTokenToBackend(currentToken, 'web', deviceId);
        }
      }
    } catch (err) {
      console.error('[NotificationRepository] Failed to register Web Push:', err);
    }
  }

  async sendTokenToBackend(token, platform, deviceId) {
    await syncManager.enqueueAction('registerDeviceToken', 'POST', '/users/device-tokens', {
      token,
      platform,
      deviceId
    });
  }

  async handleIncomingPayload(data, isFromSSE) {
    // If it's from SSE, `data` is the full document. If from FCM, it's just the `data` map payload.
    const reportId = data._id || data.reportId || data.id;
    if (!reportId) return;

    try {
      const existing = await db.notifications.get(String(reportId));

      if (isFromSSE) {
        // SSE is the source of truth. Always overwrite.
        const notification = {
          ...data,
          id: String(reportId),
          type: data.type || data.categoryLabel || 'Alert',
          category: data.category || 'unknown',
          message: data.message || 'New vehicle alert',
          timestamp: data.timestamp || data.createdAt || new Date().toISOString(),
          read: data.read || data.status === 'resolved' || false,
          resolved: data.resolved || data.status === 'resolved' || false,
          vehicleId: data.vehicleId?._id || data.vehicleId
        };
        await db.notifications.put(notification);
        if (!existing) {
          this.playFeedback();
        }
      } else {
        // From FCM (background/foreground). Only insert if it doesn't exist, preventing overwrite of rich SSE data.
        if (!existing) {
          const notification = {
            id: String(reportId),
            type: 'Alert',
            category: data.category || 'unknown',
            message: data.message || 'New vehicle alert',
            timestamp: new Date().toISOString(),
            read: false,
            resolved: false,
            vehicleId: data.vehicleId
          };
          await db.notifications.put(notification);
          this.playFeedback();
        }
      }
    } catch (err) {
      console.error('[NotificationRepository] Error handling incoming payload:', err);
    }
  }

  async playFeedback() {
    try {
      const m = await import('../../services/sound/HapticManager');
      m.hapticManager.playNotificationSound();
      m.hapticManager.vibrateNotification();
    } catch (e) {}
  }

  async clearLocalNotifications() {
    await db.notifications.clear();
  }
}

export const NotificationRepo = new NotificationRepository();
