import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Zap } from 'lucide-react';
import Button from '../../components/Button';
import Input from '../../components/Input';

export default function LoginRegister() {
  const navigate = useNavigate();
  const [tab, setTab] = useState('login');
  const [phone, setPhone] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!phone) return;
    setLoading(true);
    setTimeout(() => navigate('/otp'), 800);
  };

  const fillDemo = () => {
    setPhone('9876543210');
    if (tab === 'register') setName('Ajinkya Savarkar');
  };

  const canSubmit = phone.length === 10 && (tab === 'login' || name.length >= 2);

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
          {/* Tab bar */}
          <div className="flex border-b border-outline-light">
            {['login', 'register'].map(t => (
              <button
                key={t}
                className={`flex-1 py-4 font-body font-semibold text-sm capitalize transition-colors relative ${
                  tab === t ? 'text-navy' : 'text-on-surface-muted'
                }`}
                onClick={() => setTab(t)}
              >
                {t === 'login' ? 'Log In' : 'Sign Up'}
                {tab === t && (
                  <motion.div
                    layoutId="auth-line"
                    className="absolute bottom-0 left-4 right-4 h-0.5 bg-navy rounded-full"
                  />
                )}
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="px-5 pt-5 pb-6 space-y-4">
            <AnimatePresence>
              {tab === 'register' && (
                <motion.div
                  key="name"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <Input
                    label="Full Name"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    placeholder="e.g. Rahul Sharma"
                  />
                </motion.div>
              )}
            </AnimatePresence>

            <Input
              label="Phone Number"
              prefix="+91"
              type="tel"
              inputMode="numeric"
              value={phone}
              onChange={e => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
              placeholder="98765 43210"
              autoFocus
            />

            <Button fullWidth type="submit" disabled={!canSubmit} isLoading={loading}>
              Get OTP
            </Button>

            {/* Demo shortcut */}
            <button
              type="button"
              className="w-full flex items-center justify-center gap-2 py-2 text-sm font-semibold text-signal-amber font-body rounded-lg border border-signal-amber/30 bg-signal-amber/5"
              onClick={fillDemo}
            >
              <Zap size={15} />
              Demo Login — Fill credentials
            </button>
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
