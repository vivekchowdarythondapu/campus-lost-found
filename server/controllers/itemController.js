const Item = require('../models/Item');
const asyncHandler = require('express-async-handler');
const { cloudinary } = require('../config/cloudinary');
const { findMatches } = require('../services/matchService');
const Notification = require('../models/Notification');
const { sendMatchEmail } = require('../services/emailService');

// @desc    Create new item (lost or found)
// @route   POST /api/items
const createItem = asyncHandler(async (req, res) => {
  const { title, description, category, type, location, date } = req.body;

  if (!title || !description || !category || !type || !location || !date) {
    res.status(400);
    throw new Error('Please fill all required fields');
  }

  let imageUrl = '';
  let imagePublicId = '';

  if (req.file && req.file.buffer) {
    try {
      const result = await new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          { folder: 'campus-lost-found', resource_type: 'auto' },
          (error, result) => {
            if (error) reject(new Error(JSON.stringify(error)));
            else resolve(result);
          }
        );
        uploadStream.end(req.file.buffer);
      });
      imageUrl = result.secure_url;
      imagePublicId = result.public_id;
    } catch (uploadError) {
      console.error('Upload error:', uploadError.message);
    }
  }

  const item = await Item.create({
    title,
    description,
    category,
    type,
    location,
    date,
    image: imageUrl,
    imagePublicId: imagePublicId,
    postedBy: req.user._id
  });

  try {
    const matches = await findMatches(item);
    if (matches.length > 0) {
      item.matches = matches;
      await item.save();
      await Notification.create({
        user: req.user._id,
        title: 'Potential Match Found!',
        message: `We found ${matches.length} potential match(es) for your ${type} item: ${title}`,
        type: 'match',
        relatedItem: item._id
      });
    }
  } catch (matchError) {
    console.error('Match error:', matchError.message);
  }

  res.status(201).json(item);
});

// @desc    Get all items with filters
// @route   GET /api/items
const getItems = asyncHandler(async (req, res) => {
  const { type, category, search, page = 1, limit = 10 } = req.query;

  const query = { isApproved: true, status: 'active' };

  if (type) query.type = type;
  if (category) query.category = category;
  if (search) {
    query.$or = [
      { title: { $regex: search, $options: 'i' } },
      { description: { $regex: search, $options: 'i' } },
      { location: { $regex: search, $options: 'i' } }
    ];
  }

  if (req.query.location) {
    query.location = { $regex: req.query.location, $options: 'i' };
  }

  if (req.query.dateFrom || req.query.dateTo) {
    query.date = {};
    if (req.query.dateFrom) query.date.$gte = new Date(req.query.dateFrom);
    if (req.query.dateTo) query.date.$lte = new Date(req.query.dateTo);
  }

  const total = await Item.countDocuments(query);
  const sortOrder = req.query.sortBy === 'oldest' ? 1 : -1;
const items = await Item.find(query)
    .populate('postedBy', 'name email phone')
    .sort({ createdAt: sortOrder })
    .skip((page - 1) * limit)
    .limit(Number(limit));

  res.json({
    items,
    total,
    page: Number(page),
    pages: Math.ceil(total / limit)
  });
});

// @desc    Get single item
// @route   GET /api/items/:id
const getItemById = asyncHandler(async (req, res) => {
  const item = await Item.findById(req.params.id)
    .populate('postedBy', 'name email phone')
    .populate('matches.item');

  if (!item) {
    res.status(404);
    throw new Error('Item not found');
  }
  res.json(item);
});

// @desc    Get my items
// @route   GET /api/items/my
const getMyItems = asyncHandler(async (req, res) => {
  const items = await Item.find({ postedBy: req.user._id })
    .sort({ createdAt: -1 });
  res.json(items);
});

// @desc    Delete item
// @route   DELETE /api/items/:id
const deleteItem = asyncHandler(async (req, res) => {
  const item = await Item.findById(req.params.id);

  if (!item) {
    res.status(404);
    throw new Error('Item not found');
  }

  if (item.postedBy.toString() !== req.user._id.toString() &&
    req.user.role !== 'admin') {
    res.status(403);
    throw new Error('Not authorized to delete this item');
  }

  if (item.imagePublicId) {
    try {
      await cloudinary.uploader.destroy(item.imagePublicId);
    } catch (err) {
      console.error('Cloudinary delete error:', err.message);
    }
  }

  await item.deleteOne();
  res.json({ message: 'Item removed successfully' });
});

// @desc    Update item status
// @route   PUT /api/items/:id/status
const updateItemStatus = asyncHandler(async (req, res) => {
  const item = await Item.findById(req.params.id);

  if (!item) {
    res.status(404);
    throw new Error('Item not found');
  }

  item.status = req.body.status || item.status;
  const updated = await item.save();
  res.json(updated);
});

module.exports = {
  createItem,
  getItems,
  getItemById,
  getMyItems,
  deleteItem,
  updateItemStatus
};