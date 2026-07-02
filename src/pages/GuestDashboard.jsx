import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { QrCode, Search, User, ArrowRight, Shield, Bell, FileText } from 'lucide-react';
import { motion } from 'framer-motion';
import Button from '../components/Button';
import Card from '../components/Card';

export default function GuestDashboard() {
  const navigate = useNavigate();

  const containerStyle = {
    minHeight: '100vh',
    backgroundColor: 'var(--fog)',
    display: 'flex',
    flexDirection: 'column',
  };

  const headerStyle = {
    backgroundColor: 'var(--plate-white)',
    borderBottom: '1px solid rgba(26,26,26,0.08)',
    padding: '16px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  };

  const unlockFeatures = [
    { icon: <Bell size={16} />, text: 'Get instant alerts on your vehicle' },
    { icon: <FileText size={16} />, text: 'Store RC, Insurance, PUC securely' },
    { icon: <Shield size={16} />, text: 'Add emergency contacts' },
  ];

  return (
    <div style={containerStyle}>
      {/* Header */}
      <div style={headerStyle}>
        <span className="text-headline-sm" style={{ color: 'var(--primary-container)', fontFamily: 'var(--font-display)' }}>
          RoadLink
        </span>
        <span
          className="text-body-sm"
          style={{ color: 'var(--primary)', fontWeight: 600, cursor: 'pointer' }}
          onClick={() => navigate('/login')}
        >
          Log in
        </span>
      </div>

      {/* Content */}
      <div style={{ padding: '32px 16px', display: 'flex', flexDirection: 'column', gap: '32px', flex: 1 }}>

        {/* Welcome */}
        <div>
          <h1 className="text-headline-md" style={{ color: 'var(--on-surface)', marginBottom: '8px' }}>
            Spot a vehicle?
          </h1>
          <p className="text-body-md" style={{ color: 'var(--on-surface-variant)' }}>
            Scan its RoadLink QR or search by plate number to notify the owner instantly.
          </p>
        </div>

        {/* Primary Action: Scan QR */}
        <motion.div
          whileTap={{ scale: 0.98 }}
          onClick={() => navigate('/')}
          style={{
            backgroundColor: 'var(--primary-container)',
            borderRadius: 'var(--radius-xl)',
            padding: '32px 24px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '16px',
            cursor: 'pointer',
            boxShadow: '0 8px 32px rgba(27, 75, 143, 0.25)',
          }}
        >
          <div style={{
            width: '80px', height: '80px', borderRadius: '50%',
            backgroundColor: 'rgba(255,255,255,0.15)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <QrCode size={40} color="#fff" />
          </div>
          <div style={{ textAlign: 'center' }}>
            <div className="text-headline-sm" style={{ color: '#fff', marginBottom: '4px' }}>
              Scan QR Code
            </div>
            <div className="text-body-sm" style={{ color: 'rgba(255,255,255,0.75)' }}>
              Point your camera at the sticker on the windshield
            </div>
          </div>
        </motion.div>

        {/* Secondary Action: Search */}
        <Card onClick={() => navigate('/search')} style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '20px 16px' }}>
          <div style={{
            width: '48px', height: '48px', borderRadius: '50%',
            backgroundColor: 'var(--surface-container)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
          }}>
            <Search size={22} color="var(--primary-container)" />
          </div>
          <div style={{ flex: 1 }}>
            <div className="text-body-md" style={{ fontWeight: 600 }}>Search by plate number</div>
            <div className="text-body-sm" style={{ color: 'var(--on-surface-variant)' }}>MH 14 AB 1234</div>
          </div>
          <ArrowRight size={20} color="var(--on-surface-variant)" />
        </Card>

        {/* Value nudge / Login prompt */}
        <div style={{
          backgroundColor: 'var(--plate-white)',
          border: '1px solid rgba(26,26,26,0.08)',
          borderRadius: 'var(--radius-lg)',
          padding: '20px',
        }}>
          <div className="text-label-caps" style={{ color: 'var(--on-surface-variant)', marginBottom: '16px' }}>
            Unlock with a free account
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '20px' }}>
            {unlockFeatures.map((f, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ color: 'var(--primary-container)', flexShrink: 0 }}>{f.icon}</div>
                <span className="text-body-sm">{f.text}</span>
              </div>
            ))}
          </div>
          <Button
            variant="outline"
            fullWidth
            onClick={() => navigate('/login')}
          >
            <User size={16} /> Create Free Account
          </Button>
        </div>

      </div>

      {/* Bottom privacy note */}
      <div style={{ padding: '16px', textAlign: 'center' }}>
        <p className="text-body-sm" style={{ color: 'var(--on-surface-variant)' }}>
          <Shield size={12} style={{ display: 'inline', marginRight: '4px' }} />
          We never show the owner's phone number to anyone.
        </p>
      </div>
    </div>
  );
}
