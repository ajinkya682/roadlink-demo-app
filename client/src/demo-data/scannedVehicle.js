// This file has been intentionally emptied.
// The hardcoded "scanned vehicle" placeholder has been removed.
// The real scanned vehicle is now resolved dynamically in QRScanner.jsx:
//   - If the QR payload matches a locally-owned vehicle → route to /vehicle-detail/:id
//   - If it doesn't match → navigate to /scan-landing with the decoded payload passed via route state
// TODO (Phase 3/4): Replace local matching logic in QRScanner with a real
// POST /vehicles/resolve call that resolves the QR token server-side.
