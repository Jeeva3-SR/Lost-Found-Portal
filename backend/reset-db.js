require('dotenv').config();
const mongoose = require('mongoose');
const Item = require('./models/Item');
const Message = require('./models/Message');
const Notification = require('./models/Notification');
const User = require('./models/User');

const resetDB = async () => {
    try {
        const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/academic_connect';
        await mongoose.connect(MONGODB_URI);
        console.log('Connected to MongoDB for reset...');

        await Item.deleteMany({});
        await Message.deleteMany({});
        await Notification.deleteMany({});
        // Optional: Keep users but clear their roles/data if needed? 
        // User says "remove all records in the db", so I'll clear users too to be thorough.
        await User.deleteMany({});

        console.log('Database cleared successfully!');
        process.exit(0);
    } catch (err) {
        console.error('Error resetting database:', err);
        process.exit(1);
    }
};

resetDB();
