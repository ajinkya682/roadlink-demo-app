import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, Settings as SettingsIcon, Plus, QrCode, CreditCard, ChevronRight, CheckCircle, FileText, Upload, AlertCircle, ShieldAlert } from 'lucide-react';
import PlateTag from '../components/PlateTag';
import Button from '../components/Button';
import Input from '../components/Input';
import Card from '../components/Card';
import StatusPill from '../components/StatusPill';
import BottomTabBar from '../components/BottomTabBar';

// 6. Splash Onboarding
export function SplashOnboarding() {
  const navigate = useNavigate();
  const [slide, setSlide] = useState(0);

  const slides = [
    {
      title: "One QR. One identity.",
      subtext: "The digital identity for your vehicle, built for the Indian road.",
      content: <div style={{ height: '160px', backgroundColor: '#e5e2e1', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><QrCode size={48} /></div>
    },
    {
      title: "We never show your number",
      subtext: "Anyone can reach you. No one can see your number.",
      content: <PlateTag displayName="Protected" isVerified={true} animate={true} />
    },
    {
      title: "Reported the moment it matters",
      subtext: "From a wrong-parked scooter to a real emergency — the right people know instantly.",
      content: (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
          <Card style={{ padding: '12px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}><span className="text-body-sm">Wrong Parking</span></Card>
          <Card style={{ padding: '12px', display: 'flex', flexDirection: 'column', alignItems: 'center', borderColor: 'var(--alert-red)' }}><span className="text-body-sm" style={{ color: 'var(--alert-red)' }}>Emergency</span></Card>
        </div>
      )
    }
  ];

  return (
    <div style={{ padding: '40px 16px', display: 'flex', flexDirection: 'column', height: '100vh' }}>
      {slide < 2 && (
        <div style={{ textAlign: 'right' }}>
          <span style={{ color: 'var(--primary)', fontWeight: 600, cursor: 'pointer' }} onClick={() => navigate('/login')}>Skip</span>
        </div>
      )}
      
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: '32px' }}>
        <AnimatePresence mode="wait">
          <motion.div
            key={slide}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            style={{ 
              backgroundColor: 'var(--plate-white)', border: '2px solid var(--primary-container)', 
              borderRadius: '24px', padding: '24px', display: 'flex', flexDirection: 'column', gap: '24px' 
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(26,26,26,0.1)', paddingBottom: '8px' }}>
              <span className="text-label-caps" style={{ color: 'var(--outline)' }}>IND</span>
              <div style={{ width: '16px', height: '16px', backgroundColor: 'var(--primary-container)', borderRadius: '4px' }} />
            </div>
            
            {slides[slide].content}
          </motion.div>
        </AnimatePresence>

        <div style={{ textAlign: 'center' }}>
          <h1 className="text-headline-lg-mobile" style={{ color: 'var(--primary-container)', marginBottom: '8px' }}>{slides[slide].title}</h1>
          <p className="text-body-md" style={{ color: 'var(--on-surface-variant)' }}>{slides[slide].subtext}</p>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '24px', marginBottom: '24px' }}>
        <div style={{ display: 'flex', gap: '8px' }}>
          {[0, 1, 2].map(i => (
            <div key={i} style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: slide === i ? 'var(--primary-container)' : '#dcd9d9' }} />
          ))}
        </div>
        
        {slide < 2 ? (
          <Button fullWidth onClick={() => setSlide(s => s + 1)}>Next</Button>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', width: '100%' }}>
            <Button variant="secondary" fullWidth onClick={() => navigate('/login')}>Get Started</Button>
            <Button variant="outline" fullWidth onClick={() => navigate('/guest-dashboard')}>Continue as Guest</Button>
          </div>
        )}
      </div>
    </div>
  );
}

// 7. Login
export function Login() {
  const navigate = useNavigate();
  return (
    <div style={{ padding: '40px 16px', display: 'flex', flexDirection: 'column', height: '100vh', justifyContent: 'center', gap: '32px' }}>
      <div style={{ textAlign: 'center' }}>
        <h1 className="text-headline-lg" style={{ color: 'var(--primary-container)' }}>RoadLink</h1>
        <p className="text-body-md">Every Vehicle. One Identity. One Scan Away.</p>
      </div>
      
      <div>
        <Input label="Phone Number" prefix="+91" type="tel" placeholder="98765 43210" />
        <Button fullWidth onClick={() => navigate('/otp')}>Send OTP</Button>
      </div>
      
      <p className="text-body-sm" style={{ textAlign: 'center', color: 'var(--on-surface-variant)' }}>
        We only use this to verify you and deliver alerts — never shown publicly.
      </p>
    </div>
  );
}

// 8. OTP Verification
export function OTPVerification() {
  const navigate = useNavigate();
  return (
    <div style={{ padding: '40px 16px', display: 'flex', flexDirection: 'column', height: '100vh', gap: '32px' }}>
      <div>
        <h1 className="text-headline-md">Verify Phone</h1>
        <p className="text-body-md" style={{ color: 'var(--on-surface-variant)' }}>Code sent to +91 98••••210</p>
      </div>
      
      <div style={{ display: 'flex', gap: '8px', justifyContent: 'space-between' }}>
        {[1, 2, 3, 4, 5, 6].map(i => (
          <input key={i} type="text" maxLength={1} style={{ 
            width: '44px', height: '56px', textAlign: 'center', fontSize: '24px', 
            border: '1px solid rgba(26,26,26,0.2)', borderRadius: 'var(--radius-md)' 
          }} />
        ))}
      </div>
      
      <Button fullWidth onClick={() => navigate('/add-vehicle')}>Verify</Button>
      <p className="text-body-sm" style={{ textAlign: 'center', color: 'var(--on-surface-variant)' }}>Resend code in 0:59</p>
    </div>
  );
}

// 9. Add Vehicle
export function AddVehicle() {
  const navigate = useNavigate();
  const [plate, setPlate] = useState('');
  
  return (
    <div style={{ padding: '40px 16px', display: 'flex', flexDirection: 'column', minHeight: '100vh', gap: '32px' }}>
      <h1 className="text-headline-md">Add Vehicle</h1>
      
      <PlateTag plateNumber={plate || 'MH 00 AA 0000'} animate={true} />
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <Input label="Registration Number" value={plate} onChange={e => setPlate(e.target.value.toUpperCase())} placeholder="e.g. MH 14 AB 1234" />
        <Input label="Make / Model" placeholder="e.g. Honda Activa" />
        <Input label="Nickname (Optional)" placeholder="e.g. Daily Commute" />
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginTop: '16px' }}>
          <input type="checkbox" style={{ width: '24px', height: '24px' }} />
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span className="text-body-md" style={{ fontWeight: 500 }}>Show my name publicly</span>
            <span className="text-body-sm" style={{ color: 'var(--on-surface-variant)' }}>Otherwise, only the vehicle model is shown</span>
          </div>
        </div>
      </div>
      
      <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: '16px', paddingBottom: '24px' }}>
        <Button fullWidth onClick={() => navigate('/qr-detail')}>Save Vehicle</Button>
        <span className="text-body-sm" style={{ textAlign: 'center', color: 'var(--primary)', cursor: 'pointer' }} onClick={() => navigate('/dashboard')}>
          Skip documents for now
        </span>
      </div>
    </div>
  );
}

// 10. QR Detail
export function QRDetail() {
  const navigate = useNavigate();
  return (
    <div style={{ padding: '40px 16px', display: 'flex', flexDirection: 'column', height: '100vh', alignItems: 'center', gap: '32px' }}>
      <h1 className="text-headline-md" style={{ alignSelf: 'flex-start' }}>Vehicle QR</h1>
      
      <div style={{ 
        border: '2px solid var(--asphalt)', borderRadius: '16px', padding: '32px',
        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px',
        backgroundColor: 'var(--plate-white)'
      }}>
        <QrCode size={180} />
      </div>
      <h2 className="text-headline-sm">Honda Activa</h2>
      
      <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '16px', marginTop: 'auto' }}>
        <Button variant="secondary" fullWidth onClick={() => navigate('/order-sticker')}>Order Sticker</Button>
        <Button variant="outline" fullWidth>Download QR</Button>
        <Button variant="alert" fullWidth style={{ backgroundColor: 'transparent', border: '1px solid var(--alert-red)', color: 'var(--alert-red)' }}>Regenerate QR</Button>
      </div>
      <p className="text-body-sm" style={{ textAlign: 'center', color: 'var(--on-surface-variant)' }}>
        This QR protects your privacy by acting as a proxy when scanned.
      </p>
    </div>
  );
}

// 11. Order Sticker & 12. Order Confirmation combined in simple flow
export function OrderSticker() {
  const navigate = useNavigate();
  return (
    <div style={{ padding: '40px 16px', display: 'flex', flexDirection: 'column', gap: '32px', paddingBottom: '40px' }}>
      <h1 className="text-headline-md">Order QR Sticker</h1>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <h2 className="text-body-lg" style={{ fontWeight: 600 }}>Select Type</h2>
        <Card style={{ borderColor: 'var(--primary)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div style={{ fontWeight: 600 }}>Reflective Standard</div>
              <div className="text-body-sm" style={{ color: 'var(--on-surface-variant)' }}>High visibility at night</div>
            </div>
            <div style={{ fontWeight: 600 }}>₹149</div>
          </div>
        </Card>
      </div>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <h2 className="text-body-lg" style={{ fontWeight: 600 }}>Shipping Address</h2>
        <Input label="Full Name" />
        <Input label="Address" />
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
          <Input label="City" />
          <Input label="PIN Code" />
        </div>
      </div>
      
      <Button variant="primary" fullWidth onClick={() => navigate('/order-confirmation')}>Pay with Razorpay</Button>
    </div>
  );
}

export function OrderConfirmation() {
  const navigate = useNavigate();
  return (
    <div style={{ padding: '40px 16px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh', gap: '24px' }}>
      <CheckCircle size={64} color="var(--verified-green)" />
      <h1 className="text-headline-md">Order Placed</h1>
      <p className="text-data-mono">ORD-987654</p>
      <p className="text-body-md" style={{ color: 'var(--on-surface-variant)', textAlign: 'center' }}>Estimated delivery: 3-5 days</p>
      
      <Button fullWidth onClick={() => navigate('/dashboard')} style={{ marginTop: '32px' }}>Back to Dashboard</Button>
    </div>
  );
}

// 13. Dashboard Home
export function DashboardHome() {
  const navigate = useNavigate();
  return (
    <div style={{ padding: '40px 16px', display: 'flex', flexDirection: 'column', minHeight: '100vh', gap: '32px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1 className="text-headline-md" style={{ color: 'var(--primary-container)' }}>RoadLink</h1>
        <div style={{ display: 'flex', gap: '16px' }}>
          <Bell size={24} onClick={() => navigate('/notifications')} style={{ cursor: 'pointer' }} />
          <SettingsIcon size={24} onClick={() => navigate('/settings')} style={{ cursor: 'pointer' }} />
        </div>
      </div>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <Card onClick={() => navigate('/vehicle-detail')}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
            <h2 className="text-headline-sm">Honda Activa</h2>
            <div style={{ position: 'relative' }}>
              <QrCode size={24} color="var(--primary)" />
              <div style={{ position: 'absolute', top: '-4px', right: '-4px', width: '10px', height: '10px', backgroundColor: 'var(--alert-red)', borderRadius: '50%' }} />
            </div>
          </div>
          <PlateTag plateNumber="MH 14 AB 1234" />
        </Card>
        
        <Card onClick={() => navigate('/add-vehicle')} style={{ border: '2px dashed rgba(26,26,26,0.2)', display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '32px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--primary)' }}>
            <Plus size={20} />
            <span style={{ fontWeight: 600 }}>Add Vehicle</span>
          </div>
        </Card>
      </div>
    </div>
  );
}

// 14. Vehicle Detail
export function VehicleDetail() {
  const navigate = useNavigate();
  return (
    <div style={{ padding: '40px 16px', display: 'flex', flexDirection: 'column', gap: '32px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <ChevronRight size={24} style={{ transform: 'rotate(180deg)', cursor: 'pointer' }} onClick={() => navigate('/dashboard')} />
        <h1 className="text-headline-md">Vehicle Detail</h1>
      </div>
      
      <PlateTag plateNumber="MH 14 AB 1234" />
      
      <div style={{ display: 'flex', borderBottom: '1px solid rgba(26,26,26,0.1)' }}>
        <div style={{ flex: 1, textAlign: 'center', padding: '12px', borderBottom: '2px solid var(--primary)', fontWeight: 600 }}>Overview</div>
        <div style={{ flex: 1, textAlign: 'center', padding: '12px', color: 'var(--on-surface-variant)', cursor: 'pointer' }} onClick={() => navigate('/document-vault')}>Docs</div>
        <div style={{ flex: 1, textAlign: 'center', padding: '12px', color: 'var(--on-surface-variant)', cursor: 'pointer' }} onClick={() => navigate('/emergency-contacts')}>Contacts</div>
        <div style={{ flex: 1, textAlign: 'center', padding: '12px', color: 'var(--on-surface-variant)', cursor: 'pointer' }} onClick={() => navigate('/qr-detail')}>QR</div>
      </div>
      
      <div>
        <h3 className="text-body-lg" style={{ fontWeight: 600, marginBottom: '16px' }}>Recent Reports</h3>
        <Card onClick={() => navigate('/notification-detail')} style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ width: '4px', height: '40px', backgroundColor: 'var(--signal-amber)', borderRadius: '2px' }} />
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: 600 }}>Wrong Parking</div>
            <div className="text-body-sm" style={{ color: 'var(--on-surface-variant)' }}>2 hours ago</div>
          </div>
          <ChevronRight size={20} color="var(--on-surface-variant)" />
        </Card>
      </div>
    </div>
  );
}

// 15. Notifications Inbox
export function NotificationsInbox() {
  const navigate = useNavigate();
  return (
    <div style={{ padding: '40px 16px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <ChevronRight size={24} style={{ transform: 'rotate(180deg)', cursor: 'pointer' }} onClick={() => navigate('/dashboard')} />
        <h1 className="text-headline-md">Notifications</h1>
      </div>
      
      <div style={{ display: 'flex', gap: '16px', overflowX: 'auto', paddingBottom: '8px' }}>
        <StatusPill label="All" style={{ backgroundColor: 'var(--asphalt)', color: 'white' }} />
        <StatusPill label="Unresolved" />
        <StatusPill label="Resolved" />
      </div>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <Card onClick={() => navigate('/notification-detail')} style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
          <div style={{ width: '4px', height: '40px', backgroundColor: 'var(--alert-red)', borderRadius: '2px', marginTop: '4px' }} />
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <div style={{ fontWeight: 600 }}>Vehicle Damage</div>
              <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'var(--primary-container)' }} />
            </div>
            <div className="text-body-sm" style={{ color: 'var(--on-surface-variant)' }}>Someone reported a scratch.</div>
            <div className="text-body-sm" style={{ color: 'var(--on-surface-variant)', fontSize: '12px', marginTop: '4px' }}>Just now</div>
          </div>
        </Card>
      </div>
    </div>
  );
}

// 16. Notification Detail
export function NotificationDetail() {
  const navigate = useNavigate();
  return (
    <div style={{ padding: '40px 16px', display: 'flex', flexDirection: 'column', gap: '24px', minHeight: '100vh' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <ChevronRight size={24} style={{ transform: 'rotate(180deg)', cursor: 'pointer' }} onClick={() => navigate(-1)} />
        <h1 className="text-headline-md">Report Detail</h1>
      </div>
      
      <PlateTag displayName="Vehicle Damage" />
      <span className="text-body-sm" style={{ color: 'var(--on-surface-variant)' }}>Today, 2:45 PM</span>
      
      <div style={{ backgroundColor: '#e5e2e1', height: '160px', borderRadius: 'var(--radius-lg)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Camera size={32} color="var(--on-surface-variant)" />
      </div>
      
      <p className="text-body-md">
        "I accidentally backed into your scooter while parking. It looks like a minor scratch on the side panel. Waiting here for 5 mins."
      </p>
      
      <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: '16px', paddingBottom: '24px' }}>
        <Button variant="outline" fullWidth>Open Location in Maps</Button>
        <Button fullWidth style={{ backgroundColor: 'var(--verified-green)' }}>Mark Resolved</Button>
      </div>
    </div>
  );
}

// 17. Document Vault & 18. Document Upload
export function DocumentVault() {
  const navigate = useNavigate();
  return (
    <div style={{ padding: '40px 16px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <ChevronRight size={24} style={{ transform: 'rotate(180deg)', cursor: 'pointer' }} onClick={() => navigate('/vehicle-detail')} />
        <h1 className="text-headline-md">Document Vault</h1>
      </div>
      
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
        <Card>
          <div style={{ fontWeight: 600, marginBottom: '8px' }}>RC Book</div>
          <StatusPill status="success" label="Valid" />
        </Card>
        <Card onClick={() => navigate('/document-upload')} style={{ border: '2px dashed rgba(26,26,26,0.2)' }}>
          <div style={{ fontWeight: 600, marginBottom: '8px' }}>Insurance</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--primary)' }}>
            <Plus size={16} /> <span className="text-body-sm">Add</span>
          </div>
        </Card>
        <Card onClick={() => navigate('/document-upload')} style={{ border: '2px dashed rgba(26,26,26,0.2)' }}>
          <div style={{ fontWeight: 600, marginBottom: '8px' }}>PUC</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--primary)' }}>
            <Plus size={16} /> <span className="text-body-sm">Add</span>
          </div>
        </Card>
      </div>
    </div>
  );
}

export function DocumentUpload() {
  const navigate = useNavigate();
  return (
    <div style={{ padding: '40px 16px', display: 'flex', flexDirection: 'column', gap: '24px', minHeight: '100vh' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <ChevronRight size={24} style={{ transform: 'rotate(180deg)', cursor: 'pointer' }} onClick={() => navigate(-1)} />
        <h1 className="text-headline-md">Add Insurance</h1>
      </div>
      
      <div style={{ 
        border: '2px dashed rgba(26, 26, 26, 0.2)', borderRadius: 'var(--radius-lg)', 
        padding: '48px 24px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px',
        backgroundColor: 'rgba(26, 26, 26, 0.02)'
      }}>
        <Upload size={32} color="var(--on-surface-variant)" />
        <span className="text-body-md" style={{ fontWeight: 600 }}>Tap to upload PDF/JPG</span>
        <span className="text-body-sm" style={{ color: 'var(--on-surface-variant)' }}>Max size 10MB</span>
      </div>
      
      <Input label="Expiry Date" type="date" />
      
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--verified-green)', justifyContent: 'center', marginTop: '16px' }}>
        <ShieldAlert size={16} />
        <span className="text-body-sm">Stored securely, encrypted</span>
      </div>
      
      <div style={{ marginTop: 'auto', paddingBottom: '24px' }}>
        <Button fullWidth onClick={() => navigate('/document-vault')}>Save Document</Button>
      </div>
    </div>
  );
}

// 19. Settings & 20. Emergency Contacts
export function Settings() {
  const navigate = useNavigate();
  return (
    <div style={{ padding: '40px 16px', display: 'flex', flexDirection: 'column', gap: '32px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <ChevronRight size={24} style={{ transform: 'rotate(180deg)', cursor: 'pointer' }} onClick={() => navigate('/dashboard')} />
        <h1 className="text-headline-md">Settings</h1>
      </div>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <Card onClick={() => navigate('/emergency-contacts')} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontWeight: 500 }}>Emergency Contacts</span>
          <ChevronRight size={20} color="var(--on-surface-variant)" />
        </Card>
        <Card style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontWeight: 500 }}>Notification Channels</span>
          <ChevronRight size={20} color="var(--on-surface-variant)" />
        </Card>
        <Card style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontWeight: 500 }}>Language</span>
          <span className="text-body-sm" style={{ color: 'var(--on-surface-variant)' }}>English</span>
        </Card>
      </div>
      
      <div style={{ marginTop: '40px' }}>
        <span className="text-body-sm" style={{ color: 'var(--alert-red)', fontWeight: 600, cursor: 'pointer' }}>Delete Account</span>
      </div>
    </div>
  );
}

export function EmergencyContacts() {
  const navigate = useNavigate();
  return (
    <div style={{ padding: '40px 16px', display: 'flex', flexDirection: 'column', gap: '24px', minHeight: '100vh' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <ChevronRight size={24} style={{ transform: 'rotate(180deg)', cursor: 'pointer' }} onClick={() => navigate(-1)} />
        <h1 className="text-headline-md">Emergency Contacts</h1>
      </div>
      
      <Card>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <div style={{ fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px' }}>
              Ajinkya
              <StatusPill label="Primary" style={{ backgroundColor: 'var(--primary)', color: 'white', padding: '2px 8px', fontSize: '10px' }} />
            </div>
            <div className="text-body-sm" style={{ color: 'var(--on-surface-variant)' }}>+91 98•••••10 • Family</div>
          </div>
          <span className="text-body-sm" style={{ color: 'var(--primary)', fontWeight: 600 }}>Edit</span>
        </div>
      </Card>
      
      <div style={{ marginTop: 'auto', paddingBottom: '24px' }}>
        <Button variant="secondary" fullWidth>Add Emergency Contact</Button>
      </div>
    </div>
  );
}
