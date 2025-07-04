const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema({
  title: String,
  sku: String,
  description: String,
  qty: Number,
  images: [String],
});

module.exports = mongoose.model("Product", ProductSchema);
