// controllers/checkoutController.js
const Checkout = require("../models/Checkout");
const nodemailer = require("nodemailer");

// Fungsi kirim email dan simpan checkout (create)
exports.checkout = async (req, res) => {
  const { email, cart } = req.body;

  // Validasi awal
  if (!email || !Array.isArray(cart) || cart.length === 0) {
    return res.status(400).json({ message: "Data tidak lengkap" });
  }

  const newCheckout = new Checkout({ email, cart });

  try {
    await newCheckout.save();

    // Setup transporter email
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.verify(); // Debug koneksi ke Gmail
    console.log("✅ Email transporter siap digunakan");

    // Format isi cart jadi HTML
    const htmlItems = cart
      .map((item) => {
        const title = item.title || "Produk";
        const qty = item.qty || 1;
        const price = Number(item.price || 0).toLocaleString("id-ID");
        return `<li><strong>${title}</strong> - Qty: ${qty} - Rp${price}</li>`;
      })
      .join("");

    const htmlContent = `
      <p>Hi,</p>
      <p>Terima kasih telah melakukan pemesanan. Berikut detail pesanan Anda:</p>
      <ul>${htmlItems}</ul>
      <p>Kami akan segera memproses pesanan Anda. 🙌</p>
    `;

    const mailOptions = {
      from: `"Your Shop" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Konfirmasi Pesanan Anda",
      html: htmlContent,
    };

    await transporter.sendMail(mailOptions);

    res.status(201).json({
      message: "Checkout berhasil dan email terkirim",
      checkout: newCheckout,
    });
  } catch (err) {
    console.error("❌ Gagal checkout:", err);
    res.status(500).json({ message: "Gagal proses checkout", error: err });
  }
};

// GET all checkout data
exports.getAllCheckouts = async (req, res) => {
  try {
    const checkouts = await Checkout.find();
    res.json(checkouts);
  } catch (err) {
    res.status(500).json({ message: "Gagal ambil data checkout", error: err });
  }
};

// GET checkout by ID
exports.getCheckoutById = async (req, res) => {
  try {
    const checkout = await Checkout.findById(req.params.id);
    if (!checkout) {
      return res.status(404).json({ message: "Checkout tidak ditemukan" });
    }
    res.json(checkout);
  } catch (err) {
    res.status(500).json({ message: "Gagal ambil checkout", error: err });
  }
};

// UPDATE checkout by ID
exports.updateCheckout = async (req, res) => {
  console.log("req.body:", req.body);
  try {
    const updatedCheckout = await Checkout.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!updatedCheckout) {
      return res.status(404).json({ message: "Checkout tidak ditemukan" });
    }
    res.json(updatedCheckout);
  } catch (err) {
    console.error("Error update checkout:", err);
    res.status(500).json({ message: "Gagal update checkout", error: err });
  }
};

// DELETE checkout by ID
exports.deleteCheckout = async (req, res) => {
  try {
    const deletedCheckout = await Checkout.findByIdAndDelete(req.params.id);
    if (!deletedCheckout) {
      return res.status(404).json({ message: "Checkout tidak ditemukan" });
    }
    res.json({ message: "Checkout berhasil dihapus", deletedCheckout });
  } catch (err) {
    res.status(500).json({ message: "Gagal hapus checkout", error: err });
  }
};
