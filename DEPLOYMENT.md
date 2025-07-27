# 🚀 Deployment Guide

This guide covers deploying the Robinhood Portfolio Analyzer to production using **Render** (Python backend) and **Vercel** (frontend).

## 📋 Prerequisites

- GitHub account with repository access
- Render account (free tier available)
- Vercel account (free tier available)
- Domain name (optional, for custom domains)

## 🐍 Python Backend Deployment (Render)

### Step 1: Prepare Render Account

1. **Sign up** at [render.com](https://render.com)
2. **Connect** your GitHub account
3. **Select** the IPT repository

### Step 2: Deploy to Render

1. **Create New Web Service**
   - Go to Render Dashboard
   - Click "New +" → "Web Service"
   - Connect your GitHub repository
   - **Select branch**: `deploy-python-render`

2. **Configure Service Settings**
   ```
   Name: robinhood-portfolio-analyzer
   Environment: Python 3
   Branch: deploy-python-render
   Build Command: pip install -r requirements.txt
   Start Command: streamlit run app.py --server.port $PORT --server.address 0.0.0.0 --server.headless true --server.enableCORS false --server.enableXsrfProtection false
   ```

3. **Set Environment Variables** (in Render Dashboard)
   ```bash
   # Required Environment Variables
   PYTHON_VERSION=3.11.4
   RENDER=true
   STREAMLIT_SERVER_HEADLESS=true
   STREAMLIT_BROWSER_GATHER_USAGE_STATS=false
   
   # Optional: Custom configuration
   STREAMLIT_SERVER_PORT=10000
   STREAMLIT_SERVER_ADDRESS=0.0.0.0
   ```

### Step 3: Deploy and Monitor

1. **Deploy**: Click "Create Web Service"
2. **Monitor**: Watch build logs in Render dashboard
3. **Test**: Access your app at `https://your-app-name.onrender.com`

### ⚠️ Important Notes for Render

- **Free tier limitations**: 
  - Service spins down after 15 minutes of inactivity
  - Cold starts may take 30-60 seconds
  - 512MB RAM limit
- **Custom domain**: Available on paid plans
- **SSL**: Automatically provided
- **Logs**: Available in dashboard for debugging

---

## 🌐 Frontend Deployment (Vercel)

### Step 1: Prepare Vercel Account

1. **Sign up** at [vercel.com](https://vercel.com)
2. **Connect** your GitHub account
3. **Import** the IPT repository

### Step 2: Deploy to Vercel

1. **Import Project**
   - Go to Vercel Dashboard
   - Click "New Project"
   - Import your GitHub repository
   - **Select branch**: `deploy-frontend-vercel`
   - **Root Directory**: `frontend`

2. **Configure Build Settings**
   ```
   Framework Preset: Next.js
   Build Command: npm run build
   Output Directory: .next
   Install Command: npm install
   Development Command: npm run dev
   ```

3. **Set Environment Variables** (in Vercel Dashboard)
   ```bash
   # Required Environment Variables
   NEXT_PUBLIC_API_URL=https://your-render-app.onrender.com
   NEXT_PUBLIC_APP_ENV=production
   NEXT_TELEMETRY_DISABLED=1
   ```

### Step 3: Configure Domain and Deploy

1. **Deploy**: Click "Deploy"
2. **Custom Domain** (optional):
   - Go to Project Settings → Domains
   - Add your custom domain
   - Configure DNS as instructed
3. **Test**: Access your frontend at `https://your-app.vercel.app`

### ⚠️ Important Notes for Vercel

- **Free tier limitations**:
  - 100GB bandwidth per month
  - 6,000 build minutes per month
  - Function timeout: 10 seconds
- **Automatic deployments**: Triggered on git push
- **Preview deployments**: Created for PRs
- **Analytics**: Available in dashboard

---

## 🔧 Environment Variables Reference

### Render (Python Backend)

| Variable | Value | Description |
|----------|-------|-------------|
| `PYTHON_VERSION` | `3.11.4` | Python version for deployment |
| `RENDER` | `true` | Indicates running on Render |
| `STREAMLIT_SERVER_HEADLESS` | `true` | Run Streamlit in headless mode |
| `STREAMLIT_BROWSER_GATHER_USAGE_STATS` | `false` | Disable telemetry |
| `STREAMLIT_SERVER_PORT` | `10000` | Port for Streamlit server |
| `STREAMLIT_SERVER_ADDRESS` | `0.0.0.0` | Bind to all interfaces |

### Vercel (Frontend)

| Variable | Value | Description |
|----------|-------|-------------|
| `NEXT_PUBLIC_API_URL` | `https://your-render-app.onrender.com` | Backend API URL |
| `NEXT_PUBLIC_APP_ENV` | `production` | Environment indicator |
| `NEXT_TELEMETRY_DISABLED` | `1` | Disable Next.js telemetry |

---

## 🔄 Deployment Workflow

### Automated Deployment Process

1. **Code changes** pushed to deployment branches
2. **Render** automatically redeploys backend from `deploy-python-render` branch
3. **Vercel** automatically redeploys frontend from `deploy-frontend-vercel` branch
4. **Environment variables** are applied from platform dashboards

### Manual Deployment Triggers

**Render:**
```bash
# Trigger manual deployment
git push origin deploy-python-render
```

**Vercel:**
```bash
# Trigger manual deployment
git push origin deploy-frontend-vercel
```

---

## 🐛 Troubleshooting

### Common Render Issues

**Build fails with dependency errors:**
```bash
# Check requirements.txt has correct versions
# View build logs in Render dashboard
# Ensure Python version matches requirements
```

**App doesn't start:**
```bash
# Check start command is correct
# Verify environment variables are set
# Review application logs
```

**Streamlit not accessible:**
```bash
# Ensure port is set to $PORT
# Check CORS settings are disabled
# Verify headless mode is enabled
```

### Common Vercel Issues

**Build fails:**
```bash
# Check package.json dependencies
# Verify Node.js version compatibility
# Review build logs in Vercel dashboard
```

**API calls fail:**
```bash
# Verify NEXT_PUBLIC_API_URL is correct
# Check Render backend is running
# Ensure CORS is properly configured
```

**Environment variables not working:**
```bash
# Ensure variables start with NEXT_PUBLIC_ for client-side
# Redeploy after adding new variables
# Check variable names match exactly
```

---

## 📊 Monitoring and Analytics

### Render Monitoring

- **Application logs**: Available in dashboard
- **Metrics**: CPU, memory usage
- **Health checks**: Automatic endpoint monitoring
- **Alerts**: Email notifications for downtime

### Vercel Analytics

- **Web Analytics**: Page views, performance
- **Function logs**: Serverless function execution
- **Build analytics**: Build times and success rates
- **Core Web Vitals**: Performance metrics

---

## 🔒 Security Considerations

### Production Security Checklist

- [ ] **Environment variables**: Never commit secrets to git
- [ ] **HTTPS**: Enabled by default on both platforms
- [ ] **CORS**: Properly configured for API access
- [ ] **Headers**: Security headers configured in Next.js
- [ ] **Authentication**: Session-based, no persistent storage
- [ ] **API endpoints**: Protected and validated
- [ ] **Dependencies**: Regularly updated and scanned

### Robinhood API Security

- [ ] **Credentials**: Never stored or logged
- [ ] **Session management**: Proper cleanup implemented
- [ ] **MFA support**: Two-factor authentication enabled
- [ ] **Rate limiting**: Respectful API usage
- [ ] **Error handling**: No credential exposure in errors

---

## 💰 Cost Estimation

### Free Tier Usage

**Render (Free)**
- ✅ 512MB RAM
- ✅ Shared CPU
- ✅ 15-minute idle timeout
- ✅ 500 build minutes/month

**Vercel (Free)**
- ✅ 100GB bandwidth
- ✅ 6,000 build minutes
- ✅ Unlimited deployments
- ✅ 10-second function timeout

### Upgrade Considerations

**When to upgrade Render:**
- Need faster response times
- Require always-on service
- Need more memory/CPU
- Want custom domains

**When to upgrade Vercel:**
- Exceed bandwidth limits
- Need longer function timeouts
- Want advanced analytics
- Require team collaboration

---

## 🚀 Next Steps After Deployment

1. **Test thoroughly**: Verify all features work in production
2. **Monitor performance**: Watch for any performance issues
3. **Set up monitoring**: Configure alerts for downtime
4. **Custom domains**: Add your own domain names
5. **SSL certificates**: Verify HTTPS is working
6. **Backup strategy**: Consider data backup needs
7. **Documentation**: Update any user-facing documentation

---

## 📞 Support Resources

- **Render Support**: [render.com/docs](https://render.com/docs)
- **Vercel Support**: [vercel.com/docs](https://vercel.com/docs)
- **Streamlit Docs**: [docs.streamlit.io](https://docs.streamlit.io)
- **Next.js Docs**: [nextjs.org/docs](https://nextjs.org/docs)

Remember to always test your deployment thoroughly before sharing with users!