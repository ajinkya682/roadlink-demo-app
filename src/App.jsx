import React from 'react'
import { Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import Layout from './components/Layout'

// Guest
import { PublicScanLanding, ReportDetail, ReportConfirmation, SearchVehicle, SearchResult } from './pages/GuestScreens'
// Owner
import { SplashOnboarding, Login, OTPVerification, AddVehicle, QRDetail, OrderSticker, OrderConfirmation, DashboardHome, VehicleDetail, NotificationsInbox, NotificationDetail, DocumentVault, DocumentUpload, Settings, EmergencyContacts } from './pages/OwnerScreens'

function App() {
  const location = useLocation();
  
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route element={<Layout />}>
          {/* Guest Routes */}
          <Route path="/" element={<PublicScanLanding />} />
          <Route path="/report-detail" element={<ReportDetail />} />
          <Route path="/report-confirmation" element={<ReportConfirmation />} />
          <Route path="/search" element={<SearchVehicle />} />
          <Route path="/search-result" element={<SearchResult />} />

          {/* Owner Routes */}
          <Route path="/splash" element={<SplashOnboarding />} />
          <Route path="/login" element={<Login />} />
          <Route path="/otp" element={<OTPVerification />} />
          <Route path="/add-vehicle" element={<AddVehicle />} />
          <Route path="/qr-detail" element={<QRDetail />} />
          <Route path="/order-sticker" element={<OrderSticker />} />
          <Route path="/order-confirmation" element={<OrderConfirmation />} />
          <Route path="/dashboard" element={<DashboardHome />} />
          <Route path="/vehicle-detail" element={<VehicleDetail />} />
          <Route path="/notifications" element={<NotificationsInbox />} />
          <Route path="/notification-detail" element={<NotificationDetail />} />
          <Route path="/document-vault" element={<DocumentVault />} />
          <Route path="/document-upload" element={<DocumentUpload />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/emergency-contacts" element={<EmergencyContacts />} />

          {/* Catch all */}
          <Route path="*" element={<Navigate to="/splash" replace />} />
        </Route>
      </Routes>
    </AnimatePresence>
  )
}

export default App
