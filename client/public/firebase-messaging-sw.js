importScripts('https://www.gstatic.com/firebasejs/10.7.1/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.7.1/firebase-messaging-compat.js');
importScripts('https://unpkg.com/dexie@3.2.4/dist/dexie.min.js');

importScripts('/firebase-config.js');

firebase.initializeApp(firebaseConfig);

const messaging = firebase.messaging();

// Setup Dexie Database in the Service Worker context
const db = new Dexie('RoadLinkDB');
// Must exactly match the schema in your main app's database.js
db.version(1).stores({
  user: 'id',
  vehicles: 'id',
  notifications: 'id, timestamp, read, vehicleId',
  documents: 'id, vehicleId',
  contacts: 'id, vehicleId',
  syncQueue: '++id, status, createdAt'
});

messaging.onBackgroundMessage(async (payload) => {
  console.log('[firebase-messaging-sw.js] Received background message ', payload);
  
  const notificationTitle = payload.notification?.title || 'Vehicle Alert';
  const notificationOptions = {
    body: payload.notification?.body || 'New update for your vehicle.',
    icon: '/pwa-192x192.png',
    badge: '/badge.png',
    data: payload.data
  };

  // Write payload to offline Dexie DB
  if (payload.data && payload.data.reportId) {
    try {
      await db.notifications.put({
        id: payload.data.reportId,
        type: notificationTitle,
        category: payload.data.category || 'unknown',
        message: notificationOptions.body,
        timestamp: new Date().toISOString(),
        read: false,
        resolved: false,
        vehicleId: payload.data.vehicleId
      });
      console.log('[firebase-messaging-sw.js] Saved notification to Dexie');
    } catch (e) {
      console.error('[firebase-messaging-sw.js] Failed to save to Dexie', e);
    }
  }

  // Show OS notification
  return self.registration.showNotification(notificationTitle, notificationOptions);
});

self.addEventListener('notificationclick', function(event) {
  event.notification.close();
  const data = event.notification.data;
  
  // This looks to see if the current is already open and focuses if it is
  event.waitUntil(
    clients.matchAll({ type: 'window' }).then((windowClients) => {
      // Check if there is already a window/tab open with the target URL
      for (let i = 0; i < windowClients.length; i++) {
        let client = windowClients[i];
        if (client.url.includes(data.url) && 'focus' in client) {
          return client.focus();
        }
      }
      // If not, then open the target URL in a new window/tab.
      if (clients.openWindow) {
        return clients.openWindow(data.url || '/notifications');
      }
    })
  );
});
