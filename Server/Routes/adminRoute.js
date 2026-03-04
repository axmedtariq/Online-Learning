const express = require('express');
const router = express.Router();
const { isAdmin } = require('../middleware/authadminmiddleware');
const { protect } = require('../middleware/authmiddleware');
const adminCtrl = require('../Controller/AdminController');

// All routes here are protected by both Login check and Admin check
router.get('/users', protect, isAdmin, adminCtrl.getAllUsers);
router.delete('/user/:id', protect, isAdmin, adminCtrl.deleteUser);
router.put('/approve/:id', protect, isAdmin, adminCtrl.toggleInstructorApproval);
router.get('/courses', protect, isAdmin, adminCtrl.getAllCourses);

module.exports = router;