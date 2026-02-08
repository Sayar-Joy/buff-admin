# 🐃 Buffalo Dashboard

**Admin dashboard to manage button links for your Flutter app**

Control your Flutter app's button destinations remotely through a beautiful web dashboard. Change URLs, add new buttons, and manage your app's navigation without releasing updates!

---

## 🌟 Features

- ✅ **Manage Button Links** - Create, edit, delete buttons from web dashboard
- ✅ **Real-time Updates** - Changes reflect instantly in your Flutter app
- ✅ **Beautiful UI** - Modern, responsive admin interface
- ✅ **REST API** - Easy integration with Flutter
- ✅ **MongoDB Backend** - Reliable cloud database
- ✅ **Free Deployment** - Host on Render free tier
- ✅ **Demo Data** - Pre-loaded buttons to get started

---

## 🚀 Quick Start

### Option 1: Deploy to Render (Recommended)
**Best for production use - completely free!**

📖 **[Full Deployment Guide →](RENDER_DEPLOYMENT.md)**

Quick summary:
1. Set up MongoDB Atlas (free cloud database)
2. Push this repo to GitHub
3. Connect to Render.com
4. Deploy in 5 minutes!

Your dashboard will be live at: `https://your-app.onrender.com`

### Option 2: Run Locally (Development)

1. **Clone and Install:**
```bash
git clone https://github.com/Sayar-Joy/buff-admin.git
cd buff-admin
npm install
```

2. **Set up MongoDB:**
   - Install MongoDB locally, OR
   - Use MongoDB Atlas (cloud - easier!)

3. **Configure Environment:**
```bash
cp .env.example .env
# Edit .env and add your MongoDB connection string
```

4. **Start Server:**
```bash
npm start
```

5. **Open Dashboard:**
```
http://localhost:3000
```

---

## 📱 Connect Your Flutter App

### 1. Copy API Endpoint
Open your dashboard and copy the API URL from the green connection box at the top.

### 2. Add to Flutter App
```dart
class ButtonService {
  // Use your Render URL or localhost
  static const String apiUrl = 'https://your-app.onrender.com/api/buttons';
  
  static Future<List<dynamic>> getButtons() async {
    final response = await http.get(Uri.parse(apiUrl));
    if (response.statusCode == 200) {
      final data = json.decode(response.body);
      return data['data'];
    }
    return [];
  }
}
```

### 3. Display in Your UI
```dart
final buttons = await ButtonService.getButtons();
ListView.builder(
  itemCount: buttons.length,
  itemBuilder: (context, index) {
    return ListTile(
      title: Text(buttons[index]['name']),
      onTap: () => launch(buttons[index]['url']),
    );
  },
)
```

**📚 Complete Flutter Integration Guide:** [FLUTTER_INTEGRATION.md](FLUTTER_INTEGRATION.md)

---

## 🔌 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/buttons` | Get all button links |
| `GET` | `/api/buttons/:id` | Get single button |
| `POST` | `/api/buttons` | Create new button |
| `PUT` | `/api/buttons/:id` | Update button |
| `DELETE` | `/api/buttons/:id` | Delete button |
| `GET` | `/api/config` | Get app configuration |
| `PUT` | `/api/config` | Update app configuration |

---

## 🎯 How It Works

```
┌─────────────────┐         ┌──────────────┐         ┌─────────────────┐
│  Web Dashboard  │────1───▶│   MongoDB    │◀───2────│   Flutter App   │
│  (Admin Panel)  │  Change │  (Database)  │  Fetch  │  (Your Users)   │
│                 │  Links  │              │  Links  │                 │
└─────────────────┘         └──────────────┘         └─────────────────┘
```

1. **You manage buttons** in the web dashboard
2. **Data saved to MongoDB** (cloud database)
3. **Flutter app fetches** latest button links
4. **Users see updated** buttons instantly!

---

## 📂 Project Structure

```
buffalo-dashboard/
├── server.js              # Node.js Express server
├── package.json           # Dependencies
├── render.yaml            # Render deployment config
├── models/
│   └── buttonLink.js      # MongoDB schemas
├── public/
│   ├── index.html         # Dashboard UI
│   ├── css/
│   │   └── style.css      # Styling
│   └── js/
│       └── app.js         # Frontend JavaScript
└── docs/
    ├── RENDER_DEPLOYMENT.md      # Deploy to Render guide
    ├── FLUTTER_INTEGRATION.md    # Flutter setup guide
    └── HOW_IT_WORKS.md          # Detailed explanation
```

---

## 🛠️ Tech Stack

- **Backend:** Node.js + Express
- **Database:** MongoDB (Atlas)
- **Frontend:** Vanilla JavaScript + HTML/CSS
- **Deployment:** Render (free tier)
- **Mobile:** Flutter integration

---

## 📖 Documentation

- **[🚀 Render Deployment Guide](RENDER_DEPLOYMENT.md)** - Deploy to production
- **[📱 Flutter Integration Guide](FLUTTER_INTEGRATION.md)** - Connect to Flutter app
- **[📚 How It Works](HOW_IT_WORKS.md)** - Detailed explanation
- **[⚡ Quick Start](QUICK_START.md)** - Local development setup

---

## 🌐 Live Demo

Once deployed to Render, your dashboard will be accessible at:
```
https://your-service-name.onrender.com
```

API endpoint for Flutter:
```
https://your-service-name.onrender.com/api/buttons
```

---

## ⚙️ Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `MONGODB_URI` | MongoDB connection string | `mongodb+srv://user:pass@cluster.net/db` |
| `PORT` | Server port (auto-set by Render) | `3000` |
| `NODE_ENV` | Environment mode | `production` |

---

## 🤝 Contributing

Contributions are welcome! Feel free to:
- Report bugs
- Suggest features
- Submit pull requests

---

## 📄 License

ISC License - Free to use and modify

---

## 🎉 Get Started Now!

1. **Deploy to Render:** Follow [RENDER_DEPLOYMENT.md](RENDER_DEPLOYMENT.md)
2. **Integrate Flutter:** Follow [FLUTTER_INTEGRATION.md](FLUTTER_INTEGRATION.md)
3. **Start Managing:** Change button links from anywhere!

**Questions?** Check the documentation or open an issue on GitHub.

---

**Made with ❤️ for Flutter developers**
