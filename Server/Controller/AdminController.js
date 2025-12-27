const User = require('../models/user');
const Course = require('../models/course');

// --- USER MANAGEMENT ---
exports.getAllUsers = async (req, res) => {
    const users = await User.find().select('-password'); // Don't send passwords
    res.json(users);
};

exports.deleteUser = async (req, res) => {
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: "User removed successfully" });
};

// --- INSTRUCTOR APPROVAL ---
exports.toggleInstructorApproval = async (req, res) => {
    const user = await User.findById(req.params.id);
    user.isApproved = !user.isApproved;
    await user.save();
    res.json({ message: `Instructor ${user.isApproved ? 'Approved' : 'Suspended'}` });
};

// --- COURSE MANAGEMENT ---
exports.getAllCourses = async (req, res) => {
    const courses = await Course.find().populate('instructor', 'username');
    res.json(courses);
};