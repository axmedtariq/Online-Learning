const express = require('express');
const router = express.Router();
const {
    createCourse,
    getAllCourses,
    getCourseById,
    addLesson,
    watchCourse,
    createReview,
    createQuiz,
    getCourseQuizzes,
    getInstructorCourses
} = require('../Controller/courseController');
const { protect, isInstructor } = require('../middleware/authmiddleware');

// Public routes
router.get('/', getAllCourses);
router.get('/:id', getCourseById);

// Instructor routes
router.post('/create', protect, isInstructor, createCourse);
router.get('/instructor/my-courses', protect, isInstructor, getInstructorCourses);
router.post('/:courseId/lesson', protect, isInstructor, addLesson);

// Student/Enrollment routes
router.get('/watch/:id', protect, watchCourse);
router.post('/:id/reviews', protect, createReview);
router.post('/quiz', protect, isInstructor, createQuiz);
router.get('/:courseId/quizzes', protect, getCourseQuizzes);

module.exports = router;