require("dotenv").config();
const express = require("express");
const path = require("path");
const cors = require("cors");

// ======================
// ROUTES IMPORTS
// ======================
const propertyRouter = require("./routes/propertyRoutes");
const featureRouter = require("./routes/featureRoutes");
const authRouter = require("./routes/auth.routes");
const otpRoutes = require("./routes/otp.routes");
const userRoutes = require("./routes/user.routes");
const favoriteRouter = require("./routes/favoriteRoutes");

// ======================
// DB CONNECTION
// ======================
require("./config/db");

const app = express();

// ======================
// GLOBAL MIDDLEWARES
// ======================
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ======================
// STATIC FILES
// ======================
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// ======================
// API ROUTES
// ======================
app.use("/api/properties", propertyRouter);
app.use("/api/features", featureRouter);
app.use("/api/auth", authRouter);
app.use("/api/otp", otpRoutes);
app.use("/api/user", userRoutes);
app.use("/api/favorites", favoriteRouter);

// ======================
// HEALTH CHECK
// ======================
app.get("/", (req, res) => {
  res.status(200).json({
    status: "success",
    message: "Real Estate API is live and healthy 🚀",
  });
});

// ======================
// 404 HANDLER
// ======================
app.use((req, res) => {
  res.status(404).json({
    status: "error",
    message: "Route not found",
  });
});

// ======================
// ERROR HANDLER
// ======================
app.use((err, req, res, next) => {
  console.error("🔥 ERROR:", err);

  res.status(err.statusCode || 500).json({
    status: "error",
    message: err.message || "Internal Server Error",
  });
});

// ======================
// SERVER START
// ======================
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});