# Railway Deployment Guide for SoundBridge LMS

## ⚠️ Important Notice

**Manus provides built-in hosting with custom domain support**, which is the recommended deployment option for this application. Using external hosting providers like Railway may result in compatibility issues with:
- Built-in authentication (Manus OAuth)
- File storage (S3 integration)
- LLM services
- Email notifications
- Analytics tracking

If you choose to proceed with Railway deployment anyway, follow the instructions below.

---

## Prerequisites

1. **Railway Account**: Sign up at [railway.app](https://railway.app)
2. **GitHub Repository**: Push your code to a GitHub repository
3. **MySQL Database**: Railway provides MySQL as an add-on service
4. **Environment Variables**: You'll need to configure all required secrets

---

## Step 1: Create a New Railway Project

1. Log in to Railway dashboard
2. Click **"New Project"**
3. Select **"Deploy from GitHub repo"**
4. Authorize Railway to access your GitHub account
5. Select your `soundbridge-lms` repository

---

## Step 2: Add MySQL Database

1. In your Railway project, click **"+ New"**
2. Select **"Database"** → **"Add MySQL"**
3. Railway will automatically provision a MySQL instance
4. Copy the **`DATABASE_URL`** from the MySQL service variables

---

## Step 3: Configure Environment Variables

In your Railway project settings, add the following environment variables:

### Required System Variables

```bash
# Node Environment
NODE_ENV=production

# Database (automatically provided by Railway MySQL service)
DATABASE_URL=mysql://user:password@host:port/database

# JWT Secret (generate a random 32+ character string)
JWT_SECRET=your-super-secret-jwt-key-here-min-32-chars

# Manus OAuth Configuration
OAUTH_SERVER_URL=https://api.manus.im
VITE_OAUTH_PORTAL_URL=https://portal.manus.im
VITE_APP_ID=your-manus-app-id

# Owner Information
OWNER_OPEN_ID=your-owner-open-id
OWNER_NAME=your-owner-name

# Manus Built-in Services
BUILT_IN_FORGE_API_URL=https://forge.manus.im
BUILT_IN_FORGE_API_KEY=your-forge-api-key
VITE_FRONTEND_FORGE_API_URL=https://forge.manus.im
VITE_FRONTEND_FORGE_API_KEY=your-frontend-forge-api-key

# Analytics
VITE_ANALYTICS_ENDPOINT=https://analytics.manus.im
VITE_ANALYTICS_WEBSITE_ID=your-website-id

# Application Branding
VITE_APP_TITLE=SoundBridge Health - Facilitator Training
VITE_APP_LOGO=https://your-logo-url.com/logo.png
```

### How to Generate JWT_SECRET

```bash
# On Linux/Mac
openssl rand -base64 32

# On Windows (PowerShell)
[Convert]::ToBase64String((1..32 | ForEach-Object { Get-Random -Maximum 256 }))

# Using Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

---

## Step 4: Configure Build Settings

Railway should auto-detect your build settings, but verify:

### Build Command
```bash
pnpm install && pnpm build
```

### Start Command
```bash
pnpm start
```

### Root Directory
```
/
```

### Node Version (in package.json)
```json
{
  "engines": {
    "node": ">=18.0.0",
    "pnpm": ">=8.0.0"
  }
}
```

---

## Step 5: Database Migration

After deployment, you need to push the database schema:

### Option A: Using Railway CLI

1. Install Railway CLI:
```bash
npm install -g @railway/cli
```

2. Login and link project:
```bash
railway login
railway link
```

3. Run database migration:
```bash
railway run pnpm db:push
```

### Option B: Using Railway Dashboard

1. Go to your project's MySQL service
2. Click **"Connect"** to get connection details
3. Use a MySQL client (like MySQL Workbench or DBeaver) to connect
4. Run the schema SQL manually (export from Drizzle)

---

## Step 6: Seed Initial Data

After schema is created, seed the initial data:

```bash
# Using Railway CLI
railway run pnpm exec tsx seed-modules.mjs
railway run pnpm exec tsx seed-live-classes.mjs
```

Or create a seed script in `package.json`:

```json
{
  "scripts": {
    "seed": "tsx seed-modules.mjs && tsx seed-live-classes.mjs"
  }
}
```

Then run:
```bash
railway run pnpm seed
```

---

## Step 7: Configure Custom Domain (Optional)

1. In Railway project settings, go to **"Settings"** → **"Domains"**
2. Click **"Generate Domain"** for a free Railway subdomain
3. Or click **"Custom Domain"** to add your own domain
4. Update DNS records as instructed by Railway
5. Wait for SSL certificate provisioning (automatic)

---

## Step 8: Post-Deployment Verification

After deployment, verify these endpoints:

1. **Health Check**: `https://your-app.railway.app/api/health`
2. **OAuth Callback**: `https://your-app.railway.app/api/oauth/callback`
3. **tRPC Endpoint**: `https://your-app.railway.app/api/trpc`
4. **Frontend**: `https://your-app.railway.app/`

---

## Troubleshooting

### Build Failures

**Error: "pnpm: command not found"**
- Railway uses npm by default. Add a `.npmrc` file:
```
package-manager=pnpm@8.15.0
```

**Error: "Module not found"**
- Ensure all dependencies are in `package.json`
- Run `pnpm install` locally to verify

### Database Connection Issues

**Error: "ECONNREFUSED" or "Connection timeout"**
- Verify `DATABASE_URL` is correctly set
- Check MySQL service is running in Railway
- Ensure database name exists

**Error: "Table doesn't exist"**
- Run `pnpm db:push` to create schema
- Check migration logs for errors

### OAuth/Authentication Issues

**Error: "OAuth callback failed"**
- Manus OAuth may not work with external hosting
- You'll need to implement alternative authentication
- Consider using NextAuth.js or Clerk

**Error: "Invalid redirect_uri"**
- Update OAuth callback URL in Manus settings
- Must match your Railway domain exactly

### File Upload Issues

**Error: "S3 upload failed"**
- Manus S3 integration requires Manus hosting
- Alternative: Use Railway's persistent volumes or external S3

### Performance Issues

**Slow response times**
- Check Railway region (select closest to users)
- Upgrade Railway plan for more resources
- Enable Railway's CDN for static assets

---

## Environment-Specific Configuration

### Development
```bash
NODE_ENV=development
DATABASE_URL=mysql://localhost:3306/soundbridge_dev
```

### Staging
```bash
NODE_ENV=staging
DATABASE_URL=mysql://staging-db-url
```

### Production
```bash
NODE_ENV=production
DATABASE_URL=mysql://production-db-url
```

---

## Monitoring and Logs

### View Logs
```bash
# Using Railway CLI
railway logs

# Or in Railway Dashboard
# Go to project → Deployments → Click deployment → View logs
```

### Monitor Performance
- Railway provides built-in metrics dashboard
- Monitor CPU, memory, and network usage
- Set up alerts for downtime or errors

---

## Scaling

### Vertical Scaling
- Upgrade Railway plan for more CPU/RAM
- Go to **Settings** → **Plan** → Select higher tier

### Horizontal Scaling
- Railway supports multiple replicas (Pro plan)
- Go to **Settings** → **Replicas** → Increase count

---

## Backup Strategy

### Database Backups

Railway MySQL doesn't include automatic backups on free tier. Set up manual backups:

```bash
# Export database
railway run mysqldump -u user -p database > backup.sql

# Schedule with cron (on your local machine or CI/CD)
0 2 * * * railway run mysqldump -u user -p database > backup-$(date +\%Y\%m\%d).sql
```

### File Backups
- If using Railway volumes, back up regularly
- Consider external storage (S3, Backblaze B2)

---

## CI/CD Integration

### GitHub Actions Example

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Railway

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Install Railway CLI
        run: npm install -g @railway/cli
      
      - name: Deploy to Railway
        run: railway up
        env:
          RAILWAY_TOKEN: ${{ secrets.RAILWAY_TOKEN }}
```

---

## Cost Estimation

### Railway Pricing (as of 2024)

**Hobby Plan** (Free)
- $5 credit/month
- Shared CPU
- 512MB RAM
- 1GB storage
- Good for testing

**Developer Plan** ($5/month)
- $5 credit + $5 usage
- Shared CPU
- 8GB RAM
- 100GB storage
- Good for small production apps

**Team Plan** ($20/month)
- $20 credit + usage
- Dedicated CPU
- Custom RAM
- Custom storage
- Production-ready

**Estimated Monthly Cost for SoundBridge LMS:**
- Development: Free (Hobby plan)
- Production (10-50 users): $10-20/month
- Production (50-200 users): $20-50/month

---

## Security Best Practices

1. **Never commit secrets** to Git
   - Use `.env` files (already in `.gitignore`)
   - Store secrets in Railway environment variables

2. **Enable HTTPS** (automatic with Railway)

3. **Set secure JWT_SECRET**
   - Minimum 32 characters
   - Use cryptographically random string

4. **Restrict database access**
   - Railway MySQL is private by default
   - Don't expose publicly

5. **Regular updates**
   - Keep dependencies updated: `pnpm update`
   - Monitor security advisories

---

## Alternative: Staying with Manus Hosting

If you encounter issues with Railway, consider using Manus's built-in hosting:

### Advantages
✅ Zero configuration required
✅ All services pre-integrated (OAuth, S3, LLM, email)
✅ Custom domain support included
✅ Automatic SSL certificates
✅ Built-in analytics
✅ No compatibility issues

### How to Deploy on Manus
1. Save a checkpoint in the Manus UI
2. Click **"Publish"** button in Management UI
3. Configure custom domain (optional)
4. Done! Your app is live

---

## Support

For Railway-specific issues:
- Railway Documentation: https://docs.railway.app
- Railway Discord: https://discord.gg/railway
- Railway Support: support@railway.app

For Manus-specific issues:
- Manus Help Center: https://help.manus.im
- Submit feedback/issues through the Manus UI

---

## Quick Reference: Railway CLI Commands

```bash
# Install CLI
npm install -g @railway/cli

# Login
railway login

# Link to project
railway link

# View environment variables
railway variables

# Set environment variable
railway variables set KEY=value

# Run command in Railway environment
railway run <command>

# View logs
railway logs

# Deploy
railway up

# Open project in browser
railway open
```

---

## Checklist Before Going Live

- [ ] All environment variables configured
- [ ] Database schema pushed (`pnpm db:push`)
- [ ] Initial data seeded (modules, live classes)
- [ ] OAuth callback URL updated in Manus settings
- [ ] Custom domain configured (if applicable)
- [ ] SSL certificate active
- [ ] Health check endpoint responding
- [ ] Test user registration and login
- [ ] Test module access and video playback
- [ ] Test assessment submission
- [ ] Test live class registration
- [ ] Test discussion forum
- [ ] Test analytics dashboard
- [ ] Monitor logs for errors
- [ ] Set up database backups
- [ ] Configure monitoring/alerts

---

## Conclusion

While Railway deployment is possible, **Manus hosting is strongly recommended** for this application due to tight integration with Manus services. If you proceed with Railway, expect to implement workarounds for OAuth, file storage, and other Manus-specific features.

For the best experience and zero configuration, use the **Publish** button in the Manus Management UI.
