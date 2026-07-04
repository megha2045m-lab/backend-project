const mongoose = require("mongoose");

const connectDB = async () => {
  const dbUri = process.env.MONGODB_URI || process.env.DATABASE_URL;

  if (!dbUri) {
    console.error("❌ Error: MONGODB_URI or DATABASE_URL is not defined in environment variables.");
    process.exit(1);
  }

  try {
    await mongoose.connect(dbUri);

    console.log("✅ Database Connected successfully");
  } catch (error) {
    console.error("❌ Database Connection Failed");
    console.error(error.message);
    process.exit(1);
  }
};

module.exports = connectDB;