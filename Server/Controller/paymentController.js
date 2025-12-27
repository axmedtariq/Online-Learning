const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const User = require('../models/user');

exports.handleStripeWebhook = async (req, res) => {
    const sig = req.headers['stripe-signature'];
    let event;

    try {
        // Verify that the event actually came from Stripe
        event = stripe.webhooks.constructEvent(
            req.body, 
            sig, 
            process.env.STRIPE_WEBHOOK_SECRET
        );
    } catch (err) {
        return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    // Handle the specific event
    if (event.type === 'checkout.session.completed') {
        const session = event.data.object;

        // Extract metadata we sent during checkout creation
        const { userId, courseId } = session.metadata;

        try {
            // Update the User's purchased courses in MongoDB
            await User.findByIdAndUpdate(userId, {
                $addToSet: { purchasedCourses: courseId } // $addToSet prevents duplicates
            });
            
            console.log(`Success: Course ${courseId} added to User ${userId}`);
        } catch (dbErr) {
            console.error("Database update failed during webhook", dbErr);
        }
    }

    // Return a 200 response to Stripe to acknowledge receipt
    res.json({ received: true });
};