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

// Middlewares
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));
app.use(cookieParser());
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

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