import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Shield } from 'lucide-react';
import { motion } from 'framer-motion';
import Button from '../../components/Button';

function formatPlate(val) {
  const raw = val.replace(/\s/g, '').toUpperCase().slice(0, 10);
  let out = raw;
  if (raw.length > 2) out = raw.slice(0, 2) + ' ' + raw.slice(2);
  if (raw.length > 4) out = raw.slice(0, 2) + ' ' + raw.slice(2, 4) + ' ' + raw.slice(4);
  if (raw.length > 6) out = raw.slice(0, 2) + ' ' + raw.slice(2, 4) + ' ' + raw.slice(4, 6) + ' ' + raw.slice(6);
  return out;
}

export default function SearchVehicle() {
  const navigate = useNavigate();
  const [plate, setPlate] = useState('');

  const handleChange = (e) => setPlate(formatPlate(e.target.value));

  const handleSearch = () => {
    if (plate.replace(/\s/g, '').length >= 6) {
      navigate('/search-result', { state: { plate } });
    }
  };

  const isValid = plate.replace(/\s/g, '').length >= 6;

  return (
    <div className="min-h-screen bg-fog flex flex-col items-center justify-center px-5 pb-12">
      <motion.div
        className="w-full max-w-sm space-y-6"
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
      >
        <div className="text-center space-y-2">
          <div className="w-14 h-14 bg-navy/10 rounded-2xl flex items-center justify-center mx-auto">
            <Search size={28} className="text-navy" />
          </div>
          <h1 className="font-display text-headline-sm text-on-surface">Search a Vehicle</h1>
          <p className="font-body text-body-sm text-on-surface-muted">Enter the registration number below</p>
        </div>

        {/* Plate-styled input */}
        <div className="bg-white border-2 border-asphalt rounded-xl overflow-hidden shadow-plate">
          {/* Plate header */}
          <div className="flex items-center justify-between px-4 py-2 border-b border-asphalt/15">
            <span className="font-mono text-[10px] font-medium text-on-surface-muted tracking-[0.2em] uppercase">IND</span>
            <div className="w-2 h-2 rounded-full bg-outline-light" />
          </div>
          {/* Input */}
          <input
            className="w-full px-4 py-4 font-mono font-medium text-xl text-asphalt tracking-widest bg-transparent focus:outline-none placeholder:text-outline-light text-center uppercase"
            value={plate}
            onChange={handleChange}
            placeholder="MH 14 AB 1234"
            autoFocus
            onKeyDown={e => e.key === 'Enter' && handleSearch()}
          />
        </div>

        <Button fullWidth onClick={handleSearch} disabled={!isValid}>
          <Search size={18} /> Search
        </Button>

        <div className="flex items-center justify-center gap-2">
          <Shield size={13} className="text-verified-green" />
          <p className="font-body text-xs text-on-surface-muted">
            We will never show you a phone number.
          </p>
        </div>
      </motion.div>
    </div>
  );
}
