# 📱 Flutter App Integration Guide

## 🎯 How It Works

1. **Dashboard Link**: `http://localhost:3000` (or your deployed URL)
2. **API Endpoint**: Your Flutter app calls this to get button links
3. **Change Button Destinations**: Update URLs in the dashboard, and they instantly change in your Flutter app!

---

## 🚀 Step-by-Step Integration

### Step 1: Get Your API Connection Link

1. Open your deployed dashboard (e.g., `https://buffalo-dashboard.onrender.com`)
   - Or if running locally: `http://localhost:3000`
2. At the top, you'll see **"Flutter App Connection"** section with a green border
3. Click **"📋 Copy"** to copy your API endpoint URL
4. **Render Example:** `https://buffalo-dashboard.onrender.com/api/buttons`
5. **Local Example:** `http://localhost:3000/api/buttons`

---

### Step 2: Add Required Package to Flutter

Add the HTTP package to your `pubspec.yaml`:

```yaml
dependencies:
  flutter:
    sdk: flutter
  http: ^1.1.0
  url_launcher: ^6.2.0  # Optional: to open URLs
```

Run:
```bash
flutter pub get
```

### Step 3: Create Button Service in Flutter

Create a new file: `lib/services/button_service.dart`

```dart
import 'dart:convert';
import 'package:http/http.dart' as http;

class ButtonLink {
  final String id;
  final String name;
  final String url;
  final String icon;
  final String description;
  final bool isActive;
  final int order;

  ButtonLink({
    required this.id,
    required this.name,
    required this.url,
    this.icon = '',
    this.description = '',
    required this.isActive,
    required this.order,
  });

  factory ButtonLink.fromJson(Map<String, dynamic> json) {
    return ButtonLink(
      id: json['_id'],
      name: json['name'],
      url: json['url'],
      icon: json['icon'] ?? '',
      description: json['description'] ?? '',
      isActive: json['isActive'],
      order: json['order'],
    );
  }
}

class ButtonService {
  // 🔗 PASTE YOUR API URL HERE (copy from dashboard)
  static const String apiUrl = 'https://buffalo-dashboard.onrender.com/api/buttons';
  
  // Use your actual Render URL:
  // - Render: 'https://your-service-name.onrender.com/api/buttons'
  // - For local testing: 'http://localhost:3000/api/buttons'
  // - For Android emulator: 'http://10.0.2.2:3000/api/buttons'
  // - For iOS simulator: 'http://localhost:3000/api/buttons'
  // - For real device on local network: 'http://YOUR_COMPUTER_IP:3000/api/buttons'

  static Future<List<ButtonLink>> getButtons() async {
    try {
      final response = await http.get(Uri.parse(apiUrl));

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
      print('Error fetching buttons: $e');
      return [];
    }
  }
}
```

### Step 4: Use in Your Flutter App

Example implementation:

```dart
import 'package:flutter/material.dart';
import 'services/button_service.dart';
import 'package:url_launcher/url_launcher.dart';

class MyHomePage extends StatefulWidget {
  @override
  _MyHomePageState createState() => _MyHomePageState();
}

class _MyHomePageState extends State<MyHomePage> {
  List<ButtonLink> buttons = [];
  bool isLoading = true;

  @override
  void initState() {
    super.initState();
    loadButtons();
  }

  Future<void> loadButtons() async {
    setState(() => isLoading = true);
    final fetchedButtons = await ButtonService.getButtons();
    setState(() {
      buttons = fetchedButtons;
      isLoading = false;
    });
  }

  Future<void> openUrl(String url) async {
    final uri = Uri.parse(url);
    if (await canLaunchUrl(uri)) {
      await launchUrl(uri, mode: LaunchMode.externalApplication);
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('My App'),
        actions: [
          IconButton(
            icon: Icon(Icons.refresh),
            onPressed: loadButtons,
            tooltip: 'Refresh buttons',
          ),
        ],
      ),
      body: isLoading
          ? Center(child: CircularProgressIndicator())
          : buttons.isEmpty
              ? Center(
                  child: Column(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      Icon(Icons.link_off, size: 64, color: Colors.grey),
                      SizedBox(height: 16),
                      Text('No buttons available'),
                      TextButton(
                        onPressed: loadButtons,
                        child: Text('Retry'),
                      ),
                    ],
                  ),
                )
              : ListView.builder(
                  padding: EdgeInsets.all(16),
                  itemCount: buttons.length,
                  itemBuilder: (context, index) {
                    final button = buttons[index];
                    return Card(
                      margin: EdgeInsets.only(bottom: 12),
                      elevation: 2,
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(12),
                      ),
                      child: ListTile(
                        contentPadding: EdgeInsets.all(16),
                        leading: CircleAvatar(
                          backgroundColor: Colors.blue,
                          child: Icon(Icons.link, color: Colors.white),
                        ),
                        title: Text(
                          button.name,
                          style: TextStyle(
                            fontWeight: FontWeight.bold,
                            fontSize: 16,
                          ),
                        ),
                        subtitle: button.description.isNotEmpty
                            ? Text(button.description)
                            : null,
                        trailing: Icon(Icons.arrow_forward_ios),
                        onTap: () => openUrl(button.url),
                      ),
                    );
                  },
                ),
    );
  }
}
```

---
Production (Render Deployment) - RECOMMENDED
```dart
static const String apiUrl = 'https://your-service-name.onrender.com/api/buttons';
```
✅ Works on all devices (Android, iOS, real devices, emulators)
✅ No network configuration needed
✅ Accessible from anywhere

### Local Development

#### 
## 🔧 Network Configuration

### Android (Emulator)
The emulator treats `localhost` as itself, not your computer.

**Update the API URL to:**
```dart
static const String apiUrl = 'http://10.0.2.2:3000/api/buttons';
```

### iOS (Simulator)
```dart
static const String apiUrl = 'http://localhost:3000/api/buttons';
```

### Real Device (Android/iOS)
1. Find your computer's IP address:
   - Mac: `System Settings > Network` or run `ifconfig | grep inet`
   - Windows: `ipconfig` (Production)
1. Open your Render dashboard: `https://your-app.onrender.com`
2. You'll see 3 demo buttons already created (Home, Profile, Settings)
3. Click "Edit" on any button
4. Change the URL (e.g., to `https://google.com`)
5. Click "Update Button"
6. **In your Flutter app:** Pull to refresh or restart
7. Tap the button - it should open the new URL!

**Note:** First request after inactivity may take 30-60 seconds (Render free tier wakes from sleep)

### Method 1b: Quick Test (Local Development)
1. Open dashboard: `http://localhost:3000`
2. Use your computer's IP:
```dart
static const String apiUrl = 'http://192.168.1.100:3000/api/buttons';
```

3. **Important**: Make sure your phone and computer are on the same WiFi network!

---

## ✅ Testing the Connection

### Method 1: Quick Test
1. Open dashboard: http://localhost:3000
2. You'll see 3 demo buttons already created
3. Click "Edit" on any button
4. Change the URL (e.g., to `https://google.com`)
5. Click "Update Button"
6. Restart your Flutter app
7. Tap the button - it should open the new URL!

### Method 2: Create a New Button
1. In dashboard, fill the form:
   - **Name**: "My Website"
   - **URL**: "https://yourwebsite.com"
   - **Description**: "Visit my website"
   - **Display Order**: 10
2. Click "Add Button"
3. Reload your Flutter app
4. The new button appears!

---

## 🎨 Example: Button with Custom Icons

Map icon names to Flutter icons:

```dart
IconData getIcon(String iconName) {
  switch (iconName.toLowerCase()) {
    case 'home':
      return Icons.home;
    case 'person':
    case 'profile':
      return Icons.person;
    case 'settings':
      return Icons.settings;
    Deploy to Render (Recommended - FREE!)

**Full guide:** [RENDER_DEPLOYMENT.md](RENDER_DEPLOYMENT.md)

Quick steps:
1. Set up MongoDB Atlas (free cloud database)
2. Push code to GitHub: `https://github.com/Sayar-Joy/buff-admin.git`
3. Connect to Render.com
4. Add MongoDB connection string as environment variable
5. Deploy!

Your dashboard will be at: `https://your-app.onrender.com`

### Update Flutter App with Production URL
```dart
static const String apiUrl = 'https://your-app.onrender.com/api/buttons';
```

✅ No more localhost
✅ Works on all devices
✅ Free forever
✅ Accessible from anywhere

---

## 🐛 Troubleshooting

### "Failed to load buttons" Error

**Check 1: Is the server running?**
- **Render:** Open `https://your-app.onrender.com` in browser
- **Local:** Open `http://localhost:3000` in browser
- Should see the dashboard

**Check 2: Using correct URL?**
- **Production:** Must use full Render URL
- **Local Android Emulator:** Use `10.0.2.2`
- **Local Real device:** Use your computer's IP

**Check 3: Server waking up? (Render only)**
- Free tier sleeps after 15 minutes
- First request takes 30-60 seconds to wake
- Add longer timeout in Flutter:
  ```dart
  final response = await http.get(Uri.parse(apiUrl))
      .timeout(Duration(seconds: 60));
  ```//your-deployed-url.com/api/buttons';
```
 1: Pull to refresh** (Add this to your Flutter app)
```dart
RefreshIndicator(
  onRefresh: loadButtons,
  child: ListView.builder(...),
)
```

**Solution 2: Add manual refresh button**
```dart
IconButton(
  icon: Icon(Icons.refresh),
  onPressed: loadButtons,
)
```

**Solution 3: Auto-refresh timer** (checks every 30 seconds)
```dart
Timer.periodic(Duration(seconds: 30), (_) {
  loadButtons();
});
```

### Connection Timeout (Render Wake-Up)

If using Render free tier, add timeout handling:

```dart
static Future<List<ButtonLink>> getButtons() async {
  try {
    print('Fetching buttons...');
    final response = await http.get(Uri.parse(apiUrl))
        .timeout(
          Duration(seconds: 60), // Allow time for server wake-up
          onTimeout: () {
            throw TimeoutException('Server is waking up, please wait...');
          },
        );
    
    if (response.statusCode == 200) {
      final data = json.decode(response.body);
      if (data['success']) {
        print('Buttons loaded successfully!');
        // ... rest of code
      }
    }
  } on TimeoutException catch (e) {
    print(e.message);
    // Show message to user: "Server is starting, please wait..."
    // Retry after 3 seconds
    await Future.delayed(Duration(seconds: 3));
    return getButtons(); // Retry once
  } catch (e) {
    print('Error: $e');
    return [];
  }
}
```

---

## 📞 Need Help?

- **Deployment issues?** Check [RENDER_DEPLOYMENT.md](RENDER_DEPLOYMENT.md)
- **Can't see buttons?** Open your dashboard URL in browser first to wake server
- **Local network issues?** Use Render instead (much easier!)

Check your deployed dashboard

**Solution**: Add a refresh button in your Flutter app:
```dart
IconButton(
  icon: Icon(Icons.refresh),
  onPressed: loadButtons,
)
```

---

## 💡 Pro Tips

1. **Auto-refresh**: Use a timer to automatically refresh buttons every 30 seconds
2. **Cache**: Store buttons locally to work offline
3. **Authentication**: Add API keys in production
4. **Analytics**: Track which buttons users tap most

---

## 📞 Need Help?

Check the demo buttons at http://localhost:3000 to see working examples!
