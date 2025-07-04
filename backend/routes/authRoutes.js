const express = require("express");
const router = express.Router();
const {
  register,
  login,
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
} = require("../controllers/authControllers");

// Register dan Login
router.post("/register", register);
router.post("/login", login);

// User management
router.get("/", getUsers);
router.get("/:id", getUserById);
router.put("/:id", updateUser);
router.delete("/:id", deleteUser);

module.exports = router;
