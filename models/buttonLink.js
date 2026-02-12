const mongoose = require("mongoose");

// Admin Schema
const adminSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },
    lastLogin: {
      type: Date,
    },
  },
  {
    timestamps: true,
  },
);

const Admin = mongoose.model("Admin", adminSchema);

// App Configuration Schema
const appConfigSchema = new mongoose.Schema(
  {
    appName: {
      type: String,
      default: "My Flutter App",
    },
    apiUrl: {
      type: String,
      default: "",
    },
    lastUpdated: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  },
);

const AppConfig = mongoose.model("AppConfig", appConfigSchema);

// Button Link Schema
const buttonLinkSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    url: {
      type: String,
      trim: true,
      default: "",
    },
    icon: {
      type: String,
      default: "",
    },
    displayText: {
      type: String,
      default: "",
    },
    linkType: {
      type: String,
      enum: ["redirect", "text"],
      default: "redirect",
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    order: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  },
);

const ButtonLink = mongoose.model("ButtonLink", buttonLinkSchema);

module.exports = { ButtonLink, AppConfig, Admin };
