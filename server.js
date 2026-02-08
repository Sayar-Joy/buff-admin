require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const { ButtonLink, AppConfig } = require('./models/buttonLink');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/buffalo_dashboard')
  .then(async () => {
    console.log('✓ MongoDB connected successfully');
    await initializeApp();
  })
  .catch(err => console.error('✗ MongoDB connection error:', err));

// Initialize app with demo data
async function initializeApp() {
  try {
    // Create default app config if it doesn't exist
    const configCount = await AppConfig.countDocuments();
    if (configCount === 0) {
      const hostname = process.env.HOSTNAME || 'localhost';
      const port = process.env.PORT || 3000;
      await AppConfig.create({
        appName: 'My Flutter App',
        apiUrl: `http://${hostname}:${port}/api/buttons`
      });
      console.log('✓ App configuration initialized');
    }

    // Create demo buttons if none exist
    const buttonCount = await ButtonLink.countDocuments();
    if (buttonCount === 0) {
      const demoButtons = [
        {
          name: 'Home Page',
          url: 'https://example.com/home',
          icon: 'home',
          description: 'Main home page of the application',
          isActive: true,
          order: 1
        },
        {
          name: 'Profile',
          url: 'https://example.com/profile',
          icon: 'person',
          description: 'User profile settings',
          isActive: true,
          order: 2
        },
        {
          name: 'Settings',
          url: 'https://example.com/settings',
          icon: 'settings',
          description: 'App settings and preferences',
          isActive: true,
          order: 3
        }
      ];
      await ButtonLink.insertMany(demoButtons);
      console.log('✓ Demo buttons created');
    }
  } catch (error) {
    console.error('Error initializing app:', error);
  }
}

// API Routes

// Get app configuration
app.get('/api/config', async (req, res) => {
  try {
    let config = await AppConfig.findOne();
    if (!config) {
      const hostname = req.hostname === 'localhost' ? 'localhost' : req.hostname;
      const port = process.env.PORT || 3000;
      config = await AppConfig.create({
        appName: 'My Flutter App',
        apiUrl: `http://${hostname}:${port}/api/buttons`
      });
    }
    res.json({ success: true, data: config });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Update app configuration
app.put('/api/config', async (req, res) => {
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
app.get('/api/buttons', async (req, res) => {
  try {
    const buttons = await ButtonLink.find().sort({ order: 1 });
    res.json({ success: true, data: buttons });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get single button link
app.get('/api/buttons/:id', async (req, res) => {
  try {
    const button = await ButtonLink.findById(req.params.id);
    if (!button) {
      return res.status(404).json({ success: false, message: 'Button not found' });
    }
    res.json({ success: true, data: button });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Create button link
app.post('/api/buttons', async (req, res) => {
  try {
    const button = new ButtonLink(req.body);
    await button.save();
    res.status(201).json({ success: true, data: button });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

// Update button link
app.put('/api/buttons/:id', async (req, res) => {
  try {
    const button = await ButtonLink.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!button) {
      return res.status(404).json({ success: false, message: 'Button not found' });
    }
    res.json({ success: true, data: button });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

// Delete button link
app.delete('/api/buttons/:id', async (req, res) => {
  try {
    const button = await ButtonLink.findByIdAndDelete(req.params.id);
    if (!button) {
      return res.status(404).json({ success: false, message: 'Button not found' });
    }
    res.json({ success: true, message: 'Button deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`✓ Server running on http://localhost:${PORT}`);
});
