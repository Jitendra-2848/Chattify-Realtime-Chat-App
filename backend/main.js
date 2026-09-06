require("dotenv").config();
const cors = require("cors");
const path = require("path");
const cookieParser = require("cookie-parser");
const mongoose = require("mongoose");
const express = require("express");

// Import from socket.js
const { app, server } = require("./lib/socket");

// Import routes
const userRoute = require("./route/user");
const messageRoute = require("./route/message");

// Allowed origins for CORS (supports local dev and deployed client)
const allowedOrigins = [
  "http://localhost:5173",
  ...(process.env.CLIENT_URL ? process.env.CLIENT_URL.split(",").map((u) => u.trim()) : []),
];

// Middlewares
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));
app.use(cookieParser());
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) return callback(null, true);
      // Allow vercel / render domains if frontend is hosted there
      if (/^https:\/\/.*\.vercel\.app$/.test(origin) || /^https:\/\/.*\.onrender\.com$/.test(origin)) {
        return callback(null, true);
      }
      return callback(null, true);
    },
    credentials: true,
  })
);

// Ultra-fast Health Check route for Render cold-start detection & pinging
app.get("/health", (req, res) => {
  res.status(200).json({
    status: "ok",
    uptime: Math.floor(process.uptime()),
    timestamp: Date.now(),
    message: "Server is awake and healthy",
  });
});

// Routes
app.use("/message", messageRoute);
app.use(userRoute);

// Test route
app.get("/test", (req, res) => {
  res.json({ message: "Server is working!" });
});

// Database connection
mongoose
  .connect(`${process.env.Mongodb_URL}`)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.error("❌ MongoDB Error:", err.message));

// Start server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});




