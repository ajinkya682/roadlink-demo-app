import React, { useState, useRef, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import AppHeader from '../../components/AppHeader';
import Button from '../../components/Button';

export default function OTPVerification() {
  const navigate = useNavigate();
  const [digits, setDigits] = useState(['', '', '', '', '', '']);
  const [shake, setShake] = useState(false);
  const [loading, setLoading] = useState(false);
  const [countdown, setCountdown] = useState(60);
  const [canResend, setCanResend] = useState(false);
  const inputRefs = useRef([]);

  // Countdown timer
  useEffect(() => {
    if (countdown <= 0) { setCanResend(true); return; }
    const t = setTimeout(() => setCountdown(c => c - 1), 1000);
    return () => clearTimeout(t);
  }, [countdown]);

  const handleResend = () => {
    setCountdown(60);
    setCanResend(false);
    setDigits(['', '', '', '', '', '']);
    inputRefs.current[0]?.focus();
  };

  const handleDigit = useCallback((index, value) => {
    if (!/^\d?$/.test(value)) return;
    const next = [...digits];
    next[index] = value;
    setDigits(next);
    if (value && index < 5) inputRefs.current[index + 1]?.focus();

    // Auto-submit when all 6 filled
    if (value && index === 5) {
      const full = [...next];
      if (full.every(d => d !== '')) {
        setTimeout(() => submitCode(full.join('')), 100);
      }
    }
  }, [digits]);

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !digits[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const submitCode = (code) => {
    setLoading(true);
    setTimeout(() => {
      if (code === '123456') {
        navigate('/add-vehicle');
      } else {
        setLoading(false);
        setShake(true);
        setDigits(['', '', '', '', '', '']);
        inputRefs.current[0]?.focus();
        setTimeout(() => setShake(false), 600);
      }
    }, 900);
  };

  const handleVerify = () => {
    const code = digits.join('');
    if (code.length < 6) return;
    submitCode(code);
  };

  const allFilled = digits.every(d => d !== '');

  return (
    <div className="min-h-screen bg-fog flex flex-col">
      <AppHeader title="Verify Phone" />

      <div className="flex-1 px-5 py-8 flex flex-col gap-8">
        {/* Header */}
        <div className="text-center">
          <h1 className="font-display text-headline-sm text-on-surface mb-2">Enter the 6-digit code</h1>
          <p className="font-body text-body-sm text-on-surface-muted">Code sent to +91 98•••••210</p>
        </div>

        {/* OTP boxes */}
        <motion.div
          className="flex items-center justify-center gap-2"
          animate={shake ? { x: [0, -8, 8, -6, 6, -3, 3, 0] } : {}}
          transition={{ duration: 0.5 }}
        >
          {digits.map((d, i) => (
            <motion.div
              key={i}
              animate={d ? { scale: [1, 1.1, 1] } : {}}
              transition={{ type: 'spring', damping: 12, stiffness: 300 }}
            >
              <input
                ref={el => inputRefs.current[i] = el}
                className={`otp-box ${d ? 'filled' : ''}`}
                type="tel"
                inputMode="numeric"
                maxLength={1}
                value={d}
                onChange={e => handleDigit(i, e.target.value)}
                onKeyDown={e => handleKeyDown(i, e)}
                autoFocus={i === 0}
              />
            </motion.div>
          ))}
        </motion.div>

        {/* Demo hint */}
        <div className="bg-signal-amber/10 border border-signal-amber/30 rounded-xl px-4 py-3 text-center">
          <p className="font-body text-sm text-signal-amber font-semibold">
            💡 Demo: Enter <span className="font-mono tracking-widest">1 2 3 4 5 6</span> to verify
          </p>
        </div>

        <Button fullWidth onClick={handleVerify} disabled={!allFilled} isLoading={loading}>
          Verify
        </Button>

        {/* Resend */}
        <div className="text-center">
          {canResend ? (
            <button
              onClick={handleResend}
              className="font-body text-sm font-semibold text-navy underline underline-offset-2"
            >
              Resend code
            </button>
          ) : (
            <p className="font-body text-sm text-on-surface-muted">
              Resend code in{' '}
              <span className="font-mono font-semibold text-on-surface tabular-nums">
                0:{countdown.toString().padStart(2, '0')}
              </span>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
