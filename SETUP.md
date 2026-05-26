# Environment Setup Guide

## Prerequisites

1. **Node.js 18+** - Already installed ✅
2. **pnpm** - Already installed ✅
3. **GitHub Personal Access Token** - Need to create
4. **MongoDB Atlas Account** - Need to create (free tier)

---

## Step 1: GitHub Personal Access Token

1. Go to https://github.com/settings/tokens/new
2. Create a new token with these settings:
   - **Note**: `NITRR OSS Website`
   - **Expiration**: 90 days (or custom)
   - **Scopes**: Select `public_repo` and `read:org`
3. Click "Generate token"
4. Copy the token (you won't see it again!)

---

## Step 2: MongoDB Atlas Setup (Free Tier)

1. Go to https://www.mongodb.com/cloud/atlas/register
2. Create a free account
3. Create a new cluster:
   - Choose **FREE** tier (M0)
   - Select a region close to you
   - Cluster Name: `nitrr-oss-cluster`
4. Create a database user:
   - Database Access → Add New Database User
   - Username: `nitrr-admin`
   - Password: Generate a secure password (save it!)
   - Database User Privileges: `Atlas Admin`
5. Whitelist your IP:
   - Network Access → Add IP Address
   - Click "Allow Access from Anywhere" (0.0.0.0/0) for development
   - (In production, restrict to your server IP)
6. Get connection string:
   - Click "Connect" on your cluster
   - Choose "Connect your application"
   - Copy the connection string
   - Format: `mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/<database>?retryWrites=true&w=majority`

---

## Step 3: Configure Environment Variables

Edit `.env.local` in the project root:

```bash
# MongoDB Configuration
MONGODB_URI=mongodb+srv://nitrr-admin:<YOUR_PASSWORD>@cluster0.xxxxx.mongodb.net/nitrr-oss?retryWrites=true&w=majority

# GitHub Configuration
GITHUB_TOKEN=ghp_your_github_token_here
GITHUB_ORG_NAME=your-actual-org-name

# Site Configuration
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_BASE_URL=http://localhost:3000

# Cache Update Secret (generate with: openssl rand -base64 32)
CACHE_UPDATE_SECRET=your_random_secret_here

# Optional: exclude maintainers from leaderboard (comma-separated GitHub usernames)
MAINTAINER_USERNAMES=maintainer1,maintainer2
```

**Replace:**

- `<YOUR_PASSWORD>` with your MongoDB user password
- `cluster0.xxxxx` with your actual cluster URL
- `ghp_your_github_token_here` with your GitHub token
- `your-actual-org-name` with your GitHub organization name
- `your_random_secret_here` with a random secret (run `openssl rand -base64 32`)

---

## Step 4: Restart Development Server

After updating `.env.local`:

```bash
# Stop the current dev server (Ctrl+C)
pnpm dev
```

---

## Step 5: Test the Setup

1. Open http://localhost:3000
2. You should see:
   - Stats dashboard with real numbers
   - Featured projects from your GitHub org
   - Activity chart with data

---

## Step 6: Enable Scheduled Leaderboard Sync (Optional)

You can run the sync hourly using either GitHub Actions or Vercel Cron.

### Option A: GitHub Actions

Add these repository secrets:

- `CACHE_UPDATE_SECRET` (same value as `.env.local`)
- `LEADERBOARD_SYNC_URL` (e.g., `https://your-domain.com/api/leaderboard/sync`)

The workflow at `.github/workflows/leaderboard-sync.yml` runs hourly.

### Option B: Vercel Cron

If you deploy on Vercel, `vercel.json` already schedules an hourly GET to
`/api/leaderboard/sync`. No extra setup is required beyond your standard
environment variables.

---

## Troubleshooting

### "Failed to fetch projects" error

- Check GitHub token has correct scopes (`public_repo`, `read:org`)
- Verify `GITHUB_ORG_NAME` matches your actual organization name
- Make sure token hasn't expired

### "MongoDB connection failed" error

- Verify connection string is correct
- Check MongoDB user password (no special characters that need escaping)
- Ensure IP whitelist includes your current IP
- Try connection from MongoDB Compass first

### "Cannot find module" errors

- Run `pnpm install` again
- Delete `.next` folder and rebuild: `rm -rf .next && pnpm dev`

---

## Quick Start (Without Setup)

The website will still work without configuration, but:

- Stats will show loading skeletons
- Projects page will be empty
- Leaderboard will be empty

This is fine for UI/frontend development!

---

## Production Deployment (Vercel)

1. Push code to GitHub
2. Import project in Vercel
3. Add environment variables in Vercel dashboard:
   - Same variables as `.env.local`
   - Change `NEXT_PUBLIC_SITE_URL` to your production URL
4. Deploy!

MongoDB Atlas is free up to 512MB storage, perfect for this use case.
