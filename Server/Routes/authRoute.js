const express = require('express');
const router = express.Router();
const { signup, login } = require('../Controller/authcontroller');
const { forgotPassword, resetPassword } = require('../controller/forgotPasswordController');

// Standard Auth
router.post('/signup', signup);
router.post('/login', login);

// Password Reset
router.post('/forgot-password', forgotPassword);
router.post('/reset-password/:token', resetPassword);

module.exports = router;