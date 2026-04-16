const express = require('express');
const router = express.Router();
const { getProfile, updateProfile } = require('../controllers/profileController');
const { protect } = require('../middleware/authMiddleware');
const { upload } = require('../config/cloudinary');

router.get('/', protect, getProfile);
router.put('/', protect, upload.single('avatar'), updateProfile);

module.exports = router;