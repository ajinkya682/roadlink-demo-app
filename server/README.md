# RoadLink MVP Backend

This is the Node.js/Express MVP backend for RoadLink.

## Tech Stack
- **Node.js + Express.js**
- **MongoDB** + Mongoose
- **JWT** for Authentication
- **Multer** for local document storage
- **Helmet + RateLimiter** for security

## Getting Started

1. Copy `.env.example` to `.env`
2. Run `npm install`
3. Run `npm run dev` to start the server in development mode.
4. Run `npm test` to run integration tests using an in-memory MongoDB server.

## API Endpoints (v1)

### Authentication
- `POST /v1/auth/otp/request` - Request OTP for login/signup
- `POST /v1/auth/otp/verify` - Verify OTP and get tokens
- `POST /v1/auth/refresh` - Refresh access token
- `POST /v1/auth/logout` - Invalidate refresh token (Requires Auth)

### Vehicles (Requires Auth)
- `POST /v1/vehicles` - Add a vehicle and generate QR token
- `GET /v1/vehicles` - List user's vehicles
- `GET /v1/vehicles/:id` - Get vehicle details
- `PATCH /v1/vehicles/:id` - Update vehicle details
- `DELETE /v1/vehicles/:id` - Delete vehicle and invalidate QR tokens
- `POST /v1/vehicles/:id/qr/regenerate` - Regenerate QR token

### Guest Endpoints (No Auth Required)
- `GET /v1/vehicles/resolve?token={token}` - Resolve a QR token to get a public profile. DOES NOT LEAK PII.
- `GET /v1/vehicles/search?number={registrationNumber}` - Search for a vehicle by registration.
- `POST /v1/reports` - Submit an incident report using a valid QR token.

### Reports (Requires Auth)
- `GET /v1/reports` - Fetch reports for user's vehicles
- `PATCH /v1/reports/:id` - Update report status (`resolved`, `escalated`)

### Documents (Requires Auth)
- `POST /v1/documents` - Upload a document (multipart/form-data with `file`)
- `GET /v1/documents` - Get documents for a vehicle
- `DELETE /v1/documents/:id` - Delete a document

### Emergency Contacts (Requires Auth)
- `POST /v1/emergency-contacts` - Add an emergency contact
- `GET /v1/emergency-contacts` - Get contacts for a vehicle
- `PATCH /v1/emergency-contacts/:id` - Update a contact
- `DELETE /v1/emergency-contacts/:id` - Delete a contact
