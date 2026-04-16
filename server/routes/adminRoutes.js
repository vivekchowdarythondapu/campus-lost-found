const express = require('express');
const router = express.Router();
const {
  getAllItems,
  getAllUsers,
  updateItem,
  deleteUser,
  getStats
} = require('../controllers/adminController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

router.get('/stats', protect, adminOnly, getStats);
router.get('/items', protect, adminOnly, getAllItems);
router.get('/users', protect, adminOnly, getAllUsers);
router.put('/items/:id', protect, adminOnly, updateItem);
router.delete('/users/:id', protect, adminOnly, deleteUser);

module.exports = router;