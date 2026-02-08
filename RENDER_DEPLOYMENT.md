# 🚀 Deploy Buffalo Dashboard to Render (Free Tier)

## Step-by-Step Deployment Guide

### Prerequisites
- GitHub account
- Render account (sign up at https://render.com - it's free!)
- MongoDB Atlas account (free tier available at https://www.mongodb.com/cloud/atlas)

---

## Part 1: Set Up MongoDB Atlas (Cloud Database)

### 1. Create MongoDB Atlas Account
1. Go to https://www.mongodb.com/cloud/atlas
2. Sign up for free (no credit card required)
3. Create a new project (name it "Buffalo Dashboard")

### 2. Create a Cluster
1. Click "Build a Database"
2. Choose **FREE** tier (M0 Sandbox)
3. Select a cloud provider and region (choose closest to you)
4. Click "Create Cluster" (takes 3-5 minutes)

### 3. Set Up Database Access
1. Click "Database Access" in left sidebar
2. Click "Add New Database User"
3. Choose "Password" authentication
4. Username: `buffadmin`
5. Password: Click "Autogenerate Secure Password" and **COPY IT**
6. Database User Privileges: "Read and write to any database"
7. Click "Add User"

### 4. Set Up Network Access
1. Click "Network Access" in left sidebar
2. Click "Add IP Address"
3. Click "Allow Access from Anywhere" (0.0.0.0/0)
4. Click "Confirm"

### 5. Get Connection String
1. Click "Database" in left sidebar
2. Click "Connect" button on your cluster
3. Choose "Connect your application"
4. Copy the connection string (looks like):
   ```
   mongodb+srv://buffadmin:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```
5. Replace `<password>` with your actual password from step 3
6. **SAVE THIS CONNECTION STRING** - you'll need it for Render!

---

## Part 2: Push Code to GitHub

### 1. Initialize Git Repository
```bash
cd "/Users/hlyanpaingaung/Desktop/buffalo dashboard"
git init
git add .
git commit -m "Initial commit - Buffalo Dashboard"
```

### 2. Connect to GitHub Repository
```bash
git remote add origin https://github.com/Sayar-Joy/buff-admin.git
git branch -M main
git push -u origin main
```

If you get authentication errors, use:
```bash
# For authentication, you may need to use a personal access token
# Go to GitHub → Settings → Developer settings → Personal access tokens
```

---

## Part 3: Deploy to Render

### 1. Sign Up / Log In to Render
1. Go to https://render.com
2. Sign up with your GitHub account (easiest method)
3. Authorize Render to access your GitHub

### 2. Create New Web Service
1. Click "New +" button (top right)
2. Select "Web Service"
3. Connect your GitHub repository: `Sayar-Joy/buff-admin`
4. Click "Connect"

### 3. Configure Your Service
Fill in the following details:

**Name**: `buffalo-dashboard` (or any name you prefer)

**Region**: Choose closest to your location

**Branch**: `main`

**Root Directory**: Leave blank

**Runtime**: `Node`

**Build Command**: 
```
npm install
```

**Start Command**: 
```
npm start
```

**Plan**: Select **Free** (this is important!)

### 4. Add Environment Variables
Click "Advanced" → "Add Environment Variable"

Add this variable:

| Key | Value |
|-----|-------|
| `MONGODB_URI` | Your full MongoDB Atlas connection string from Part 1 Step 5 |

Example:
```
mongodb+srv://buffadmin:yourpassword@cluster0.xxxxx.mongodb.net/buffalo_dashboard?retryWrites=true&w=majority
```

Make sure to add `/buffalo_dashboard` after `.net` to specify the database name!

| Key | Value |
|-----|-------|
| `NODE_ENV` | `production` |

### 5. Deploy!
1. Click "Create Web Service"
2. Wait 3-5 minutes for deployment
3. You'll see build logs - watch for "Build succeeded"
4. Once deployed, you'll see "Your service is live 🎉"

### 6. Get Your Live URL
Your dashboard will be available at:
```
https://buffalo-dashboard.onrender.com
```
(Replace `buffalo-dashboard` with your actual service name)

**Copy this URL** - this is your API endpoint for Flutter!

---

## Part 4: Update Your Flutter App

### Update API URL in Flutter App

Replace the localhost URL with your Render URL:

```dart
class ButtonService {
  // OLD (localhost):
  // static const String apiUrl = 'http://localhost:3000/api/buttons';
  
  // NEW (Render):
  static const String apiUrl = 'https://buffalo-dashboard.onrender.com/api/buttons';
  
  // ... rest of your code
}
```

**That's it!** Your Flutter app will now fetch button links from your live Render server!

---

## ⚠️ Important Notes About Free Tier

### Render Free Tier Limitations:
1. **Sleep Mode**: Service goes to sleep after 15 minutes of inactivity
2. **Wake Up Time**: First request after sleep takes 30-50 seconds
3. **Monthly Hours**: 750 hours/month (enough for continuous use)

### What This Means:
- If no one uses the dashboard for 15+ minutes, it sleeps
- First visitor will wait ~30 seconds for it to wake up
- Subsequent requests are instant
- Perfect for personal projects and demos!

### How to Handle in Flutter App:
Add a loading state and timeout:
```dart
static Future<List<ButtonLink>> getButtons() async {
  try {
    final response = await http.get(
      Uri.parse(apiUrl),
      // Add timeout for first wake-up
    ).timeout(Duration(seconds: 60));
    
    // ... rest of code
  } catch (e) {
    print('Server is waking up, please wait...');
    // Retry once
  }
}
```

---

## 📊 Monitor Your Deployment

### Check Logs
1. Go to Render Dashboard
2. Click your service
3. Click "Logs" tab
4. You should see:
   ```
   ✓ MongoDB connected successfully
   ✓ App configuration initialized
   ✓ Demo buttons created
   ✓ Server running on http://0.0.0.0:10000
   ```

### Test Your API
Open in browser:
```
https://your-service-name.onrender.com/api/buttons
```

You should see JSON with your buttons!

---

## 🔧 Updating Your App

### To Deploy Changes:

1. **Make changes locally**
2. **Commit and push to GitHub:**
   ```bash
   git add .
   git commit -m "Update description"
   git push
   ```
3. **Render auto-deploys** (takes 2-3 minutes)
4. **Check logs** to confirm deployment

---

## 🌐 Custom Domain (Optional)

Want your own domain like `dashboard.yourdomain.com`?

1. Go to Render Dashboard → Your Service → "Settings"
2. Scroll to "Custom Domain"
3. Add your domain
4. Render provides DNS instructions
5. Update your domain's DNS settings

---

## 🔐 Security Tips for Production

### 1. Add Authentication
Consider adding basic auth:

```javascript
// In server.js, add before routes:
app.use((req, res, next) => {
  const auth = req.headers.authorization;
  if (!auth || auth !== 'Bearer YOUR_SECRET_KEY') {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  next();
});
```

### 2. Restrict CORS
Update in `server.js`:
```javascript
app.use(cors({
  origin: ['https://yourdomain.com'] // Only your Flutter app
}));
```

### 3. Add API Key
Store in environment variables on Render

---

## 🐛 Troubleshooting

### Problem: "Application failed to respond"
- **Solution**: Check MongoDB connection string is correct
- Ensure network access is set to 0.0.0.0/0 in MongoDB Atlas

### Problem: Build fails
- **Solution**: Check that `package.json` has all dependencies
- Ensure Node version compatibility

### Problem: Can't access dashboard
- **Solution**: Wait 60 seconds (might be waking from sleep)
- Check logs on Render

### Problem: Buttons not showing in Flutter
- **Solution**: Verify API URL in Flutter matches Render URL exactly
- Check Render logs for errors

---

## ✅ Checklist

Before going live, make sure:
- [ ] MongoDB Atlas is set up and connection string works
- [ ] Code is pushed to GitHub
- [ ] Render service is created and deployed
- [ ] Environment variables are set correctly
- [ ] API endpoint works (test in browser)
- [ ] Flutter app URL is updated to Render URL
- [ ] Test creating/editing/deleting buttons
- [ ] Demo buttons are visible

---

## 🎉 Your Dashboard is Live!

**Dashboard URL**: `https://your-service.onrender.com`

**API Endpoint**: `https://your-service.onrender.com/api/buttons`

Now you can:
- ✅ Access dashboard from anywhere
- ✅ Manage button links on the go
- ✅ Flutter app works from any device
- ✅ No need to keep your computer running!

**Free. Forever. 🚀**

---

## 📱 Final Flutter Code

```dart
class ButtonService {
  // Your live Render URL
  static const String apiUrl = 'https://buffalo-dashboard.onrender.com/api/buttons';
  
  static Future<List<ButtonLink>> getButtons() async {
    try {
      final response = await http.get(Uri.parse(apiUrl))
          .timeout(Duration(seconds: 60)); // Allow time for wake-up
      
      if (response.statusCode == 200) {
        final data = json.decode(response.body);
        if (data['success']) {
          List<ButtonLink> buttons = (data['data'] as List)
              .map((json) => ButtonLink.fromJson(json))
              .where((button) => button.isActive)
              .toList();
          
          buttons.sort((a, b) => a.order.compareTo(b.order));
          return buttons;
        }
      }
      throw Exception('Failed to load buttons');
    } catch (e) {
      print('Error: $e');
      return [];
    }
  }
}
```

Your admin dashboard is now live and connected to your Flutter app! 🎊
