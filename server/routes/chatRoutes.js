const express = require('express');
const router = express.Router();
const {
  sendMessage,
  getConversation,
  getMyConversations
} = require('../controllers/chatController');
const { protect } = require('../middleware/authMiddleware');

router.get('/', protect, getMyConversations);
router.post('/', protect, sendMessage);
router.get('/:userId', protect, getConversation);

module.exports = router;