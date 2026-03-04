const { User, Course } = require('../models');

// --- USER MANAGEMENT ---
exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.findAll({
            attributes: { exclude: ['password'] }
        });
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: "Error fetching users" });
    }
};

exports.deleteUser = async (req, res) => {
    try {
        await User.destroy({ where: { id: req.params.id } });
        res.json({ message: "User removed successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error deleting user" });
    }
};

// --- INSTRUCTOR APPROVAL ---
exports.toggleInstructorApproval = async (req, res) => {
    try {
        const user = await User.findByPk(req.params.id);
        if (!user) return res.status(404).json({ message: "User not found" });

        user.isApproved = !user.isApproved;
        await user.save();
        res.json({ message: `Instructor ${user.isApproved ? 'Approved' : 'Suspended'}` });
    } catch (error) {
        res.status(500).json({ message: "Error toggling approval" });
    }
};

// --- COURSE MANAGEMENT ---
exports.getAllCourses = async (req, res) => {
    try {
        const courses = await Course.findAll({
            include: [{ model: User, as: 'instructor', attributes: ['username'] }]
        });
        res.json(courses);
    } catch (error) {
        res.status(500).json({ message: "Error fetching courses" });
    }
};