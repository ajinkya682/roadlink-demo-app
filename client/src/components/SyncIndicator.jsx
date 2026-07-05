import React from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import db from '../lib/db/database';
import { CloudOff, RefreshCw } from 'lucide-react';

export default function SyncIndicator({ urlPrefix }) {
  // Check if there are any pending sync items that match the given URL prefix
  const pendingCount = useLiveQuery(async () => {
    if (!urlPrefix) {
      return await db.syncQueue.where('status').equals('pending').count();
    }
    const allPending = await db.syncQueue.where('status').equals('pending').toArray();
    return allPending.filter(item => item.url.startsWith(urlPrefix)).length;
  });

  if (!pendingCount || pendingCount === 0) return null;

  return (
    <div className="flex items-center gap-1.5 text-xs font-medium text-[#feae2c] bg-[#feae2c]/10 px-2.5 py-1 rounded-full">
      <CloudOff size={12} />
      <span>Pending Sync</span>
    </div>
  );
}
