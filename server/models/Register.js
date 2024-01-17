const mongoose = require("mongoose");

const RegisterSchema = new mongoose.Schema({
  email: { type: String, unique: true },
  password: String,
  passwordConfirm: String,
  createdAt: { type: Date, default: Date.now },
  quiote: String,
});

const RegisterModel = mongoose.model("registers", RegisterSchema);
module.exports = RegisterModel;
