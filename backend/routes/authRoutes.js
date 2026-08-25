const express = require('express');
const router = express.Router();
const { register, login, getProfile, updateProfile, changePassword, exportData, deleteAccount } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

router.post('/register', register);
router.post('/login', login);
router.get('/profile', protect, getProfile);
router.patch('/profile', protect, updateProfile);
router.patch('/password', protect, changePassword);
router.get('/export', protect, exportData);
router.delete('/account', protect, deleteAccount);

module.exports = router;