const express = require("express");
const { registerUser, loginUser, getUserProfile, updateUserProfile, } = require("../controllers/authController");
const { protect } = require("../middlewares/authMiddleware");

// 1. Import multer and path
const multer = require("multer");
const path = require("path");

const router = express.Router();

// 2. Add Multer Configuration
// This sets up where to save the files and how to name them
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Files will be saved in the 'uploads/' directory.
    // IMPORTANT: You must create this 'uploads' folder in your 'backend' directory.
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    // Create a unique filename to avoid conflicts
    cb(
      null,
      `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`
    );
  },
});

// 3. Initialize the 'upload' variable
// This is the variable that was "not defined" before
const upload = multer({ storage: storage });

// --- Auth Routes ---
router.post("/register", registerUser); // Register User
router.post("/login", loginUser); // Login User
router.get("/profile", protect, getUserProfile); // Get User Profile
router.put("/profile", protect, updateUserProfile); // Update Profile

// --- File Upload Route ---
// The 'upload.single("image")' middleware will now work
router.post("/upload-image", upload.single("image"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: "No file uploaded" });
  }

  // You will need to make your 'uploads' folder public/static in server.js
  // to access this URL from the frontend
  const imageUrl = `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`;
  
  res.status(200).json({ imageUrl });
});

module.exports = router;