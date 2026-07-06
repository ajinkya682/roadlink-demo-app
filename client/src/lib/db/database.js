import Dexie from 'dexie';

// Initialize the Dexie database
export const db = new Dexie('RoadLinkDB');

// Define database schema
// ++id creates an auto-incrementing primary key.
// The other fields listed are indexed properties (for fast queries).
// Unlisted fields can still be stored in the object without being indexed.
db.version(1).stores({
  user: 'id', // Expecting singleton or simple key, usually just 'me'
  vehicles: 'id, isVerified, addedDate',
  documents: 'id, vehicleId, type',
  contacts: 'id, isPrimary',
  syncQueue: '++id, action, method, url, status, createdAt' // status: 'pending', 'failed'
});

db.version(2).stores({
  user: 'id',
  vehicles: 'id, isVerified, addedDate',
  documents: 'id, vehicleId, type',
  contacts: 'id, isPrimary',
  syncQueue: '++id, action, method, url, status, createdAt',
  notifications: 'id, read, resolved, timestamp'
});

// Optionally, define hooks for automatically setting updatedAt
db.user.hook('creating', function (primKey, obj, trans) {
  obj.updatedAt = Date.now();
});
db.user.hook('updating', function (mods, primKey, obj, trans) {
  return { updatedAt: Date.now() };
});

db.vehicles.hook('creating', function (primKey, obj, trans) {
  obj.updatedAt = Date.now();
});
db.vehicles.hook('updating', function (mods, primKey, obj, trans) {
  return { updatedAt: Date.now() };
});

export default db;
