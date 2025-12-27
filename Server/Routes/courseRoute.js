const express = require('express');
const router = express.Router();
const { createCourse } = require('../controllers/courseController');
const { isInstructor } = require('../middleware/authmiddleware');
const verifyToken = require('../middleware/verifyToken'); // Your JWT checker

// Only logged-in, approved instructors can hit this POST route
router.post('/create', verifyToken, isInstructor, createCourse);

module.exports = router;