const express = require("express");
const connectDB = require("./config/database");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const http = require("http");
require("dotenv").config();

const app = express();

// CORS configuration
const corsOptions = {
  origin: [process.env.CLIENT_URL, "http://localhost:5173"], // Allow both deployed & local frontend
  methods: ["GET", "POST", "PATCH", "DELETE", "OPTIONS"],
  credentials: true, // Required for authentication (cookies, sessions)
};

app.use(cors(corsOptions));
app.options("*", cors(corsOptions)); // Handle preflight requests
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

// Connect to DB and start server
connectDB()
  .then(() => {
    console.log("Database connected...");
    const PORT = process.env.PORT || 5000;
    server.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => console.error("Database connection failed!", err));
