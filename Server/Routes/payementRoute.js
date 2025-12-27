const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/paymentController');

// This specific route needs raw body for Stripe signature verification
router.post('/webhook', express.raw({ type: 'application/json' }), paymentController.handleStripeWebhook);

module.exports = router;