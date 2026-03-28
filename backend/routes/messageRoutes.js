const express = require('express');
const { sendMessage, getConversations, getMessages } = require('../controllers/messageController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/', protect, sendMessage);
router.get('/conversations', protect, getConversations);
router.get('/:otherUserId', protect, getMessages);

module.exports = router;
