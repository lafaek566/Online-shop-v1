const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

// REGISTER
exports.register = async (req, res) => {
  try {
    const { email, password } = req.body;

    // cek email sudah terdaftar atau belum
    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({ message: "Email sudah terdaftar" });

    // hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // buat user baru
    const newUser = new User({
      email,
      password: hashedPassword,
    });

    await newUser.save();
    res.status(201).json({ message: "User berhasil dibuat" });
  } catch (error) {
    console.error("❌ Error saat register:", error);
    res.status(500).json({ message: "Gagal register user", error });
  }
};

// LOGIN (sudah kamu punya, saya tambahkan cek JWT_SECRET dan expiresIn)
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User tidak ditemukan" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(401).json({ message: "Email atau password salah" });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    res.json({ token });
  } catch (error) {
    console.error("❌ Error saat login:", error);
    res.status(500).json({ message: "Gagal login", error });
  }
};

// GET ALL USERS
exports.getUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password"); // jangan kirim password
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: "Gagal ambil data users", error });
  }
};

// GET USER BY ID
exports.getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password");
    if (!user) return res.status(404).json({ message: "User tidak ditemukan" });
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "Gagal ambil user", error });
  }
};

// UPDATE USER (email dan password bisa diupdate)
exports.updateUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const updateData = {};

    if (email) updateData.email = email;
    if (password) {
      const salt = await bcrypt.genSalt(10);
      updateData.password = await bcrypt.hash(password, salt);
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    ).select("-password");

    if (!updatedUser)
      return res.status(404).json({ message: "User tidak ditemukan" });

    res.json(updatedUser);
  } catch (error) {
    res.status(500).json({ message: "Gagal update user", error });
  }
};

// DELETE USER
exports.deleteUser = async (req, res) => {
  try {
    const deletedUser = await User.findByIdAndDelete(req.params.id);

    if (!deletedUser)
      return res.status(404).json({ message: "User tidak ditemukan" });

    res.json({ message: "User berhasil dihapus", deletedUser });
  } catch (error) {
    res.status(500).json({ message: "Gagal hapus user", error });
  }
};
