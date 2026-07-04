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
        <div className="bg-white border-2 border-asphalt rounded-xl overflow-hidden shadow-plate flex h-[72px]">
          {/* Blue IND Strip */}
          <div className="bg-[#003399] w-[40px] flex flex-col items-center justify-between py-2 flex-shrink-0 relative">
            {/* Ind chakra mock */}
            <div className="w-4 h-4 rounded-full border border-white/40 flex items-center justify-center mt-1">
              <div className="w-1 h-1 bg-white/60 rounded-full" />
            </div>
            <span className="font-mono text-[10px] font-bold text-white tracking-[0.1em]">IND</span>
            {/* Rivet */}
            <div className="absolute top-1.5 right-1 w-1.5 h-1.5 bg-black/20 rounded-full" />
            <div className="absolute bottom-1.5 right-1 w-1.5 h-1.5 bg-black/20 rounded-full" />
          </div>
          
          {/* Input Area */}
          <div className="flex-1 relative bg-[linear-gradient(to_bottom,#ffffff,#f0f0f0)]">
             <input
              className="w-full h-full px-4 font-mono font-bold text-[28px] text-asphalt tracking-widest bg-transparent focus:outline-none placeholder:text-outline-light/50 text-center uppercase"
              value={plate}
              onChange={handleChange}
              placeholder="MH 12 AB 1234"
              autoFocus
              onKeyDown={e => e.key === 'Enter' && handleSearch()}
            />
          </div>
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
