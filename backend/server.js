require("dotenv").config();
const express = require("express");
const path = require("path");
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");

const propertyRouter = require("./routes/propertyRoutes");
const featureRouter = require("./routes/featureRoutes");
const authRouter = require("./routes/auth.routes");
const otpRoutes = require("./routes/otp.routes");
const userRoutes = require("./routes/user.routes");
const favoriteRouter = require("./routes/favoriteRoutes");
const messageRoutes = require("./routes/message.routes");
const inquiryRoutes = require("./routes/inquiry.routes");

require("./config/db");

const app = express();
const server = http.createServer(app);

const corsOrigins = (process.env.CORS_ORIGINS || process.env.CLIENT_URL || "")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

const allowedOrigins =
  corsOrigins.length > 0
    ? corsOrigins
    : ["http://localhost:5173", "http://localhost:5174"];

const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
    methods: ["GET", "POST"],
  },
});

app.set("io", io);

io.on("connection", (socket) => {
  socket.on("join", (inquiryId) => {
    if (inquiryId) {
      socket.join(`inquiry_${inquiryId}`);
    }
  });

  socket.on("typing", (payload = {}) => {
    const inquiryId = Number(payload.inquiryId);
    if (!inquiryId) {
      return;
    }

    socket.to(`inquiry_${inquiryId}`).emit("typing", {
      inquiryId,
      userId: Number(payload.userId) || 0,
      userName: payload.userName || "User",
      isTyping: Boolean(payload.isTyping),
    });
  });
});

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  }),
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.use("/api/properties", propertyRouter);
app.use("/api/features", featureRouter);
app.use("/api/auth", authRouter);
app.use("/api/otp", otpRoutes);
app.use("/api/user", userRoutes);
app.use("/api/favorites", favoriteRouter);
app.use("/api/messages", messageRoutes);
app.use("/api/inquiries", inquiryRoutes);

app.get("/", (req, res) => {
  res.status(200).json({
    status: "success",
    message: "Real Estate API is live and healthy.",
  });
});

app.use((req, res) => {
  res.status(404).json({
    status: "error",
    message: "Route not found",
  });
});

app.use((err, req, res, next) => {
  console.error("ERROR:", err);
  res.status(err.statusCode || 500).json({
    status: "error",
    message: err.message || "Internal Server Error",
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
