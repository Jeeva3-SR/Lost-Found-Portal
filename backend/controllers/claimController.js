const Claim = require('../models/Claim');
const Item = require('../models/Item');

// @desc    Create a claim request
// @route   POST /api/claims
const createClaim = async (req, res) => {
    try {
        const { itemId, message } = req.body;
        
        const item = await Item.findById(itemId);
        if (!item) {
            return res.status(404).json({ message: 'Item not found' });
        }

        if (item.reporter.toString() === req.user._id.toString()) {
            return res.status(400).json({ message: 'You cannot claim your own item' });
        }

        const existingClaim = await Claim.findOne({ item: itemId, requester: req.user._id });
        if (existingClaim) {
            return res.status(400).json({ message: 'You have already filed a claim for this item' });
        }

        const claim = await Claim.create({
            item: itemId,
            requester: req.user._id,
            message
        });

        res.status(201).json(claim);
    } catch (error) {
        res.status(400).json({ message: 'Error creating claim' });
    }
};

// @desc    Get claims for items reported by the user
// @route   GET /api/claims/received
const getReceivedClaims = async (req, res) => {
    try {
        // Find items reported by current user
        const myItems = await Item.find({ reporter: req.user._id });
        const itemIds = myItems.map(item => item._id);

        const claims = await Claim.find({ item: { $in: itemIds } })
            .populate('item', 'title type')
            .populate('requester', 'rollNumber')
            .sort({ createdAt: -1 });

        res.json(claims);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching claims' });
    }
};

// @desc    Approve or reject a claim
// @route   PUT /api/claims/:id
const handleClaim = async (req, res) => {
    try {
        const { status } = req.body; // 'approved' or 'rejected'
        const claim = await Claim.findById(req.params.id).populate('item');

        if (!claim) {
            return res.status(404).json({ message: 'Claim not found' });
        }

        // Only the item reporter can approve/reject
        if (claim.item.reporter.toString() !== req.user._id.toString()) {
            return res.status(401).json({ message: 'Not authorized' });
        }

        claim.status = status;
        await claim.save();

        // If approved, update item status
        if (status === 'approved') {
            await Item.findByIdAndUpdate(claim.item._id, { status: 'claimed' });
            // Optionally reject other pending claims for this item
            await Claim.updateMany(
                { item: claim.item._id, _id: { $ne: claim._id }, status: 'pending' },
                { status: 'rejected' }
            );
        }

        res.json(claim);
    } catch (error) {
        res.status(400).json({ message: 'Error handling claim' });
    }
};

module.exports = { createClaim, getReceivedClaims, handleClaim };
