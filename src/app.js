const express = require("express");
const connectDB = require("./config/database");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const http = require("http");
require("dotenv").config();

const app = express();

const allowedOrigins = [process.env.CLIENT_URL || "http://localhost:5173"];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        console.error(`Blocked CORS request from: ${origin}`);
        callback(new Error("Not allowed by CORS"));
      }
    },
    methods: ["GET", "POST", "PATCH", "DELETE", "OPTIONS"],
    credentials: true, // ✅ Required for cookies/auth headers
    allowedHeaders: ["Content-Type", "Authorization", "Cookie"],
  })
);
app.options("*", cors()); // ✅ Allow preflight requests globally

app.use(express.json());
app.use(cookieParser());

// Import routes
const authRouter = require("./routes/auth");
const profileRouter = require("./routes/profile");
const requestRouter = require("./routes/request");
const userRouter = require("./routes/user");
const chatRouter = require("./routes/chat");

app.use("/", authRouter, profileRouter, requestRouter, userRouter, chatRouter);

const server = http.createServer(app);
const initializeSocket = require("./utils/socket");
initializeSocket(server);

connectDB()
  .then(() => {
    console.log("Database connected...");
    const PORT = process.env.PORT || 5000;
    server.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => console.error("Database connection failed!", err));
