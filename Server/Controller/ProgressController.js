const User = require('../models/user');

exports.markLessonComplete = async (req, res) => {
    try {
        const { userId, courseId, lessonId } = req.body;

        // We use $addToSet to ensure the lessonId is only added once
        await User.findByIdAndUpdate(userId, {
            $addToSet: { completedLessons: lessonId } 
        });

        res.status(200).json({ message: "Progress saved!" });
    } catch (error) {
        res.status(500).json({ message: "Error saving progress" });
    }
};