const jwt = require("jsonwebtoken");
const User = require("../models/user.model");

// Protect routes (Verify JWT)
const protect = async (req, res, next) => {
  let token;

  // Check Authorization header
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      // Get token
      token = req.headers.authorization.split(" ")[1];

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Get user from DB (without password)
      req.user = await User.findById(decoded.id).select("-password");

      // Check if user still exists
      if (!req.user) {
        return res.status(401).json({
          message: "User no longer exists",
        });
      }

      next(); // Allow request
    } catch (error) {
      console.error("Auth Error:", error);

      return res.status(401).json({
        message: "Not authorized, token failed",
      });
    }
  }

  // If no token
  if (!token) {
    return res.status(401).json({
      message: "Not authorized, no token",
    });
  }
};

// Role authorization
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        message: "Access denied",
      });
    }

    next();
  };
};

module.exports = {
  protect,
  authorize,
};
