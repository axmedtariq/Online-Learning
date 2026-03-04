const express = require('express');
const router = express.Router();
const paymentController = require('../Controller/paymentController');

// This specific route needs raw body for Stripe signature verification
router.post('/', paymentController.handleStripeWebhook);

module.exports = router;