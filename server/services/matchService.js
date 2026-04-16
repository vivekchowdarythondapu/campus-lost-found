const Item = require('../models/Item');

// Calculate similarity between two strings
const cosineSimilarity = (str1, str2) => {
  const tokenize = (str) => str.toLowerCase()
    .replace(/[^a-z0-9\s]/g, '')
    .split(/\s+/)
    .filter(Boolean);

  const words1 = tokenize(str1);
  const words2 = tokenize(str2);

  const allWords = [...new Set([...words1, ...words2])];

  const vec1 = allWords.map(w => words1.filter(x => x === w).length);
  const vec2 = allWords.map(w => words2.filter(x => x === w).length);

  const dotProduct = vec1.reduce((sum, v, i) => sum + v * vec2[i], 0);
  const mag1 = Math.sqrt(vec1.reduce((sum, v) => sum + v * v, 0));
  const mag2 = Math.sqrt(vec2.reduce((sum, v) => sum + v * v, 0));

  if (mag1 === 0 || mag2 === 0) return 0;
  return dotProduct / (mag1 * mag2);
};

// Find matches for a given item
const findMatches = async (item) => {
  try {
    // Search for opposite type items
    const oppositeType = item.type === 'lost' ? 'found' : 'lost';

    const candidates = await Item.find({
      type: oppositeType,
      category: item.category,
      status: 'active',
      _id: { $ne: item._id }
    });

    const matches = [];

    for (const candidate of candidates) {
      const text1 = `${item.title} ${item.description} ${item.location}`;
      const text2 = `${candidate.title} ${candidate.description} ${candidate.location}`;

      const score = cosineSimilarity(text1, text2);

      if (score > 0.2) {
        matches.push({
          item: candidate._id,
          score: Math.round(score * 100)
        });
      }
    }

    // Sort by score descending
    return matches.sort((a, b) => b.score - a.score).slice(0, 5);
  } catch (error) {
    console.error('Match service error:', error);
    return [];
  }
};

module.exports = { findMatches };