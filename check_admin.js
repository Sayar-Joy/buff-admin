require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const { Admin } = require("./models/buttonLink");

async function checkAdmin() {
  try {
    await mongoose.connect(
      process.env.MONGODB_URI || "mongodb://localhost:27017/buffalo_dashboard",
    );
    console.log("✓ Connected to MongoDB");

    // Check all admin users
    const admins = await Admin.find({});

    if (admins.length === 0) {
      console.log("✗ No admin users found in database!");
    } else {
      console.log(`✓ Found ${admins.length} admin user(s):`);
      admins.forEach((admin, index) => {
        console.log(`  ${index + 1}. Username: ${admin.username}`);
        console.log(
          `     Password hash: ${admin.password.substring(0, 20)}...`,
        );
      });
    }

    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error("Error:", error);
    process.exit(1);
  }
}

checkAdmin();
