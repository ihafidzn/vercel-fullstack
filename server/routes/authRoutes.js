// routes/authRoutes.js
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const express = require("express");
const authenticateToken = require("../middleware/authMiddleware");
const router = express.Router();
const RegisterModel = require("../models/Register");

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await RegisterModel.findOne({ email });

    if (user) {
      const isPasswordMatch = await bcrypt.compare(password, user.password);

      if (isPasswordMatch) {
        const accessToken = jwt.sign(
          { email: user.email },
          process.env.JWT_SECRET,
          { expiresIn: "15m" }
        );
        const refreshToken = jwt.sign(
          { email: user.email },
          process.env.JWT_REFRESH_SECRET,
          { expiresIn: "7d" }
        );

        res.json({ accessToken, refreshToken });
      } else {
        res.status(401).json({ error: "Authentication failed" });
      }
    } else {
      res.status(404).json({ error: "User not found" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post("/token-refresh", (req, res) => {
  const refreshToken = req.body.token;

  if (!refreshToken) return res.status(401).json({ error: "Unauthorized" });

  jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET, (err, user) => {
    if (err) return res.status(403).json({ error: "Forbidden" });

    const accessToken = jwt.sign(
      { email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "15m" }
    );
    res.json({ accessToken });
  });
});

module.exports = router;
