const User = require('../models/User');
const jwt = require('jsonwebtoken');

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

// @desc    Register new user (for initial setup/testing)
// @route   POST /api/auth/register
const registerUser = async (req, res) => {
    const { rollNumber, password, role } = req.body;

    const userExists = await User.findOne({ rollNumber });
    if (userExists) {
        return res.status(400).json({ message: 'User already exists' });
    }

    const user = await User.create({
        rollNumber,
        password, // Pre-save hook will hash this
        role: role || 'user',
        forcePasswordChange: true // Default as per requirements
    });

    if (user) {
        res.status(201).json({
            _id: user._id,
            rollNumber: user.rollNumber,
            role: user.role,
            forcePasswordChange: user.forcePasswordChange,
            token: generateToken(user._id)
        });
    } else {
        res.status(400).json({ message: 'Invalid user data' });
    }
};

// @desc    Login user
// @route   POST /api/auth/login
const loginUser = async (req, res) => {
    const { rollNumber, password } = req.body;

    const user = await User.findOne({ rollNumber });

    if (user && (await user.comparePassword(password))) {
        res.json({
            _id: user._id,
            rollNumber: user.rollNumber,
            role: user.role,
            forcePasswordChange: user.forcePasswordChange,
            token: generateToken(user._id)
        });
    } else {
        res.status(401).json({ message: 'Invalid roll number or password' });
    }
};

// @desc    Update password
// @route   PUT /api/auth/change-password
const changePassword = async (req, res) => {
    const { oldPassword, newPassword } = req.body;
    const user = await User.findById(req.user._id);

    if (user && (await user.comparePassword(oldPassword))) {
        user.password = newPassword;
        user.forcePasswordChange = false;
        await user.save();
        res.json({ message: 'Password updated successfully' });
    } else {
        res.status(400).json({ message: 'Invalid current password' });
    }
};

module.exports = { registerUser, loginUser, changePassword };
