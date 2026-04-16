const express = require('express');
const router = express.Router();
const {
  createItem,
  getItems,
  getItemById,
  getMyItems,
  deleteItem,
  updateItemStatus
} = require('../controllers/itemController');
const { protect } = require('../middleware/authMiddleware');
const { upload } = require('../config/cloudinary');

router.get('/', getItems);
router.get('/my', protect, getMyItems);
router.get('/:id', getItemById);
router.post('/', protect, upload.single('image'), createItem);
router.delete('/:id', protect, deleteItem);
router.put('/:id/status', protect, updateItemStatus);

module.exports = router;