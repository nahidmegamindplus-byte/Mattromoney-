# AmarBondhon Matrimony (আমারবন্ধন) 💍

An original, production-oriented Bangladeshi matrimonial platform inspired by the core functionalities of contemporary Bangladeshi matrimonial portals (such as Biyeta, Align Matrimony, and BangladeshiMatrimony). Engineered with enterprise security, privacy controls, manual Bangladesh mobile financial service (bKash, Nagad, Rocket) Send Money verification, real-time messaging, WebRTC calling, and comprehensive administrative governance.

---

## 🌟 Brand & Visual Identity
- **Primary Brand Color (Deep Maroon):** `#7A1735`
- **Secondary Surface (Warm Ivory):** `#FFF9F2`
- **Accent Color (Gold):** `#C8A45D`
- **Text & Surface Dark:** `#29252A`
- **Typography:** *Hind Siliguri* (Bangla) & *Inter* (English)
- **Bilingual Interface:** Instant seamless toggle between Bangla (বাংলা) and English.

---

## 🚀 Key Functional Modules

### 1. Registration & Legal Marriage Age Enforcement
- Enforces the **Bangladesh Child Marriage Restraint Act**:
  - Minimum male age: **21 years**
  - Minimum female age: **18 years**
- Guardian / family creation consent tracking.
- Secure bcrypt password hashing and HTTP-only cookie JWT session management.

### 2. Multi-Step Matrimonial Biodata
- Demographics, marital status, height, complexion, blood group.
- Religious practice: prayer regularity, sunnah beard, hijab/niqab, denomination.
- Division, district, upazila (both present and permanent).
- Educational attainment and career (institution, designation, annual income range).
- Family background (parents' profession, sibling count, family status & values).
- Partner expectations and preferences.
- Server-side privacy masking:
  - **Photos:** blurred when marked `ON_REQUEST` or hidden.
  - **Guardian Contact:** strictly masked (`01711******`) unless unlocked via active premium membership entitlement or approved access.

### 3. Matchmaking & Search Engine
- Search by Gender, Age range, Height range, Religion, Marital status, Education level, Occupation, Division, and District.
- **Compatibility Scoring Algorithm:** Dynamically calculates compatibility percentages based on partner preferences vs. applicant biodata.
- **Block & Report Exclusion:** Blocked users are automatically excluded from search results and restricted from sending messages or calls.

### 4. Bangladesh Mobile Financial Services Send Money System (Core)
- **Admin Payment Methods Settings (`/admin/finance/payment-methods`):**
  - Configure receiving accounts for **bKash**, **Nagad**, and **Rocket**.
  - Account types: `PERSONAL`, `PERSONAL_RETAIL`, `MERCHANT`.
  - Bilingual instructions in Bangla and English.
  - Masked account representation in public listings.
- **User Checkout Flow (`/checkout`):**
  - Retrieves authoritative plan prices from database (eliminating client-side price tampering).
  - Generates traceable Order ID (e.g., `AB-ORD-2026-XXXXX`).
  - Provides copy buttons for Receiving Account Number, Exact Amount, and Order Reference.
  - Step-by-step transfer instructions for bKash App/*247#, Nagad, and Rocket.
- **Payment Submission Form:**
  - Submit Sender Mobile Number, Transaction ID (TrxID), and exact amount.
  - Enforces **Global Uniqueness of Transaction IDs** to block duplicate claims.
  - Transitions order to `SUBMITTED_FOR_VERIFICATION`.
- **Finance Admin Manual Verification Queue (`/admin/finance/manual-payments`):**
  - Duplicate-claim and mismatch risk indicators.
  - Atomic database approval activating subscriptions, allocating quotas, creating invoices, and notifying users.
  - Mandatory rejection reason logging.
  - Full append-only audit trail (`AuditLog`).
- **Revenue Integrity (`/admin/finance/reports`):**
  - Strictly reports confirmed revenue from `APPROVED` orders only.
  - Pending submissions are never counted as earned revenue.

### 5. Real-Time Chat & Audio/Video Calling
- Authenticated 1-to-1 chat with unread indicators and read receipts.
- WebRTC Audio and Video calling with STUN configuration (`stun.l.google.com:19302`).
- Call controls: mic mute, camera toggle, duration timer, and connection status.

### 6. Administration & Governance
- Protected `/admin` panel with role-based access (`SUPER_ADMIN`, `FINANCE_ADMIN`, `MODERATOR`).
- Dynamic membership plans management (pricing, search limits, interest quotas, contact unlock quotas).
- User management and account suspension.
- Immutable system audit logs.

---

## 🛠️ Tech Stack & Architecture
- **Framework:** Next.js 15 (App Router) & React 19
- **Language:** TypeScript 5.7
- **Styling:** Tailwind CSS with custom design tokens
- **ORM & Database:** Prisma ORM with SQLite (local development/testing) and PostgreSQL schema ready for production deployment
- **Testing:** Vitest test suite with 21 automated integration tests
- **Icons:** Lucide React

---

## 🧪 Automated Test Suite
To execute all 21 automated tests:
```bash
npm run test
```

Tests cover:
1. Legal marriage eligibility age under Bangladeshi law.
2. User registration and password hashing.
3. Biodata completion percentage and sequential numbering (`AB-YYYY-XXXX`).
4. Server-side privacy masking of guardian phone numbers and photos.
5. Compatibility scoring algorithm.
6. Blocked user exclusion from search results.
7. Interest sending and quota deduction.
8. Authoritative plan price verification during order creation.
9. Underpayment rejection.
10. Send Money claim submission and status transition.
11. Transaction ID uniqueness and duplicate claim blocking.
12. Single atomic payment approval and subscription activation.
13. Prevention of duplicate approvals.
14. Separation of earned revenue from pending claims.
15. Chat messaging and call initiation permissions.

---

## 💻 Local Development Setup

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Database Generation & Seeding:**
   ```bash
   npx prisma generate
   npx prisma db push
   node scripts/seed.mjs
   ```

3. **Run Dev Server:**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🔑 System Administrative Accounts

The platform contains **zero demo or dummy candidate profiles**. Members register their own genuine biodatas. For platform operations and moderation, the following administrative accounts are available:

| Role | Email | Password | Purpose |
|---|---|---|---|
| **Super Admin** | `admin@amarbondhon.com` | `Admin@123456` | Full platform control, audit logs, plan configuration |
| **Finance Admin** | `finance@amarbondhon.com` | `Admin@123456` | bKash/Nagad/Rocket manual payment review queue |
| **Moderator** | `moderator@amarbondhon.com` | `Admin@123456` | Biodata approval, photo moderation, report management |
