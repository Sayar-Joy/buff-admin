# 🚀 Quick Deploy to Render via GitHub

## Prerequisites
- GitHub account
- This code ready to push

## Step 1: Push to GitHub

Open Terminal and run these commands:

```bash
# Navigate to project folder
cd "/Users/hlyanpaingaung/Desktop/buffalo dashboard"

# Initialize git (if not already done)
git init

# Add all files
git add .

# Commit
git commit -m "Initial commit - Buffalo Dashboard ready for Render"

# Add remote repository
git remote add origin https://github.com/Sayar-Joy/buff-admin.git

# Push to main branch
git branch -M main
git push -u origin main
```

**If you need to authenticate:**
- GitHub may ask for username and password
- Use a Personal Access Token instead of password
- Get token: GitHub → Settings → Developer settings → Personal access tokens → Generate new token

---

## Step 2: Set Up MongoDB Atlas

1. Go to https://mongodb.com/cloud/atlas
2. Create free account (M0 cluster - FREE forever)
3. Create database user (save username & password!)
4. Network access: Allow 0.0.0.0/0
5. Get connection string:
   ```
   mongodb+srv://username:password@cluster.net/buffalo_dashboard?retryWrites=true&w=majority
   ```
6. **Replace `<password>` with your actual password!**

---

## Step 3: Deploy to Render

1. **Go to Render:** https://render.com
2. **Sign in** with GitHub account
3. **New Web Service:**
   - Click "New +" → "Web Service"
   - Select repository: `Sayar-Joy/buff-admin`
   - Click "Connect"

4. **Configure:**
   - **Name:** `buffalo-dashboard`
   - **Region:** Choose closest
   - **Branch:** `main`
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
   - **Plan:** FREE

5. **Environment Variables:**
   Click "Advanced" → Add Environment Variable:
   
   | Key | Value |
   |-----|-------|
   | `MONGODB_URI` | Your MongoDB Atlas connection string |
   | `NODE_ENV` | `production` |

6. **Create Web Service** (blue button at bottom)

7. **Wait 3-5 minutes** for deployment

8. **Your app is live!** 
   ```
   https://buffalo-dashboard.onrender.com
   ```
   (Use your actual service name)

---

## Step 4: Test Your Dashboard

1. Open your Render URL in browser
2. You should see the Buffalo Dashboard
3. Demo buttons should be loaded
4. Try creating a new button!

---

## Step 5: Use in Flutter

Copy your Render URL and use in Flutter:

```dart
static const String apiUrl = 'https://buffalo-dashboard.onrender.com/api/buttons';
```

---

## Troubleshooting

### Build Failed
- Check logs in Render dashboard
- Verify `package.json` is correct
- Ensure `node` version compatibility

### "Application failed to respond"
- Check MongoDB connection string is correct
- Ensure network access in MongoDB Atlas is 0.0.0.0/0
- Check Render logs for MongoDB connection errors

### Can't Access Dashboard
- Wait 60 seconds (might be waking from sleep on free tier)
- Check Render logs for errors
- Verify environment variables are set

---

## Update Your App

To push updates:

```bash
git add .
git commit -m "Your update message"
git push
```

Render automatically redeploys on push! 🎉

---

## Important Links

- **Render Dashboard:** https://dashboard.render.com
- **MongoDB Atlas:** https://cloud.mongodb.com
- **Your Repo:** https://github.com/Sayar-Joy/buff-admin

---

## Tips

✅ **Free tier sleeps after 15 mins** - First request takes 30-60 seconds to wake
✅ **Check logs** in Render dashboard to debug issues
✅ **MongoDB Atlas** - Don't forget to whitelist 0.0.0.0/0
✅ **Test API** - Visit `your-url.com/api/buttons` to see JSON

**Complete guide:** [RENDER_DEPLOYMENT.md](RENDER_DEPLOYMENT.md)
