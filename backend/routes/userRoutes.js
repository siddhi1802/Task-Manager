const express = require("express");
const {adminOnly, protect} = require("../middlewares/authMiddleware");
const {getUsers, getUserById, deleteUser} = require("../controllers/userController");

const router = express.Router();

//User Management Routes
router.get("/",protect, adminOnly, getUsers); //get all users (Admin Only)
router.get("/:id",protect, getUserById); //Get specific user
// router.delete("/:id", protect, adminOnly, deleteUser); //Delete user (Admin Only)

module.exports = router;