const jwt = require('jsonwebtoken');
const User = require('../models/user');

exports.isInstructor = async (req, res, next) => {
    try {
        // 1. Get user ID from the JWT token (set in the login step)
        const user = await User.findById(req.user.id);

        // 2. Check if role is Instructor
        if (user.role !== 'instructor') {
            return res.status(403).json({ message: "Access denied. Only instructors allowed." });
        }

        // 3. Check if Admin has approved them
        if (!user.isApproved) {
            return res.status(403).json({ message: "Your account is pending admin approval." });
        }

        next(); // User is valid, move to the next function
    } catch (error) {
        res.status(500).json({ message: "Auth error" });
    }
};