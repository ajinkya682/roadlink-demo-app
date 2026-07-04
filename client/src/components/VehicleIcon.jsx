import React from 'react';
import { Car, Bike, Bus } from 'lucide-react';

export default function VehicleIcon({ type, size = 24, className = "text-navy" }) {
  if (type === 'two-wheeler') {
    return <Bike size={size} className={className} />;
  }
  if (type === 'commercial') {
    return <Bus size={size} className={className} />;
  }
  // Default to four-wheeler
  return <Car size={size} className={className} />;
}
