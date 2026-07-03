import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import AppHeader from '../../components/AppHeader';
import Button from '../../components/Button';
import Input from '../../components/Input';
import PlateTag from '../../components/PlateTag';
import { useDemoData } from '../../context/DemoContext';

function formatPlate(val) {
  const raw = val.replace(/[^A-Z0-9]/g, '').slice(0, 10);
  let out = raw;
  if (raw.length > 2) out = raw.slice(0, 2) + ' ' + raw.slice(2);
  if (raw.length > 4) out = raw.slice(0, 2) + ' ' + raw.slice(2, 4) + ' ' + raw.slice(4);
  if (raw.length > 6) out = raw.slice(0, 2) + ' ' + raw.slice(2, 4) + ' ' + raw.slice(4, 6) + ' ' + raw.slice(6);
  return out;
}

export default function AddVehicle() {
  const navigate = useNavigate();
  const { addVehicle } = useDemoData();

  const [plate, setPlate] = useState('');
  const [model, setModel] = useState('');
  const [nickname, setNickname] = useState('');
  const [loading, setLoading] = useState(false);

  const handlePlate = (e) => setPlate(formatPlate(e.target.value.toUpperCase()));

  const rawPlate = plate.replace(/\s/g, '');
  const showModel = rawPlate.length >= 5;
  const showNickname = model.length >= 2;
  const canSave = rawPlate.length >= 6 && model.length >= 2;

  const handleSave = () => {
    setLoading(true);
    setTimeout(() => {
      addVehicle({ plate, displayName: model, make: model.split(' ')[0], model, nickname });
      navigate('/qr-detail');
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-fog flex flex-col">
      <AppHeader title="Add Vehicle" />

      <div className="flex-1 px-5 py-6 space-y-6">
        {/* Live plate preview */}
        <div className="flex justify-center">
          <motion.div
            animate={{ opacity: 1, y: 0 }}
            initial={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.3 }}
          >
            <PlateTag
              plateNumber={plate || 'MH 00 AA 0000'}
              isVerified={false}
              size="lg"
              animateEntry
              key={plate.slice(0, 2)}
            />
          </motion.div>
        </div>

        {/* Form */}
        <div className="space-y-4">
          <Input
            label="Registration Number"
            value={plate}
            onChange={handlePlate}
            placeholder="MH 14 AB 1234"
            helper="Enter exactly as shown on your RC book"
            inputClassName="font-mono uppercase tracking-widest"
          />

          <AnimatePresence>
            {showModel && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ type: 'spring', damping: 22, stiffness: 180 }}
              >
                <Input
                  label="Make / Model"
                  value={model}
                  onChange={e => setModel(e.target.value)}
                  placeholder="e.g. Honda Activa 6G"
                  autoFocus
                />
              </motion.div>
            )}

            {showNickname && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ type: 'spring', damping: 22, stiffness: 180, delay: 0.05 }}
              >
                <Input
                  label="Nickname (Optional)"
                  value={nickname}
                  onChange={e => setNickname(e.target.value)}
                  placeholder="e.g. Daily Commute"
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Actions */}
        <div className="space-y-3 pt-2">
          <motion.div animate={{ opacity: canSave ? 1 : 0.45 }}>
            <Button fullWidth onClick={handleSave} disabled={!canSave} isLoading={loading}>
              Save Vehicle
            </Button>
          </motion.div>
          <button
            className="w-full py-3 font-body text-sm font-semibold text-on-surface-muted text-center"
            onClick={() => navigate('/dashboard')}
          >
            Skip for now
          </button>
        </div>
      </div>
    </div>
  );
}
