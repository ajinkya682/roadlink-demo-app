import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Camera, MapPin, Search, AlertTriangle, Flame, ShieldAlert, Phone } from 'lucide-react';
import PlateTag from '../components/PlateTag';
import Button from '../components/Button';
import Card from '../components/Card';

export function PublicScanLanding() {
  const navigate = useNavigate();
  
  const categories = [
    { label: 'Wrong Parking', type: 'normal' },
    { label: 'Blocking Road', type: 'normal' },
    { label: 'Hit & Run', type: 'normal' },
    { label: 'Vehicle Damage', type: 'normal' },
    { label: 'Fire', type: 'alert', icon: <Flame size={24} /> },
    { label: 'Vehicle Theft', type: 'alert', icon: <ShieldAlert size={24} /> },
    { label: 'Tow Alert', type: 'normal' },
    { label: 'Headlights On', type: 'normal' },
    { label: 'Windows Open', type: 'normal' },
    { label: 'Emergency', type: 'alert', icon: <AlertTriangle size={24} /> },
    { label: 'Lost Vehicle', type: 'normal' },
    { label: 'Abandoned', type: 'normal' },
  ];

  return (
    <div style={{ padding: '40px 16px', display: 'flex', flexDirection: 'column', gap: '32px' }}>
      <PlateTag displayName="Honda Activa" isVerified={true} animate={true} />
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px' }}>
        {categories.map((cat, i) => (
          <Card 
            key={i} 
            onClick={() => navigate('/report-detail')}
            style={{ 
              borderColor: cat.type === 'alert' ? 'var(--alert-red)' : 'var(--outline-variant)',
              display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px'
            }}
          >
            {cat.icon && <div style={{ color: 'var(--alert-red)' }}>{cat.icon}</div>}
            <span className="text-body-md" style={{ textAlign: 'center', fontWeight: 500 }}>
              {cat.label}
            </span>
          </Card>
        ))}
      </div>
      
      <p className="text-body-sm" style={{ textAlign: 'center', color: 'var(--on-surface-variant)', marginTop: 'auto' }}>
        This page never shows the owner's phone number. <br/><b>RoadLink</b>
      </p>
    </div>
  );
}

export function ReportDetail() {
  const navigate = useNavigate();
  const [notes, setNotes] = useState('');
  
  return (
    <div style={{ padding: '40px 16px', display: 'flex', flexDirection: 'column', gap: '24px', height: '100vh' }}>
      <div style={{ alignSelf: 'flex-start' }}>
        <PlateTag displayName="Wrong Parking" />
      </div>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <textarea 
          placeholder="Optional notes..."
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          className="text-body-md"
          style={{
            width: '100%', height: '120px', padding: '16px',
            border: '1px solid rgba(26, 26, 26, 0.2)', borderRadius: 'var(--radius-lg)',
            resize: 'none', backgroundColor: 'var(--surface-container-lowest)'
          }}
          maxLength={300}
        />
        <div style={{ textAlign: 'right', fontSize: '12px', color: 'var(--on-surface-variant)' }}>
          {notes.length}/300
        </div>
      </div>

      <div style={{ 
        border: '2px dashed rgba(26, 26, 26, 0.2)', borderRadius: 'var(--radius-lg)', 
        padding: '32px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px',
        backgroundColor: 'rgba(26, 26, 26, 0.02)'
      }}>
        <Camera size={32} color="var(--on-surface-variant)" />
        <span className="text-body-sm" style={{ color: 'var(--on-surface-variant)' }}>Add Photo / Video</span>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <input type="checkbox" style={{ width: '24px', height: '24px' }} />
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <span className="text-body-md" style={{ fontWeight: 500 }}>Share location</span>
          <span className="text-body-sm" style={{ color: 'var(--on-surface-variant)' }}>Helps owner find the vehicle faster</span>
        </div>
      </div>

      <div style={{ marginTop: 'auto', marginBottom: '40px' }}>
        <Button variant="secondary" fullWidth onClick={() => navigate('/report-confirmation')}>
          Send Notification
        </Button>
      </div>
    </div>
  );
}

export function ReportConfirmation() {
  const navigate = useNavigate();
  return (
    <div style={{ padding: '40px 16px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh', gap: '24px' }}>
      <PlateTag displayName="Notification Sent" isVerified={true} animate={true} />
      <p className="text-body-lg" style={{ textAlign: 'center', color: 'var(--on-surface-variant)' }}>
        The owner has been notified instantly.
      </p>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', width: '100%', marginTop: '40px' }}>
        <Button variant="alert" fullWidth>
          <Phone size={18} /> Call Emergency (112)
        </Button>
        <Button variant="outline" fullWidth onClick={() => navigate('/')}>
          Done
        </Button>
      </div>
    </div>
  );
}

export function SearchVehicle() {
  const navigate = useNavigate();
  return (
    <div style={{ padding: '40px 16px', display: 'flex', flexDirection: 'column', height: '100vh', gap: '40px' }}>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: '24px' }}>
        <input 
          type="text" 
          placeholder="MH 14 AB 1234"
          className="text-data-mono"
          style={{
            width: '100%', padding: '24px', textAlign: 'center',
            fontSize: '24px', border: '2px solid var(--asphalt)',
            borderRadius: 'var(--radius-md)', backgroundColor: 'var(--plate-white)'
          }}
        />
        <Button variant="primary" fullWidth onClick={() => navigate('/search-result')}>
          <Search size={18} /> Search
        </Button>
      </div>
      
      <p className="text-body-sm" style={{ textAlign: 'center', color: 'var(--on-surface-variant)', marginBottom: '40px' }}>
        We'll never show you a phone number.
      </p>
    </div>
  );
}

export function SearchResult() {
  const navigate = useNavigate();
  const [found, setFound] = useState(true); // Toggle for demo

  return (
    <div style={{ padding: '40px 16px', display: 'flex', flexDirection: 'column', height: '100vh', justifyContent: 'center', gap: '32px' }}>
      {found ? (
        <>
          <PlateTag displayName="Honda Activa" isVerified={true} animate={true} />
          <Button variant="primary" fullWidth onClick={() => navigate('/report-detail')}>
            Notify Owner
          </Button>
        </>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
          <p className="text-body-lg" style={{ color: 'var(--on-surface-variant)', textAlign: 'center' }}>
            This vehicle isn't registered on RoadLink yet.
          </p>
          <a href="#" className="text-body-sm" style={{ color: 'var(--primary)' }}>Learn how RoadLink works</a>
        </div>
      )}
      
      {/* Demo toggle just for viewing the states easily */}
      <div style={{ position: 'absolute', bottom: '20px', left: '20px' }}>
        <Button variant="outline" onClick={() => setFound(!found)}>Toggle State</Button>
      </div>
    </div>
  );
}
