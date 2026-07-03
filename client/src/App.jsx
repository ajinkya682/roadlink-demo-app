import React, { useEffect } from 'react'
import { Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import { Capacitor } from '@capacitor/core'
import { PushNotifications } from '@capacitor/push-notifications'
import PageWrapper from './components/PageWrapper'
import BottomTabBar from './components/BottomTabBar'

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
import VehicleDetail from './pages/owner/VehicleDetail'
import NotificationsInbox from './pages/owner/NotificationsInbox'
import NotificationDetail from './pages/owner/NotificationDetail'
import DocumentVault from './pages/owner/DocumentVault'
import DocumentUpload from './pages/owner/DocumentUpload'
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
    '/dashboard',
    '/document-vault',
    '/settings'
  ];

  const shouldShowNav = showNavRoutes.includes(location.pathname) || location.pathname.startsWith('/vehicle-detail');

  return (
    <div className="app-shell">
      <div className="safe-area-wrapper">
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            {/* Entry */}
            <Route path="/" element={<PageWrapper><Splash /></PageWrapper>} />

            {/* Guest */}
            <Route path="/guest-dashboard" element={<PageWrapper><GuestDashboard /></PageWrapper>} />
            <Route path="/scan-landing" element={<PageWrapper><ScanLanding /></PageWrapper>} />
            <Route path="/report-detail" element={<PageWrapper><ReportDetail /></PageWrapper>} />
            <Route path="/report-confirmation" element={<PageWrapper><ReportConfirmation /></PageWrapper>} />
            <Route path="/search" element={<PageWrapper><SearchVehicle /></PageWrapper>} />
            <Route path="/search-result" element={<PageWrapper><SearchResult /></PageWrapper>} />

            {/* Auth */}
            <Route path="/login" element={<PageWrapper><LoginRegister /></PageWrapper>} />
            <Route path="/otp" element={<PageWrapper><OTPVerification /></PageWrapper>} />

            {/* Owner */}
            <Route path="/add-vehicle" element={<PageWrapper><AddVehicle /></PageWrapper>} />
            <Route path="/qr-detail" element={<PageWrapper><QRDetail /></PageWrapper>} />
            <Route path="/order-sticker" element={<PageWrapper><OrderSticker /></PageWrapper>} />
            <Route path="/order-confirmation" element={<PageWrapper><OrderConfirmation /></PageWrapper>} />
            <Route path="/dashboard" element={<PageWrapper><Dashboard /></PageWrapper>} />
            <Route path="/vehicle-detail/:id" element={<PageWrapper><VehicleDetail /></PageWrapper>} />
            <Route path="/vehicle-detail" element={<PageWrapper><VehicleDetail /></PageWrapper>} />
            <Route path="/notifications" element={<PageWrapper><NotificationsInbox /></PageWrapper>} />
            <Route path="/notification-detail/:id" element={<PageWrapper><NotificationDetail /></PageWrapper>} />
            <Route path="/notification-detail" element={<PageWrapper><NotificationDetail /></PageWrapper>} />
            <Route path="/document-vault" element={<PageWrapper><DocumentVault /></PageWrapper>} />
            <Route path="/document-upload" element={<PageWrapper><DocumentUpload /></PageWrapper>} />
            <Route path="/settings" element={<PageWrapper><Settings /></PageWrapper>} />
            <Route path="/emergency-contacts" element={<PageWrapper><EmergencyContacts /></PageWrapper>} />
            <Route path="/profile" element={<PageWrapper><MyProfile /></PageWrapper>} />
            <Route path="/privacy-controls" element={<PageWrapper><PrivacyControls /></PageWrapper>} />
            <Route path="/terms" element={<PageWrapper><TermsPrivacy /></PageWrapper>} />
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
