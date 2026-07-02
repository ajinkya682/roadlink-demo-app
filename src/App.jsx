import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import Layout from './components/Layout'

// Guest
import GuestDashboard from './pages/GuestDashboard'
import { PublicScanLanding, ReportDetail, ReportConfirmation, SearchVehicle, SearchResult } from './pages/GuestScreens'
// Auth
import LoginRegister from './pages/LoginRegister'
// Owner
import { SplashOnboarding, OTPVerification, AddVehicle, QRDetail, OrderSticker, OrderConfirmation, DashboardHome, VehicleDetail, NotificationsInbox, NotificationDetail, DocumentVault, DocumentUpload, Settings, EmergencyContacts } from './pages/OwnerScreens'

function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        {/* Entry point — Splash/Onboarding */}
        <Route path="/" element={<SplashOnboarding />} />

        {/* Guest Mode (no login) */}
        <Route path="/guest-dashboard" element={<GuestDashboard />} />
        <Route path="/scan-landing" element={<PublicScanLanding />} />
        <Route path="/report-detail" element={<ReportDetail />} />
        <Route path="/report-confirmation" element={<ReportConfirmation />} />
        <Route path="/search" element={<SearchVehicle />} />
        <Route path="/search-result" element={<SearchResult />} />

        {/* Auth Flow */}
        <Route path="/login" element={<LoginRegister />} />
        <Route path="/otp" element={<OTPVerification />} />

        {/* Owner Flow */}
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
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  )
}

export default App
