const Item = require('../models/Item');

// @desc    Report new item (lost/found)
// @route   POST /api/items
const reportItem = async (req, res) => {
    try {
        const { type, title, description, location, date } = req.body;
        const image = req.file ? req.file.filename : null;

        const item = await Item.create({
            type,
            title,
            description,
            location,
            date,
            image,
            reporter: req.user._id
        });

        res.status(201).json(item);
    } catch (error) {
        console.error(error);
        res.status(400).json({ message: 'Error reporting item' });
    }
};

// @desc    Get all items (with filters)
// @route   GET /api/items
const getItems = async (req, res) => {
    try {
        const { type } = req.query;
        const filter = {};
        if (type) filter.type = type;

        const items = await Item.find(filter).populate('reporter', 'rollNumber').sort({ createdAt: -1 });
        res.json(items);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching items' });
    }
};

// @desc    Get single item by ID
// @route   GET /api/items/:id
const getItemById = async (req, res) => {
    try {
        const item = await Item.findById(req.params.id).populate('reporter', 'rollNumber');
        if (!item) {
            return res.status(404).json({ message: 'Item not found' });
        }
        res.json(item);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching item details' });
    }
};

// @desc    Get user's posts
// @route   GET /api/items/my-posts
const getMyPosts = async (req, res) => {
    try {
        const items = await Item.find({ reporter: req.user._id }).populate('reporter', 'rollNumber').sort({ createdAt: -1 });
        res.json(items);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching your posts' });
    }
};

// @desc    Update item status or details
// @route   PUT /api/items/:id
const updateItem = async (req, res) => {
    try {
        const item = await Item.findById(req.params.id);

        if (!item) {
            return res.status(404).json({ message: 'Item not found' });
        }

        // Only reporter or admin can update details (except status which might change via claims)
        if (item.reporter.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
            return res.status(401).json({ message: 'Not authorized' });
        }

        const updatedItem = await Item.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(updatedItem);
    } catch (error) {
        res.status(400).json({ message: 'Error updating item' });
    }
};

// @desc    Delete item
// @route   DELETE /api/items/:id
const deleteItem = async (req, res) => {
    try {
        const item = await Item.findById(req.params.id);

        if (!item) {
            return res.status(404).json({ message: 'Item not found' });
        }

        if (item.reporter.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
            return res.status(401).json({ message: 'Not authorized' });
        }

        await item.deleteOne();
        res.json({ message: 'Item removed' });
    } catch (error) {
        res.status(400).json({ message: 'Error deleting item' });
    }
};



module.exports = {
    reportItem,
    getItems,
    getMyPosts,
    getItemById,
    updateItem,
    deleteItem
};
