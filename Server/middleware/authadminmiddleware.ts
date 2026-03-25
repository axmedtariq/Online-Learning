const { User } = require('../models');

exports.isAdmin = async (req, res, next) => {
    try {
        // req.user is populated by your verifyToken (protect) middleware
        const user = await User.findByPk(req.user.id);

        if (user && user.role === 'admin') {
            next(); // Proceed to the Admin function
        } else {
            return res.status(403).json({ message: "Access Denied: Admin Rights Required" });
        }
    } catch (error) {
        console.error("Admin Check Error:", error);
        res.status(500).json({ message: "Server Error" });
    }
};