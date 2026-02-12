require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const { ButtonLink, AppConfig, Admin } = require("./models/buttonLink");

async function reseedDatabase() {
  try {
    // Connect to MongoDB
    await mongoose.connect(
      process.env.MONGODB_URI || "mongodb://localhost:27017/buffalo_dashboard",
    );
    console.log("✓ Connected to MongoDB");

    // Clear existing data
    await ButtonLink.deleteMany({});
    await AppConfig.deleteMany({});
    await Admin.deleteMany({});
    console.log("✓ Cleared existing data");

    // Create admin user - set credentials via environment variables
    const adminUsername = process.env.ADMIN_USERNAME || "heinhtet";
    const adminPassword = process.env.ADMIN_PASSWORD || "javburmaadminjeff";
    const hashedPassword = await bcrypt.hash(adminPassword, 10);
    await Admin.create({
      username: adminUsername,
      password: hashedPassword,
    });
    console.log("✓ Admin user created");

    // Create default app config
    const hostname = process.env.HOSTNAME || "localhost";
    const port = process.env.PORT || 3000;
    await AppConfig.create({
      appName: "My Flutter App",
      apiUrl: `http://${hostname}:${port}/api/buttons`,
    });
    console.log("✓ App configuration created");

    // Create 4 links (3 redirect + 1 text)
    const demoButtons = [
      {
        name: "Telegram Link",
        url: "https://t.me/blahblah",
        icon: "send",
        linkType: "redirect",
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
    console.log("✓ Demo links created (3 redirect + 1 text)");
    console.log(`✓ Successfully seeded ${demoButtons.length} links`);

    // Close connection
    await mongoose.connection.close();
    console.log("✓ Database reseeded successfully");
    process.exit(0);
  } catch (error) {
    console.error("✗ Error reseeding database:", error);
    process.exit(1);
  }
}

reseedDatabase();
