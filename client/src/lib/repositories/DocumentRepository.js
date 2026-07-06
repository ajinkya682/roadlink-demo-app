import { db } from '../db/database';
import api from '../api';
import { syncManager } from '../sync/SyncManager';


let lastDocumentRefreshAt = 0;
const DOCUMENT_TTL_MS = 60 * 1000;

export class DocumentRepository {
  static async getDocuments() {
    const cached = await db.documents.toArray();
    this.refreshDocumentsSilently();
    return cached;
  }

  static async refreshDocumentsSilently() {
    if (!navigator.onLine) return;

    const now = Date.now();
    if (now - lastDocumentRefreshAt < DOCUMENT_TTL_MS) return;
    lastDocumentRefreshAt = now;

    try {
      const res = await api.get('/documents');
      if (res.data.success) {
        const fetchedDocs = res.data.data.documents.map(d => ({
          id: d._id,
          vehicleId: d.vehicleId,
          type: d.type,
          fileUrl: d.fileUrl,
          number: d.documentNumber,
          expiry: d.expiryDate ? new Date(d.expiryDate).toLocaleDateString('en-IN', { month: 'short', year: 'numeric' }) : null,
          expiryDateValue: d.expiryDate,
          status: d.expiryDate && new Date(d.expiryDate) < new Date() ? 'expired' : 'valid',
          updatedAt: Date.now()
        }));

        await db.documents.bulkPut(fetchedDocs);

        const fetchedIds = new Set(fetchedDocs.map(d => d.id));
        const allCached = await db.documents.toArray();
        const toDelete = allCached.filter(d => !fetchedIds.has(d.id)).map(d => d.id);
        if (toDelete.length > 0) {
          await db.documents.bulkDelete(toDelete);
        }
      }
    } catch (err) {
      console.error('[DocumentRepository] Background refresh failed:', err);
    }
  }

  static async addDocument(d) {
    const newDoc = {
      id: d._id,
      vehicleId: d.vehicleId,
      type: d.type,
      fileUrl: d.fileUrl,
      number: d.documentNumber,
      expiry: d.expiryDate ? new Date(d.expiryDate).toLocaleDateString('en-IN', { month: 'short', year: 'numeric' }) : null,
      expiryDateValue: d.expiryDate,
      status: d.expiryDate && new Date(d.expiryDate) < new Date() ? 'expired' : 'valid',
      updatedAt: Date.now()
    };
    await db.documents.put(newDoc);
    return newDoc;
  }

  static async deleteDocument(id) {
    await db.documents.delete(id);

    if (navigator.onLine) {
      try {
        await api.delete(`/documents/${id}`);
      } catch (err) {
        await syncManager.enqueueAction('deleteDocument', 'DELETE', `/documents/${id}`, null);
      }
    } else {
      await syncManager.enqueueAction('deleteDocument', 'DELETE', `/documents/${id}`, null);
    }
  }

  static async updateDocument(id, updates) {
    const doc = await db.documents.get(id);
    if (!doc) return;
    
    // For MVP optimistic update
    Object.assign(doc, updates);
    await db.documents.put(doc);

    if (navigator.onLine) {
      try {
        await api.patch(`/documents/${id}`, updates);
      } catch (err) {
        await syncManager.enqueueAction('updateDocument', 'PATCH', `/documents/${id}`, updates);
      }
    } else {
      await syncManager.enqueueAction('updateDocument', 'PATCH', `/documents/${id}`, updates);
    }
  }

  static async clear() {
    await db.documents.clear();
  }
}
