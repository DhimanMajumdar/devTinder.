const socket = require("socket.io");
const crypto = require("crypto");
const { Chat } = require("../models/chat");
const mongoose = require("mongoose");

const getSecretRoomId = (userId, targetUserId) => {
  return crypto
    .createHash("sha256")
    .update([userId, targetUserId].sort().join("_"))
    .digest("hex");
};

const initializeSocket = (server) => {
  const io = socket(server, {
    cors: {
      origin: [process.env.CLIENT_URL || "http://localhost:5173"],
      methods: ["GET", "POST"],
      credentials: true,
    },
    path: "/socket.io/",
  });

  io.on("connection", (socket) => {
    console.log("🟢 New WebSocket Connection:", socket.id);

    socket.on("joinChat", ({ firstName, userId, targetUserId }) => {
      const roomId = getSecretRoomId(userId, targetUserId);
      console.log(`${firstName} joined Room: ${roomId}`);
      socket.join(roomId);
    });

    socket.on(
      "sendMessage",
      async ({ firstName, userId, targetUserId, text }) => {
        try {
          const roomId = getSecretRoomId(userId, targetUserId);
          console.log(`${firstName}: ${text}`);

          let chat = await Chat.findOne({
            participants: {
              $all: [
                new mongoose.Types.ObjectId(userId),
                new mongoose.Types.ObjectId(targetUserId),
              ],
            },
          });

          if (!chat) {
            chat = new Chat({
              participants: [
                new mongoose.Types.ObjectId(userId),
                new mongoose.Types.ObjectId(targetUserId),
              ],
              messages: [],
            });
          }

          chat.messages.push({
            senderId: new mongoose.Types.ObjectId(userId),
            text,
          });
          await chat.save();

          io.to(roomId).emit("messageReceived", {
            firstName,
            text,
            timeStamp: new Date(),
          });
        } catch (err) {
          console.error(err);
        }
      }
    );

    socket.on("disconnect", () => {
      console.log("User disconnected:", socket.id);
    });
  });

  return io;
};

module.exports = initializeSocket;
