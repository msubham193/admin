const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const Admin = require("../models/Admin");
const router = express.Router();

// Middleware for verifying JWT token (admin-only routes)
const verifyAdmin = (req, res, next) => {
  const token = req.headers["authorization"];
  if (!token) return res.status(401).json({ msg: "Access denied" });
  console.log(token);
  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) return res.status(401).json({ msg: "Invalid token" });
    if (decoded.role !== "Admin")
      return res.status(403).json({ msg: "Forbidden" });
    req.user = decoded;
    next();
  });
};

router.post("/document", async (req, res) => {
  try {
    const { documentName, users } = req.body;

    // Check if all required data is provided
    if (!documentName || !users || users.length === 0) {
      return res
        .status(400)
        .json({ msg: "Please provide all required fields." });
    }

    // Verify that all user IDs exist in the database
    const validUsers = await User.find({
      _id: { $in: users },
      status: "Approved",
    });
    if (validUsers.length !== users.length) {
      return res
        .status(400)
        .json({ msg: "Some users are invalid or not approved." });
    }

    // Create the document
    const document = new Document({
      documentName,
      users,
    });

    await document.save();

    return res
      .status(201)
      .json({ msg: "Document created successfully", document });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ msg: "Server error" });
  }
});

// Register a new user (Admin only)
router.post("/", verifyAdmin, async (req, res) => {
  const { username, email, role } = req.body;

  // Check if user already exists
  const userExists = await User.findOne({ email });
  if (userExists) return res.status(400).json({ msg: "User already exists" });

  // Hash the password

  try {
    const newUser = new User({
      username,
      email,

      role,
      status: "Pending",
    });
    await newUser.save();
    res.status(201).json(newUser);
  } catch (error) {
    res.status(500).json({ msg: "Error creating user", error });
  }
});

// Get all users (Admin only)
router.get("/dashboard", verifyAdmin, async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const pendingApprovals = await User.countDocuments({ status: "Pending" });
    const approvedUsers = await User.countDocuments({ status: "Approved" });

    res.json({ totalUsers, pendingApprovals, approvedUsers });
  } catch (error) {
    console.error("Error fetching dashboard data:", error);
    res.status(500).json({ msg: "Error fetching dashboard data" });
  }
});
router.get("/", verifyAdmin, async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (error) {
    res.status(500).json({ msg: "Error fetching users", error });
  }
});

// Approve or reject user (Admin only)
router.patch("/:id/approve", verifyAdmin, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ msg: "User not found" });

    user.status = "Approved";
    user.rejectionReason = null; // Clear any previous rejection reason

    await user.save();
    res.json(user);
  } catch (error) {
    res.status(500).json({ msg: "Error approving user", error });
  }
});

// Route to reject a user
router.patch("/:id/reject", verifyAdmin, async (req, res) => {
  const { rejectionReason } = req.body;

  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ msg: "User not found" });

    user.status = "Rejected";
    user.rejectionReason = rejectionReason || "No reason provided"; // Default reason if none provided

    await user.save();
    res.json(user);
  } catch (error) {
    res.status(500).json({ msg: "Error rejecting user", error });
  }
});

// Admin login
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await Admin.findOne({ email });
    if (!user) return res.status(404).json({ msg: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ msg: "Invalid credentials" });

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );
    res.json({ token });
  } catch (error) {
    res.status(500).json({ msg: "Error logging in", error });
  }
});

router.post("/register", async (req, res) => {
  const { username, email, password } = req.body;

  // Check if admin already exists
  const userExists = await User.findOne({ email });
  if (userExists) return res.status(400).json({ msg: "Admin already exists" });

  try {
    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new admin user
    const newAdmin = new Admin({
      username,
      email,
      password: hashedPassword,
      role: "Admin",
      // Admin is automatically approved
    });

    await newAdmin.save();
    res.status(201).json({ msg: "Admin registered successfully" });
  } catch (error) {
    res.status(500).json({ msg: "Error registering admin", error });
  }
});

module.exports = router;
