# Production Deployment Guide: AmarBondhon Matrimony

This document describes how to deploy AmarBondhon Matrimony to a production environment with PostgreSQL, secure secrets, object storage, and domain hosting.

---

## 1. Hosting Environment Prerequisites
- **Node.js:** v20.x or v22.x LTS (compatible with v24)
- **Database:** PostgreSQL v14+ (e.g., Supabase, Neon, AWS RDS, DigitalOcean Managed Database)
- **Object Storage (Optional for large media):** AWS S3, Cloudflare R2, or local private filesystem storage

---

## 2. Environment Variables Configuration (`.env.production`)

```env
# Database Connection (PostgreSQL)
DATABASE_URL="postgresql://user:password@db-host:5432/amarbondhon?schema=public&sslmode=require"

# Security & Sessions (generate using `openssl rand -hex 32`)
JWT_SECRET="YOUR_RANDOM_ENTERPRISE_KEY_AT_LEAST_32_CHARACTERS"
NEXTAUTH_SECRET="ANOTHER_RANDOM_LONG_SECRET_KEY"

# Application URL
NEXT_PUBLIC_APP_URL="https://amarbondhon.com"
NEXT_PUBLIC_APP_NAME="AmarBondhon Matrimony"

# WebRTC & Calling Infrastructure (LiveKit Cloud or direct WebRTC)
LIVEKIT_URL="wss://your-project.livekit.cloud"
LIVEKIT_API_KEY="your_api_key"
LIVEKIT_API_SECRET="your_api_secret"

# Storage
STORAGE_PROVIDER="local"
STORAGE_LOCAL_DIR="/var/www/uploads"
```

---

## 3. Switching to Production PostgreSQL
In the repository, the complete PostgreSQL-compliant Prisma schema is provided at `prisma/schema.postgresql.prisma`.

To switch Prisma from SQLite to PostgreSQL:
```bash
cp prisma/schema.postgresql.prisma prisma/schema.prisma
npx prisma generate
npx prisma migrate deploy # or npx prisma db push
node scripts/seed.mjs
```

---

## 4. Production Build & Start
```bash
# 1. Build optimized bundle
npm run build

# 2. Run with production server (or use PM2 / Docker)
npm run start
```

### Running with PM2 (Recommended for VPS / Linux):
```bash
npm install -g pm2
pm2 start npm --name "amarbondhon" -- start
pm2 save
pm2 startup
```

---

## 5. Reverse Proxy Configuration (Nginx)

```nginx
server {
    server_name amarbondhon.com www.amarbondhon.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # Static assets caching
    location /_next/static/ {
        proxy_pass http://localhost:3000;
        proxy_cache_valid 200 365d;
        add_header Cache-Control "public, max-age=31536000, immutable";
    }

    listen 443 ssl http2;
    ssl_certificate /etc/letsencrypt/live/amarbondhon.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/amarbondhon.com/privkey.pem;
}
```
