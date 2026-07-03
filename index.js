const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const fileRoutes = require("./routes/fileRoutes");
const path = require("path");

dotenv.config();

// Connect Database
connectDB();

const app = express();

// ✅ TEMPORARY CORS (Allow all origins for testing)
app.use(
  cors({
    origin: true,
    credentials: true,
    methods: ["GET", "POST", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// Middleware
app.use(express.json());

// Static folder
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Routes
app.use("/api/files", fileRoutes);

// Test Route
app.get("/", (req, res) => {
  res.send("Drive Backend Running 🚀");
});

// Start Server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});