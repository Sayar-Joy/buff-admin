# 📱 Flutter App Integration Guide

## 🎯 How It Works

Your Buffalo Dashboard provides **4 fixed links** that you can control from the admin panel:

- **3 Redirect Links**: Telegram, Viber, Website (opens URLs)
- **1 Text Display**: Shows custom text in your Flutter app

1. **Dashboard Link**: `https://buffalo-dashboard.onrender.com/`
2. **Login**: Access the admin panel to manage your links
3. **API Endpoint**: Your Flutter app calls this to get the links
4. **Instant Updates**: Change URLs/text in the dashboard, and they instantly update in your Flutter app!

---

## 🚀 Step-by-Step Integration

### Step 1: Get Your API Connection Link

1. Open your dashboard
   - **Production (Deployed)**: `https://buffalo-dashboard.onrender.com/`
   - **Local Development**: `http://localhost:3000`
2. Login with credentials above
3. At the top, you'll see **"Flutter App Connection"** section
4. Click **"📋 Copy"** to copy your API endpoint URL
5. Example: `https://buffalo-dashboard.onrender.com/api/buttons`

---

### Step 2: Add Required Packages to Flutter

Add these to your `pubspec.yaml`:

```yaml
dependencies:
  flutter:
    sdk: flutter
  http: ^1.1.0
  url_launcher: ^6.2.0 # To open URLs in browser/apps
```

Run:

```bash
flutter pub get
```

---

### Step 3: Create Button Service in Flutter

Create: `lib/services/button_service.dart`

```dart
import 'dart:convert';
import 'package:http/http.dart' as http;

class ButtonLink {
  final String id;
  final String name;
  final String url;
  final String icon;
  final String displayText;
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
      linkType: json['linkType'] ?? 'redirect',
      isActive: json['isActive'],
      order: json['order'],
    );
  }
}

class ButtonService {
  // 🔗 PASTE YOUR API URL HERE
  static const String apiUrl = 'https://buffalo-dashboard.onrender.com/api/buttons';

  // Choose based on your environment:
  // - Production: 'https://buffalo-dashboard.onrender.com/api/buttons'
  // - Local iOS sim: 'http://localhost:3000/api/buttons'
  // - Local Android emu: 'http://10.0.2.2:3000/api/buttons'
  // - Real device (WiFi): 'http://192.168.X.X:3000/api/buttons'

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

---

### Step 4: Use in Your Flutter App

Create: `lib/pages/links_page.dart`

```dart
import 'package:flutter/material.dart';
import '../services/button_service.dart';
import 'package:url_launcher/url_launcher.dart';

class LinksPage extends StatefulWidget {
  @override
  _LinksPageState createState() => _LinksPageState();
}

class _LinksPageState extends State<LinksPage> {
  List<ButtonLink> links = [];
  bool isLoading = true;

  @override
  void initState() {
    super.initState();
    loadLinks();
  }

  Future<void> loadLinks() async {
    setState(() => isLoading = true);
    final fetchedLinks = await ButtonService.getButtons();
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
      default:
        return Icons.link;
    }
  }

  Widget buildLink(ButtonLink link) {
    // Text Display Link (non-clickable info)
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

---

## ✅ Testing the Connection

### Method 1: Test Your 4 Links

1. **Login to dashboard**: `https://buffalo-dashboard.onrender.com/`

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
   - Click in the "Display Text" textarea
   - Change to: `"Welcome! Contact us below 👇"`
   - Click "Save Changes"

5. **Test in Flutter**:
   - Restart your Flutter app (or pull to refresh)
   - You'll see 3 clickable links + 1 info message
   - Tap Telegram link - opens your new URL!

### Method 2: Test API Response

Open in browser: `https://buffalo-dashboard.onrender.com/api/buttons`

You'll see JSON like:

```json
{
  "success": true,
  "data": [
    {
      "_id": "...",
      "name": "Telegram Link",
      "url": "https://t.me/blahblah",
      "icon": "send",
      "linkType": "redirect",
      "displayText": "",
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
```

---

## 🎯 Your 4 Links Explained

| Name              | Type     | Purpose            | Default Value             | How to Edit               |
| ----------------- | -------- | ------------------ | ------------------------- | ------------------------- |
| **Telegram Link** | Redirect | Opens Telegram app | `https://t.me/blahblah`   | Change URL field          |
| **Viber Link**    | Redirect | Opens Viber app    | `viber://chat?number=...` | Change URL field          |
| **Website Link**  | Redirect | Opens browser      | `https://youtube.com`     | Change URL field          |
| **Display Text**  | Text     | Shows message      | "Welcome to our service!" | Change Display Text field |

### What Shows in Flutter:

```
┌────────────────────────────────┐
│ 📝 Welcome to our service!    │  ← Display Text (blue info box)
└────────────────────────────────┘

┌────────────────────────────────┐
│ 📱 Telegram Link          →   │  ← Clickable, opens Telegram
└────────────────────────────────┘

┌────────────────────────────────┐
│ 📞 Viber Link             →   │  ← Clickable, opens Viber
└────────────────────────────────┘

┌────────────────────────────────┐
│ 🌐 Website Link           →   │  ← Clickable, opens browser
└────────────────────────────────┘
```

---

## 🔧 Network Configuration

### Production (Render Deployment) - RECOMMENDED ✅

```dart
static const String apiUrl = 'https://your-service-name.onrender.com/api/buttons';
```

✅ Works everywhere (Android, iOS, real devices, emulators)  
✅ No network configuration needed  
✅ Accessible from anywhere

### Local Development

#### iOS Simulator

```dart
static const String apiUrl = 'http://localhost:3000/api/buttons';
```

#### Android Emulator

The emulator treats `localhost` as itself, not your computer.

```dart
static const String apiUrl = 'http://10.0.2.2:3000/api/buttons';
```

#### Real Device (Same WiFi)

1. Find your computer's IP:
   - Mac: `ifconfig | grep "inet " | grep -v 127.0.0.1`
   - Windows: `ipconfig`
2. Use that IP:

```dart
static const String apiUrl = 'http://192.168.1.100:3000/api/buttons';
```

---

## 🔐 Authentication Note

The dashboard requires login to **edit** links.

However, the **API endpoint (`/api/buttons`) is PUBLIC** - no authentication needed!  
Your Flutter app can directly fetch links without any login. ✅

---

## 🔄 How Updates Work

```
┌──────────────────┐
│   Admin Panel    │  1. You login & edit Telegram URL
│  (Dashboard)     │     Change: https://t.me/NewChannel
└────────┬─────────┘     Click "Save Changes"
         │
         ↓
┌──────────────────┐
│    Database      │  2. MongoDB stores new URL
│   (MongoDB)      │     Telegram Link updated
└────────┬─────────┘
         │
         ↓
┌──────────────────┐
│   Flutter App    │  3. App fetches latest data
│                  │     - Pull to refresh
│  GET /api/buttons│     - Or restart app
│                  │     → New URL appears!
└──────────────────┘
```

**Result**: Update once in dashboard → Changes everywhere 🎉

---

## 📱 Common Flutter Patterns

### Pattern 1: Separate Text from Links

```dart
List<ButtonLink> get redirectLinks =>
    links.where((l) => l.isRedirect).toList();

List<ButtonLink> get textDisplays =>
    links.where((l) => l.isTextDisplay).toList();

// Show text first, then links
Column(
  children: [
    ...textDisplays.map((t) => InfoCard(text: t.displayText)),
    SizedBox(height: 16),
    ...redirectLinks.map((l) => LinkButton(link: l)),
  ],
)
```

### Pattern 2: Handle Different Link Types

```dart
void handleLink(ButtonLink link) {
  if (link.isRedirect) {
    // Open URL
    openUrl(link.url);
  } else if (link.isTextDisplay) {
    // Show in dialog or do nothing
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: Text(link.name),
        content: Text(link.displayText),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context),
            child: Text('OK'),
          ),
        ],
      ),
    );
  }
}
```

### Pattern 3: Auto-Refresh Every 30 Seconds

```dart
Timer? _refreshTimer;

@override
void initState() {
  super.initState();
  loadLinks();
  // Auto-refresh
  _refreshTimer = Timer.periodic(Duration(seconds: 30), (_) {
    loadLinks();
  });
}

@override
void dispose() {
  _refreshTimer?.cancel();
  super.dispose();
}
```

---

## 🐛 Troubleshooting

### ❌ Links Not Updating?

**Problem**: Changed link in dashboard, Flutter shows old URL

**Solution**:

1. Add pull-to-refresh (see code example above)
2. Or restart Flutter app
3. Check console: `print('Fetched ${links.length} links');`

### ❌ "Failed to load buttons"

**Check 1**: Is server running?

- Open `https://buffalo-dashboard.onrender.com/` in browser
- Should see login page

**Check 2**: Correct API URL?

- **Android emulator**: Use `10.0.2.2`
- **iOS simulator**: Use `localhost`
- **Real device**: Use computer's IP address

**Check 3**: Network permissions (Android)?
Add to `AndroidManifest.xml`:

```xml
<uses-permission android:name="android.permission.INTERNET"/>
```

### ❌ Can't Open Viber/Telegram Links?

**Problem**: Links don't open on iOS

**Solution**: Add URL schemes to `ios/Runner/Info.plist`:

```xml
<key>LSApplicationQueriesSchemes</key>
<array>
    <string>viber</string>
    <string>tg</string>
</array>
```

### ❌ Display Text Not Showing?

**Problem**: Only see 3 links, not 4

**Solution**: Check your filter logic:

```dart
// Make sure you're not filtering out text type
List<ButtonLink> buttons = (data['data'] as List)
    .map((json) => ButtonLink.fromJson(json))
    .where((button) => button.isActive) // ✅ Keep this
    // .where((button) => button.linkType == 'redirect') // ❌ Don't filter by type
    .toList();
```

### ❌ Render Server Timeout

**Problem**: First request takes forever (Render free tier)

**Solution**: Add timeout + retry:

```dart
static Future<List<ButtonLink>> getButtons() async {
  try {
    final response = await http.get(Uri.parse(apiUrl))
        .timeout(
          Duration(seconds: 60),
          onTimeout: () => throw TimeoutException('Server waking up...'),
        );
    // ... rest of code
  } on TimeoutException {
    print('Retrying in 3 seconds...');
    await Future.delayed(Duration(seconds: 3));
    return getButtons(); // Retry once
  }
}
```

---

## 💡 Pro Tips

1. **Cache for Offline**: Use `shared_preferences` to store last fetched links
2. **Loading States**: Show skeleton loader instead of spinner
3. **Error Handling**: Show friendly error messages with retry button
4. **Deep Links**: Parse URLs to navigate within app (e.g., `myapp://profile`)
5. **Analytics**: Track which links users tap most
6. **Animations**: Add hero animations when tapping links
7. **Pull to Refresh**: Always add `RefreshIndicator` for better UX

---

## 🚀 Deploy to Production (Render)

For production deployment, see [RENDER_DEPLOYMENT.md](RENDER_DEPLOYMENT.md)

Quick steps:

1. Set up MongoDB Atlas (free)
2. Push code to GitHub
3. Connect to Render.com
4. Add environment variables
5. Deploy!

Your dashboard will be at: `https://your-app.onrender.com`

**Update Flutter**:

```dart
static const String apiUrl = 'https://your-app.onrender.com/api/buttons';
```

✅ Works on all devices  
✅ No localhost issues  
✅ Free forever

---

## 📞 Need Help?

### Quick Checklist:

✅ Server running? Open `https://buffalo-dashboard.onrender.com/` in browser  
✅ Can login? Access the dashboard with your credentials  
✅ API working? Check `https://buffalo-dashboard.onrender.com/api/buttons`  
✅ Flutter connected? Console should show "Fetching buttons..."  
✅ Links appear? Should see 4 items (3 clickable + 1 info)

### Common Issues:

- **Can't login?** Verify your admin credentials
- **Port 3000 in use?** Run: `lsof -ti:3000 | xargs kill -9`
- **Flutter can't connect?** Check API URL matches your environment
- **No data?** Run: `npm run reseed` to restore default links

---

## 🎉 Summary

Your Buffalo Dashboard gives you **4 managed links**:

✅ **No hardcoding** - Change URLs/text from admin panel  
✅ **Real-time updates** - Edit once, update everywhere  
✅ **Simple integration** - Just 1 API call in Flutter  
✅ **Flexible** - 3 redirect links + 1 display text  
✅ **Secure** - Admin panel protected, API public for reading  
✅ **Free** - Deploy to Render at no cost

**Your 4 Links:**

1. Telegram → Opens Telegram app
2. Viber → Opens Viber app
3. Website → Opens browser
4. Display Text → Shows custom message

**Happy coding!** 🐃
