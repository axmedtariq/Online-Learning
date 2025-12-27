const User = require('../models/user');

exports.isAdmin = async (req, res, next) => {
    try {
        // req.user is populated by your verifyToken middleware
        const user = await User.findById(req.user.id);

        if (user && user.role === 'admin') {
            next(); // Proceed to the Admin function
        } else {
            return res.status(403).json({ message: "Access Denied: Admin Rights Required" });
        }
    } catch (error) {
        res.status(500).json({ message: "Server Error" });
    }
};