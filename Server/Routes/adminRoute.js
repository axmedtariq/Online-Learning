const express = require('express');
const router = express.Router();
const { isAdmin } = require('../middleware/adminMiddleware');
const verifyToken = require('../middleware/verifyToken');
const adminCtrl = require('../controllers/adminController');

// All routes here are protected by both Login check and Admin check
router.get('/users', verifyToken, isAdmin, adminCtrl.getAllUsers);
router.delete('/user/:id', verifyToken, isAdmin, adminCtrl.deleteUser);
router.put('/approve/:id', verifyToken, isAdmin, adminCtrl.toggleInstructorApproval);
router.get('/courses', verifyToken, isAdmin, adminCtrl.getAllCourses);

module.exports = router;