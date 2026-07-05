import { db } from '../db/database';
import api from '../api';
import { syncManager } from '../sync/SyncManager';
import { Network } from '@capacitor/network';

export class ContactRepository {
  static async getContacts() {
    const cached = await db.contacts.toArray();
    this.refreshContactsSilently();
    return cached;
  }

  static async refreshContactsSilently() {
    const status = await Network.getStatus();
    if (!status.connected) return;

    try {
      const res = await api.get('/emergency-contacts');
      if (res.data.success) {
        const fetchedContacts = res.data.data.contacts.map(c => ({
          id: c._id,
          name: c.name,
          phone: c.phone,
          maskedPhone: this.maskPhone(c.phone),
          relation: c.relationship,
          isPrimary: c.isPrimary,
          updatedAt: Date.now()
        }));

        await db.contacts.bulkPut(fetchedContacts);

        const fetchedIds = new Set(fetchedContacts.map(c => c.id));
        const allCached = await db.contacts.toArray();
        const toDelete = allCached.filter(c => !fetchedIds.has(c.id)).map(c => c.id);
        if (toDelete.length > 0) {
          await db.contacts.bulkDelete(toDelete);
        }
      }
    } catch (err) {
      console.error('[ContactRepository] Background refresh failed:', err);
    }
  }

  static async addContact(contact) {
    const payload = {
      name: contact.name,
      phone: contact.phone,
      relationship: contact.relation,
      isPrimary: contact.isPrimary
    };

    // Attempt online creation to get real ID
    const res = await api.post('/emergency-contacts', payload); 
    const c = res.data.data.contact;

    const newContact = {
      id: c._id,
      name: c.name,
      phone: c.phone,
      maskedPhone: this.maskPhone(c.phone),
      relation: c.relationship,
      isPrimary: c.isPrimary,
      updatedAt: Date.now()
    };
    await db.contacts.put(newContact);
    return newContact;
  }

  static async deleteContact(id) {
    await db.contacts.delete(id);
    const status = await Network.getStatus();
    if (status.connected) {
      try {
        await api.delete(`/emergency-contacts/${id}`);
      } catch (err) {
        await syncManager.enqueueAction('deleteContact', 'DELETE', `/emergency-contacts/${id}`, null);
      }
    } else {
      await syncManager.enqueueAction('deleteContact', 'DELETE', `/emergency-contacts/${id}`, null);
    }
  }

  static async updateContact(id, updatedContact) {
    const c = await db.contacts.get(id);
    if (!c) return;

    const payload = {
      name: updatedContact.name,
      phone: updatedContact.phone,
      relationship: updatedContact.relation,
      isPrimary: updatedContact.isPrimary
    };

    Object.assign(c, updatedContact);
    await db.contacts.put(c);

    const status = await Network.getStatus();
    if (status.connected) {
      try {
        await api.patch(`/emergency-contacts/${id}`, payload);
      } catch (err) {
        await syncManager.enqueueAction('updateContact', 'PATCH', `/emergency-contacts/${id}`, payload);
      }
    } else {
      await syncManager.enqueueAction('updateContact', 'PATCH', `/emergency-contacts/${id}`, payload);
    }
  }

  static async setPrimaryContact(id) {
    // Optimistically update local state: set all to false, then this to true
    const contacts = await db.contacts.toArray();
    for (let c of contacts) {
      c.isPrimary = c.id === id;
      await db.contacts.put(c);
    }

    const payload = { isPrimary: true };
    const status = await Network.getStatus();
    if (status.connected) {
      try {
        await api.patch(`/emergency-contacts/${id}`, payload);
      } catch (err) {
        await syncManager.enqueueAction('setPrimaryContact', 'PATCH', `/emergency-contacts/${id}`, payload);
      }
    } else {
      await syncManager.enqueueAction('setPrimaryContact', 'PATCH', `/emergency-contacts/${id}`, payload);
    }
  }

  static maskPhone(phone) {
    const digits = phone.replace(/\D/g, '');
    if (digits.length >= 2) {
      const last2 = digits.slice(-2);
      return `+91 ${digits.slice(2, 4)}•••••${last2}`;
    }
    return phone;
  }

  static async clear() {
    await db.contacts.clear();
  }
}
