require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const { ButtonLink, AppConfig, Admin } = require("./models/buttonLink");

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Auth middleware
function authMiddleware(req, res, next) {
  const token = req.headers.authorization?.replace("Bearer ", "");
  
  if (!token) {
    return res.status(401).json({ success: false, message: "No token provided" });
  }

  // Simple token validation (in production, use JWT)
  if (token !== process.env.AUTH_SECRET && !token.startsWith("admin_")) {
    return res.status(401).json({ success: false, message: "Invalid token" });
  }

  next();
}

// Serve login page for unauthenticated users
app.get("/", (req, res, next) => {
  const token = req.query.token || req.headers.authorization?.replace("Bearer ", "");
  if (!token) {
    return res.sendFile(__dirname + "/public/login.html");
  }
  next();
});

app.use(express.static("public"));

// MongoDB Connection
mongoose
  .connect(
    process.env.MONGODB_URI || "mongodb://localhost:27017/buffalo_dashboard",
  )
  .then(async () => {
    console.log("✓ MongoDB connected successfully");
    await initializeApp();
  })linkType: "redirect",
          isActive: true,
          order: 1,
        },
        {
          name: "Viber Link",
          url: "viber://chat?number=%2B959956252246",
          icon: "phone",
          linkType: "redirect",
          isActive: true,
          order: 2,
        },
        {
          name: "Website Link",
          url: "https://youtube.com",
          icon: "language",
          linkType: "redirect",
          isActive: true,
          order: 3,
        },
        {
          name: "Display Text",
          url: "",
          displayText: "Welcome to our service!",
          icon: "info",
          linkType: "text",
          isActive: true,
          order: 4,
        },
      ];
      await ButtonLink.insertMany(demoButtons);
      console.log("✓ Demo buttons created");
    }

    // Create default admin if none exists
    const adminCount = await Admin.countDocuments();
    if (adminCount === 0) {
      await Admin.create({
        username: "admin",
        password: "admin123",
      });
      console.log("✓ Default admin created (username: admin, password: admin123)
          name: "Telegram Link",
          url: "https://t.me/blahblah",
          icon: "send",
          description: "Contact us on Telegram",
          isActive: true,
          order: 1,
        },
        {
          name: "Viber Link",
          url: "viber://chat?number=%2B959956252246",
          icon: "phone",
          description: "Contact us on Viber",
          isActive: true,
          order: 2,
        },
   Authentication routes
app.post("/api/auth/login", async (req, res) => {
  try {
    const { username, password } = req.body;
    
    const admin = await Admin.findOne({ username });
    
    if (!admin || admin.password !== password) {
      return res.status(401).json({ 
        success: false, 
        message: "Invalid username or password" 
      });
    }

    // Update last login
    admin.lastLogin = new Date();
    await admin.save();

    // Generate simple token (in production, use JWT)
    const token = `admin_${admin._id}_${Date.now()}`;
    uthMiddleware, a
    res.json({ 
      success: true, 
      token,
      message: "Login successful" 
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

app.post("/api/auth/verify", (req, res) => {
  const token = req.headers.authorization?.replace("Bearer ", "");
  
  if (!token || !token.startsWith("admin_")) {
    return res.json({ success: false, authenticated: false });
  }

  res.json({ success: true, authenticated: true });
});

//      {
          name: "Website Link",
          url: "https://youtube.com",
          icon: "language",
          description: "Visit our website",
          isActive: true,
          order: 3,
        },
      ];
      await ButtonLink.insertMany(demoButtons);
      console.log("✓ Demo buttons created");
    }
  } catch (error) {
    console.error("Error initializing app:", error);
  }
}

// API Routes

// Get app configuration
app.get("/api/config", async (req, res) => {
  try {
    let config = await AppConfig.findOne();
    if (!config) {
      const hostname =
        req.hostname === "localhost" ? "localhost" : req.hostname;
      const port = process.env.PORT || 3000;
      config = await AppConfig.create({
        appName: "My Flutter App",
        apiUrl: `http://${hostname}:${port}/api/buttons`,
      });
    }
    res.json({ success: true, data: config });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Update app configuration4 links only)
app.post("/api/buttons", authMiddlewareasync (req, res) => {
  try {
    let config = await AppConfig.findOne();
    if (!config) {
      config = new AppConfig();
    }
    config.appName = req.body.appName || config.appName;
    config.lastUpdated = Date.now();
    await config.save();
    res.json({ success: true, data: config });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

// Get all button links
app.get("/api/buttons", async (req, res) => {
  try {
    const buttons = await ButtonLink.find().sort({ order: 1 });
    res.json({ success: true, data: buttons });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get single button link
app.get("/api/buttons/:id", async (req, res) => {
  try {
    const button = await ButtonLink.findById(req.params.id);
    if (!button) {
      return res
        .status(404)
        .json({ success: false, message: "Button not found" });
    }
    res.json({ success: true, data: button });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Create button link (DISABLED - Fixed 3 links only)
app.post("/api/buttons", async (req, res) => {
  res.status(403).json({
    success: false,
    message:
      "Adding new links is disabled. Only the 3 fixed links can be edited.",
  });
});

// Update button link (Only URL and description)
app.put("/api/buttons/:id", async (req, res) => {
  try {
    // Only allow updating url and description
    const updateData = {
      url: req.body.url,
      description: req.body.description,
    };

    const button = await ButtonLink.findByIdAndUpdate(
      req.params.id,
      updateData,
      {
        new: true,
        runValidators: true,
      },
    );

    if (!button) {
      return res
        .status(404)
        .json({ success: false, message: "Button not found" });
    }
    res.json({ success: true, data: button });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

// Delete button link (DISABLED - Fixed 3 links only)
app.delete("/api/buttons/:id", async (req, res) => {
  res.status(403).json({
    success: false,
    message:
      "Deleting links is disabled. Only the 3 fixed links can be edited.",
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`✓ Server running on http://localhost:${PORT}`);
});
