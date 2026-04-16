const express = require('express');
const router = express.Router();
const asyncHandler = require('express-async-handler');
const Notification = require('../models/Notification');
const { protect } = require('../middleware/authMiddleware');

// @desc    Get all notifications for user
// @route   GET /api/notifications
router.get('/', protect, asyncHandler(async (req, res) => {
  const notifications = await Notification.find({ user: req.user._id })
    .sort({ createdAt: -1 })
    .limit(20)
    .populate('relatedItem', 'title type');
  res.json(notifications);
}));

// @desc    Get unread count
// @route   GET /api/notifications/unread
router.get('/unread', protect, asyncHandler(async (req, res) => {
  const count = await Notification.countDocuments({
    user: req.user._id,
    isRead: false
  });
  res.json({ count });
}));

// @desc    Mark all as read
// @route   PUT /api/notifications/read-all
router.put('/read-all', protect, asyncHandler(async (req, res) => {
  await Notification.updateMany(
    { user: req.user._id, isRead: false },
    { isRead: true }
  );
  res.json({ message: 'All notifications marked as read' });
}));

// @desc    Mark single as read
// @route   PUT /api/notifications/:id/read
router.put('/:id/read', protect, asyncHandler(async (req, res) => {
  await Notification.findByIdAndUpdate(req.params.id, { isRead: true });
  res.json({ message: 'Notification marked as read' });
}));

// @desc    Delete notification
// @route   DELETE /api/notifications/:id
router.delete('/:id', protect, asyncHandler(async (req, res) => {
  await Notification.findByIdAndDelete(req.params.id);
  res.json({ message: 'Notification deleted' });
}));

module.exports = router;