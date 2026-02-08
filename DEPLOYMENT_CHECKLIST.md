# ✅ Deployment Checklist

Use this checklist to ensure everything is ready for Render deployment.

## Pre-Deployment Checklist

### Files Required ✓
- [x] `package.json` with all dependencies
- [x] `server.js` main application file
- [x] `render.yaml` configuration file
- [x] `.env.example` template file
- [x] `.gitignore` (excludes node_modules, .env)
- [x] `models/buttonLink.js` database schema
- [x] `public/` folder with dashboard UI
- [x] Documentation (README, guides)

### Git & GitHub ⏳
- [ ] Git initialized (`git init`)
- [ ] All files committed
- [ ] Remote added: `https://github.com/Sayar-Joy/buff-admin.git`
- [ ] Pushed to GitHub (`git push origin main`)

### MongoDB Atlas ⏳
- [ ] Free M0 cluster created
- [ ] Database user created (username & password saved)
- [ ] Network access: 0.0.0.0/0 whitelisted
- [ ] Connection string copied
- [ ] Password replaced in connection string

### Render Setup ⏳
- [ ] Render account created (signed in with GitHub)
- [ ] Repository connected to Render
- [ ] Build command: `npm install`
- [ ] Start command: `npm start`
- [ ] Environment variable `MONGODB_URI` added
- [ ] Environment variable `NODE_ENV` set to `production`
- [ ] Deploy initiated

## Post-Deployment Checklist

### Verify Deployment ⏳
- [ ] Build completed successfully (check Render logs)
- [ ] Service shows "Live" status
- [ ] Dashboard accessible at Render URL
- [ ] Demo buttons visible on dashboard
- [ ] Can create new button
- [ ] Can edit existing button
- [ ] Can delete button

### Test API ⏳
- [ ] Visit `https://your-app.onrender.com/api/buttons`
- [ ] See JSON response with button data
- [ ] Response includes `success: true`
- [ ] Buttons array contains demo data

### Render Logs Check ⏳
Look for these messages in Render logs:
- [ ] ✓ MongoDB connected successfully
- [ ] ✓ App configuration initialized
- [ ] ✓ Demo buttons created (or existing count shown)
- [ ] ✓ Server running on http://0.0.0.0:10000

## Flutter Integration Checklist

### Update Flutter Code ⏳
- [ ] Copied Render URL from dashboard
- [ ] Updated `apiUrl` in ButtonService
- [ ] Added timeout (60 seconds for wake-up)
- [ ] Tested fetch buttons function
- [ ] Buttons load successfully in Flutter app
- [ ] Can tap buttons and open URLs
- [ ] Added refresh functionality

### Test in Flutter ⏳
- [ ] Works on Android emulator
- [ ] Works on iOS simulator
- [ ] Works on real device
- [ ] Loading state displays during fetch
- [ ] Error handling works
- [ ] Buttons update when dashboard changes

## Production Ready Checklist

### Security (Optional but Recommended) ⏳
- [ ] Consider adding authentication to dashboard
- [ ] Restrict CORS to your Flutter app domain
- [ ] Monitor usage in Render dashboard
- [ ] Keep MongoDB credentials secure

### Documentation ⏳
- [ ] README.md updated with live URL
- [ ] Team/users know how to access dashboard
- [ ] Flutter developers have integration guide
- [ ] Backup MongoDB connection string somewhere safe

### Monitoring ⏳
- [ ] Bookmarked Render dashboard
- [ ] Bookmarked MongoDB Atlas dashboard
- [ ] Know how to check logs
- [ ] Know how to redeploy

## Common Issues Resolved

### Issue: Build Failed
- [x] Verified package.json is valid JSON
- [x] All dependencies listed
- [x] No syntax errors in server.js

### Issue: MongoDB Connection Failed
- [x] Connection string format correct
- [x] Password doesn't contain special characters needing encoding
- [x] Network access allows 0.0.0.0/0
- [x] Database name included in connection string

### Issue: App Not Responding
- [x] Environment variables set correctly
- [x] MongoDB URI starts with `mongodb+srv://`
- [x] Build command is `npm install`
- [x] Start command is `npm start`

### Issue: Flutter Can't Connect
- [x] Using HTTPS Render URL (not HTTP)
- [x] No trailing slash in URL
- [x] Timeout set to 60+ seconds
- [x] Server is awake (visited dashboard first)

---

## Quick Commands Reference

### Git Commands
```bash
# Initial setup
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/Sayar-Joy/buff-admin.git
git branch -M main
git push -u origin main

# Push updates
git add .
git commit -m "Update description"
git push
```

### Test API
```bash
# Test locally
curl http://localhost:3000/api/buttons

# Test on Render
curl https://your-app.onrender.com/api/buttons
```

---

## Ready to Deploy?

If all items in "Pre-Deployment Checklist" are checked ✓, you're ready!

**Next step:** Follow [DEPLOY_QUICK.md](DEPLOY_QUICK.md)

---

## Need Help?

- **Git issues:** [GitHub Docs](https://docs.github.com)
- **MongoDB:** [RENDER_ENV_VARS.md](RENDER_ENV_VARS.md)
- **Render:** [RENDER_DEPLOYMENT.md](RENDER_DEPLOYMENT.md)
- **Flutter:** [FLUTTER_INTEGRATION.md](FLUTTER_INTEGRATION.md)

---

**Status:** Ready for deployment! ✅
