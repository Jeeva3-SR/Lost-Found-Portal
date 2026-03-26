require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');
const Item = require('./models/Item');

const seedData = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB for seeding...');

        // Clear existing data
        await User.deleteMany({});
        await Item.deleteMany({});

        // Create Users
        const user1 = await User.create({
            rollNumber: '2024-CS-128',
            password: 'password123',
            role: 'user',
            forcePasswordChange: false
        });

        const user2 = await User.create({
            rollNumber: '2024-ME-045',
            password: 'password123',
            role: 'user',
            forcePasswordChange: false
        });

        const admin = await User.create({
            rollNumber: 'ADMIN-001',
            password: 'adminpassword',
            role: 'admin',
            forcePasswordChange: false
        });

        console.log('Users created.');

        // Create Items
        await Item.create([
            {
                type: 'lost',
                title: 'Sony WH-1000XM4 Headphones',
                description: 'Black headphones, had a small scratch on the left ear cup.',
                location: 'Main Gym',
                date: new Date('2024-11-12'),
                reporter: user1._id,
                status: 'active'
            },
            {
                type: 'found',
                title: 'Sony Headphones black',
                description: 'Found Sony headphones near the gym entrance.',
                location: 'Gym Entrance',
                date: new Date('2024-11-13'),
                reporter: user2._id,
                status: 'active'
            },
            {
                type: 'lost',
                title: 'Leather Wallet',
                description: 'Brown leather wallet with ID cards.',
                location: 'Student Center',
                date: new Date('2024-11-15'),
                reporter: user1._id,
                status: 'active'
            }
        ]);

        console.log('Sample items created.');
        process.exit();
    } catch (error) {
        console.error('Error seeding data:', error);
        process.exit(1);
    }
};

seedData();
