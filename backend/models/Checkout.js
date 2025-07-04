// models/Checkout.js
const mongoose = require("mongoose");

const CheckoutSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
  },
  cart: [
    {
      productId: String,
      title: { type: String, required: true },
      qty: { type: Number, required: true },
      price: { type: Number, required: true },
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Checkout", CheckoutSchema);
