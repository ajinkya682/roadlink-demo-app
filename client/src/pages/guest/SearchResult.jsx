import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search, Shield } from 'lucide-react';
import Button from '../../components/Button';
import PlateTag from '../../components/PlateTag';
import { vehicles } from '../../demo-data/vehicles';

export default function SearchResult() {
  const navigate = useNavigate();
  const location = useLocation();
  const plate = location.state?.plate || 'MH 14 AB 1234';
  const [loading, setLoading] = useState(true);

  // Check if plate matches any registered vehicle
  const found = vehicles.find(v =>
    v.plate.replace(/\s/g, '').toUpperCase() === plate.replace(/\s/g, '').toUpperCase()
  );

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 1400);
    return () => clearTimeout(t);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-fog flex flex-col items-center justify-center gap-4">
        <motion.div
          animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
          transition={{ repeat: Infinity, duration: 1.5 }}
          className="w-16 h-16 bg-navy/10 rounded-2xl flex items-center justify-center"
        >
          <Search size={32} className="text-navy" />
        </motion.div>
        <p className="font-body text-body-sm text-on-surface-muted">Searching secure registry...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-fog flex flex-col items-center justify-center px-5 pb-12">
      <div className="w-full max-w-sm space-y-6">
        {found ? (
          <>
            <div className="text-center space-y-1">
              <span className="inline-block font-body text-label-caps text-verified-green uppercase tracking-widest bg-verified-green/10 px-3 py-1 rounded-full">
                Vehicle Found
              </span>
            </div>

            <motion.div
              className="flex justify-center"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ type: 'spring', damping: 20 }}
            >
              <PlateTag plateNumber={found.plate} displayName={found.displayName} isVerified={found.isVerified} size="lg" />
            </motion.div>

            <motion.div
              className="space-y-3"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <Button
                fullWidth
                onClick={() => navigate('/report-detail', { state: { category: { label: 'General Alert', emoji: '🔔', isAlert: false } } })}
              >
                Notify Owner
              </Button>
              <Button variant="outline" fullWidth onClick={() => navigate('/search')}>
                Search Another
              </Button>
              <div className="flex items-center justify-center gap-2 pt-1">
                <Shield size={13} className="text-verified-green" />
                <p className="font-body text-xs text-on-surface-muted text-center">
                  Owner's privacy is protected. They'll receive your alert without sharing their number.
                </p>
              </div>
            </motion.div>
          </>
        ) : (
          <>
            {/* Not found */}
            <motion.div
              className="text-center space-y-3"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="w-16 h-16 bg-surface-high rounded-2xl flex items-center justify-center mx-auto">
                <Search size={28} className="text-outline" />
              </div>
              <div>
                <h2 className="font-display text-headline-sm text-on-surface mb-1">
                  Vehicle Not Found
                </h2>
                <p className="font-mono text-data-mono text-on-surface bg-surface-high inline-block px-3 py-1.5 rounded-lg mb-3">
                  {plate}
                </p>
                <p className="font-body text-body-sm text-on-surface-muted">
                  This vehicle isn't registered on RoadLink yet.
                </p>
              </div>

              <div className="space-y-3 pt-2">
                <Button variant="outline" fullWidth onClick={() => navigate('/search')}>
                  Search Again
                </Button>
                <button
                  className="font-body text-sm text-on-surface-muted underline underline-offset-2"
                  onClick={() => navigate('/login')}
                >
                  Learn how RoadLink works
                </button>
              </div>
            </motion.div>
          </>
        )}
      </div>
    </div>
  );
}
