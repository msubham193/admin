const mongoose = require("mongoose");

const AdminSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, default: "User" }, // User or Admin

  },
  { timestamps: true }
);

module.exports = mongoose.model("Admin", AdminSchema);
