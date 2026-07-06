import { db } from '../db/database';
import api from '../api';

class SyncManager {
  constructor() {
    this.isSyncing = false;
    this.isOnline = navigator.onLine;

    // Listen to network changes
    window.addEventListener('online', () => {
      this.isOnline = true;
      this.processQueue();
    });

    window.addEventListener('offline', () => {
      this.isOnline = false;
    });
  }

  /**
   * Adds an item to the sync queue.
   * Useful when an API call fails or when offline.
   */
  async enqueueAction(actionType, method, url, payload) {
    try {
      await db.syncQueue.add({
        action: actionType,
        method,
        url,
        payload,
        status: 'pending',
        retryCount: 0,
        createdAt: Date.now()
      });
      // Attempt to sync immediately if we think we are online
      if (this.isOnline) {
        this.processQueue();
      }
    } catch (err) {
      console.error('Failed to enqueue action:', err);
    }
  }

  /**
   * Processes the queue sequentially.
   */
  async processQueue() {
    if (this.isSyncing || !this.isOnline) return;
    this.isSyncing = true;

    try {
      // Get all pending actions sorted by createdAt
      const pendingItems = await db.syncQueue
        .where('status')
        .equals('pending')
        .sortBy('createdAt');

      for (const item of pendingItems) {
        if (!this.isOnline) break; // Stop if we go offline during sync

        try {
          // Execute API request
          let response;
          if (item.method.toUpperCase() === 'POST') {
            response = await api.post(item.url, item.payload);
          } else if (item.method.toUpperCase() === 'PATCH') {
            response = await api.patch(item.url, item.payload);
          } else if (item.method.toUpperCase() === 'DELETE') {
            response = await api.delete(item.url);
          } else if (item.method.toUpperCase() === 'PUT') {
            response = await api.put(item.url, item.payload);
          }

          if (response && response.data && response.data.success) {
            // Success! Remove from queue
            await db.syncQueue.delete(item.id);
            console.log(`[SyncManager] Successfully synced ${item.action}`);
          } else {
            throw new Error('API returned unsuccessful response');
          }

        } catch (err) {
          console.error(`[SyncManager] Failed to sync ${item.action}:`, err);
          
          const isNetworkError = !err.response;
          const isClientError = err.response && err.response.status >= 400 && err.response.status < 500;
          
          if (isClientError && err.response.status !== 401 && err.response.status !== 429) {
            // 4xx error (Bad request, Not found, etc) usually means the request is malformed
            // and won't succeed on retry (unless it's 401 unauth or 429 rate limit).
            // Mark as failed permanently to avoid infinite loops.
            await db.syncQueue.update(item.id, {
              status: 'failed',
              error: err.response.data?.error?.message || err.message
            });
          } else {
            if (err.response && err.response.status === 401) {
              window.dispatchEvent(new Event('auth:logout'));
              await db.syncQueue.update(item.id, { status: 'failed', error: 'Unauthorized' });
              break;
            }
            // 5xx error or network error, increment retry count
            await db.syncQueue.update(item.id, {
              retryCount: item.retryCount + 1
            });
            // Stop processing queue if it's a network issue
            if (isNetworkError) {
              this.isOnline = false;
              break; 
            }
          }
        }
      }
    } catch (err) {
      console.error('[SyncManager] Error in queue processing loop:', err);
    } finally {
      this.isSyncing = false;
    }
  }
}

// Export singleton instance
export const syncManager = new SyncManager();
