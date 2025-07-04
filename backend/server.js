const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const path = require("path");

const authRoutes = require("./routes/authRoutes");
const productRoutes = require("./routes/productRoutes");
const checkoutRoutes = require("./routes/checkoutRoutes");

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// ✅ Static folder untuk akses gambar
app.use("/uploads", express.static("uploads"));

// ✅ Route upload MULTER DULU SEBELUM express.json
app.use("/api/products", productRoutes);

app.use("/api/auth", authRoutes);
app.use("/api/checkout", checkoutRoutes);

// ✅ Connect MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

const PORT = process.env.PORT || 5005;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
