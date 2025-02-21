const jwt = require("jsonwebtoken");
const User = require("../models/user");

const userAuth = async (req, res, next) => {
  try {
    // Read the token from the req cookies
    const { token } = req.cookies;
    if (!token) {
      return res.status(401).send("Unauthorized: No token provided");
    }
    
    const decodeObj = jwt.verify(token,process.env.JWT_SECRET);
    const { _id } = decodeObj;
    
    const user = await User.findById(_id);
    if (!user) {
      return res.status(404).send("User not found");
    }
    
    req.user = user;
    next();
  } catch (err) {
    return res.status(401).send("Unauthorized: Invalid token");
  }
};

module.exports = {
  userAuth,
};
