const express = require('express');
const router = express.Router();

// MATCHING YOUR SCREENSHOT: Folder is 'Controller', files are lowercase
const { signup, login, getProfile } = require('../Controller/authcontroller');
const { forgotPassword, resetPassword } = require('../Controller/forgetpasswordcontroller');
const { protect } = require('../middleware/authmiddleware');

// Standard Auth
router.post('/signup', signup);
router.post('/login', login);
router.get('/profile', protect, getProfile);

// Password Reset
router.post('/forgot-password', forgotPassword);

// The controller expects both id and token as params
router.post('/reset-password/:id/:token', resetPassword);

module.exports = router;