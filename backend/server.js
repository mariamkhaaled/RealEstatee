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
const messageRoutes = require("./routes/message.routes");
const inquiryRoutes = require("./routes/inquiry.routes");

require("./config/db");
const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL || "http://localhost:5173",
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
});

// 1. GLOBAL MIDDLEWARES
app.use(cors());
app.use(express.json());

app.use("/api/properties", propertyRouter);
app.use("/api/features", featureRouter);
app.use("/api/auth", authRouter);
app.use("/api/otp", otpRoutes);
app.use("/api/user", userRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/inquiries", inquiryRoutes);
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// 2. ROUTES (We will add more here later)
app.get("/", (req, res) => {
  res.status(200).json({
    status: "success",
    message: "Real Estate API is live and healthy.",
  });
});

// 3. GLOBAL ERROR HANDLER
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    status: "error",
    message: err.message || "Internal Server Error",
  });
});

// 4. SERVER START
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
