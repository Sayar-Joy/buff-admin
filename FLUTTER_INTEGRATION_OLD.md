# 📱 Flutter App Integration Guide

## 🎯 How It Works

Your Buffalo Dashboard provides **4 fixed links** that you can control from the admin panel:
- **3 Redirect Links**: Telegram, Viber, Website (opens URLs)
- **1 Text Display**: Shows custom text in your Flutter app

1. **Dashboard Link**: `http://localhost:3000` (or your deployed URL)
2. **Login**: Use `heinhtet` / `javburmaadminjeff` to access admin panel
3. **API Endpoint**: Your Flutter app calls this to get the links
4. **Instant Updates**: Change URLs/text in the dashboard, and they instantly update in your Flutter app!

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
  url_launcher: ^6.2.0 # Optional: to open URLs
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

class ButtonLinkisplayText;
  final String linkType; // 'redirect' or 'text'
  final bool isActive;
  final int order;

  ButtonLink({
    required this.id,
    required this.name,
    required this.url,
    this.icon = '',
    this.displayText = '',
    required this.linkType,
    required this.isActive,
    required this.order,
  });

  bool get isRedirect => linkType == 'redirect';
  bool get isTextDisplay => linkType == 'text';

  factory ButtonLink.fromJson(Map<String, dynamic> json) {
    return ButtonLink(
      id: json['_id'],
      name: json['name'],
      url: json['url'] ?? '',
      icon: json['icon'] ?? '',
      displayText: json['displayText'] ?? '',
      linkType: json['linkType'] ?? 'redirect
      id: json['_id'],
      name: json['name'],
      url: json['url'],
      icon: json['icon'] ?? '',
      description: json['description'] ?? '',
      isActive: json['isActive'],
      order: json['order'],
    );://localhost:3000/api/buttons';

  // Use your actual URL based on environment:
  // - Render: 'https://your-service-name.onrender.com/api/buttons'
  // - Local testing: 'http://localhost:3000/api/buttons'
  // - Android emulator: 'http://10.0.2.2:3000/api/buttons'
  // - iOS simulator: 'http://localhost:3000/api/buttons'
  // - Real device (same WiFi)
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
  Widget buildLinkItem(ButtonLink button) {
    // Handle text display link
    if (button.isTextDisplay) {
      return Card(
        margin: EdgeInsets.only(bottom: 12),
        elevation: 2,
        color: Colors.blue.shade50,
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(12),
        ),
        child: Padding(
          padding: EdgeInsets.all(20),
          child: Row(
            children: [
              Icon(Icons.info_outline, color: Colors.blue, size: 28),
              SizedBox(width: 16),
              Expanded(
                child: Text(
                  button.displayText,
                  style: TextStyle(
                    fontSize: 16,
                    fontWeight: FontWeight.w500,
                    color: Colors.blue.shade900,
                  ),
                ),
              ),
            ],
          ),
        ),
      );
    }

    // Handle redirect link
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
          child: Icon(
            button.icon == 'send' ? Icons.send :
            button.icon == 'phone' ? Icons.phone :
            button.icon == 'language' ? Icons.language :
            Icons.link,
            color: Colors.white,
          ),
        ),
        title: Text(
          button.name,
          style: TextStyle(
            fontWeight: FontWeight.bold,
            fontSize: 16,
          ),
        ),
        trailing: Icon(Icons.arrow_forward_ios, size: 16),
        onTap: () => openUrl(button.url),
      ),
    );
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
            tooltip: 'Refresh links',
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
                      Text('No links available'),
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
                    return buildLinkItem(button    subtitle: button.description.isNotEmpty
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
Test Your 4 Links

1. **Login to dashboard**: `http://localhost:3000`
   - Username: `heinhtet`
   - Password: `javburmaadminjeff`

2. **You'll see 4 fixed links**:
   - 🔗 **Telegram Link** - Edit URL to your Telegram
   - 🔗 **Viber Link** - Edit URL to your Viber
   - 🔗 **Website Link** - Edit URL to your website
   - 📝 **Display Text** - Edit text message

3. **Edit a redirect link**:
   - Click in the URL field for "Telegram Link"
   - Change to: `https://t.me/YourChannel`
   - Click "Save Changes"

4. **Edit the text display**:
   - Click in the "Display Text" field
   - Change to: `"Welcome! Contact us below 👇"`
   - Click "Save Changes"

5. **Test in Flutter**:
   - Restart your Flutter app
   - You'll see 3 clickable links + 1 info message
   - Tap Telegram link - opens your new URL!

### Method 2: Test API Response

## 🎨 Complete Example with All Features

Here's a full example handling both redirect links and text display:

```dart
import 'package:flutter/material.dart';
import 'services/button_service.dart';
import 'package:url_launcher/url_launcher.dart';

class LinksPage extends StatefulWidget {
  @override
  _LinksPageState createState() => _LinksPageState();
}  default:
        return Icons.link;
    }
  }

  Widget buildLink(ButtonLink link) {
    // Text Display Link
    if (link.isTextDisplay) {
      return Container(
        margin: EdgeInsets.only(bottom: 12),
        padding: EdgeInsets.all(20),
        decoration: BoxDecoration(
          color: Colors.blue.shade50,
          borderRadius: BorderRadius.circular(12),
          border: Border.all(color: Colors.blue.shade200),
        ),
        child: Row(
          children: [
            Icon(getIcon(link.icon), color: Colors.blue.shade700, size: 28),
            SizedBox(width: 16),
            Expanded(
              child: Text(
                link.displayText,
                style: TextStyle(
                  fontSize: 16,
                  fontWeight: FontWeight.w500,
                  color: Colors.blue.shade900,
                ),
              ),
            ),
          ],
        ),
      );
    }

    // Redirect Link (clickable)
    return Card(
      margin: EdgeInsets.only(bottom: 12),
      elevation: 2,
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(12),
      ),
      child: InkWell(
        onTap: () => openUrl(link.url),
        borderRadius: BorderRadius.circular(12),
        child: Padding(
          padding: EdgeInsets.all(16),
          child: Row(
            children: [
              CircleAvatar(
                backgroundColor: Colors.blue,
                child: Icon(getIcon(link.icon), color: Colors.white),
              ),
              SizedBox(width: 16),
              Expanded(
                child: Text(
                  link.name,
                  style: TextStyle(
                    fontWeight: FontWeight.bold,
                    fontSize: 16,
                  ),
                ),
              ),
              Icon(Icons.arrow_forward_ios, size: 16, color: Colors.grey),
            ],
          ),
        ),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('Quick Links'),
        actions: [
          IconButton(
            icon: Icon(Icons.refresh),
            onPressed: loadLinks,
          ),
        ],
      ),
      body: RefreshIndicator(
        onRefresh: loadLinks,
        child: isLoading
            ? Center(child: CircularProgressIndicator())
            : links.isEmpty
                ? Center(
                    child: Column(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        Icon(Icons.link_off, size: 64, color: Colors.grey),
                        SizedBox(height: 16),
                        Text('No links available'),
                        SizedBox(height: 16),
                        ElevatedButton(
                          onPressed: loadLinks,
                          child: Text('Retry'),
                        ),
                      ],
                    ),
                  )
                : ListView.builder(
                    padding: EdgeInsets.all(16),
                    itemCount: links.length,
                    itemBuilder: (context, index) {
                      return buildLink(links[index]);
                    },
                  ),
      ),
    );
  }
}
```

### Expected Output in Your App:

When you run this code, you'll see:
1. **an't Open Viber/Telegram Links?

**Problem**: Clicking Telegram/Viber links doesn't work on iOS

**Solution**: Add URL schemes to `ios/Runner/Info.plist`:

```xml
<key>LSApplicationQueriesSchemes</key>
<array>
    <string>viber</string>
    <string>tg</string>
</array>
```

### Display Text Not Showing?

**Problem**: Text display link not appearing in Flutter

**Solution**: Make sure you're checking `linkType`:

```dart
if (link.linkType == 'text' && link.displayText.isNotEmpty) {
  return InfoCard(text: link.displayText);
}
```

### CDisplay Text** (blue info box with message)
2. **Telegram Link** (clickable card with send icon)
3. **Viber Link** (clickable card with phone icon)  
4. **Website Link** (clickable card with language icon)
class _LinksPageState extends State<LinksPage> {
  List<ButtonLink> links = [];
  bool isLoading = true;

  @override
  void initState() {
    super.initState();
    loadLinks();
  }

  FuCan't login to dashboard?** Use `heinhtet` / `javburmaadminjeff`
- **Flutter can't fetch links?** Check if server is running: `npm start`
- **Links not updating?** Add pull-to-refresh or restart Flutter app
- **Deployment issues?** Check [RENDER_DEPLOYMENT.md](RENDER_DEPLOYMENT.md)
- **Local network issues?** Use your computer's IP address in Flutter

### Test Checklist:

✅ Server running? Open `http://localhost:3000` in browser  
✅ Can login? Use credentials above  
✅ API working? Open `http://localhost:3000/api/buttons` - should show JSON  
✅ Flutter connected? Check console for "Fetching buttons..." message  
✅ Links appear? You should see 4 items (3 clickable + 1 info text)

---

## 💡 Pro Tips

1. **Auto-refresh**: Add a timer to refresh links every 30 seconds
2. **Offline support**: Cache links locally with `shared_preferences`
3. **Deep linking**: Use link URLs to navigate within your app
4. **Analytics**: Track which links users tap most
5. **Animations**: Add hero animations when tapping links
6. **Custom icons**: Upload icon images and show them instead of Flutter icons

---

## 🎉 Summary

Your Buffalo Dashboard gives you **4 managed links**:
- ✅ **No hardcoding** - Change URLs/text from admin panel
- ✅ **Real-time updates** - Edit once, update everywhere
- ✅ **Simple integration** - Just 1 API call in Flutter
- ✅ **Flexible** - 3 redirect links + 1 display text
- ✅ **Secure** - Admin panel protected, API public for reading
    setState(() {
      links = fetchedLinks;
      isLoading = false;
    });
  }

  Future<void> openUrl(String url) async {
    final uri = Uri.parse(url);
    if (await canLaunchUrl(uri)) {
      await launchUrl(uri, mode: LaunchMode.externalApplication);
    } else {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Could not open link')),
      );
    }
  }

  IconData getIcon(String iconName) {
    switch (iconName.toLowerCase()) {
      case 'send':
        return Icons.send;
      case 'phone':
        return Icons.phone;
      case 'language':
        return Icons.language;
      case 'info':
        return Icons.info_outline;
      "isActive": true,
      "order": 1
    },
    {
      "_id": "...",
      "name": "Viber Link",
      "url": "viber://chat?number=%2B959956252246",
      "icon": "phone",
      "linkType": "redirect",
      "displayText": "",
      "isActive": true,
      "order": 2
    },
    {
      "_id": "...",
      "name": "Website Link",
      "url": "https://youtube.com",
      "icon": "language",
      "linkType": "redirect",
      "displayText": "",
      "isActive": true,
      "order": 3
    },
    {
      "_id": "...",
      "name": "Display Text",
      "url": "",
      "icon": "info",
      "linkType": "text",
      "displayText": "Welcome to our service!",
      "isActive": true,
      "order": 4
    }
  ]
}
```Production)
1. Open your Render dashboard: `https://your-app.onrender.com`
1. You'll see 3 demo buttons already created (Home, Profile, Settings)
1. Click "Edit" on any button
1. Change the URL (e.g., to `https://google.com`)
1. Click "Update Button"
1. **In your Flutter app:** Pull to refresh or restart
1. Tap the button - it should open the new URL!

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

````dart
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
````

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
  ````dart
  final response = await http.get(Uri.parse(apiUrl))
      .timeout(Duration(seconds: 60));
  ```//your-deployed-url.com/api/buttons';
  ````

````
 1: Pull to refresh** (Add this to your Flutter app)
```dart
RefreshIndicator(
  onRefresh: loadButtons,
  child: ListView.builder(...),
)
````

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
