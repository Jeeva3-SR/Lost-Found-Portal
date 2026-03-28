const express = require('express');
const { 
    reportItem, 
    getItems, 
    getMyPosts, 
    getItemById,
    updateItem, 
    deleteItem
} = require('../controllers/itemController');
const { protect } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

const router = express.Router();

router.route('/')
    .post(protect, upload.single('image'), reportItem)
    .get(protect, getItems);

router.get('/my-posts', protect, getMyPosts);

router.route('/:id')
    .get(protect, getItemById)
    .put(protect, updateItem)
    .delete(protect, deleteItem);

module.exports = router;
