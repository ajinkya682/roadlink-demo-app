import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Package, Truck, ShieldCheck, Check } from 'lucide-react';
import AppHeader from '../../components/AppHeader';
import Button from '../../components/Button';
import Input from '../../components/Input';

const stickerTypes = [
  {
    id: 'standard',
    name: 'Standard',
    price: '₹99',
    desc: 'Weather-resistant vinyl, 2-year lifespan',
    features: ['UV-resistant', 'Waterproof', '60mm × 40mm'],
  },
  {
    id: 'reflective',
    name: 'Reflective',
    price: '₹149',
    desc: 'High visibility at night, 3M material',
    features: ['Night visibility', '3M premium', 'Free shipping'],
    recommended: true,
  },
  {
    id: 'nfc',
    name: 'NFC + QR',
    price: '₹299',
    desc: 'Tap or scan — dual-mode for smartphones',
    features: ['NFC tap', 'QR scan', 'Premium metal'],
  },
];

export default function OrderSticker() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [selected, setSelected] = useState('reflective');
  const [loading, setLoading] = useState(false);
  const [address, setAddress] = useState({ name: '', addressLine: '', city: '', pin: '' });

  const selectedType = stickerTypes.find(s => s.id === selected);

  const handleNext = () => {
    if (step === 1) setStep(2);
    else {
      setLoading(true);
      setTimeout(() => navigate('/order-confirmation'), 1500);
    }
  };

  const canProceed = step === 1 || (address.name && address.addressLine && address.city && address.pin.length === 6);

  return (
    <div className="min-h-screen bg-fog flex flex-col">
      <AppHeader title="Order Sticker" />

      {/* Progress */}
      <div className="px-5 pt-4 pb-2 flex items-center gap-3">
        {[1, 2].map(s => (
          <React.Fragment key={s}>
            <div className={`flex items-center justify-center w-8 h-8 rounded-full font-body text-sm font-bold transition-colors ${
              step >= s ? 'bg-navy text-white' : 'bg-surface-high text-on-surface-muted'
            }`}>
              {step > s ? <Check size={16} /> : s}
            </div>
            {s < 2 && (
              <div className={`flex-1 h-0.5 rounded-full transition-colors ${step > 1 ? 'bg-navy' : 'bg-surface-high'}`} />
            )}
          </React.Fragment>
        ))}
      </div>

      <div className="flex-1 px-5 py-4">
        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="space-y-3"
            >
              <h2 className="font-display text-headline-sm text-on-surface">Choose Sticker Type</h2>
              {stickerTypes.map(type => (
                <motion.div
                  key={type.id}
                  whileTap={{ scale: 0.985 }}
                  className={`relative bg-white rounded-2xl border-2 p-4 cursor-pointer transition-colors ${
                    selected === type.id
                      ? 'border-navy bg-navy/2'
                      : 'border-outline-light hover:border-navy/30'
                  }`}
                  onClick={() => setSelected(type.id)}
                >
                  {type.recommended && (
                    <span className="absolute top-3 right-3 bg-signal-amber text-asphalt text-[10px] font-bold px-2 py-0.5 rounded-full">
                      POPULAR
                    </span>
                  )}
                  <div className="flex items-start gap-3">
                    <div className={`mt-0.5 w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                      selected === type.id ? 'border-navy bg-navy' : 'border-outline-light'
                    }`}>
                      {selected === type.id && <div className="w-2 h-2 rounded-full bg-white" />}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-baseline gap-2">
                        <span className="font-display text-headline-sm text-on-surface">{type.name}</span>
                        <span className="font-mono text-lg font-bold text-navy">{type.price}</span>
                      </div>
                      <p className="font-body text-xs text-on-surface-muted mt-0.5">{type.desc}</p>
                      <div className="flex flex-wrap gap-1.5 mt-2">
                        {type.features.map(f => (
                          <span key={f} className="bg-surface-low rounded-full px-2.5 py-0.5 font-body text-xs text-on-surface-muted">
                            {f}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}

              <div className="flex flex-col gap-1.5 pt-1">
                {[
                  [Package, 'Premium 3M material'],
                  [Truck, 'Free shipping pan-India'],
                  [ShieldCheck, '1-year replacement guarantee'],
                ].map(([Icon, text]) => (
                  <div key={text} className="flex items-center gap-2 font-body text-sm text-on-surface-muted">
                    <Icon size={14} className="text-verified-green flex-shrink-0" />
                    {text}
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="space-y-4"
            >
              <h2 className="font-display text-headline-sm text-on-surface">Shipping Details</h2>

              <div className="bg-navy/5 border border-navy/15 rounded-xl px-4 py-3 flex justify-between">
                <span className="font-body text-sm text-on-surface">{selectedType?.name} Sticker</span>
                <span className="font-mono font-bold text-navy">{selectedType?.price}</span>
              </div>

              <Input label="Full Name" placeholder="e.g. Rahul Sharma" value={address.name}
                onChange={e => setAddress(a => ({ ...a, name: e.target.value }))} autoFocus />
              <Input label="Address" placeholder="House/Flat No., Street, Area" value={address.addressLine}
                onChange={e => setAddress(a => ({ ...a, addressLine: e.target.value }))} />
              <div className="grid grid-cols-2 gap-3">
                <Input label="City" placeholder="Pune" value={address.city}
                  onChange={e => setAddress(a => ({ ...a, city: e.target.value }))} />
                <Input label="PIN Code" type="tel" maxLength={6} placeholder="411014" value={address.pin}
                  onChange={e => setAddress(a => ({ ...a, pin: e.target.value.replace(/\D/g, '') }))} />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="px-5 pb-10 pt-4 border-t border-outline-light bg-fog">
        <Button fullWidth onClick={handleNext} isLoading={loading} disabled={!canProceed}>
          {step === 1 ? 'Continue to Shipping' : `Pay ${selectedType?.price} via Razorpay`}
        </Button>
      </div>
    </div>
  );
}
