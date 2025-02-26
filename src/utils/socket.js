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
      origin: "http://localhost:5173",
    },
  });

  io.on("connection", (socket) => {
    socket.on("joinChat", ({ firstName, userId, targetUserId }) => {
      const roomId = getSecretRoomId(userId, targetUserId);
      console.log(`${firstName} Joined Room: ${roomId}`);
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
                new mongoose.Types.ObjectId(targetUserId)
              ] 
            }
          });

          if (!chat) {
            chat = new Chat({
              participants: [
                new mongoose.Types.ObjectId(userId), 
                new mongoose.Types.ObjectId(targetUserId)
              ],
              messages: [],
            });
          }

          chat.messages.push({ senderId: new mongoose.Types.ObjectId(userId), text });
          await chat.save();

          io.to(roomId).emit("messageReceived", { firstName, text, timeStamp: new Date() });
        } catch (err) {
          console.error(err);
        }
      }
    );

    socket.on("disconnect", () => {});
  });
};

module.exports = initializeSocket;
