import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Zap } from 'lucide-react';
import Button from '../../components/Button';
import Input from '../../components/Input';

export default function LoginRegister() {
  const navigate = useNavigate();
  const [phone, setPhone] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [touched, setTouched] = useState({ name: false, phone: false });

  const nameError = touched.name && name.length < 2 ? 'Please enter your full name' : '';
  const phoneError = touched.phone && phone.length !== 10 ? 'Please enter a valid 10-digit number' : '';
  const canSubmit = phone.length === 10 && name.length >= 2;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!canSubmit) return;
    setLoading(true);
    const maskedPhone = `+91 ${phone.slice(0, 2)}••••${phone.slice(-4)}`;
    
    // Simulate API call
    setTimeout(() => {
      navigate('/otp', { state: { phone, name, maskedPhone } });
    }, 800);
  };

  return (
    <div className="min-h-screen bg-fog flex flex-col">
      {/* Hero area */}
      <div className="relative bg-navy pt-16 pb-20 px-6 text-center overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute -top-12 -right-12 w-48 h-48 rounded-full bg-white" />
          <div className="absolute -bottom-8 -left-8 w-36 h-36 rounded-full bg-white" />
        </div>

        <div className="relative z-10">
          <h1 className="font-display text-headline-lg text-white tracking-tight mb-2">RoadLink</h1>
          <p className="font-body text-body-sm text-white/70">Every Vehicle. One Identity. One Scan Away.</p>
        </div>
      </div>

      {/* Card — overlaps hero */}
      <div className="relative z-20 flex-1 px-5 -mt-8 pb-8">
        <div className="bg-white rounded-2xl shadow-sheet border border-outline-light/50 overflow-hidden">
          <div className="px-5 pt-6 pb-4 border-b border-outline-light">
            <h2 className="font-display text-headline-sm text-on-surface">Get Started</h2>
            <p className="font-body text-body-sm text-on-surface-muted mt-1">Enter your details to continue</p>
          </div>

          <form onSubmit={handleSubmit} className="px-5 pt-5 pb-6 space-y-4">
            <div className="space-y-1">
              <Input
                label="Full Name"
                value={name}
                onChange={e => setName(e.target.value)}
                onBlur={() => setTouched(t => ({ ...t, name: true }))}
                placeholder="e.g. Rahul Sharma"
                error={!!nameError}
              />
              {nameError ? (
                <p className="font-body text-[11px] text-alert-red px-1">{nameError}</p>
              ) : (
                <p className="font-body text-[11px] text-on-surface-muted px-1">This name may be shown publicly if you choose to display it on a vehicle</p>
              )}
            </div>

            <div className="space-y-1">
              <Input
                label="Mobile Number"
                prefix="+91"
                type="tel"
                inputMode="numeric"
                value={phone}
                onChange={e => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                onBlur={() => setTouched(t => ({ ...t, phone: true }))}
                placeholder="98765 43210"
                error={!!phoneError}
              />
              {phoneError && (
                <p className="font-body text-[11px] text-alert-red px-1">{phoneError}</p>
              )}
            </div>
            <Button fullWidth type="submit" disabled={!canSubmit} isLoading={loading}>
              Get OTP
            </Button>


          </form>
        </div>

        <div className="mt-8 pb-4 text-center px-4">
          <p className="font-body text-[15px] text-on-surface-muted mb-8 leading-relaxed">
            We only use this to verify you and deliver alerts —<br />never shown publicly.
          </p>
          <div className="border-t border-outline-light pt-6">
            <p className="font-body text-[15px] text-on-surface mb-5 leading-relaxed">
              Privacy Encrypted. This page never shows the<br />owner's phone number.
            </p>
            <div className="flex justify-center gap-6 mb-6">
              <button className="font-body text-[15px] text-on-surface-muted hover:text-navy underline underline-offset-4">Privacy Policy</button>
              <button className="font-body text-[15px] text-on-surface-muted hover:text-navy underline underline-offset-4">Legal Terms</button>
            </div>
            <p className="font-body text-[11px] font-bold tracking-[0.1em] text-on-surface-muted uppercase mt-8">
              ROADLINK IDENTITY SYSTEMS © 2026
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
