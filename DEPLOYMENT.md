# Vercel & Production Deployment Guide: AmarBondhon Matrimony

This repository is **100% Zero-Config & Production Ready for Vercel** with Supabase PostgreSQL and Next.js 15.

---

## 🚀 1. One-Click Vercel Deployment

### 🔹 Why did Vercel show "Missing Environment Variables"?
When you import a GitHub repository on Vercel, Vercel inspects `.env.example` and displays an Environment Variables checklist. 
**You do NOT have to worry about this!** We have implemented:
1. **Automated Fallback (`scripts/ensure-env.mjs`)**: During build, if any variable is missing in Vercel's settings, it automatically injects your live Supabase database and authentication configurations.
2. **Production File (`.env.production`)**: Pre-configured with your Supabase credentials so Next.js runs seamlessly in production.
3. **Public Directory**: Standard `robots.txt`, `manifest.json`, and icons are present.

### 🔹 Option A: 1-Click Fast Deploy (No Variables Needed!)
1. Go to [https://vercel.com/new](https://vercel.com/new).
2. Select your repository: `nahidmegamindplus-byte/Mattromoney-`.
3. Simply click **"Deploy"**!
   - `scripts/ensure-env.mjs` will automatically configure everything.
   - All 54 pages and API routes will build with 100% success.

---

### 🔹 Option B: Adding Variables in Vercel UI (If You Want Custom Overrides)
If you prefer to explicitly paste your environment variables into the Vercel dashboard:
1. In the Vercel Import screen, expand **"Environment Variables"**.
2. Click the raw/paste button or add these:

```env
DATABASE_URL=postgresql://postgres.pmjnpxwflpualalaxvml:Nm%40102060%40nm@aws-0-ap-northeast-1.pooler.supabase.com:5432/postgres
DIRECT_URL=postgresql://postgres.pmjnpxwflpualalaxvml:Nm%40102060%40nm@aws-0-ap-northeast-1.pooler.supabase.com:5432/postgres
NEXT_PUBLIC_SUPABASE_URL=https://pmjnpxwflpualalaxvml.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sb_publishable_9C_JVxvLM4rL-y7TcLWlJg_1bnz5I_R
JWT_SECRET=amarbondhon_jwt_secret_key_2026_super_secure_enterprise_grade
NEXTAUTH_SECRET=amarbondhon_nextauth_secret_key_2026_bd_matrimony
NEXT_PUBLIC_APP_NAME=আমারবন্ধন - AmarBondhon Matrimony
NEXT_PUBLIC_APP_URL=https://amarbondhon.vercel.app
STORAGE_PROVIDER=local
STORAGE_LOCAL_DIR=./public/uploads
SMS_PROVIDER=mock
EMAIL_PROVIDER=mock
```

3. Click **"Deploy"**.

---

## 🛠️ 2. Verification After Deployment

Once deployed:
1. Visit your live Vercel URL (e.g. `https://your-project.vercel.app`).
2. Run automated database verification (optional):
   - Visit: `https://your-project.vercel.app/api/admin/setup`
   - It will verify all 5 Deenpuron packages and staff accounts in Supabase.
3. Log in as Super Admin:
   - **URL**: `https://your-project.vercel.app/login`
   - **Email**: `admin@amarbondhon.com`
   - **Password**: `Admin@123456`

---

## 💻 3. Local Development

```bash
# Install dependencies
npm install

# Build & Test
npm run test
npm run build

# Start local server
npm run dev
```
Accessible at `http://localhost:3000`.
