const express = require('express');
const router = express.Router();
const asyncHandler = require('express-async-handler');
const Item = require('../models/Item');
const { findMatches } = require('../services/matchService');
const { protect } = require('../middleware/authMiddleware');

// @desc    Get matches for an item
// @route   GET /api/matches/:itemId
router.get('/:itemId', protect, asyncHandler(async (req, res) => {
  const item = await Item.findById(req.params.itemId);
  if (!item) {
    res.status(404);
    throw new Error('Item not found');
  }

  const matches = await findMatches(item);
  const itemIds = matches.map(m => m.item);
  const matchedItems = await Item.find({ _id: { $in: itemIds } })
    .populate('postedBy', 'name email phone');

  const result = matchedItems.map(mi => ({
    ...mi.toObject(),
    score: matches.find(m => m.item.toString() === mi._id.toString())?.score
  }));

  res.json(result.sort((a, b) => b.score - a.score));
}));

module.exports = router;