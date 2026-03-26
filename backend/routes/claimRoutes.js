const express = require('express');
const { createClaim, getReceivedClaims, handleClaim } = require('../controllers/claimController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/', protect, createClaim);
router.get('/received', protect, getReceivedClaims);
router.put('/:id', protect, handleClaim);

module.exports = router;
