const { Server } = require("socket.io");
const express = require("express");
const http = require("http");

const app = express();
const server = http.createServer(app);

const allowedOrigins = [
  "http://localhost:5173",
  ...(process.env.CLIENT_URL ? process.env.CLIENT_URL.split(",").map((u) => u.trim()) : []),
];

const io = new Server(server, {
  cors: {
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) return callback(null, true);
      if (/^https:\/\/.*\.vercel\.app$/.test(origin) || /^https:\/\/.*\.onrender\.com$/.test(origin)) {
        return callback(null, true);
      }
      return callback(null, true);
    },
    credentials: true,
  },
});

const onlineUsers = {};

io.on("connection", (socket) => {
  console.log("⚡ User connected:", socket.id);

  // User joins
  socket.on("join", (userId) => {
    if (userId) {
      onlineUsers[userId] = socket.id;
      console.log("✅ User joined:", userId);
      console.log("📋 Online users:", Object.keys(onlineUsers));
      
      io.emit("onlineUsers", Object.keys(onlineUsers));
    }
  });

  // Receive message from sender → Send to receiver
  socket.on("sendMessage", (data) => {
    console.log("📨 Message received:", data);
    
    const receiverSocketId = onlineUsers[data.receiverId];
    console.log("🔍 Receiver socket:", receiverSocketId);
    
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("receiveMessage", data);
      console.log("✅ Message sent to receiver");
    } else {
      console.log("⚠️ Receiver is offline");
    }
  });

  // User disconnects
  socket.on("disconnect", () => {
    console.log("❌ User disconnected:", socket.id);
    
    for (let userId in onlineUsers) {
      if (onlineUsers[userId] === socket.id) {
        delete onlineUsers[userId];
        console.log("🗑️ Removed:", userId);
        break;
      }
    }
    
    io.emit("onlineUsers", Object.keys(onlineUsers));
  });
});

// Function to get receiver's socket ID
const getreceiver = (receiverId) => {
  return onlineUsers[receiverId];
};

module.exports = { app, getreceiver, io, server };