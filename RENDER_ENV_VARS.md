# Production Configuration for Render

When deploying to Render, configure these environment variables in the Render dashboard:

## Required Environment Variables:

### MONGODB_URI (Required)

Your MongoDB Atlas connection string. Get it from:

1. MongoDB Atlas Dashboard
2. Click "Connect" on your cluster
3. Choose "Connect your application"
4. Copy the connection string

Format:

```
mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/buffalo_dashboard?retryWrites=true&w=majority
```

**Important:** Replace `<password>` with your actual MongoDB user password!

### NODE_ENV (Recommended)

Set to `production` for production deployment

### PORT (Auto-set by Render)

Render automatically sets this. Don't manually configure.

---

## Setting Environment Variables on Render:

1. Go to your Render service dashboard
2. Click "Environment" in the left sidebar
3. Click "Add Environment Variable"
4. Add key-value pairs:
   - Key: `MONGODB_URI`
   - Value: Your full MongoDB connection string
5. Click "Save Changes"
6. Service will automatically redeploy

---

## MongoDB Atlas Setup:

### 1. Create Free Cluster

- Go to https://mongodb.com/cloud/atlas
- Sign up (no credit card needed)
- Create a free M0 cluster

### 2. Database Access

- Create a database user
- Username: `buffadmin` (or any name)
- Password: Generate a secure password
- Save username and password!

### 3. Network Access

- Add IP address: `0.0.0.0/0` (allow from anywhere)
- This is safe as it still requires authentication

### 4. Get Connection String

Click "Connect" → "Connect your application" → Copy string

Example:

```
mongodb+srv://buffadmin:MySecureP@ss123@cluster0.abc123.mongodb.net/buffalo_dashboard?retryWrites=true&w=majority
```

---

## Verification:

After deployment, check Render logs for:

```
✓ MongoDB connected successfully
✓ App configuration initialized
✓ Server running on http://0.0.0.0:10000
```

If you see these, your environment variables are configured correctly! 🎉
