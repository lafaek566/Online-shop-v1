const express = require("express");
const router = express.Router();
const {
  checkout,
  getAllCheckouts,
  getCheckoutById,
  updateCheckout,
  deleteCheckout,
} = require("../controllers/checkoutController");

// Create checkout & send email
router.post("/", checkout);

// Read all checkout
router.get("/", getAllCheckouts);

// Read one checkout by id
router.get("/:id", getCheckoutById);

// Update checkout by id
router.put("/:id", updateCheckout);

// Delete checkout by id
router.delete("/:id", deleteCheckout);

module.exports = router;
