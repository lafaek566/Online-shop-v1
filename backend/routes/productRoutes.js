const express = require("express");
const multer = require("multer");
const path = require("path");
const {
  addProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
} = require("../controllers/productControllers");

const router = express.Router();

// ✅ Konfigurasi penyimpanan
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) =>
    cb(null, Date.now() + path.extname(file.originalname)),
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = [
    "image/webp",
    "image/avif",
    "image/jpeg",
    "image/png",
    "image/jpg",
  ];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("❌ Format gambar tidak didukung."), false);
  }
};

const upload = multer({ storage, fileFilter });

// ✅ ROUTES
router.post("/add", upload.array("images", 5), addProduct);
router.get("/", getProducts);
router.get("/:id", getProductById);
router.put("/:id", upload.array("images", 5), updateProduct);
router.delete("/:id", deleteProduct);

module.exports = router;
