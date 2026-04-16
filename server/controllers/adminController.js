const Item = require('../models/Item');
const User = require('../models/User');
const Notification = require('../models/Notification');
const asyncHandler = require('express-async-handler');
const { sendStatusEmail } = require('../services/emailService');

// @desc    Get all items (admin)
// @route   GET /api/admin/items
const getAllItems = asyncHandler(async (req, res) => {
  const { status, type, page = 1, limit = 20 } = req.query;
  const query = {};
  if (status) query.status = status;
  if (type) query.type = type;

  const total = await Item.countDocuments(query);
  const items = await Item.find(query)
    .populate('postedBy', 'name email')
    .sort({ createdAt: -1 })
    .skip((page - 1) * limit)
    .limit(Number(limit));

  res.json({ items, total, page: Number(page), pages: Math.ceil(total / limit) });
});

// @desc    Get all users (admin)
// @route   GET /api/admin/users
const getAllUsers = asyncHandler(async (req, res) => {
  const users = await User.find({}).select('-password').sort({ createdAt: -1 });
  res.json(users);
});

// @desc    Update item status (admin)
// @route   PUT /api/admin/items/:id
const updateItem = asyncHandler(async (req, res) => {
  const item = await Item.findById(req.params.id);
  if (!item) {
    res.status(404);
    throw new Error('Item not found');
  }

  item.status = req.body.status || item.status;
  item.isApproved = req.body.isApproved !== undefined
    ? req.body.isApproved
    : item.isApproved;

  const updated = await item.save();

  // Notify user
  await Notification.create({
    user: item.postedBy,
    title: 'Item Status Updated',
    message: `Your item "${item.title}" status has been updated to ${item.status}`,
    type: 'admin',
    relatedItem: item._id
  });

  res.json(updated);
});

// @desc    Delete user (admin)
// @route   DELETE /api/admin/users/:id
const deleteUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }
  await user.deleteOne();
  res.json({ message: 'User deleted successfully' });
});

// @desc    Get dashboard stats (admin)
// @route   GET /api/admin/stats
const getStats = asyncHandler(async (req, res) => {
  const totalItems = await Item.countDocuments();
  const lostItems = await Item.countDocuments({ type: 'lost' });
  const foundItems = await Item.countDocuments({ type: 'found' });
  const returnedItems = await Item.countDocuments({ status: 'returned' });
  const totalUsers = await User.countDocuments({ role: 'student' });
  const activeItems = await Item.countDocuments({ status: 'active' });
  const matchedItems = await Item.countDocuments({ status: 'matched' });

  res.json({
    totalItems,
    lostItems,
    foundItems,
    returnedItems,
    totalUsers,
    activeItems,
    matchedItems
  });
});

module.exports = {
  getAllItems,
  getAllUsers,
  updateItem,
  deleteUser,
  getStats
};