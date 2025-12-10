# Firebase Deployment Guide for DEADDAY

## 🎯 Goal
Host your game on Firebase with:
- **Free domain**: https://your-project.web.app
- **Free SSL**: Automatic HTTPS
- **Auto-deploy**: Push to GitHub → Automatically updates live site
- **Free bandwidth**: 10GB/month (plenty for this game)

---

## ✅ Step 1: Install Node.js (If Not Already Installed)

1. Go to https://nodejs.org/
2. Download **LTS version** (Long Term Support)
3. Run installer with default settings
4. **Restart VS Code** after installation

**Verify:**
```bash
node --version
npm --version
```

Should show versions like `v20.x.x` and `10.x.x`.

---

## ✅ Step 2: Install Firebase CLI

Open terminal in VS Code (Ctrl + `) and run:

```bash
npm install -g firebase-tools
```

Wait for installation to complete (~1-2 minutes).

**Verify:**
```bash
firebase --version
```

Should show version like `13.x.x`.

---

## ✅ Step 3: Login to Firebase

```bash
firebase login
```

This will:
1. Open your web browser
2. Ask you to sign in with Google
3. Request permission to access Firebase

**Click "Allow"** when prompted.

You should see: `✔  Success! Logged in as your-email@gmail.com`

---

## ✅ Step 4: Create Firebase Project

### Option A: Use Existing Firebase Project (If You Have One)

If you already created a project in the Firebase Console:
```bash
firebase projects:list
```

Note the **Project ID** (not the display name).

### Option B: Create New Project via Console

1. Go to https://console.firebase.google.com/
2. Click "Add project"
3. Enter project name: **deadday-game** (or your choice)
4. Disable Google Analytics (not needed for hosting)
5. Click "Create project"
6. **Copy the Project ID** (shown after creation)

---

## ✅ Step 5: Initialize Firebase in Your Project

**IMPORTANT:** Make sure you're in the DEADDAY folder:

```bash
cd "c:\Users\shady\OneDrive\Documents\phaser\DEADDAY"
```

Then run:

```bash
firebase init hosting
```

### Answer the Questions:

**1. "Select a default Firebase project for this directory"**
- Choose: **Use an existing project**
- Select: **deadday-game** (or whatever you named it)

**2. "What do you want to use as your public directory?"**
- Type: `.` (just a dot)
- **Why**: Your index.html is in the root folder, so serve everything from here

**3. "Configure as a single-page app (rewrite all urls to /index.html)?"**
- Type: `Yes`
- **Why**: Ensures game doesn't break on page refresh

**4. "Set up automatic builds and deploys with GitHub?"**
- Type: `Yes` ⚠️ **CRITICAL STEP**
- This creates the auto-deploy workflow

**5. "For which GitHub repository would you like to set up a GitHub workflow?"**
- If you already have a GitHub repo, enter: `your-username/deadday`
- If not, we'll set this up next

**6. "Set up the workflow to run a build script before every deploy?"**
- Type: `No`
- **Why**: Your game doesn't need a build step (it's already static files)

**7. "Set up automatic deployment to your site's live channel when a PR is merged?"**
- Type: `Yes`
- **Why**: Auto-deploy when you push to main branch

**8. "File index.html already exists. Overwrite?"**
- Type: `No` ⚠️ **IMPORTANT**
- **Why**: Don't delete your game's HTML!

---

## ✅ Step 6: Create GitHub Repository (If You Don't Have One)

### Initialize Git in Your Project:

```bash
git init
git add .
git commit -m "Initial commit - DEADDAY game"
```

### Create GitHub Repo:

1. Go to https://github.com/new
2. Repository name: **deadday**
3. Keep it **Public** (required for free hosting)
4. **Do NOT** initialize with README (your project already has files)
5. Click "Create repository"

### Connect Your Local Project to GitHub:

Copy the commands GitHub shows you (they'll look like this):

```bash
git remote add origin https://github.com/YOUR-USERNAME/deadday.git
git branch -M main
git push -u origin main
```

Replace `YOUR-USERNAME` with your actual GitHub username.

---

## ✅ Step 7: Deploy Your Game!

### First Manual Deploy:

```bash
firebase deploy
```

Wait ~30 seconds. You'll see output like:

```
✔  Deploy complete!

Project Console: https://console.firebase.google.com/project/deadday-game/overview
Hosting URL: https://deadday-game.web.app
```

**Click the Hosting URL** to see your live game!

---

## ✅ Step 8: Set Up Auto-Deploy (GitHub Actions)

If you said "Yes" to GitHub setup in Step 5, Firebase already created these files:

- `.github/workflows/firebase-hosting-pull-request.yml`
- `.github/workflows/firebase-hosting-merge.yml`

### Add GitHub Secrets:

1. Go to your GitHub repo: `https://github.com/YOUR-USERNAME/deadday`
2. Click **Settings** → **Secrets and variables** → **Actions**
3. You should see a secret named `FIREBASE_SERVICE_ACCOUNT_...` (already added by Firebase CLI)

**That's it!** GitHub Actions is now configured.

---

## 🔄 How to Update Your Game (After Setup)

### Every time you want to update the live game:

```bash
# 1. Make your changes in VS Code

# 2. Test locally (open index.html in browser)

# 3. Commit and push to GitHub
git add .
git commit -m "describe your changes"
git push
```

**Wait 1-2 minutes** and your game will automatically update on the live site!

### Check Deployment Status:

- Go to your GitHub repo → **Actions** tab
- You'll see the deployment running
- Green checkmark = deployed successfully
- Red X = deployment failed (check error logs)

---

## 📁 Files Created by Firebase

After running `firebase init`, you'll see:

```
DEADDAY/
├── .firebaserc          ← Firebase project configuration
├── firebase.json        ← Hosting rules
├── .github/
│   └── workflows/
│       ├── firebase-hosting-pull-request.yml  ← Auto-deploy on PR
│       └── firebase-hosting-merge.yml         ← Auto-deploy on push to main
└── .gitignore           ← Updated to ignore Firebase cache
```

**Don't delete these files!** They're needed for auto-deploy.

---

## 🐛 Troubleshooting

### Issue: "Firebase command not found"

**Solution:**
```bash
npm install -g firebase-tools
```

### Issue: "Permission denied" when installing Firebase CLI

**Solution (Windows):**
Run terminal as Administrator, then:
```bash
npm install -g firebase-tools
```

### Issue: "No Firebase project found"

**Solution:**
Make sure you ran `firebase init` and selected a project.

### Issue: Game works locally but not on Firebase

**Solution:**
Check `firebase.json` - make sure `public` is set to `"."` or the folder containing index.html.

### Issue: GitHub Actions deployment fails

**Solution:**
1. Check the error in GitHub → Actions tab
2. Make sure secret `FIREBASE_SERVICE_ACCOUNT_...` exists
3. Make sure your repo is **Public**

### Issue: Assets not loading on live site

**Solution:**
Check that all file paths in your code are **relative**, not absolute:
- ✅ Good: `assets/images/chicken.png`
- ❌ Bad: `/assets/images/chicken.png` (leading slash)
- ❌ Bad: `C:/Users/shady/...` (absolute path)

---

## 🎮 Your Live Game URLs

After deployment, you'll get:

- **Live Site**: `https://deadday-game.web.app`
- **Firebase Console**: `https://console.firebase.google.com/project/deadday-game`
- **GitHub Repo**: `https://github.com/YOUR-USERNAME/deadday`

---

## 📊 Usage Limits (Free Tier)

Firebase Spark (Free) Plan:
- ✅ **10GB storage** (your game is ~10MB, so plenty)
- ✅ **10GB bandwidth/month** (enough for ~1000 players/month)
- ✅ **Unlimited custom domains** (you can add your own later)
- ✅ **Free SSL certificate** (automatic HTTPS)

If you exceed limits, Firebase will just stop serving until next month (no charges).

---

## 🚀 Next Steps After Deployment

1. **Share your game**: Send friends the `.web.app` URL
2. **Add custom domain** (optional): https://firebase.google.com/docs/hosting/custom-domain
3. **Monitor usage**: Check Firebase Console → Hosting → Usage tab
4. **Update game**: Just push to GitHub, auto-deploy handles the rest!

---

## 📝 Quick Reference Commands

```bash
# Deploy manually
firebase deploy

# List Firebase projects
firebase projects:list

# Check which project you're using
firebase use

# Switch to different project
firebase use project-id

# View hosting URL
firebase hosting:channel:list

# Logout
firebase logout
```

---

**Last Updated:** 2025-12-09

**Your game will be live at:** https://deadday-game.web.app (after deployment)
