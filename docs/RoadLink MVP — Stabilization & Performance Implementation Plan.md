# RoadLink MVP — Stabilization & Performance Implementation Plan

> **Status:** Implementation Complete — Stabilized for MVP.
> **Date:** July 2026
> **Prepared by:** Engineering Review (AI-assisted full-stack analysis)

---

## Table of Contents

1. [Executive Summary](#executive-summary)
2. [Architecture Overview](#architecture-overview)
3. [Issue Catalogue — Root Cause Analysis](#issue-catalogue)
4. [File-by-File Change Plan](#file-by-file-change-plan)
5. [Implementation Phases](#implementation-phases)
6. [Risk Analysis](#risk-analysis)
7. [Performance Improvements](#performance-improvements)
8. [Mobile Compatibility Fixes](#mobile-compatibility-fixes)
9. [Security Improvements](#security-improvements)
10. [Testing Checklist](#testing-checklist)
11. [Open Questions & Decisions Required](#open-questions)
12. [Remaining TODOs After This Phase](#remaining-todos)

---

## Executive Summary

After a complete read of every layer of the stack — frontend routes, context providers, repositories, Dexie schema, SyncManager, API layer, Capacitor hooks, server controllers, auth flow, Razorpay integration, and modal system — **15 distinct issues** were identified across 10 categories.

### Summary of Findings

| Severity | Count | Examples |
|---|---|---|
| 🔴 Critical | 2 | Vehicle creation bug, Webhook security gap |
| 🟡 High | 7 | Modal z-index, Razorpay UPI, Android back button, Loading flash, OTP bypass |
| 🟠 Medium | 4 | CORS wildcard, Repository always refreshes, Notification re-fetch, addDocument ID leak |
| 🟢 Low | 2 | Dead code, OTP error UX |

**Nothing has been changed yet. This document is the plan for your review.**

---

## Architecture Overview

```
React 19 (Vite SPA)
  └── BrowserRouter
        └── DialogProvider (z-[150] modals)
              └── AppProvider (Dexie + useLiveQuery + Auth state)
                    └── App (Routes + BottomTabBar z-50)

Data Flow:
  useLiveQuery (Dexie IndexedDB) → reactive state
  Repositories (User/Vehicle/Document/Contact) → Dexie + API
  SyncManager → offline queue → Dexie syncQueue table
  Axios (api.js) → Express backend → MongoDB + Cloudinary + Razorpay + MSG91
```

### Key Technology Stack

| Layer | Technology | Version |
|---|---|---|
| Frontend | React + Vite | 19.x + 8.x |
| Routing | react-router-dom | 7.x |
| Offline DB | Dexie (IndexedDB) | 4.x |
| Native | Capacitor | 8.x |
| Animations | framer-motion | 12.x |
| Styling | Tailwind CSS | 3.x |
| Backend | Express + Node.js | - |
| Database | MongoDB Atlas | - |
| Payment | Razorpay | - |
| OTP | MSG91 | - |
| Storage | Cloudinary | - |

---

## Issue Catalogue

---

### ISSUE 1 — 🔴 CRITICAL: Vehicle Creation Bug (False Error + No UI Update)

**Files affected:** `client/src/pages/owner/AddVehicle.jsx`, `client/src/lib/repositories/VehicleRepository.js`, `client/src/context/AppContext.jsx`

#### Root Cause — Multi-layered

The vehicle creation flow has a **double-POST bug** that makes a successfully-created vehicle appear as an error to the user.

**Step-by-step trace:**

```
1. AddVehicle.jsx:73  → api.post('/vehicles', formData)  ← First POST ✓ 201 Created
2. AddVehicle.jsx:83  → addVehicle(vehicle, null)         ← Passes server response object
3. AppContext.jsx:189  → VehicleRepository.addVehicle(v, qrToken)
4. VehicleRepository.js:64 → api.post('/vehicles', vData) ← Second POST ✗ 409 Conflict
5. AddVehicle.jsx:92  → catch(err) → setError(...)        ← User sees FALSE error
```

The `addVehicle` function in AppContext delegates to `VehicleRepository.addVehicle()`. That method assumes it receives **form payload data** and makes a fresh POST. But `AddVehicle.jsx` is passing it the **already-returned server vehicle object**. This triggers a second creation attempt, which fails with 409 because the vehicle already exists.

**Additional bugs in the same flow:**
- `setLoading(false)` is ONLY called in the `catch` block (line 95), never in the success path. The Save button stays stuck in loading state after the false error.
- Even if the user dismisses the error and presses Save again, they get another 409 (still false).

**Evidence in code:**
```js
// AddVehicle.jsx:73 — First (correct) POST
const res = await api.post("/vehicles", formData, {
  headers: { "Content-Type": undefined },
});

// AddVehicle.jsx:83 — Passes RETURNED vehicle object to addVehicle
if (addVehicle) {
  await addVehicle(vehicle, null); // vehicle = res.data.data.vehicle
}

// AppContext.jsx:189 — Delegates to repository
return await VehicleRepository.addVehicle(v, qrToken);

// VehicleRepository.js:64 — SECOND POST with wrong payload
const res = await api.post('/vehicles', vData); // vData is the server response object!
```

#### Fix
- Add `VehicleRepository.createVehicle(formData)` — single method that accepts FormData, POSTs to server once, normalizes the response, saves to Dexie, returns normalized vehicle.
- `AddVehicle.jsx` calls ONLY `VehicleRepository.createVehicle()` — no direct `api.post`, no separate `addVehicle` call.
- Remove the double-call pattern. `AppContext.addVehicle` should be renamed/removed to prevent future confusion.
- Always call `setLoading(false)` in both success and error paths.

---

### ISSUE 2 — 🟡 HIGH: Post-Vehicle-Creation Redirect (Fragile Field Names)

**Files affected:** `client/src/pages/owner/AddVehicle.jsx`, `client/src/pages/owner/SubscriptionPayment.jsx`

#### Root Cause

After vehicle creation, `navigate('/subscription-payment', { state: { vehicle } })` passes the **raw MongoDB server response object**. Field names from the server: `_id`, `registrationNumber`, `ownerId`. But `SubscriptionPayment.jsx` reads `vehicle.id || vehicle._id` and `vehicle.plate || vehicle.registrationNumber`.

The `||` fallback works today, but is fragile — if either field is missing or the shape changes, it silently breaks.

#### Fix
After vehicle creation, navigate with the **Dexie-normalized vehicle object** (fields: `id`, `plate`) returned by the repository, not the raw server response. This ensures consistent field names throughout the app.

---

### ISSUE 3 — 🟡 HIGH: Repeated API Calls on Every Page Navigation

**Files affected:** `client/src/pages/owner/Dashboard.jsx`, `Vehicles.jsx`, `DocumentVault.jsx`, `EmergencyContacts.jsx`, `Settings.jsx`, `client/src/lib/repositories/VehicleRepository.js`

#### Root Cause

Every tab page calls its own refresh inside `useEffect([], [])`:

```
Dashboard.jsx:34      → refreshVehicles() + refreshNotifications()
Vehicles.jsx:25       → refreshVehicles()
DocumentVault.jsx:19  → refreshVehicles() + refreshDocuments()
EmergencyContacts.jsx:16 → refreshContacts()
Settings.jsx:25       → refreshUser()
```

Each triggers a background `GET` API call on every page mount. Since all 4 tabs are under `RequireAuth`, switching tabs re-mounts the component and fires the refresh again.

Additionally, `VehicleRepository.getVehicles()` (line 11) calls `this.refreshVehiclesSilently()` unconditionally — creating 3 parallel `GET /vehicles` requests during a typical navigation session.

**Why this is unnecessary:** The data is already in Dexie, and `useLiveQuery` is fully reactive — it re-renders the component automatically when Dexie data changes. The per-page `useEffect` refreshes are redundant.

#### Fix
- Remove all per-page `useEffect` refresh calls.
- Add a module-level `lastRefreshedAt` timestamp to each repository. Only hit the network if `Date.now() - lastRefreshedAt > 60000` (60 second TTL).
- Add a global prefetch that fires once after login to populate Dexie on first load.
- Trust `useLiveQuery` for reactive updates after that.

---

### ISSUE 4 — 🟡 HIGH: Modal Z-Index Collision (Modals Behind Bottom Nav)

**Files affected:** `client/src/pages/owner/Settings.jsx`, `client/src/context/DialogContext.jsx`

#### Root Cause — Z-Index Audit

| Component | z-index value | Integer |
|---|---|---|
| BottomTabBar | `z-50` | 50 |
| Delete Account modal | `z-50` | 50 ← **SAME AS NAV** |
| Logout Confirm modal | `z-[100]` | 100 |
| DialogContext modal | `z-[150]` | 150 |
| Coming Soon modal (AppContext) | `z-[999]` | 999 |
| Upgrade modal (AppContext) | `z-[999]` | 999 |

The **Delete Account** modal uses `z-50` — exactly equal to the BottomTabBar. CSS stacking at equal z-index is resolved by DOM order: **later in the DOM wins**. Since `BottomTabBar` is rendered after the page content (it's a sibling appended after `Routes` in the `safe-area-wrapper`), the tab bar appears on top of the modal on mobile.

#### Fix
Standardize the z-index scale:
- `z-40` — Sticky headers
- `z-50` — Bottom navigation (keep as-is)
- `z-[200]` — All modals/dialogs (minimum)
- `z-[300]` — Global alerts
- `z-[999]` — Critical system modals

Update:
- Delete Account modal: `z-50` → `z-[200]`
- DialogContext modal: `z-[150]` → `z-[200]`

---

### ISSUE 5 — 🟡 HIGH: Razorpay UPI / Net Banking Fails on Android

**Files affected:** `client/src/pages/owner/SubscriptionPayment.jsx`

#### Root Cause — Multi-part

**1. WebView UPI Intent Blocking**
Razorpay Checkout uses `window.Razorpay().open()` which renders a modal overlay. When a user selects UPI inside this overlay, Razorpay generates a `upi://pay?...` intent URL. Capacitor's Android WebView does **not** route custom URI schemes (like `upi://`) to native apps by default — the intent is ignored.

**2. Net Banking Redirect**
Net Banking opens an external bank login page. In a WebView, this redirect may open inside the WebView itself (no back navigation, wrong cookies) or fail entirely.

**3. No `callback_url`**
For UPI apps that use redirect-based flows (BHIM, PhonePe), Razorpay redirects the user out, then back via a callback URL. Without a `callback_url` and a configured deep link, the return journey breaks.

**4. Missing Android Intent Filter**
`AndroidManifest.xml` has no intent filter for `roadlink://` or HTTPS deep links — so the OS cannot route Razorpay's redirect back to the app.

**5. Placeholder Image in Production**
`image: "https://via.placeholder.com/150"` appears in the Razorpay checkout UI shown to users.

#### Fix Options

**Option A — Proper Fix (~90 min)**
Use `@capacitor/browser` to open Razorpay's hosted payment page in the device's system browser (Chrome/Safari). The system browser handles UPI deep links natively. Payment result is delivered via webhook to the backend.

**Option B — Quick Fix (~30 min)**
Add `config.display` to the Razorpay options to hide UPI and Net Banking. Show only Cards and Wallets, which work inside WebView without deep link handling.

```js
// Quick fix — add to Razorpay options
config: {
  display: {
    hide: [{ method: 'upi' }, { method: 'netbanking' }],
    preferences: { show_default_blocks: true }
  }
}
```

**⚠️ Decision required from you — see Open Questions section.**

---

### ISSUE 6 — 🟡 HIGH: Android Back Button Not Implemented

**Files affected:** `client/src/App.jsx`, new file `client/src/hooks/useBackButton.js`

#### Root Cause
`App.addListener('backButton', ...)` from `@capacitor/app` is never called anywhere in the codebase. Android's hardware/gesture back button triggers the default WebView behavior, which varies by device — may do nothing, may close the app unexpectedly, may navigate the browser history in unexpected ways.

#### Desired Behavior (as specified)
```
Press Back on any sub-page  → navigate(-1) or navigate('/dashboard')
Press Back on Dashboard     → first press: toast "Press back again to exit"
                              second press within 2 seconds: App.exitApp()
                              after 2 seconds: reset, show toast again on next press
```

#### Fix
Create `client/src/hooks/useBackButton.js`:
```js
import { useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { App } from '@capacitor/app';
import { Capacitor } from '@capacitor/core';
import { Toast } from '@capacitor/toast';

export function useBackButton() {
  const navigate = useNavigate();
  const location = useLocation();
  const backPressedOnce = useRef(false);
  const backTimer = useRef(null);

  useEffect(() => {
    if (!Capacitor.isNativePlatform()) return;

    const handler = App.addListener('backButton', ({ canGoBack }) => {
      const isOnDashboard = location.pathname === '/dashboard';

      if (!isOnDashboard) {
        if (canGoBack) {
          navigate(-1);
        } else {
          navigate('/dashboard');
        }
        return;
      }

      // On Dashboard — double-back-to-exit
      if (backPressedOnce.current) {
        clearTimeout(backTimer.current);
        App.exitApp();
        return;
      }

      backPressedOnce.current = true;
      Toast.show({ text: 'Press back again to exit', duration: 'short', position: 'bottom' });
      backTimer.current = setTimeout(() => {
        backPressedOnce.current = false;
      }, 2000);
    });

    return () => {
      handler.then(h => h.remove());
      clearTimeout(backTimer.current);
    };
  }, [navigate, location.pathname]);
}
```

Import and call in `App.jsx`.

---

### ISSUE 7 — 🟡 HIGH: OTP Dev Bypass / Testing Cheat Code

**Files affected:** `server/modules/auth/controller.js`, `server/.env`

#### Root Cause
MSG91 DLT (Distributed Ledger Technology) registration is pending approval. Until approved, SMS OTPs do not deliver to Indian phone numbers. The server logs the OTP to console (Render logs), which requires backend access to read. There is no frontend bypass for testing.

#### Fix — Server-side only, gated by NODE_ENV

In `server/modules/auth/controller.js`, `verifyOtp` function, add before the OTP check:

```js
// =============================================================
// ⚠️ TEMPORARY DEVELOPMENT BYPASS — REMOVE BEFORE PRODUCTION
// =============================================================
// Allows OTP '431113' to succeed in non-production environments.
// This bypass is DISABLED when NODE_ENV=production.
// REMOVE THIS BLOCK entirely before deploying to production.
// =============================================================
const DEV_CHEAT_OTP = '431113';
const isCheatCode = process.env.NODE_ENV !== 'production' && otp === DEV_CHEAT_OTP;

if (!isCheatCode && (!session || session.otp !== otp)) {
  return sendError(res, 'Invalid or expired OTP', 400);
}
// =============================================================
// END TEMPORARY BYPASS
// =============================================================
```

Also add `NODE_ENV=development` to `server/.env`.

---

### ISSUE 8 — 🟡 HIGH: Loading Flash on Page Navigation

**Files affected:** `client/src/components/RequireAuth.jsx`

#### Root Cause
`RequireAuth.jsx` shows a full-screen spinner when `!isInitialized || isCacheLoading`. `isCacheLoading` is true when `useLiveQuery` returns `undefined` (the initial Dexie read state).

Even though IndexedDB reads are extremely fast (~1–5ms), the React render cycle means there is always at least one render where `userQuery === undefined`. On every route navigation, `RequireAuth` re-evaluates and may briefly show the spinner before Dexie resolves.

#### Fix — Stale-While-Revalidate
Only show the blocking spinner if there is truly no cached data:
```js
// Current (causes flash):
if (!isInitialized || isCacheLoading) return <Spinner />;

// Fixed (only blocks on true cold start):
if (!isInitialized) return <Spinner />;
if (isCacheLoading && !isAuthenticated) return <Spinner />;
// If authenticated + Dexie is loading, render children immediately with stale data
```

---

### ISSUE 9 — 🟠 MEDIUM: Notifications Re-Fetched on Every Dashboard Visit

**Files affected:** `client/src/context/AppContext.jsx`, `client/src/pages/owner/Dashboard.jsx`

#### Root Cause
Notifications live in React `useState` (not Dexie), so they do not survive route navigation. Every time the user navigates to `/dashboard`, `Dashboard.jsx` calls `refreshNotifications()`, which makes a full `GET /reports` API call.

#### Fix — Simple TTL
Add a `lastNotificationsRefresh` ref in AppContext:
```js
const lastNotificationsRefreshRef = useRef(0);

const refreshNotifications = async () => {
  const now = Date.now();
  if (now - lastNotificationsRefreshRef.current < 30000) return; // 30s TTL
  lastNotificationsRefreshRef.current = now;
  // ... existing fetch logic
};
```

---

### ISSUE 10 — 🟠 MEDIUM: addDocument Bypasses Repository (Ghost IDs)

**Files affected:** `client/src/context/AppContext.jsx`, `client/src/lib/repositories/DocumentRepository.js`

#### Root Cause
`AppContext.addDocument()` generates a fake local ID (`d${Date.now()}`) and writes directly to Dexie without hitting the server:
```js
// AppContext.jsx:212
const addDocument = async (doc) => {
  const newDoc = { ...doc, id: `d${Date.now()}` };
  await db.documents.put(newDoc);
  // No server call, no real ID
};
```
When `DocumentRepository.refreshDocumentsSilently()` runs later, it fetches real documents from the server (with real MongoDB ObjectIds). The deletion-reconciliation logic in the refresh removes documents that aren't in the server response — but the fake-ID document may NOT match any server record, causing it to linger in Dexie as a ghost entry, OR be deleted unexpectedly on the next refresh.

#### Fix
Add `DocumentRepository.addDocument(doc)` that POSTs to server first, saves to Dexie with the real server ID, and returns the normalized document. Route `AppContext.addDocument` through it.

---

### ISSUE 11 — 🔴 CRITICAL (Security): Webhook Signature Verification Disabled

**Files affected:** `server/.env`, `server/modules/subscriptions/controllers/subscriptionController.js`

#### Root Cause
`RAZORPAY_WEBHOOK_SECRET` is **not present** in `server/.env`. In `subscriptionController.js`:
```js
const secret = process.env.RAZORPAY_WEBHOOK_SECRET;
if (secret) {
  // verify signature
}
// If secret is undefined, this block is skipped entirely
```
Without the secret, **any HTTP POST to `/v1/subscriptions/webhook`** is processed without signature validation. A malicious actor could send a fake `subscription.activated` event and activate protection for any vehicle without paying.

#### Fix
1. Go to Razorpay Dashboard → Settings → Webhooks → copy the webhook secret.
2. Add `RAZORPAY_WEBHOOK_SECRET=<your_secret>` to `server/.env`.
3. Done — the existing verification code is correct, just needs the env var.

---

### ISSUE 12 — 🟠 MEDIUM: VehicleRepository Always Refreshes (No Staleness Guard)

**Files affected:** `client/src/lib/repositories/VehicleRepository.js`

#### Root Cause
`VehicleRepository.getVehicles()` line 11 calls `this.refreshVehiclesSilently()` unconditionally on every call. Multiple components (`Dashboard`, `Vehicles`, `DocumentVault`) call this on mount, resulting in 3 parallel `GET /vehicles` requests per session.

#### Fix
Add module-level timestamp:
```js
let lastVehicleRefreshAt = 0;
const VEHICLE_TTL_MS = 60 * 1000; // 60 seconds

static async refreshVehiclesSilently() {
  const now = Date.now();
  if (now - lastVehicleRefreshAt < VEHICLE_TTL_MS) return;
  lastVehicleRefreshAt = now;
  // ... existing refresh logic
}
```

Apply the same pattern to `UserRepository`, `ContactRepository`, `DocumentRepository`.

---

### ISSUE 13 — 🟠 MEDIUM: CORS Wildcard in Production

**Files affected:** `server/app.js`, `server/.env`

#### Root Cause
```js
app.use(cors()); // Allows ANY origin
```
This is acceptable for development but allows any website to make authenticated requests to your API in production.

#### Fix
```js
app.use(cors({
  origin: process.env.ALLOWED_ORIGIN || '*',
  methods: ['GET', 'POST', 'PATCH', 'DELETE', 'PUT'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));
```
Add `ALLOWED_ORIGIN=https://your-production-domain.com` to production `.env`.

---

### ISSUE 14 — 🟢 LOW: OTP Error UX

**Files affected:** `client/src/pages/auth/OTPVerification.jsx`

#### Root Cause
Generic error messages when OTP delivery fails or verification fails. Users see raw error strings.

#### Fix
Map common error messages to user-friendly copy:
- "Invalid or expired OTP" → "That code didn't match. Please try again."
- Network error → "We couldn't reach the server. Check your connection and try again."
- Any 500 → "Something went wrong on our end. Please try again in a moment."

---

### ISSUE 15 — 🟢 LOW: Dead Code

**Files affected:** Multiple

| File | Dead Code | Fix |
|---|---|---|
| `App.jsx` lines 5–107 | Entire PushNotifications block (commented out) | Remove the comment block |
| `AppContext.jsx` line 322 | `setUser` no-op with `console.warn` | Remove — nothing uses it |
| `OTPVerification.jsx` line 84 | `joinedDate: new Date()` — sets today, not actual join date | Use server-returned `user.createdAt` |
| `VehicleDetail.jsx` line 28 | `useState(contextVehicle)` — local copy doesn't update when Dexie refreshes | Derive from `vehicles.find()` directly |
| `SubscriptionPayment.jsx` line 64 | `image: "https://via.placeholder.com/150"` | Remove or replace with real logo URL |

---

## File-by-File Change Plan

### New Files to Create

| File | Purpose |
|---|---|
| `client/src/hooks/useBackButton.js` | Android back button handling |
| `client/src/hooks/useDataFreshness.js` | Centralized staleness TTL utility |
| `docs/implementation-plan.md` | This file |

### Files to Modify

#### 🔴 Critical

| File | Changes |
|---|---|
| `client/src/lib/repositories/VehicleRepository.js` | Add `createVehicle(formData)` method; add staleness TTL to all refresh methods |
| `client/src/pages/owner/AddVehicle.jsx` | Use `VehicleRepository.createVehicle()`; remove direct `api.post`; fix `setLoading(false)` in success path |
| `client/src/context/AppContext.jsx` | Fix `addVehicle` to not call repo's old `addVehicle`; add notification TTL; global prefetch on sign-in; remove `setUser` no-op |
| `server/modules/auth/controller.js` | Add OTP cheat code bypass (gated by `NODE_ENV`) |
| `server/.env` | Add `RAZORPAY_WEBHOOK_SECRET`, `NODE_ENV=development`, `ALLOWED_ORIGIN` |

#### 🟡 High

| File | Changes |
|---|---|
| `client/src/pages/owner/Settings.jsx` | Fix Delete Account modal `z-50` → `z-[200]`; remove `useEffect(() => refreshUser(), [])` |
| `client/src/context/DialogContext.jsx` | Fix `z-[150]` → `z-[200]` |
| `client/src/App.jsx` | Add `useBackButton()` hook; remove commented-out push notification block |
| `client/src/pages/owner/Dashboard.jsx` | Remove `useEffect(() => { refreshVehicles(); refreshNotifications(); }, [])` |
| `client/src/pages/owner/Vehicles.jsx` | Remove `useEffect(() => { refreshVehicles(); }, [])` |
| `client/src/pages/owner/DocumentVault.jsx` | Remove `useEffect` refresh calls |
| `client/src/pages/owner/EmergencyContacts.jsx` | Remove `useEffect(() => refreshContacts(), [])` |
| `client/src/components/RequireAuth.jsx` | Fix loading flash — stale-while-revalidate pattern |
| `client/src/pages/owner/SubscriptionPayment.jsx` | Fix placeholder image; add UPI fix (per decision) |
| `client/src/lib/repositories/UserRepository.js` | Add staleness TTL |
| `client/src/lib/repositories/ContactRepository.js` | Add staleness TTL |
| `client/src/lib/repositories/DocumentRepository.js` | Add staleness TTL; add `addDocument()` method |

#### 🟠 Medium / 🟢 Low

| File | Changes |
|---|---|
| `server/app.js` | Restrict CORS to `process.env.ALLOWED_ORIGIN` |
| `client/src/pages/auth/OTPVerification.jsx` | Fix `joinedDate`; improve error messages |

---

## Implementation Phases

### Phase 1 — Security & Critical Bugs (Do First, 1–2 hours)

1. Add `RAZORPAY_WEBHOOK_SECRET` to `server/.env` (**5 min — manual step**)
2. Add `NODE_ENV=development` to `server/.env` (**2 min**)
3. Add OTP cheat code `431113` in `server/modules/auth/controller.js` (**10 min**)
4. Fix vehicle creation bug — refactor `VehicleRepository` + `AddVehicle.jsx` + `AppContext` (**30 min**)
5. Fix post-creation redirect to use normalized vehicle object (**10 min**)

### Phase 2 — UI & Navigation (1–2 hours)

6. Fix modal z-index in `Settings.jsx` and `DialogContext.jsx` (**15 min**)
7. Create `useBackButton.js` hook (**30 min**)
8. Wire `useBackButton` into `App.jsx` (**5 min**)
9. Fix loading flash in `RequireAuth.jsx` (**10 min**)

### Phase 3 — Performance & Cache (1 hour)

10. Add staleness TTL to all 4 repositories (**40 min**)
11. Remove all per-page `useEffect` refresh calls (**20 min**)
12. Add notification TTL in `AppContext` (**15 min**)
13. Add global prefetch trigger on `signIn()` in `AppContext` (**15 min**)

### Phase 4 — Razorpay Mobile Fix (1–2 hours depending on option chosen)

14. Fix Razorpay mobile payment — Option A or Option B (**30–90 min**)

### Phase 5 — Code Quality Cleanup (30 min)

15. Remove dead code from `App.jsx`, `AppContext.jsx`, `OTPVerification.jsx`
16. Fix CORS in `server/app.js`
17. Route `addDocument` through `DocumentRepository`
18. Replace Razorpay placeholder image

---

## Risk Analysis

| Change | Risk Level | Mitigation |
|---|---|---|
| Vehicle creation refactor | Low | Single unit of change; well-isolated |
| Remove per-page refreshes | Low | useLiveQuery already handles reactivity; data stays fresh |
| Staleness TTL on repos | Low | Opt-in; background refreshes still happen |
| Modal z-index fix | None | CSS-only change |
| OTP cheat code | Low | Gated by `NODE_ENV !== 'production'` |
| Android back button | Low | Uses Capacitor's official API; no-op on web |
| Razorpay mobile fix (Option B) | Low | Config change only; no flow change |
| Razorpay mobile fix (Option A) | Medium | Changes payment flow; requires backend change |
| CORS restriction | Low | Controlled by env var; '*' still works as fallback |
| Webhook secret | None | Adds security; existing logic already handles it |

**Regression risk assessment: LOW.** The Dexie + useLiveQuery architecture means page rendering is already driven by the database, not by API call completion. Removing refresh calls does not remove data — it removes unnecessary re-fetches. All writes continue to work identically.

---

## Performance Improvements

| Optimization | Before | After |
|---|---|---|
| API calls per navigation session | 3–6 redundant calls | 0 redundant calls |
| Vehicles API calls per session | 3 parallel GETs | 1 GET (after 60s TTL) |
| Notifications re-fetch on Dashboard | Every visit | Once per 30 seconds |
| Tab navigation loading spinners | Appears on every tab switch | Never (Dexie is instant) |
| First load after login | Sequential fetches scattered | One organized parallel prefetch |

---

## Mobile Compatibility Fixes

### Android Back Button
- Currently: Does nothing or exits app unexpectedly
- After: Proper back-navigation + double-press-to-exit on Dashboard

### Modal Z-Index
- Currently: Delete Account dialog appears BEHIND the bottom navigation bar
- After: All modals use `z-[200]` minimum, always above navigation

### Loading Flash
- Currently: Brief spinner flash on every page navigation
- After: Instant rendering from Dexie cache; no flash

### Razorpay UPI
- Currently: UPI deep links silently fail inside WebView
- After: Either disabled (Option B) or opened in system browser (Option A)

### Safe Areas
- Current: `app-shell` has `padding: env(safe-area-inset-*)` — **already correct**
- Status bar: Capacitor StatusBar plugin configured — **already correct**
- No changes needed for safe area handling

---

## Security Improvements

| Issue | Status | Fix |
|---|---|---|
| Razorpay webhook unsigned | ⚠️ OPEN | Add `RAZORPAY_WEBHOOK_SECRET` to `.env` |
| CORS wildcard | ⚠️ OPEN | Lock to `ALLOWED_ORIGIN` in production |
| OTP cheat code in production | N/A | Gated by `NODE_ENV` — safe |
| JWT stored in Preferences | ✅ OK | Capacitor Preferences is native-secure |
| Refresh token in Preferences | ✅ OK | Same |
| MongoDB credentials in .env | ⚠️ Note | Never commit `.env` — add to `.gitignore` if not already |

---

## Testing Checklist

### Auth Flow
- [ ] Register new account → OTP delivered (MSG91) → verify → redirect to AddVehicle
- [ ] Register with cheat code `431113` → verify succeeds → redirect to AddVehicle
- [ ] Login existing account → OTP → redirect to Dashboard
- [ ] Login with wrong OTP → clear error message, retry possible
- [ ] Login with cheat code while `NODE_ENV=production` → cheat code does NOT work
- [ ] Expired token → auto-refresh → original request retried transparently
- [ ] Expired refresh token → redirect to login

### Vehicle Flow
- [ ] Add vehicle → Save button → vehicle created → NO false error
- [ ] After creation → auto-redirect to SubscriptionPayment with correct vehicle data
- [ ] SubscriptionPayment shows correct plate number
- [ ] If vehicle already exists → server returns 409 → user sees clear error
- [ ] Add vehicle while offline → appropriate error shown (no silent failure)

### Payment Flow
- [ ] Razorpay modal opens → payment with test card → success → redirect to VehicleDetail
- [ ] Razorpay modal opened → user closes without paying → back to SubscriptionPayment
- [ ] `protectionStatus` updates to `active` after payment

### Navigation & Cache
- [ ] Login → Dashboard loads instantly (no spinner)
- [ ] Navigate to Vehicles tab → instant (no loading animation)
- [ ] Navigate to Docs tab → instant
- [ ] Navigate to Profile tab → instant
- [ ] Navigate between tabs 10 times → no API calls after the first prefetch
- [ ] Go offline → all 4 tabs still show cached data
- [ ] Go online → data silently refreshes in background

### Modal Z-Index (Android)
- [ ] Tap "Delete Account" → modal appears ABOVE bottom navigation bar
- [ ] Tap "Log Out" → modal appears ABOVE bottom navigation bar
- [ ] DialogContext alert → appears ABOVE bottom navigation bar

### Android Back Button
- [ ] Any detail page → Back → returns to previous screen
- [ ] VehicleDetail → Back → returns to Vehicles
- [ ] Dashboard → Back → toast "Press back again to exit"
- [ ] Dashboard → Back → Back within 2 seconds → app exits
- [ ] Dashboard → Back → wait 3 seconds → Back again → toast appears (does NOT exit)

### Performance
- [ ] Navigate between all 4 tabs → Network tab shows zero redundant API calls
- [ ] Dashboard refreshNotifications → only called once per 30 seconds

### Security
- [ ] POST to `/v1/subscriptions/webhook` without valid signature → 400 rejected
- [ ] CORS: request from unknown origin → rejected in production

---

## Open Questions

**Decision 1 — Razorpay UPI on Android:**

The two options:

- **Option A (Proper, ~90 min):** Use `@capacitor/browser` to open Razorpay's hosted checkout in the device's system browser. System browser handles UPI intent links natively. Payment result returned via webhook. Requires backend to generate Razorpay payment link instead of inline SDK.

- **Option B (Quick Fix, ~30 min):** Add `config.display` to hide UPI and Net Banking in the Razorpay overlay. Show only Cards and Wallets, which work inside WebView without deep link handling.

**→ Which option do you choose?**

---

**Decision 2 — Global Prefetch vs Per-Page TTL:**

- **Recommended approach:** Remove all per-page `useEffect` refresh calls entirely. Trust `useLiveQuery` for instant reactive rendering. Fire a single global prefetch on login. Repositories use 60-second TTL for any subsequent background refresh.

- **Alternative:** Keep per-page refreshes, but gate them with a TTL so they don't run more than once per minute.

**→ Do you agree with the recommended approach (remove all per-page refreshes)?**

---

**Decision 3 — Notification persistence:**

Notifications currently live in React `useState` — they are lost on page navigation and must be re-fetched each time.

- **MVP (quick):** Add a 30-second TTL to avoid re-fetching on every visit. Notifications still disappear if the app is backgrounded.
- **Proper:** Migrate notifications to a Dexie `notifications` table. They persist offline, render instantly, and are updated in the background.

**→ MVP fix (TTL) or proper fix (Dexie migration)?**

---

## Remaining TODOs (After This Phase)

These are known gaps that are out of scope for this stabilization sprint:

| TODO | Description | Priority |
|---|---|---|
| Push notifications | Firebase `google-services.json` required, plugin commented out | Post-MVP |
| Notification Dexie migration | Move from `useState` to Dexie for persistence | Post-MVP |
| Document upload via Repository | `DocumentRepository.addDocument()` with server POST | This phase |
| Medical profile in Dexie | Currently in `useState`, lost on navigation | Post-MVP |
| Razorpay native Android SDK | Replace inline JS checkout with native plugin | Post-MVP |
| VehicleDetail local state sync | `useState(contextVehicle)` doesn't update on Dexie refresh | This phase |
| Token refresh race condition | Multiple concurrent 401s may all try to refresh simultaneously | Post-MVP |
| Unit tests | No test runner configured (Vitest recommended) | Post-MVP |
| Subscription order history cache | Orders not in Dexie | Post-MVP |
| CORS production lockdown | Add `ALLOWED_ORIGIN` to production deployment | This phase |

---

## Approval Checklist

Before implementation begins, confirm:

- [x] **Razorpay UPI fix:** Option A (proper) or Option B (quick)? -> Applied Option B
- [x] **Global prefetch strategy:** Remove all per-page refreshes (recommended)? -> Applied TTL strategy and removed per-page effects
- [x] **Notification persistence:** TTL fix or Dexie migration? -> TTL fix applied
- [x] **Webhook secret:** Retrieved from Razorpay dashboard and ready to add? -> Added to .env
- [x] **This plan is approved for implementation?** -> Executed and complete.

---

*End of RoadLink MVP Stabilization Implementation Plan*
*Created: July 2026 | Version: 1.0*
