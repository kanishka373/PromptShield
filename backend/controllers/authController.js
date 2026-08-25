const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Scan = require('../models/Scan');

const generateToken = (id) => jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });

const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) return res.status(400).json({ message: 'All fields required' });
    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ message: 'Email already registered' });
    const user = await User.create({ name, email, password });
    res.status(201).json({ _id: user._id, name: user.name, email: user.email, token: generateToken(user._id) });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (user && await user.matchPassword(password)) {
      res.json({ _id: user._id, name: user.name, email: user.email, token: generateToken(user._id) });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getProfile = async (req, res) => {
  res.json({ _id: req.user._id, name: req.user.name, email: req.user.email, createdAt: req.user.createdAt });
};

// Naam update karta hai
const updateProfile = async (req, res) => {
  try {
    const { name } = req.body;
    if (!name || !name.trim()) return res.status(400).json({ message: 'Name is required' });

    const user = await User.findById(req.user._id);
    user.name = name.trim();
    await user.save();

    res.json({ _id: user._id, name: user.name, email: user.email, createdAt: user.createdAt });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Password change karta hai (current password verify karke)
const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword) return res.status(400).json({ message: 'Both fields required' });
    if (newPassword.length < 6) return res.status(400).json({ message: 'New password must be at least 6 characters' });

    const user = await User.findById(req.user._id);
    const isMatch = await user.matchPassword(currentPassword);
    if (!isMatch) return res.status(401).json({ message: 'Current password is incorrect' });

    user.password = newPassword; // pre-save hook isko hash kar dega
    await user.save();

    res.json({ message: 'Password updated successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// User ka poora data (profile + scan history) JSON mein export karta hai
const exportData = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    const scans = await Scan.find({ userId: req.user._id });

    const exportPayload = {
      exportedAt: new Date().toISOString(),
      profile: user,
      scans,
    };

    res.setHeader('Content-Disposition', 'attachment; filename=promptshield-data-export.json');
    res.setHeader('Content-Type', 'application/json');
    res.json(exportPayload);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Account aur uske saare scans permanently delete karta hai
const deleteAccount = async (req, res) => {
  try {
    await Scan.deleteMany({ userId: req.user._id });
    await User.findByIdAndDelete(req.user._id);
    res.json({ message: 'Account deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { register, login, getProfile, updateProfile, changePassword, exportData, deleteAccount };