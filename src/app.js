const express = require("express");
const connectDB = require("./config/database");
const app = express();
const cookieParser = require("cookie-parser");
const cors = require("cors");
require('dotenv').config()

// CORS configuration
const corsOptions = {
  origin: 'http://localhost:5173',  // Your frontend URL
  methods: ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS'],  // Ensure PATCH is allowed
  credentials: true,  // Allow credentials (like cookies)
};

// Apply CORS middleware with the correct options
app.use(cors(corsOptions));

// Handle preflight requests (OPTIONS)
app.options('*', cors(corsOptions));



// Body parsing middleware
app.use(express.json());
app.use(cookieParser());

// Import routes
const authRouter = require("./routes/auth");
const profileRouter = require("./routes/profile");
const requestRouter = require("./routes/request");
const userRouter = require("./routes/user");

// Use routers
app.use("/", authRouter, profileRouter, requestRouter, userRouter);

// Connect to the database and start server
connectDB()
  .then(() => {
    console.log("Database connection established...");
    
    // Listen on port 5000
    app.listen(5000, () => {
      console.log("Server is successfully listening on port 5000...");
    });
  })
  .catch((err) => {
    console.error("Database cannot be connected!", err);
  });
