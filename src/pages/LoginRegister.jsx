import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Button from '../components/Button';
import Input from '../components/Input';

export default function LoginRegister() {
  const navigate = useNavigate();
  const [tab, setTab] = useState('login'); // 'login' | 'register'
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');

  const tabBarStyle = {
    display: 'flex',
    backgroundColor: 'var(--surface-container)',
    borderRadius: 'var(--radius-lg)',
    padding: '4px',
    marginBottom: '32px',
  };

  const tabStyle = (active) => ({
    flex: 1,
    padding: '10px',
    textAlign: 'center',
    fontWeight: 600,
    fontSize: '15px',
    borderRadius: 'calc(var(--radius-lg) - 4px)',
    cursor: 'pointer',
    border: 'none',
    transition: 'all 0.2s ease',
    backgroundColor: active ? 'var(--plate-white)' : 'transparent',
    color: active ? 'var(--primary-container)' : 'var(--on-surface-variant)',
    boxShadow: active ? '0 1px 4px rgba(26,26,26,0.12)' : 'none',
  });

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: 'var(--fog)',
      padding: '0 0 40px',
      display: 'flex',
      flexDirection: 'column',
    }}>
      {/* Header */}
      <div style={{
        background: 'linear-gradient(160deg, var(--primary) 0%, var(--primary-container) 100%)',
        padding: '56px 24px 40px',
        marginBottom: '0',
      }}>
        <h1 className="text-headline-lg-mobile" style={{ color: '#fff', marginBottom: '8px', fontFamily: 'var(--font-display)' }}>
          RoadLink
        </h1>
        <p className="text-body-md" style={{ color: 'rgba(255,255,255,0.80)' }}>
          Every Vehicle. One Identity. One Scan Away.
        </p>
      </div>

      {/* Card */}
      <div style={{
        margin: '-20px 16px 0',
        backgroundColor: 'var(--plate-white)',
        borderRadius: 'var(--radius-xl)',
        padding: '24px',
        boxShadow: '0 8px 32px rgba(26,26,26,0.10)',
        flex: 1,
      }}>
        {/* Tabs */}
        <div style={tabBarStyle}>
          <button style={tabStyle(tab === 'login')} onClick={() => setTab('login')}>Log In</button>
          <button style={tabStyle(tab === 'register')} onClick={() => setTab('register')}>Sign Up</button>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={tab}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.18 }}
          >
            {tab === 'register' && (
              <Input
                label="Full Name"
                placeholder="e.g. Ajinkya Saivar"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            )}
            <Input
              label="Phone Number"
              prefix="+91"
              type="tel"
              placeholder="98765 43210"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          </motion.div>
        </AnimatePresence>

        <Button fullWidth onClick={() => navigate('/otp')} style={{ marginTop: '8px' }}>
          {tab === 'login' ? 'Send OTP' : 'Create Account & Send OTP'}
        </Button>

        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          margin: '24px 0',
        }}>
          <div style={{ flex: 1, height: '1px', backgroundColor: 'rgba(26,26,26,0.1)' }} />
          <span className="text-body-sm" style={{ color: 'var(--on-surface-variant)', flexShrink: 0 }}>or</span>
          <div style={{ flex: 1, height: '1px', backgroundColor: 'rgba(26,26,26,0.1)' }} />
        </div>

        <Button variant="outline" fullWidth onClick={() => navigate('/guest-dashboard')}>
          Continue as Guest
        </Button>

        <p className="text-body-sm" style={{
          textAlign: 'center',
          color: 'var(--on-surface-variant)',
          marginTop: '24px',
          lineHeight: '1.6',
        }}>
          We only use your number to verify you and deliver alerts — never shown publicly.
        </p>
      </div>
    </div>
  );
}
