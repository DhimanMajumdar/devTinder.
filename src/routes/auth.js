const express = require("express");
const authRouter = express.Router();
const { validateSignUpData } = require("../utils/validation");
const User = require("../models/user");
const bcrypt = require("bcrypt");

authRouter.post("/signup", async (req, res) => {
  try {
    validateSignUpData(req);
    const { firstName, lastName, emailId, password, gender } = req.body;

    const existingUser = await User.findOne({ emailId });
    if (existingUser) {
      return res
        .status(400)
        .json({ message: "User with this email already exists." });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const user = new User({
      firstName,
      lastName,
      emailId,
      gender,
      password: passwordHash,
    });
    const savedUser = await user.save();
    const token = await savedUser.getJWT();

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // ✅ Only secure in production
      sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax", // ✅ Allows cross-site cookies
      expires: new Date(Date.now() + 8 * 3600000),
    });

    res.json({ message: "User added successfully!", data: savedUser });
  } catch (err) {
    res.status(400).json({ message: "ERROR: " + err.message });
  }
});

authRouter.post("/login", async (req, res) => {
  try {
    const { emailId, password } = req.body;
    const user = await User.findOne({ emailId });

    if (!user || !(await user.validatePassword(password))) {
      throw new Error("Invalid Credentials!!");
    }

    const token = await user.getJWT();

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
      expires: new Date(Date.now() + 8 * 3600000),
    });

    res.json({ message: "Login successful!", user });
  } catch (err) {
    res.status(400).json({ message: "ERROR: " + err.message });
  }
});

authRouter.post("/logout", async (req, res) => {
  res.cookie("token", "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
    expires: new Date(0),
  });
  res.json({ message: "Logout successful!" });
});

module.exports = authRouter;
