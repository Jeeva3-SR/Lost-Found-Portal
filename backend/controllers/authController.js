const User = require('../models/User');
const jwt = require('jsonwebtoken');

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

// @desc    Register new user (for initial setup/testing)
// @route   POST /api/auth/register
const registerUser = async (req, res) => {
    try {
        const { rollNumber, password, role } = req.body;

        if (!rollNumber || !password) {
            return res.status(400).json({ message: 'Roll number and password are required' });
        }

        const userExists = await User.findOne({ rollNumber });
        if (userExists) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const user = await User.create({
            rollNumber,
            password,
            role: role || 'user'
        });

        if (user) {
            res.status(201).json({
                _id: user._id,
                rollNumber: user.rollNumber,
                role: user.role,
                token: generateToken(user._id)
            });
        } else {
            res.status(400).json({ message: 'Invalid user data' });
        }
    } catch (error) {
        console.error('Registration error:', error.message);
        res.status(500).json({ message: error.message || 'Registration failed' });
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
        await user.save();
        res.json({ message: 'Password updated successfully' });
    } else {
        res.status(400).json({ message: 'Invalid current password' });
    }
};

// @desc    Update user profile
// @route   PUT /api/auth/profile
const updateProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);

        if (user) {
            user.rollNumber = req.body.rollNumber || user.rollNumber;
            // Add other fields if necessary
            
            const updatedUser = await user.save();
            res.json({
                _id: updatedUser._id,
                rollNumber: updatedUser.rollNumber,
                role: updatedUser.role,
                token: generateToken(updatedUser._id)
            });
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        res.status(400).json({ message: 'Error updating profile' });
    }
};

module.exports = { registerUser, loginUser, changePassword, updateProfile };
