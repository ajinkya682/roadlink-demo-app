import React, { useEffect } from 'react'
import { Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import { Capacitor } from '@capacitor/core'
import { PushNotifications } from '@capacitor/push-notifications'
import PageWrapper from './components/PageWrapper'
import BottomTabBar from './components/BottomTabBar'
import RequireAuth from './components/RequireAuth'
import RequireGuest from './components/RequireGuest'

// Guest
import GuestDashboard from './pages/GuestDashboard'
import ScanLanding from './pages/guest/ScanLanding'
import ReportDetail from './pages/guest/ReportDetail'
import ReportConfirmation from './pages/guest/ReportConfirmation'
import SearchVehicle from './pages/guest/SearchVehicle'
import SearchResult from './pages/guest/SearchResult'

// Auth
import Splash from './pages/auth/Splash'
import LoginRegister from './pages/auth/LoginRegister'
import OTPVerification from './pages/auth/OTPVerification'

// Owner
import AddVehicle from './pages/owner/AddVehicle'
import QRDetail from './pages/owner/QRDetail'
import OrderSticker from './pages/owner/OrderSticker'
import OrderConfirmation from './pages/owner/OrderConfirmation'
import Dashboard from './pages/owner/Dashboard'
import Vehicles from './pages/owner/Vehicles'
import VehicleDetail from './pages/owner/VehicleDetail'
import NotificationsInbox from './pages/owner/NotificationsInbox'
import NotificationDetail from './pages/owner/NotificationDetail'
import DocumentVault from './pages/owner/DocumentVault'
import DocumentUpload from './pages/owner/DocumentUpload'
import DocumentDetail from './pages/owner/DocumentDetail'
import Settings from './pages/owner/Settings'
import EmergencyContacts from './pages/owner/EmergencyContacts'
import MyProfile from './pages/owner/MyProfile'
import PrivacyControls from './pages/owner/PrivacyControls'
import TermsPrivacy from './pages/owner/TermsPrivacy'

// Shared
import QRScanner from './pages/shared/QRScanner'

function App() {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (Capacitor.isNativePlatform()) {
      // Request push notification permission
      PushNotifications.requestPermissions().then(result => {
        if (result.receive === 'granted') {
          PushNotifications.register();
        }
      });

      // Listen for registration success
      PushNotifications.addListener('registration', (token) => {
        console.log('Push registration success, token: ' + token.value);
        // Here you would send the token to your backend
      });

      // Listen for registration error
      PushNotifications.addListener('registrationError', (error) => {
        console.error('Error on registration: ' + JSON.stringify(error));
      });

      // Listen for notification received while app is in foreground
      PushNotifications.addListener('pushNotificationReceived', (notification) => {
        console.log('Push received: ' + JSON.stringify(notification));
        // You could show a custom toast here
      });

      // Listen for notification action (when user taps on it)
      PushNotifications.addListener('pushNotificationActionPerformed', (notification) => {
        console.log('Push action performed: ' + JSON.stringify(notification));
        // Navigate based on data payload
        const data = notification.notification.data;
        if (data && data.route) {
          navigate(data.route);
        } else {
          navigate('/notifications');
        }
      });
    }
  }, [navigate]);

  const showNavRoutes = [
    '/dashboard',       // Home
    '/document-vault',  // Docs
    '/vehicles',        // Vehicles (Root tab)
    '/settings'         // Settings
  ];

  // Only show nav on exact matches of the root tab routes
  const shouldShowNav = showNavRoutes.includes(location.pathname);

  return (
    <div className="app-shell">
      <div className="safe-area-wrapper">
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            {/* Entry */}
            <Route path="/" element={<RequireGuest><PageWrapper><Splash /></PageWrapper></RequireGuest>} />

            {/* Guest */}
            <Route path="/guest-dashboard" element={<PageWrapper><GuestDashboard /></PageWrapper>} />
            <Route path="/scan-landing" element={<PageWrapper><ScanLanding /></PageWrapper>} />
            <Route path="/report-detail" element={<PageWrapper><ReportDetail /></PageWrapper>} />
            <Route path="/report-confirmation" element={<PageWrapper><ReportConfirmation /></PageWrapper>} />
            <Route path="/search" element={<PageWrapper><SearchVehicle /></PageWrapper>} />
            <Route path="/search-result" element={<PageWrapper><SearchResult /></PageWrapper>} />

            {/* Auth */}
            <Route path="/login" element={<RequireGuest><PageWrapper><LoginRegister /></PageWrapper></RequireGuest>} />
            <Route path="/otp" element={<RequireGuest><PageWrapper><OTPVerification /></PageWrapper></RequireGuest>} />

            {/* Owner (Protected) */}
            <Route path="/add-vehicle" element={<RequireAuth><PageWrapper><AddVehicle /></PageWrapper></RequireAuth>} />
            <Route path="/qr-detail" element={<RequireAuth><PageWrapper><QRDetail /></PageWrapper></RequireAuth>} />
            <Route path="/order-sticker" element={<RequireAuth><PageWrapper><OrderSticker /></PageWrapper></RequireAuth>} />
            <Route path="/order-confirmation" element={<RequireAuth><PageWrapper><OrderConfirmation /></PageWrapper></RequireAuth>} />
            <Route path="/dashboard" element={<RequireAuth><PageWrapper><Dashboard /></PageWrapper></RequireAuth>} />
            <Route path="/vehicles" element={<RequireAuth><PageWrapper><Vehicles /></PageWrapper></RequireAuth>} />
            <Route path="/vehicle-detail/:id" element={<RequireAuth><PageWrapper><VehicleDetail /></PageWrapper></RequireAuth>} />
            <Route path="/vehicle-detail" element={<Navigate to="/vehicles" replace />} />
            <Route path="/notifications" element={<RequireAuth><PageWrapper><NotificationsInbox /></PageWrapper></RequireAuth>} />
            <Route path="/notification-detail/:id" element={<RequireAuth><PageWrapper><NotificationDetail /></PageWrapper></RequireAuth>} />
            <Route path="/notification-detail" element={<RequireAuth><PageWrapper><NotificationDetail /></PageWrapper></RequireAuth>} />
            <Route path="/document-vault" element={<RequireAuth><PageWrapper><DocumentVault /></PageWrapper></RequireAuth>} />
            <Route path="/document-upload" element={<RequireAuth><PageWrapper><DocumentUpload /></PageWrapper></RequireAuth>} />
            <Route path="/document-detail/:id" element={<RequireAuth><PageWrapper><DocumentDetail /></PageWrapper></RequireAuth>} />
            <Route path="/settings" element={<RequireAuth><PageWrapper><Settings /></PageWrapper></RequireAuth>} />
            <Route path="/emergency-contacts" element={<RequireAuth><PageWrapper><EmergencyContacts /></PageWrapper></RequireAuth>} />
            <Route path="/profile" element={<RequireAuth><PageWrapper><MyProfile /></PageWrapper></RequireAuth>} />
            <Route path="/privacy-controls" element={<RequireAuth><PageWrapper><PrivacyControls /></PageWrapper></RequireAuth>} />
            <Route path="/terms" element={<RequireAuth><PageWrapper><TermsPrivacy /></PageWrapper></RequireAuth>} />
            <Route path="/scanner" element={<PageWrapper><QRScanner /></PageWrapper>} />

            {/* Catch all */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </AnimatePresence>

        {/* Global persistent bottom nav */}
        {shouldShowNav && (
          <BottomTabBar />
        )}
      </div>
    </div>
  )
}

export default App
