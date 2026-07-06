import React, { useEffect, useState } from 'react';

import { WifiOff, Wifi } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export function OfflineBanner() {
  const [isOnline, setIsOnline] = useState(true);
  const [wasOffline, setWasOffline] = useState(false);

  useEffect(() => {
    // Check initial
    setIsOnline(navigator.onLine);
    if (!navigator.onLine) setWasOffline(true);

    // Listen to changes
    const handleOnline = () => {
      setIsOnline(true);
    };
    const handleOffline = () => {
      setIsOnline(false);
      setWasOffline(true);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Show banner if currently offline OR if we just reconnected (show for a few secs then hide)
  const [showRestored, setShowRestored] = useState(false);

  useEffect(() => {
    if (isOnline && wasOffline) {
      setShowRestored(true);
      const timer = setTimeout(() => {
        setShowRestored(false);
        setWasOffline(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [isOnline, wasOffline]);

  return (
    <AnimatePresence>
      {(!isOnline || showRestored) && (
        <motion.div
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -50, opacity: 0 }}
          className={`absolute top-0 inset-x-0 z-[999] px-4 py-2 flex items-center justify-center gap-2 text-sm font-medium text-white shadow-md ${
            !isOnline ? 'bg-red-500' : 'bg-green-500'
          }`}
        >
          {!isOnline ? (
            <>
              <WifiOff size={16} />
              <span>Offline Mode - Viewing cached data</span>
            </>
          ) : (
            <>
              <Wifi size={16} />
              <span>Connection Restored - Syncing updates...</span>
            </>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
