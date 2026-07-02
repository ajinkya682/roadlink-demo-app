import React from 'react';
import { Link } from 'react-router-dom';

export function SplashOnboarding() { return <div style={{ padding: '24px' }}><h1>6. Splash Onboarding</h1><Link to="/login">Get Started</Link></div>; }
export function Login() { return <div style={{ padding: '24px' }}><h1>7. Login</h1><Link to="/otp">Send OTP</Link></div>; }
export function OTPVerification() { return <div style={{ padding: '24px' }}><h1>8. OTP Verification</h1><Link to="/dashboard">Verify</Link></div>; }
export function AddVehicle() { return <div style={{ padding: '24px' }}><h1>9. Add Vehicle</h1><Link to="/qr-detail">Save</Link></div>; }
export function QRDetail() { return <div style={{ padding: '24px' }}><h1>10. QR Detail</h1><Link to="/order-sticker">Order Sticker</Link></div>; }
export function OrderSticker() { return <div style={{ padding: '24px' }}><h1>11. Order Sticker</h1><Link to="/order-confirmation">Pay</Link></div>; }
export function OrderConfirmation() { return <div style={{ padding: '24px' }}><h1>12. Order Confirmation</h1><Link to="/dashboard">Dashboard</Link></div>; }
export function DashboardHome() { return <div style={{ padding: '24px' }}><h1>13. Dashboard Home</h1><Link to="/vehicle-detail">View Vehicle</Link></div>; }
export function VehicleDetail() { return <div style={{ padding: '24px' }}><h1>14. Vehicle Detail</h1><Link to="/document-vault">Documents</Link></div>; }
export function NotificationsInbox() { return <div style={{ padding: '24px' }}><h1>15. Notifications Inbox</h1><Link to="/notification-detail">View Report</Link></div>; }
export function NotificationDetail() { return <div style={{ padding: '24px' }}><h1>16. Notification Detail</h1><Link to="/dashboard">Back</Link></div>; }
export function DocumentVault() { return <div style={{ padding: '24px' }}><h1>17. Document Vault</h1><Link to="/document-upload">Add Document</Link></div>; }
export function DocumentUpload() { return <div style={{ padding: '24px' }}><h1>18. Document Upload</h1><Link to="/document-vault">Save</Link></div>; }
export function Settings() { return <div style={{ padding: '24px' }}><h1>19. Settings</h1><Link to="/emergency-contacts">Contacts</Link></div>; }
export function EmergencyContacts() { return <div style={{ padding: '24px' }}><h1>20. Emergency Contacts</h1><Link to="/dashboard">Back</Link></div>; }
