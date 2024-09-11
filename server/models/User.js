const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },

    role: { type: String, default: "User" }, // User or Admin
    status: { type: String, default: "Pending" }, // Pending, Approved, Rejected
    rejectionReason: { type: String }, // If rejected
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
