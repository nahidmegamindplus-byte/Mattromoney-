# Vercel & Production Deployment Guide: AmarBondhon Matrimony

This repository is **100% optimized and ready for one-click deployment on Vercel** with Supabase PostgreSQL and Next.js 15.

---

## 🚀 1. One-Click Vercel Deployment Steps

1. **Go to Vercel**: Visit [https://vercel.com/new](https://vercel.com/new) and log in.
2. **Import Repository**: Select your GitHub repository:
   `nahidmegamindplus-byte/Mattromoney-`
3. **Framework Preset**: Vercel will automatically detect **Next.js** (also configured in `vercel.json`).
4. **Build & Development Settings**:
   - Build Command: `prisma generate && next build` (automated by `vercel.json` and `package.json`)
   - Output Directory: `.next`
   - Install Command: `npm install`
5. **Environment Variables**: Add the following environment variables in the Vercel project settings:

| Variable Name | Description | Example / Live Value |
| :--- | :--- | :--- |
| `DATABASE_URL` | Supabase Session / Pooler Connection string (Port 5432) | `postgresql://postgres.pmjnpxwflpualalaxvml:Nm%40102060%40nm@aws-0-ap-northeast-1.pooler.supabase.com:5432/postgres` |
| `DIRECT_URL` | Direct connection for Prisma migrations (Port 5432) | `postgresql://postgres.pmjnpxwflpualalaxvml:Nm%40102060%40nm@aws-0-ap-northeast-1.pooler.supabase.com:5432/postgres` |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase Cloud project URL | `https://pmjnpxwflpualalaxvml.supabase.co` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase Publishable / Anon API key | `sb_publishable_9C_JVxvLM4rL-y7TcLWlJg_1bnz5I_R` |
| `JWT_SECRET` | Secret key for signing session tokens | `your-secure-jwt-secret-key-32-chars-long` |
| `NEXT_PUBLIC_APP_URL` | Your live deployment URL (or leave blank for Vercel auto-domain) | `https://your-app.vercel.app` |
| `NEXT_PUBLIC_APP_NAME` | Website Name | `আমারবন্ধন - AmarBondhon Matrimony` |

6. **Click "Deploy"**: Vercel will run `prisma generate && next build`, create the serverless Lambdas and static assets, and give you your live URL!

---

## 🛠️ 2. Why this repository is 100% Vercel-ready

- **Automated Prisma Generation**: `postinstall: "prisma generate"` and `vercel.json` ensure that the Prisma client binary is always generated inside Vercel's Amazon Linux runtime (`rhel-openssl-3.0.x`).
- **Multi-target Binary Engines**: `prisma/schema.prisma` includes `binaryTargets = ["native", "rhel-openssl-1.0.x", "rhel-openssl-3.0.x", "debian-openssl-3.0.x"]`.
- **Zero Build-Time Failures**: Homepage and Pricing static/ISR pages wrap database queries with safe fallbacks so `next build` never fails even if database connection is cold during initial deployment.
- **Supabase Storage Image Patterns**: `next.config.mjs` includes `**.supabase.co` in `images.remotePatterns` for optimized image delivery.
- **Clean Git Tracking**: `.env` and `node_modules` are safely excluded via `.gitignore`.

---

## 💻 3. Local Development

```bash
# Install dependencies
npm install

# Run database generation
npm run prisma:generate

# Start development server
npm run dev
```
Accessible at `http://localhost:3000`.
