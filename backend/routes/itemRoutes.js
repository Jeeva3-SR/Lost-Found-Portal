const express = require('express');
const { 
    reportItem, 
    getItems, 
    getMyPosts, 
    updateItem, 
    deleteItem,
    getMatches
} = require('../controllers/itemController');
const { protect } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

const router = express.Router();

router.route('/')
    .post(protect, upload.single('image'), reportItem)
    .get(protect, getItems);

router.get('/my-posts', protect, getMyPosts);
router.get('/:id/matches', protect, getMatches);

router.route('/:id')
    .put(protect, updateItem)
    .delete(protect, deleteItem);

module.exports = router;
