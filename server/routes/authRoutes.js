const express = require('express');
const router = express.Router();
const {
  sendOTP,
  registerUser,
  loginUser,
  getUserProfile,
  updateUserProfile
} = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

router.post('/send-otp', sendOTP);
router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/profile', protect, getUserProfile);
router.put('/profile', protect, updateUserProfile);

module.exports = router;