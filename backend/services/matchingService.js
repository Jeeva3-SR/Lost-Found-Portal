const stringSimilarity = require('string-similarity');

/**
 * Calculate match score between two items
 * @param {Object} item1 - The reference item (e.g., lost item)
 * @param {Object} item2 - The potential match (e.g., found item)
 */
const calculateMatchScore = (item1, item2) => {
    let score = 0;

    // 1. Title Similarity (50 points)
    const titleScore = stringSimilarity.compareTwoStrings(
        item1.title.toLowerCase(), 
        item2.title.toLowerCase()
    );
    score += titleScore * 50;

    // 2. Location Match (30 points)
    // Exact match or substring match
    if (item1.location.toLowerCase() === item2.location.toLowerCase()) {
        score += 30;
    } else if (
        item1.location.toLowerCase().includes(item2.location.toLowerCase()) ||
        item2.location.toLowerCase().includes(item1.location.toLowerCase())
    ) {
        score += 15; // Partial match for location
    }

    // 3. Date Proximity (20 points)
    const date1 = new Date(item1.date);
    const date2 = new Date(item2.date);
    const diffInDays = Math.abs(date1 - date2) / (1000 * 60 * 60 * 24);

    if (diffInDays <= 2) {
        score += 20;
    } else if (diffInDays <= 5) {
        score += 10;
    }

    return Math.round(score);
};

const findMatchesForItem = async (item, allItems) => {
    const matches = allItems
        .filter(targetItem => targetItem._id.toString() !== item._id.toString() && targetItem.type !== item.type)
        .map(targetItem => {
            const score = calculateMatchScore(item, targetItem);
            return {
                item: targetItem,
                score
            };
        })
        .filter(match => match.score > 60) // Threshold
        .sort((a, b) => b.score - a.score);

    return matches;
};

module.exports = { calculateMatchScore, findMatchesForItem };
