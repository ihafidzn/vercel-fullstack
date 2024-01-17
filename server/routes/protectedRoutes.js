// routes/protectedRoutes.js
const express = require("express");
const authenticateToken = require("../middleware/authMiddleware");
const router = express.Router();
const ProtectedModel = require("../models/protectedModel");
router.get("/protected-resource", authenticateToken, async (req, res) => {
  const protectedData = await ProtectedModel.find();
  res.json(protectedData);
});

module.exports = router;
