const Product = require("../models/Product");

// Add product (sudah ada)
exports.addProduct = async (req, res) => {
  try {
    console.log("✅ /addProduct HIT");
    console.log("BODY:", req.body);
    console.log("FILES:", req.files);

    const { title, sku, description, qty } = req.body;
    const images = req.files?.map((file) => file.path) || [];

    const newProduct = new Product({
      title,
      sku,
      description,
      qty: parseInt(qty),
      images,
    });

    await newProduct.save();
    res.status(201).json(newProduct);
  } catch (error) {
    console.error("❌ Error saat tambah produk:", error);
    res.status(500).json({ message: "Gagal tambah produk", error });
  }
};

// Get all products (sudah ada)
exports.getProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: "Gagal ambil produk", error });
  }
};

// Get product by ID
exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product)
      return res.status(404).json({ message: "Produk tidak ditemukan" });

    res.json(product);
  } catch (error) {
    res.status(500).json({ message: "Gagal ambil produk", error });
  }
};

// Update product by ID
exports.updateProduct = async (req, res) => {
  try {
    const { title, sku, description, qty } = req.body;
    const images = req.files?.map((file) => file.path);

    const updateData = {
      title,
      sku,
      description,
      qty: qty ? parseInt(qty) : undefined,
    };

    // Jika ada gambar baru, update images
    if (images && images.length > 0) {
      updateData.images = images;
    }

    // Hapus properti yang undefined supaya gak overwrite data kosong
    Object.keys(updateData).forEach(
      (key) => updateData[key] === undefined && delete updateData[key]
    );

    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );

    if (!updatedProduct)
      return res.status(404).json({ message: "Produk tidak ditemukan" });

    res.json(updatedProduct);
  } catch (error) {
    console.error("❌ Error saat update produk:", error);
    res.status(500).json({ message: "Gagal update produk", error });
  }
};

// Delete product by ID
exports.deleteProduct = async (req, res) => {
  try {
    const deletedProduct = await Product.findByIdAndDelete(req.params.id);

    if (!deletedProduct)
      return res.status(404).json({ message: "Produk tidak ditemukan" });

    res.json({ message: "Produk berhasil dihapus", deletedProduct });
  } catch (error) {
    res.status(500).json({ message: "Gagal hapus produk", error });
  }
};
