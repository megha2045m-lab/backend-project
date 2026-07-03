const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const fileRoutes = require("./routes/fileRoutes");
const path = require("path");

dotenv.config();

connectDB();

const app = express();

const allowedOrigins = [
  "https://frontend-project-ibx91rbvo-megha2045m-labs-projects.vercel.app",
  "https://frontend-project-1dr7yx651-megha2045m-labs-projects.vercel.app",
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      }
      return callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
  })
);
app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use("/api/files", fileRoutes);

app.get("/", (req, res) => {
  res.send("Drive Backend Running 🚀");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});