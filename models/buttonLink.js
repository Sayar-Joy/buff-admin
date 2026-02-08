const mongoose = require('mongoose');

// App Configuration Schema
const appConfigSchema = new mongoose.Schema({
  appName: {
    type: String,
    default: 'My Flutter App'
  },
  apiUrl: {
    type: String,
    default: ''
  },
  lastUpdated: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

const AppConfig = mongoose.model('AppConfig', appConfigSchema);

// Button Link Schema
const buttonLinkSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  url: {
    type: String,
    required: true,
    trim: true
  },
  icon: {
    type: String,
    default: ''
  },
  description: {
    type: String,
    default: ''
  },
  isActive: {
    type: Boolean,
    default: true
  },
  order: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

const ButtonLink = mongoose.model('ButtonLink', buttonLinkSchema);

module.exports = { ButtonLink, AppConfig };
