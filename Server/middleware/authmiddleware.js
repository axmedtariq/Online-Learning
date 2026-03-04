const jwt = require('jsonwebtoken');
const { User } = require('../models');

exports.protect = async (req, res, next) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            token = req.headers.authorization.split(' ')[1];
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            // Using findByPk for Sequelize
            req.user = await User.findByPk(decoded.id, {
                attributes: { exclude: ['password'] }
            });

            if (!req.user) {
                return res.status(401).json({ message: 'User not found' });
            }

            next();
        } catch (error) {
            console.error("Auth Middleware Error:", error);
            res.status(401).json({ message: 'Not authorized, token failed' });
        }
    }

    if (!token) {
        res.status(401).json({ message: 'Not authorized, no token' });
    }
};

exports.isInstructor = async (req, res, next) => {
    try {
        // req.user is already set by the 'protect' middleware
        const user = req.user;

        if (!user || user.role !== 'instructor') {
            return res.status(403).json({ message: "Access denied. Only instructors allowed." });
        }

        if (!user.isApproved) {
            return res.status(403).json({ message: "Your account is pending admin approval." });
        }

        next();
    } catch (error) {
        console.error("Role Check Error:", error);
        res.status(500).json({ message: "Auth error" });
    }
};