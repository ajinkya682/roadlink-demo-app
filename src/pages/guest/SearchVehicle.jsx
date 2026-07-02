import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search } from 'lucide-react';
import { motion } from 'framer-motion';
import Button from '../../components/Button';
import styles from './SearchVehicle.module.css';

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

  const handleChange = (e) => {
    setPlate(formatPlate(e.target.value));
  };

  const handleSearch = () => {
    if (plate.replace(/\s/g, '').length >= 6) {
      navigate('/search-result', { state: { plate } });
    }
  };

  const isValid = plate.replace(/\s/g, '').length >= 6;

  return (
    <div className={styles.page}>
      <motion.div
        className={styles.center}
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
      >
        <Search size={32} color="var(--on-surface-variant)" />
        <h1 className={styles.headline}>Search a Vehicle</h1>

        <div className={styles.plateInput}>
          <div className={styles.plateHeader}>
            <span className={styles.ind}>IND</span>
            <div className={styles.rivet} />
          </div>
          <input
            className={styles.plateField}
            value={plate}
            onChange={handleChange}
            placeholder="MH 14 AB 1234"
            autoFocus
            onKeyDown={e => e.key === 'Enter' && handleSearch()}
          />
        </div>

        <Button fullWidth onClick={handleSearch} disabled={!isValid}>
          Search
        </Button>

        <p className={styles.privacy}>We will never show you a phone number.</p>
      </motion.div>
    </div>
  );
}
