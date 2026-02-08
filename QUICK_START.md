# 🐃 Buffalo Dashboard - Quick Start Guide

## ✅ Setup Complete!

Your admin dashboard is now ready. The server is running at **http://localhost:3000**

## 📋 What You Can Do:

### From the Admin Dashboard:
1. **Add New Buttons** - Create button links with names, URLs, icons, and descriptions
2. **Edit Existing Buttons** - Update any button information
3. **Delete Buttons** - Remove buttons you no longer need
4. **Toggle Active Status** - Enable/disable buttons without deleting them
5. **Set Display Order** - Control the order buttons appear in your Flutter app

## 🔌 Connecting Your Flutter App:

### Step 1: Add HTTP Package
Add to your `pubspec.yaml`:
```yaml
dependencies:
  http: ^1.1.0
```

### Step 2: Copy the Integration Code
Use the code from `flutter_integration_example.dart` in your Flutter project.

### Step 3: Update the Base URL
In your Flutter code, change:
```dart
static const String baseUrl = 'http://localhost:3000/api';
```

To your actual server URL:
```dart
static const String baseUrl = 'http://YOUR_SERVER_IP:3000/api';
```

### Step 4: Fetch and Display Buttons
```dart
// Load buttons
final buttons = await ButtonService.getActiveButtons();

// Display in your UI
ListView.builder(
  itemCount: buttons.length,
  itemBuilder: (context, index) {
    final button = buttons[index];
    return ListTile(
      title: Text(button.name),
      subtitle: Text(button.description),
      onTap: () => launch(button.url), // Opens the URL
    );
  },
)
```

## 🗄️ MongoDB Setup:

The server is currently using a local MongoDB instance at:
```
mongodb://localhost:27017/buffalo_dashboard
```

### Using MongoDB Atlas (Cloud):
1. Create a free account at https://www.mongodb.com/cloud/atlas
2. Create a cluster and get your connection string
3. Update `.env` file:
   ```
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/buffalo_dashboard
   ```
4. Restart the server

## 📡 API Endpoints:

- `GET /api/buttons` - Get all button links
- `GET /api/buttons/:id` - Get single button
- `POST /api/buttons` - Create new button
- `PUT /api/buttons/:id` - Update button
- `DELETE /api/buttons/:id` - Delete button

## 🚀 Deployment:

### Deploy to Heroku:
```bash
heroku create buffalo-dashboard
heroku config:set MONGODB_URI=your_mongodb_uri
git push heroku main
```

### Deploy to Railway:
```bash
railway init
railway add
```

### Deploy to Render, Vercel, or DigitalOcean:
Follow their respective Node.js deployment guides.

## 🔧 Development Commands:

```bash
# Start server (production)
npm start

# Start with auto-reload (development)
npm run dev

# Install dependencies
npm install
```

## 📱 Testing the Integration:

1. Add a few test buttons from the dashboard
2. In your Flutter app, call `ButtonService.getActiveButtons()`
3. Display the buttons in your UI
4. Update links from the dashboard - they'll update in your app!

## 🎨 Customization:

- **Change colors**: Edit `public/css/style.css`
- **Add fields**: Update `models/buttonLink.js` and forms
- **Authentication**: Add middleware in `server.js`

## Need Help?

Check the code comments in each file for detailed explanations!
