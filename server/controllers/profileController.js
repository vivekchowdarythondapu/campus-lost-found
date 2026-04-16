const User = require('../models/User');
const Item = require('../models/Item');
const asyncHandler = require('express-async-handler');
const { cloudinary } = require('../config/cloudinary');
const jwt = require('jsonwebtoken');

// @desc    Get profile with stats
// @route   GET /api/profile
const getProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).select('-password');

  const totalItems = await Item.countDocuments({ postedBy: req.user._id });
  const returnedItems = await Item.countDocuments({ postedBy: req.user._id, status: 'returned' });
  const matchedItems = await Item.countDocuments({ postedBy: req.user._id, status: 'matched' });
  const lostItems = await Item.countDocuments({ postedBy: req.user._id, type: 'lost' });
  const foundItems = await Item.countDocuments({ postedBy: req.user._id, type: 'found' });

  res.json({
    ...user.toObject(),
    stats: {
      totalItems,
      returnedItems,
      matchedItems,
      lostItems,
      foundItems
    }
  });
});

// @desc    Update profile
// @route   PUT /api/profile
const updateProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  user.name = req.body.name || user.name;
  user.phone = req.body.phone || user.phone;

  if (req.body.password) {
    if (req.body.password.length < 6) {
      res.status(400);
      throw new Error('Password must be at least 6 characters');
    }
    user.password = req.body.password;
  }

  if (req.file && req.file.buffer) {
    try {
      if (user.avatarPublicId) {
        await cloudinary.uploader.destroy(user.avatarPublicId);
      }
      const result = await new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          { folder: 'campus-lost-found/avatars', resource_type: 'image' },
          (error, result) => {
            if (error) reject(new Error(JSON.stringify(error)));
            else resolve(result);
          }
        );
        uploadStream.end(req.file.buffer);
      });
      user.avatar = result.secure_url;
      user.avatarPublicId = result.public_id;
    } catch (err) {
      console.error('Avatar upload error:', err.message);
    }
  }

  const updatedUser = await user.save();

  res.json({
    _id: updatedUser._id,
    name: updatedUser.name,
    email: updatedUser.email,
    phone: updatedUser.phone,
    role: updatedUser.role,
    avatar: updatedUser.avatar,
    token: jwt.sign(
      { id: updatedUser._id },
      process.env.JWT_SECRET,
      { expiresIn: '30d' }
    )
  });
});

module.exports = { getProfile, updateProfile };