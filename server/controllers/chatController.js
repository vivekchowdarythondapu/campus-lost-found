const Message = require('../models/Message');
const asyncHandler = require('express-async-handler');

// @desc    Send a message
// @route   POST /api/chat
const sendMessage = asyncHandler(async (req, res) => {
  const { receiver, message, item } = req.body;

  if (!receiver || !message) {
    res.status(400);
    throw new Error('Receiver and message are required');
  }

  const newMessage = await Message.create({
    sender: req.user._id,
    receiver,
    message,
    item: item || null
  });

  const populated = await Message.findById(newMessage._id)
    .populate('sender', 'name email')
    .populate('receiver', 'name email');

  res.status(201).json(populated);
});

// @desc    Get conversation between two users
// @route   GET /api/chat/:userId
const getConversation = asyncHandler(async (req, res) => {
  const messages = await Message.find({
    $or: [
      { sender: req.user._id, receiver: req.params.userId },
      { sender: req.params.userId, receiver: req.user._id }
    ]
  })
    .populate('sender', 'name email')
    .populate('receiver', 'name email')
    .sort({ createdAt: 1 });

  // Mark messages as read
  await Message.updateMany(
    { sender: req.params.userId, receiver: req.user._id, isRead: false },
    { isRead: true }
  );

  res.json(messages);
});

// @desc    Get all conversations for current user
// @route   GET /api/chat
const getMyConversations = asyncHandler(async (req, res) => {
  const messages = await Message.find({
    $or: [
      { sender: req.user._id },
      { receiver: req.user._id }
    ]
  })
    .populate('sender', 'name email')
    .populate('receiver', 'name email')
    .sort({ createdAt: -1 });

  // Get unique conversations
  const conversations = {};
  messages.forEach(msg => {
    const otherId = msg.sender._id.toString() === req.user._id.toString()
      ? msg.receiver._id.toString()
      : msg.sender._id.toString();

    if (!conversations[otherId]) {
      conversations[otherId] = {
        user: msg.sender._id.toString() === req.user._id.toString()
          ? msg.receiver
          : msg.sender,
        lastMessage: msg.message,
        createdAt: msg.createdAt,
        unread: 0
      };
    }

    if (msg.receiver._id.toString() === req.user._id.toString() && !msg.isRead) {
      conversations[otherId].unread++;
    }
  });

  res.json(Object.values(conversations));
});

module.exports = { sendMessage, getConversation, getMyConversations };