# ⚡ AmarBondhon Matrimony - Supabase Database Setup Guide (আমারবন্ধন)

This guide walks you through connecting **AmarBondhon Matrimony** to **Supabase** (Managed PostgreSQL Cloud Database).

---

## 1. Create a Supabase Project

1. Go to [supabase.com](https://supabase.com) and sign in or create a free account.
2. Click **New Project**.
3. Choose an organization, enter a **Project Name** (e.g. `amarbondhon-matrimony`), set a strong **Database Password** (save this password!), and select a region close to your users (e.g., Singapore `ap-southeast-1` or India `ap-south-1`).
4. Click **Create new project** and wait 1-2 minutes for the database to provision.

---

## 2. Get Your Connection URLs & API Keys

### A. Database Connection Strings (Prisma ORM)
1. In your Supabase project dashboard, navigate to **Project Settings** (gear icon) -> **Database**.
2. Scroll to **Connection string**:
   - Select **URI** tab.
   - For **Transaction Pooler** (recommended for production queries, Port `6543`):
     ```
     postgresql://postgres.[YOUR-PROJECT-REF]:[YOUR-PASSWORD]@aws-0-[REGION].pooler.supabase.com:6543/postgres?pgbouncer=true
     ```
     Copy this as your `DATABASE_URL`.
   - For **Direct Connection** (Session mode, Port `5432`):
     ```
     postgresql://postgres:[YOUR-PASSWORD]@db.[YOUR-PROJECT-REF].supabase.co:5432/postgres
     ```
     Copy this as your `DIRECT_URL`.

### B. Project API Keys (Client & Server SDK)
1. In your Supabase dashboard, navigate to **Project Settings** -> **API**.
2. Copy:
   - **Project URL** -> `NEXT_PUBLIC_SUPABASE_URL`
   - **anon / public key** -> `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - **service_role key** (secret) -> `SUPABASE_SERVICE_ROLE_KEY`

---

## 3. Update Your `.env` File

Open `.env` in the root folder of this project and paste your Supabase credentials:

```env
# Supabase PostgreSQL Database (Prisma)
DATABASE_URL="postgresql://postgres.[YOUR-PROJECT-REF]:[YOUR-PASSWORD]@aws-0-[REGION].pooler.supabase.com:6543/postgres?pgbouncer=true"
DIRECT_URL="postgresql://postgres:[YOUR-PASSWORD]@db.[YOUR-PROJECT-REF].supabase.co:5432/postgres"

# Supabase API & Cloud Storage
NEXT_PUBLIC_SUPABASE_URL="https://[YOUR-PROJECT-REF].supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
SUPABASE_SERVICE_ROLE_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

*(Note: Replace `[YOUR-PASSWORD]`, `[YOUR-PROJECT-REF]`, and `[REGION]` with your actual Supabase project values).*

---

## 4. Push Schema & Tables to Supabase

Once you have updated the `.env` file with your Supabase credentials, push all tables, relations, and indexes directly to Supabase using:

```bash
npm run supabase:push
```
*(Or manually: `npx prisma db push --schema=prisma/schema.supabase.prisma`)*

This creates all production tables in your Supabase PostgreSQL database:
- `User` (Authentication, roles, verification)
- `Biodata` (Demographics, education, religious practices, family info)
- `MembershipPlan` (FREE, SILVER, GOLD, PLATINUM)
- `PaymentMethodConfig` (bKash, Nagad, Rocket settings)
- `Order` & `PaymentSubmission` (Send Money verification workflow)
- `Interest`, `Shortlist`, `BiodataAccessRequest`
- `Conversation`, `Message`, `CallSession` (WebRTC)
- `AuditLog`, `CmsContent`, `SupportTicket`

---

## 5. Seed Official System Configs (Zero Demo Profiles)

Seed official membership packages, bKash/Nagad/Rocket instructions, CMS guidelines, and admin accounts into your Supabase database:

```bash
npm run supabase:seed
```

This sets up:
- 4 official membership plans (`FREE`, `SILVER`, `GOLD`, `PLATINUM`)
- Configured bKash, Nagad, and Rocket Send Money guides
- Platform safety and Shariah guidelines
- Platform administration accounts:
  - `admin@amarbondhon.com` (`Admin@123456`)
  - `finance@amarbondhon.com` (`Admin@123456`)
  - `moderator@amarbondhon.com` (`Admin@123456`)
- **Zero demo candidate profiles** (clean start for real users).

---

## 6. Supabase Storage (Optional - for Photos & Documents)

To store uploaded profile photos and National ID documents in Supabase Storage:
1. In the Supabase Dashboard, go to **Storage**.
2. Click **Create new bucket**:
   - Bucket name: `biodata-photos` (Public bucket: ON)
   - Bucket name: `verification-docs` (Public bucket: OFF, restricted for administrative review)
3. The platform's `src/lib/supabase.ts` is pre-configured to interact with Supabase Storage.
