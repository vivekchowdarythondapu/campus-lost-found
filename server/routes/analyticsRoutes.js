const express = require('express');
const router = express.Router();
const asyncHandler = require('express-async-handler');
const Item = require('../models/Item');
const User = require('../models/User');
const { protect, adminOnly } = require('../middleware/authMiddleware');

// @desc    Get analytics data
// @route   GET /api/analytics
router.get('/', protect, adminOnly, asyncHandler(async (req, res) => {

  // Items per month (last 6 months)
  const sixMonthsAgo = new Date();
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

  const itemsByMonth = await Item.aggregate([
    { $match: { createdAt: { $gte: sixMonthsAgo } } },
    {
      $group: {
        _id: {
          month: { $month: '$createdAt' },
          year: { $year: '$createdAt' },
          type: '$type'
        },
        count: { $sum: 1 }
      }
    },
    { $sort: { '_id.year': 1, '_id.month': 1 } }
  ]);

  // Category breakdown
  const categoryStats = await Item.aggregate([
    {
      $group: {
        _id: '$category',
        count: { $sum: 1 }
      }
    },
    { $sort: { count: -1 } }
  ]);

  // Status breakdown
  const statusStats = await Item.aggregate([
    {
      $group: {
        _id: '$status',
        count: { $sum: 1 }
      }
    }
  ]);

  // Location breakdown (top 5)
  const locationStats = await Item.aggregate([
    {
      $group: {
        _id: '$location',
        count: { $sum: 1 }
      }
    },
    { $sort: { count: -1 } },
    { $limit: 5 }
  ]);

  // Daily items (last 7 days)
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

  const dailyItems = await Item.aggregate([
    { $match: { createdAt: { $gte: sevenDaysAgo } } },
    {
      $group: {
        _id: {
          day: { $dayOfMonth: '$createdAt' },
          month: { $month: '$createdAt' }
        },
        count: { $sum: 1 }
      }
    },
    { $sort: { '_id.month': 1, '_id.day': 1 } }
  ]);

  // Format monthly data
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  const monthlyMap = {};
  itemsByMonth.forEach(item => {
    const key = `${months[item._id.month - 1]} ${item._id.year}`;
    if (!monthlyMap[key]) monthlyMap[key] = { name: key, lost: 0, found: 0 };
    monthlyMap[key][item._id.type] = item.count;
  });

  res.json({
    monthly: Object.values(monthlyMap),
    categories: categoryStats.map(c => ({ name: c._id, value: c.count })),
    status: statusStats.map(s => ({ name: s._id, value: s.count })),
    locations: locationStats.map(l => ({ name: l._id, count: l.count })),
    daily: dailyItems.map(d => ({
      name: `${d._id.day}/${d._id.month}`,
      items: d.count
    }))
  });
}));

module.exports = router;