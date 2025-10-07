# Railway Deployment Guide

## 🚀 Quick Deploy to Railway

### 1. Prerequisites
- Railway account: [railway.app](https://railway.app)
- Railway CLI: `npm install -g @railway/cli`
- OpenAI API key: [platform.openai.com](https://platform.openai.com)

### 2. Environment Variables

Copy these environment variables to your Railway project:

#### **Required Variables**

```bash
# Database (automatically provided by Railway PostgreSQL)
DATABASE_URL="postgresql://username:password@host:port/database"

# Authentication
NEXTAUTH_SECRET="your-nextauth-secret-here"
NEXTAUTH_URL="https://your-railway-app.railway.app"

# AI Integration
OPENAI_API_KEY="sk-your-openai-api-key"
```

#### **Optional Variables**

```bash
# Development/Debug
NODE_ENV="production"
NEXT_PUBLIC_APP_URL="https://your-railway-app.railway.app"

# AI Configuration
OPENAI_MODEL="gpt-4"
OPENAI_MAX_TOKENS="2000"

# Rate Limiting
MONTHLY_QUIZ_LIMIT="50"
MONTHLY_WIMTS_LIMIT="100"

# Feature Flags
ENABLE_ANALYTICS="true"
ENABLE_SHARING="true"
```

### 3. Deployment Steps

#### Option A: Automatic Script
```bash
# Run the deployment script
./scripts/railway-deploy.sh
```

#### Option B: Manual Deployment

1. **Install Railway CLI**
   ```bash
   npm install -g @railway/cli
   railway login
   ```

2. **Create New Project**
   ```bash
   railway new
   # Choose: "Deploy from GitHub repo"
   # Select: jonathanbodnar/translateme
   ```

3. **Add PostgreSQL Database**
   ```bash
   railway add --database postgresql
   ```

4. **Set Environment Variables**
   - Go to Railway dashboard
   - Navigate to your project
   - Go to Variables tab
   - Add all required variables listed above

5. **Configure Build Settings (Important!)**
   - In Railway dashboard, go to Settings
   - Set Build Command: `npm run build`
   - Set Start Command: `npm start`
   - Or use the custom build script: `./scripts/railway-build.sh`

6. **Deploy**
   ```bash
   railway up
   ```

### 4. Post-Deployment Setup

#### Initialize Database
```bash
# Connect to your Railway project
railway link

# Run database migrations
railway run npm run db:push

# Seed initial data
railway run npm run db:seed
```

#### Verify Deployment
1. Check Railway dashboard for deployment status
2. Visit your app URL
3. Test key features:
   - Home page loads
   - Quiz interface works
   - WIMTS functionality
   - Admin dashboard (if needed)

### 5. Environment Variable Details

#### **DATABASE_URL**
- **Source**: Automatically provided by Railway PostgreSQL
- **Format**: `postgresql://user:pass@host:port/db`
- **Usage**: Prisma database connection

#### **NEXTAUTH_SECRET**
- **Generate**: `openssl rand -base64 32`
- **Purpose**: JWT token signing
- **Security**: Keep this secret and unique

#### **NEXTAUTH_URL**
- **Format**: `https://your-app-name.railway.app`
- **Purpose**: OAuth callback URL
- **Note**: Update after deployment

#### **OPENAI_API_KEY**
- **Source**: [OpenAI Platform](https://platform.openai.com/api-keys)
- **Format**: `sk-...`
- **Usage**: AI question generation, WIMTS suggestions, insights

### 6. Custom Domain (Optional)

1. **Add Domain in Railway**
   - Go to Settings → Domains
   - Add your custom domain
   - Configure DNS records

2. **Update Environment Variables**
   ```bash
   NEXTAUTH_URL="https://yourdomain.com"
   NEXT_PUBLIC_APP_URL="https://yourdomain.com"
   ```

### 7. Monitoring & Logs

#### View Logs
```bash
railway logs
```

#### Monitor Performance
- Railway dashboard provides metrics
- Check database connection status
- Monitor API usage (OpenAI)

### 8. Scaling & Optimization

#### Database Optimization
- Monitor query performance
- Add indexes for frequently queried fields
- Consider connection pooling for high traffic

#### AI Usage Optimization
- Implement caching for repeated queries
- Set usage limits per user
- Monitor OpenAI API costs

### 9. Troubleshooting

#### Common Issues

**Build Failures**
- Check Node.js version compatibility
- Verify all dependencies are installed
- Review build logs in Railway dashboard

**Prisma Generation Issues**
- Ensure `prisma/schema.prisma` exists in repository
- Check that build command includes `prisma generate`
- Verify DATABASE_URL is set (even for build step)
- Try using custom build script: `./scripts/railway-build.sh`

**Database Connection Issues**
- Verify DATABASE_URL is set correctly
- Check Prisma schema matches database
- Run `railway run npx prisma db push`

**AI Integration Issues**
- Verify OPENAI_API_KEY is valid
- Check API usage limits
- Review OpenAI API status

**Authentication Issues**
- Verify NEXTAUTH_SECRET is set
- Update NEXTAUTH_URL with correct domain
- Check callback URL configuration

### 10. Production Checklist

- [ ] All environment variables set
- [ ] Database migrated and seeded
- [ ] SSL certificate active
- [ ] Domain configured (if custom)
- [ ] Error monitoring setup
- [ ] Backup strategy in place
- [ ] API rate limits configured
- [ ] Security headers enabled

## 🔗 Useful Links

- [Railway Documentation](https://docs.railway.app)
- [Next.js Deployment](https://nextjs.org/docs/deployment)
- [Prisma Railway Guide](https://www.prisma.io/docs/guides/deployment/deployment-guides/deploying-to-railway)
- [OpenAI API Documentation](https://platform.openai.com/docs)

## 🆘 Support

If you encounter issues:
1. Check Railway logs: `railway logs`
2. Review this deployment guide
3. Check GitHub Issues
4. Railway Discord community
