const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const secretKey = process.env.JWT_SECRET;
const authenticateToken = (req, res, next) => {
  const token = req.header("Authorization");

  if (!token) {
    return res
      .status(401)
      .json({ message: "Access denied. Token not provided." });
  }

  jwt.verify(token, secretKey, (err, user) => {
    if (err) {
      return res.status(403).json({ message: "Invalid token." });
    }

    req.user = user;
    next();
  });
};

router.get("/protected-endpoint", authenticateToken, (req, res) => {
  res.json({ message: "This is a protected endpoint." });
});

module.exports = router;
