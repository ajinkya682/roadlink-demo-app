# RoadLink — MVP UI/UX Design Prompt Library

Scope: Section 5.1 MVP (Launch) feature set only. Each prompt below is self-contained — paste any single one into an AI design/build tool (v0, Lovable, Claude, Figma AI, etc.) and it has everything needed to generate that screen on its own.

---

## 0. Design DNA (paste this block into every prompt, or once if your tool keeps context)

RoadLink is a privacy-first digital identity for vehicles in India. The subject matter is literally the number plate — so the design's signature device is the **plate tag**: a rounded-rectangle badge with a dark bezel and letter-spaced monospace type, used everywhere a vehicle, a QR, or a status needs representing. It should feel like official road signage crossed with a modern fintech-grade trust product — never playful, never alarmist.

**Color (named tokens):**
- `--road-navy: #1B4B8F` — primary, trust, structure
- `--signal-amber: #F5A623` — action/attention (parking, general alerts)
- `--alert-red: #D93025` — reserved ONLY for Theft/Emergency states — never decorative
- `--verified-green: #1E8E5A` — resolved/verified states only
- `--asphalt: #1A1A1A` — primary text, plate-tag bezels
- `--fog: #F7F8FA` — page background
- `--plate-white: #FFFFFF` — plate tag interior

**Type:**
- Display/headers: IBM Plex Sans Condensed, semibold — slightly technical, road-signage character
- Body: Inter or IBM Plex Sans, regular/medium
- Plate/data (vehicle numbers, QR IDs, timestamps): IBM Plex Mono, letter-spacing +0.05em — monospace is used because these are literally alphanumeric codes, not decoration

**Layout concept:** Generous white/fog space, one accent per screen maximum, 12–16px corner radii on cards, plate tags always rendered with a 2px dark bezel + monospace content regardless of context (dashboard card, notification, QR screen). Reserve red strictly for emergency/theft so it keeps its alarm value. Motion: minimal — a single deliberate transition per screen (e.g., plate tag flip on QR reveal), never ambient/decorative animation.

**Voice:** plain, active, calm even in stressful states ("Someone reported your parking" not "Uh oh! Parking alert!"). Errors state what happened and what to do next, no apology, no exclamation marks.

**Baseline quality bar for every screen:** mobile-first (375px primary viewport), responsive to desktop, visible keyboard focus states, WCAG 2.1 AA contrast, works one-handed outdoors in bright sunlight (high contrast, large tap targets ≥44px).

---

## 0b. Global Bottom Navigation (use on every authenticated screen — redesign v2)

This replaces the old top-bar-only navigation. It's a fixed, PhonePe-style bottom nav shared across every screen after login: Dashboard Home, Vehicle Detail, Document Vault, Profile/Settings. It is NOT shown on the guest-facing screens (1–5) or the onboarding carousel (6a–6c), since those are pre-login/account-less contexts.

**Prompt (paste this alongside every authenticated-screen prompt so the nav renders identically everywhere):**
Design a fixed bottom navigation bar, full width, white background, 1px top border in fog-gray (or a very soft upward shadow instead of a hard line), with safe-area bottom padding for iOS home-indicator clearance. Five slots, laid out as **2 tabs — center action — 2 tabs**:
- **Left tab 1: Home** — house icon, label "Home."
- **Left tab 2: Documents** — document/folder icon, label "Docs."
- **Center: Scan** — a circular button, 60px diameter, signal-amber fill, white QR-scan icon centered, elevated so it breaks the top edge of the nav bar by about 18px (sits partly above the bar, PhonePe/Paytm-style), with a soft drop shadow for lift and a thin white ring where it overlaps the bar so it reads as a separate floating element, not flush with the row. No text label under it — the icon alone should read as "scan," since this is the app's core action and gets used constantly.
- **Right tab 1: Vehicles** — a small plate-tag/car icon, label "Vehicles" (opens a list of all the owner's vehicles — this is distinct from Home, which shows the dashboard summary).
- **Right tab 2: Profile** — a circular avatar or a simple profile-outline icon, label "Profile" (this tab now owns Settings, Emergency Contacts, and account/Delete Account — Screens 19 and 20 are reached from here, not from a header icon anymore).

**States:** active tab = filled/bold icon + road-navy label; inactive tabs = outline icon + asphalt at ~55% opacity label. No numeric badges anywhere on this bar — unread-alert counts live only on the header bell (Dashboard Home) and on individual vehicle cards, so a person never has to reconcile two different badge counts for the same thing.

**Behavior note:** tapping Scan always opens the in-app QR scanner regardless of which tab is currently active — it's a global action, not scoped to whichever tab you're standing on.

---

## GUEST-FACING SCREENS (no login, reached via QR scan or search)

### 1. Public Scan Landing Page
**Prompt:**
Design the page a stranger lands on after scanning a RoadLink QR code on someone's vehicle. No login, no navigation chrome — this is a single-purpose trust page. Top: a plate tag showing the vehicle's public display name only (e.g., "Honda Activa") with a small "Vehicle Verified" badge in verified-green next to it — no owner name, no number shown. Below: a 4×3 (or scrollable 2-column on mobile) grid of 12 category buttons: Wrong Parking, Blocking Road, Hit & Run, Vehicle Damage, Fire, Vehicle Theft, Tow Alert, Headlights On, Windows Open, Emergency, Lost Vehicle, Abandoned Vehicle, Accident Alert. Emergency and Vehicle Theft buttons are visually distinct (alert-red outline) from the other 10 (asphalt/navy outline) — everything else is calm and neutral. Each button: icon + label, large tap target. No account-creation prompt anywhere on this page — that would undermine trust in the moment. Footer: a single quiet line explaining "This page never shows the owner's phone number" plus a small RoadLink wordmark.

### 2. Report Detail & Send (after category tap)
**Prompt:**
Design the screen/modal shown after a guest taps a category on the scan landing page (e.g., "Wrong Parking"). Show the selected category as a plate-style header chip. Fields: optional notes (max 300 characters, character counter), optional photo/video attach (large dashed drop-zone, camera-first on mobile), a location-consent toggle ("Share my location with the owner?") defaulted off with a one-line explanation of why it helps. Single primary button: "Send Notification" (signal-amber). No login field anywhere. For Emergency/Theft categories, skip notes/photo entirely and show a single large confirmation button plus a one-line warning: "This alerts the owner immediately across all channels."

### 3. Report Sent Confirmation
**Prompt:**
Design a brief, calm confirmation screen shown after a report is sent. A single centered verified-green checkmark in a plate-tag shape, headline "Notification sent," one line stating the owner has been notified. No further action required — include a subtle "Done" button that closes back to the browser/home screen (this is a guest with no account). For Emergency category specifically, additionally surface the local emergency number (108/112) as a tappable call button, styled in alert-red, positioned above the "Done" button — this screen should never let a genuine emergency dead-end.

### 4. Search Vehicle by Number
**Prompt:**
Design a minimal search page: a single centered input styled as an empty plate tag (dark bezel, monospace placeholder "MH 14 AB 1234"), auto-formatting as the user types, one "Search" button below in road-navy. Below the fold, a one-line privacy reassurance: "We'll never show you a phone number." No results, filters, or history shown — this is a single-purpose lookup tool for guests.

### 5. Search Result
**Prompt:**
Design two states for the same layout. **Found:** a plate tag with the vehicle's public display name and the verified-green "Vehicle Verified" badge, plus a single "Notify Owner" button that leads into the same category grid as Screen 1. **Not found:** a quiet empty-state illustration-free message: "This vehicle isn't registered on RoadLink yet" with a secondary, de-emphasized link "Learn how RoadLink works" (not a hard sell) — never guess or suggest similar plate numbers, for privacy reasons.

---

## OWNER-FACING SCREENS (authenticated)

### 6. Splash / Onboarding (First Launch Only)
A 3-slide carousel shown only on first app install, before any login. It's the only screen in the library that exists purely to build trust before asking for a phone number. Because a single combined prompt only generates one slide (a carousel is 3 distinct screens, not one), it's split below into three self-contained prompts — **6a**, **6b**, **6c** — one per slide. Generate them one at a time so each slide gets its own render. All three must share the same card frame, corner radius, header treatment ("IND" label + car icon), and dot-indicator style so the carousel reads as one continuous object as the user swipes — not three different designs stitched together.

#### 6a. Splash — Slide 1 of 3 ("One QR. One identity.")
**Prompt:**
Design slide 1 of 3 of the RoadLink first-launch onboarding carousel. Fog-colored full-screen background. Centered card: a white plate-tag panel with a 2px road-navy rounded border (~24px radius), a thin header row inside showing a small gray "IND" label top-left and a small navy car icon top-right, a hairline divider below the header, then a large centered vehicle registration number in bold monospace navy text across two lines (e.g. "DL 01 AA / 1234"). Below the plate number, a smaller inset image with its own rounded corners and soft shadow, showing a phone scanning a QR code on a vehicle windshield with the RoadLink wordmark visible in the inset — this communicates "this plate becomes a scannable digital identity." Below the card: headline "One QR. One identity." in bold road-navy (display font), and one line of gray subtext: "The digital identity for your vehicle, built for the Indian road." Top-right corner: a quiet "Skip" link in road-navy. Bottom of screen: 3 dot indicators — first dot filled navy (active), other two light fog-gray. No primary button on this slide; advancing happens by swipe.

#### 6b. Splash — Slide 2 of 3 ("We never show your number")
**Prompt:**
Design slide 2 of 3 of the RoadLink first-launch onboarding carousel — same background, same card frame, corner radius, "Skip" placement, and dot-indicator style as slide 1, so it reads as the next frame of the same object. Inside the card, replace slide 1's QR inset with a before/after trust moment: a small illustrated windshield with a phone number handwritten in marker and struck through with a single diagonal line, positioned above or beside the same plate-tag device from slide 1 (rounded card, navy border, monospace plate number) now carrying a small verified-green checkmark badge — the plate tag visually replaces the crossed-out number. Headline: "We never show your number" in bold road-navy, the same size/weight as slide 1's headline — this is the product's single most important trust claim and should carry equal visual weight, not less. Subtext: "Anyone can reach you. No one can see your number." Dot indicators: second dot filled navy, first and third light fog-gray. No primary button; advancing happens by swipe.

#### 6c. Splash — Slide 3 of 3 ("Reported the moment it matters") + Get Started
**Prompt:**
Design slide 3 of 3 of the RoadLink first-launch onboarding carousel — same background, card frame, and header treatment as slides 1–2. Inside the card, show a condensed grid (2×2 or 2×3) of 4–5 category icons drawn from the public scan page's category set (e.g. Wrong Parking, Vehicle Damage, Theft, Emergency), each a small icon plus one-word label in a neutral asphalt/navy outline — except the Theft or Emergency icon, which keeps the alert-red accent, consistent with red being reserved only for those two categories elsewhere in the product. Headline: "Reported the moment it matters" in bold road-navy. Subtext: "From a wrong-parked scooter to a real emergency — the right people know instantly." Dot indicators: third dot filled navy, first and second light fog-gray. Unlike slides 1–2, this slide has a primary button, "Get Started" in signal-amber, centered below the dots, leading to Screen 7 (Login). Hide or disable the "Skip" link on this final slide since Get Started already serves that purpose.

### 7. Login — Phone Entry
**Prompt:**
Design a minimal, trust-forward login screen. RoadLink wordmark + tagline "Every Vehicle. One Identity. One Scan Away." centered above the fold. Single phone number input with a fixed +91 prefix, one primary button "Send OTP" in road-navy. Below the fold, a single quiet line: "We only use this to verify you and deliver alerts — never shown publicly." No social login on this screen (OTP is primary, per MVP scope).

### 8. OTP Verification
**Prompt:**
Design a 6-box OTP input screen, auto-advancing per digit, auto-submitting on completion. Show the masked phone number being verified above the boxes ("Code sent to +91 98••••210"). Below: a 60-second countdown before "Resend code" becomes tappable (greyed out until then). Keep the screen otherwise empty — this is a fast, transactional moment, not a branding moment.

### 9. Add Vehicle
**Prompt:**
Design a short, single-column form: registration number (auto-formats and uppercases as typed, styled as a live plate-tag preview that fills in above the form as the user types — this preview IS the signature moment of the screen), make, model (can be a simple text field for MVP, no fancy autocomplete required), optional nickname, a toggle "Show my name publicly" (default off, with a one-line note on what stays private). Primary button "Save Vehicle," secondary text link "Skip documents for now" leading to the dashboard rather than forcing document upload at this step.

### 10. QR Code Detail
**Prompt:**
Design the screen shown after a vehicle is created. Large centered QR code inside a plate-tag-style frame (dark bezel), vehicle name below it in the display font. Three actions below: "Download QR" (secondary/outline), "Order Sticker" (primary, signal-amber), and a smaller destructive-styled "Regenerate QR" (requires a confirmation dialog explaining the old QR will stop working). Include one reassurance line about how this QR protects privacy when scanned.

### 11. Order QR Sticker
**Prompt:**
Design a short checkout flow (can be a single scrolling screen for MVP). Step 1: sticker type selection as 2–3 cards (Standard, Reflective, NFC+QR) with price shown per card, one selectable at a time. Step 2: shipping address form (name, address lines, city, state, PIN — standard Indian address fields). Step 3: order summary + "Pay with Razorpay" primary button. Keep the whole flow on one page with clear section dividers rather than a multi-step wizard, to reduce drop-off for an add-on purchase.

### 12. Order Confirmation
**Prompt:**
Design a brief confirmation screen: verified-green checkmark, "Order placed," order number in monospace, estimated delivery window, and a "Back to Dashboard" button. Keep it visually consistent with Screen 3 (Report Sent Confirmation) — both are "action succeeded" moments and should feel like the same design family.

### 13. Owner Dashboard — Home (redesign v2 — PhonePe-style)
**Prompt:**
Redesign the main authenticated home screen, PhonePe-style, built on top of the Global Bottom Navigation (Section 0b — Home tab active).

**Header (top of screen, fog background):** left-aligned "Good afternoon, {Name}" in bold road-navy, small gray subtext line below it if useful (e.g., vehicle count summary — optional). Top-right: a bell icon with a small alert-red dot badge showing unread-notification count (tapping it opens the Notifications Inbox, Screen 15) — this is now the *only* place unread counts live at the account level. **Remove the separate gear/settings icon from this header entirely** — Settings now lives on the Profile tab in the bottom nav, so there's no duplicate path to the same destination.

**Quick actions row (directly below header):** a horizontal row of 4 circular icon buttons, PhonePe-service-icon style — each a soft fog-gray circle (48–56px) with a road-navy icon inside, and a small label underneath: **Profile** (account/avatar icon), **Add Vehicle** (plus/car icon), **My Vehicles** (a stacked-cards or plate-tag icon — opens the same destination as the Vehicles tab in the bottom nav), **Invite & Earn** (a share/gift icon — sends a referral link so a friend can sign up). Row scrolls horizontally if more icons are added post-MVP; for now all 4 fit on a 375px screen without scrolling.

**"MY VEHICLES" section:** uppercase section label (small, gray, letter-spaced), then a vertical stack of vehicle cards — keep the structure from the current build, it's working well, just tighten it:
- Each card: vehicle name (bold, large) + "Added {month year}" (small gray) on the left; a small circular QR icon button top-right (opens that vehicle's QR Code Detail, Screen 10) with its own small alert-red dot badge for unread reports *specific to that vehicle*.
- Below that, the plate-tag device exactly as already built: white panel, 2px asphalt border, "IND" label + small gray dot top row, large monospace plate number, small verified-green checkmark, "VEHICLE VERIFIED" caption in verified-green, small-caps, bold.
- Below the plate tag, a contextual status banner strip spanning the card width: signal-amber background (10–15% opacity fill) with a filled amber dot + "{N} new alerts — tap to view" when there are unread reports; verified-green background (same low-opacity treatment) with a green dot + "Privacy Mode Active" when there's nothing to action. Only one banner per card, whichever is currently true.

**"Add another vehicle" card:** keep as-is — dashed-outline card matching the plate-tag's proportions, plus icon, label, chevron.

**Overall:** content scrolls freely above the fixed Global Bottom Navigation; Home tab shows active state. This screen should still read as calm and organized even with the new quick-actions row — MVP owners may have exactly one vehicle, so nothing here should feel like it's demanding a second or third vehicle to look complete.

### 14. Vehicle Detail
**Prompt:**
Design a single-vehicle detail screen with a simple tab bar: Overview / Documents / Contacts / QR (History can be omitted or folded into Overview for MVP). Overview tab: the plate tag at the top, key facts (make/model, date added), and a compact list of the 3 most recent notifications with a "View all" link into the full inbox. Documents tab: see Screen 17 (Document Vault). Contacts tab: list of emergency contacts with add/edit — reuses Screen 20 (Emergency Contacts). QR tab: reuses Screen 10's layout inline.

### 15. Notifications Inbox
**Prompt:**
Design a chronological feed of all reports received across the owner's vehicle(s). Each row: category icon, left border color-coded (alert-red for Emergency/Theft, signal-amber for parking/general categories, verified-green for resolved), short description, relative timestamp, unread indicator (dot). Include a lightweight filter control (All / Unresolved / Resolved) at the top, not a heavy filter panel. Empty state (no reports yet): a calm message — "No reports yet. That's a good thing." — with no dead-end illustration overload.

### 16. Notification Detail
**Prompt:**
Design the expanded view of a single report, reached by tapping an inbox row. Show: category as a header chip, timestamp, an embedded static map thumbnail if location was shared (else omit the map block entirely rather than show a placeholder), any attached photo/video full-width, the reporter's optional notes as plain text. Three actions at the bottom: "Open in Maps" (if location present), "Mark Resolved" (verified-green), and — only for Theft/Hit & Run/Emergency categories — "Escalate" (alert-red, opens a short explanation of what escalation does, e.g., surfacing police-report guidance).

### 17. Document Vault (List)
**Prompt:**
Design a grid of document-type cards: RC, Insurance, PUC, License (MVP scope — omit service bills/warranty/invoices for launch). Each card shows the document type icon/label and, once uploaded, an expiry countdown badge: verified-green if >30 days, signal-amber if 7–30 days, alert-red if <7 days or expired. Empty (not-yet-uploaded) cards show a dashed outline with a plus icon and "Add [Document Type]." Tapping any card opens Screen 18 (Document Upload).

### 18. Document Upload
**Prompt:**
Design a simple upload screen/modal for a single document type (title reflects the type, e.g., "Add Insurance"). Elements: large camera-first upload zone (PDF/JPG/PNG, 10MB limit stated inline), a document type confirmation (pre-filled from the tapped card), an expiry date field (date picker), primary button "Save Document." State after upload: a small encrypted-storage indicator ("Stored securely, encrypted") so the privacy promise is visible at the point of highest sensitivity.

### 19. Settings
**Prompt:**
Design a simple grouped-list settings screen (not a dashboard, just clean rows), reached via the **Profile tab** in the Global Bottom Navigation (Section 0b) rather than a header icon. Notification Channels (toggles for Push/WhatsApp/SMS/Email, with a note that Emergency/Theft always fire regardless of these toggles), Quiet Hours (time range picker), Emergency Contacts (links to contact management), Language (single dropdown, MVP can be English-only with the control present for future-proofing), Delete Account (bottom of list, visually de-emphasized but not hidden, opens a confirmation flow explaining data export/erasure per the privacy policy).

### 20. Emergency Contacts
**Prompt:**
Design the screen reached from Screen 19 (Settings → Emergency Contacts) and also from the Contacts tab on Screen 14 (Vehicle Detail). List the owner's emergency contacts as simple rows: name, relation, phone number (masked to the last 2 digits, e.g., "+91 98•••••10" — this list is owner-facing but should still model the platform's privacy-first habit), and a "Primary" tag on exactly one contact in road-navy. Each row has edit/delete affordances (swipe-to-delete on mobile or a trailing icon button). A single primary button "Add Emergency Contact" (signal-amber) sits above the list or as a floating action button. Tapping it opens a short form: name, phone number (+91 prefix, same input pattern as Login), relation (simple dropdown: Family, Friend, Other), and a toggle "Make primary" — only one contact can be primary at a time, so switching this toggle on one row should visibly demote the previous primary contact. Empty state (no contacts yet): a calm prompt explaining why this matters — "Add at least one contact so we know who to notify in an emergency" — with the "Add Emergency Contact" button as the sole call to action. Keep the tone reassuring, not alarming, even though the subject is emergencies.

### 21. QR Scanner (In-App Camera — shared by guest mode and logged-in owners)
**Prompt:**
Design the live camera QR-scanning screen. This single screen serves two entry points — a not-logged-in guest scanning someone else's vehicle, and a logged-in owner tapping the Scan button in the Global Bottom Navigation (Section 0b) — the camera UI itself is identical either way; only what happens after a successful scan differs (see Routing, below).

**Layout:** Full-screen live camera feed as the background. A semi-transparent black scrim (roughly 55–65% opacity) covers the whole feed except a square cutout in the center — the scan target — which shows the camera feed at full clarity. The cutout is roughly 70% of screen width, centered slightly above vertical middle (leaves room below for instructions and the manual-entry fallback).

**Scan frame:** four short L-shaped corner brackets, one per corner of the cutout, 3px stroke, in signal-amber. No full square outline — just the four corners, so it reads as a precise "target" rather than a heavy box.

**Scan animation (this is the core of the ask):** a thin horizontal line, signal-amber, with a soft glow/blur beneath it, sweeps continuously from the top edge of the cutout to the bottom edge and back, looping, ease-in-out timing, roughly 2 seconds per pass. This is what communicates "actively scanning" — it should never fully stop while the camera is searching for a code. The line is slightly wider than the cutout with rounded ends, and its glow should subtly tint the camera feed directly beneath it as it passes, like a real laser scanner.

**Success state:** the instant a valid QR is detected, the scan line vanishes and the four corner brackets flash — a quick pulse from signal-amber to verified-green and hold, roughly 300–400ms — while the whole cutout briefly scales up 4–5% and back to normal (a quick, satisfying "snap" rather than a slow zoom). Immediately after, a small centered loading spinner (verified-green) replaces the frame for a brief moment while the vehicle resolves, then the screen transitions (slide-up or cross-fade, ~250ms) into the result.

**Error state (invalid or unrecognized code):** brackets flash alert-red once (same pulse timing as success, but red, and no scale change — errors shouldn't feel satisfying), a small toast slides up from the bottom: "This code isn't a valid RoadLink QR," and the scan line resumes automatically after about a second — no manual dismissal needed, since the person is still holding their phone up trying to scan.

**Chrome (overlaid on the camera feed, not a solid header):** top-left, a close/back icon (X) in a small translucent dark-gray circle for contrast against any background; top-right, a flashlight/torch toggle icon in the same translucent circle style. No page title needed — the scan frame itself communicates the purpose.

**Below the cutout:** one line of instruction text in white with a subtle dark text-shadow for legibility over any camera background: "Align the QR code within the frame." Below that, a secondary, quieter text link: "Enter number manually instead" — leads to Screen 4 (Search Vehicle by Number) for anyone whose sticker is damaged, poorly lit, or otherwise unscannable. This fallback must always be visible, never buried in a menu.

**Permission-denied state:** if camera access hasn't been granted, replace the camera feed with a calm fog-background panel: a simple camera-outline icon, one line explaining why access is needed ("RoadLink needs your camera to scan vehicle QR codes"), a primary "Enable Camera Access" button (road-navy), and the same "Enter number manually instead" link beneath it as a no-camera-needed alternative.

**Routing after a successful scan (behavior, not visual):**
- If the person scanning is a **guest** (no session): route to Screen 1 (Public Scan Landing Page) for the scanned vehicle, exactly as if they'd scanned a physical sticker in a browser.
- If the person scanning is **logged in** and the scanned vehicle is **someone else's**: also route to Screen 1 — an owner scanning a stranger's vehicle should see the same public page a guest would, not special-cased owner chrome.
- If the person scanning is **logged in** and the scanned vehicle is **their own**: skip the public page entirely and route straight to Screen 14 (Vehicle Detail) for that vehicle — there's no reason to show someone the "report a problem with this vehicle" categories for a vehicle they themselves own.

---

## How to use this library
Each numbered prompt is independent — feed them one at a time into your design tool of choice in roughly this order (guest flow first, since that's the trust-critical first impression; owner flow second). Keep the Design DNA block (Section 0) attached to every prompt so type, color, and the plate-tag signature device stay consistent across all 21 screens, since visual consistency across the guest-facing and owner-facing halves of the product is what makes the "Vehicle Verified" trust signal credible.

## First-time navigation flow

**Guest side (no account, no app install assumed) — 5 screens:**
There is no separate "first-time" state here by design — every guest visit is a first visit, since guests never log in or persist a session. The flow is always: **Screen 1 (Scan landing)** or **Screen 4 (Search by number)** → **Screen 5 (Search result)** if searched → **Screen 2 (Report & send)** → **Screen 3 (Confirmation)**. This is intentional: adding an onboarding step here would slow down the one moment (a stranger reporting something about a parked vehicle) where speed matters most.

**Owner side (account-based) — 15 screens, first-time path:**
`Screen 6a → 6b → 6c (Splash/Onboarding, first install only, swiped in sequence)` → `Screen 7 (Login)` → `Screen 8 (OTP)` → `Screen 9 (Add Vehicle)` → `Screen 10 (QR Code Detail)` → `Screen 11 (Order Sticker, optional)` → `Screen 12 (Order Confirmation, optional)` → `Screen 13 (Dashboard Home)`.

From Dashboard Home, the hub opens into: `Screen 14 (Vehicle Detail)` → its Documents tab (`Screen 17` Document Vault → `Screen 18` Document Upload) and Contacts tab (`Screen 20` Emergency Contacts); `Screen 15 (Notifications Inbox)` → `Screen 16 (Notification Detail)`; and `Screen 19 (Settings)` → `Screen 20 (Emergency Contacts)`.

**Returning users** skip Screens 6a–6c entirely (they only fire once, on first install, before any account exists) and skip Screen 9 if they already have a vehicle registered — Login → OTP drops them straight into Dashboard Home.