# 🚀 Free Deployment Guide

## Quick Setup (5 minutes)

### Step 1: Create GitHub Account (if needed)
1. Go to https://github.com/signup
2. Create a free account

### Step 2: Install Git (if needed)
1. Download from https://git-scm.com/download/win
2. Install with default settings
3. Restart your terminal

### Step 3: Push Code to GitHub

Open PowerShell in the `tattoo_business_site` folder:

```powershell
# Initialize git repository
git init

# Add all files
git add .

# Commit files
git commit -m "Initial commit - Jays Tattoos website"

# Create GitHub repository (you'll do this on GitHub website)
# 1. Go to https://github.com/new
# 2. Name it: jays-tattoos
# 3. Keep it public (required for free tier)
# 4. Don't initialize with README
# 5. Click "Create repository"

# Connect to GitHub (replace YOUR-USERNAME with your GitHub username)
git remote add origin https://github.com/YOUR-USERNAME/jays-tattoos.git

# Push code
git branch -M main
git push -u origin main
```

### Step 4: Deploy Backend (Render - FREE)

1. **Sign up for Render**
   - Go to https://render.com/
   - Click "Get Started for Free"
   - Sign up with GitHub

2. **Create Web Service**
   - Click "New +" → "Web Service"
   - Connect your GitHub repository: `jays-tattoos`
   - Settings:
     - **Name**: jays-tattoos-backend
     - **Root Directory**: `backend`
     - **Environment**: Node
     - **Build Command**: `npm install`
     - **Start Command**: `node server.js`
     - **Plan**: Free

3. **Add Environment Variables**
   Click "Environment" tab and add:
   - `PORT` = 10000 (Render uses this)
   - `ADMIN_USERNAME` = admin
   - `ADMIN_PASSWORD_HASH` = $2a$10$N9qo8uLOickgx2ZMRZoMye3DmJbNZPjyHBmP5nqK6bvLtLEPxDl4G
   - `JWT_SECRET` = jays-tattoos-secret-key-change-this-in-production-2025
   - `TWILIO_ACCOUNT_SID` = (your Twilio SID)
   - `TWILIO_AUTH_TOKEN` = (your Twilio token)
   - `TWILIO_PHONE_NUMBER` = (your Twilio number)
   - `ARTIST_PHONE_NUMBER` = +15134413711

4. **Deploy**
   - Click "Create Web Service"
   - Wait 2-3 minutes for deployment
   - **Copy your backend URL** (like: https://jays-tattoos-backend.onrender.com)

### Step 5: Update Frontend with Backend URL

1. Open `admin.html`
2. Find line ~276:
   ```javascript
   const API_URL = window.location.hostname === 'localhost' 
       ? 'http://localhost:3000' 
       : 'https://your-backend-url.onrender.com';
   ```
3. Replace `https://your-backend-url.onrender.com` with your actual Render URL
4. Save the file

5. Push the update:
   ```powershell
   git add admin.html
   git commit -m "Update backend URL"
   git push
   ```

### Step 6: Deploy Frontend (Netlify - FREE)

1. **Sign up for Netlify**
   - Go to https://netlify.com/
   - Click "Sign up"
   - Sign up with GitHub

2. **Create New Site**
   - Click "Add new site" → "Import an existing project"
   - Choose "Deploy with GitHub"
   - Select your repository: `jays-tattoos`
   - Settings:
     - **Base directory**: (leave empty - root)
     - **Build command**: (leave empty)
     - **Publish directory**: `.` (current directory)
   - Click "Deploy site"

3. **Get Your Live URL**
   - Wait 1 minute for deployment
   - You'll get a URL like: `https://random-name-123.netlify.app`
   - Click "Site settings" → "Change site name" to customize it
   - Example: `jays-tattoos.netlify.app`

### Step 7: Update CORS in Backend

1. Open `backend/server.js`
2. Find the CORS configuration (around line 40):
   ```javascript
   app.use(cors());
   ```
3. Update it to:
   ```javascript
   app.use(cors({
     origin: [
       'http://localhost:8000',
       'https://jays-tattoos.netlify.app', // Your Netlify URL
       'https://your-custom-domain.com'    // If you add a custom domain
     ],
     credentials: true
   }));
   ```
4. Commit and push:
   ```powershell
   git add backend/server.js
   git commit -m "Update CORS for production"
   git push
   ```
5. Render will auto-deploy the update (takes 1-2 minutes)

## 🎉 You're Live!

**Your Website**: https://jays-tattoos.netlify.app  
**Admin Panel**: https://jays-tattoos.netlify.app/admin.html  
**Backend API**: https://jays-tattoos-backend.onrender.com

**Login:**
- Username: `admin`
- Password: `password`

## ⚠️ Important Notes

### Free Tier Limitations:
- **Render**: Backend sleeps after 15 min of inactivity (takes 30s to wake up on first request)
- **Netlify**: 100GB bandwidth/month (plenty for a tattoo site)
- **File uploads**: Stored temporarily (Render resets every ~7 days)

### For Production Use:
1. **Change admin password** after first login
2. **Use cloud storage** for images (AWS S3, Cloudinary)
3. **Add custom domain** (both Render and Netlify support this free)
4. **Enable HTTPS** (automatic on both platforms)

## 📸 Upload Storage Issue Fix

Free Render resets files. To fix this, integrate **Cloudinary** (free tier):

1. Sign up at https://cloudinary.com/
2. Get your API credentials
3. Install cloudinary: `npm install cloudinary`
4. Update server.js to use Cloudinary instead of local storage

Want me to add Cloudinary integration? Just ask!

## 🔧 Troubleshooting

**Backend not responding:**
- Check Render logs for errors
- Verify environment variables are set
- Free tier sleeps - first request takes 30s

**CORS errors:**
- Update CORS origins in server.js
- Make sure your Netlify URL is added

**Images not uploading:**
- Check file size (max 5MB)
- Verify file type (JPEG, PNG, GIF, WebP)
- Look at Render logs for specific errors

**Can't login:**
- Verify backend is running (visit https://your-backend.onrender.com/health)
- Check browser console for errors
- Confirm admin credentials in Render environment variables

## 💰 Cost
**$0/month** - Everything is free!

## 🌐 Custom Domain (Optional)

Buy a domain from:
- Namecheap (~$10/year)
- Google Domains (~$12/year)
- Porkbun (~$8/year)

Then connect it:
- **Netlify**: Site settings → Domain management → Add custom domain
- **Render**: Settings → Custom domains → Add domain

Both platforms handle SSL certificates automatically!
