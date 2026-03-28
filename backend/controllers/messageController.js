const Message = require('../models/Message');
const Notification = require('../models/Notification');

// @desc    Send a message
// @route   POST /api/messages
const sendMessage = async (req, res) => {
    try {
        const { receiver, content, item } = req.body;
        
        const message = await Message.create({
            sender: req.user._id,
            receiver,
            content,
            item: item || null
        });

        // Create notification for receiver
        await Notification.create({
            user: receiver,
            type: 'message',
            content: `New message from ${req.user.rollNumber}: "${content.substring(0, 50)}${content.length > 50 ? '...' : ''}"`,
            link: `/chat?receiver=${req.user._id}`
        });

        const populatedMessage = await Message.findById(message._id)
            .populate('sender receiver', 'rollNumber')
            .populate('item', 'title image type location date description');

        res.status(201).json(populatedMessage);
    } catch (error) {
        res.status(400).json({ message: 'Error sending message' });
    }
};

// @desc    Get all conversations for user
// @route   GET /api/messages/conversations
const getConversations = async (req, res) => {
    try {
        // Find all messages where user is sender or receiver
        const messages = await Message.find({
            $or: [{ sender: req.user._id }, { receiver: req.user._id }]
        }).populate('sender receiver', 'rollNumber').sort({ createdAt: -1 });

        // Group by user pairing
        const conversations = {};
        messages.forEach(msg => {
            const otherUser = msg.sender._id.toString() === req.user._id.toString() ? msg.receiver : msg.sender;
            if (!conversations[otherUser._id]) {
                conversations[otherUser._id] = {
                    user: otherUser,
                    lastMessage: msg.content,
                    updatedAt: msg.createdAt,
                    isRead: msg.isRead
                };
            }
        });

        res.json(Object.values(conversations));
    } catch (error) {
        res.status(500).json({ message: 'Error fetching conversations' });
    }
};

// @desc    Get messages in a conversation
// @route   GET /api/messages/:otherUserId
const getMessages = async (req, res) => {
    try {
        const messages = await Message.find({
            $or: [
                { sender: req.user._id, receiver: req.params.otherUserId },
                { sender: req.params.otherUserId, receiver: req.user._id }
            ]
        }).populate('sender receiver', 'rollNumber').populate('item', 'title image type location date description').sort({ createdAt: 1 });

        // Mark as read
        await Message.updateMany(
            { receiver: req.user._id, sender: req.params.otherUserId, isRead: false },
            { isRead: true }
        );

        res.json(messages);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching messages' });
    }
};

module.exports = { sendMessage, getConversations, getMessages };
