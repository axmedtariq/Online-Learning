const express = require('express');
const router = express.Router();
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const { protect } = require('../middleware/authmiddleware');

router.post('/create-payment-intent', protect, async (req, res) => {
    const { amount, courseId } = req.body; // Amount in cents (e.g., $10.00 is 1000)
    const userId = req.user.id;

    try {
        const paymentIntent = await stripe.paymentIntents.create({
            amount: amount,
            currency: 'usd',
            payment_method_types: ['card'],
            metadata: {
                userId: userId.toString(),
                courseId: courseId
            }
        });

        res.status(200).send({
            clientSecret: paymentIntent.client_secret,
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;