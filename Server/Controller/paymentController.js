const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const { User, Course, sequelize } = require('../models');

exports.handleStripeWebhook = async (req, res) => {
    const sig = req.headers['stripe-signature'];
    let event;

    try {
        event = stripe.webhooks.constructEvent(
            req.body,
            sig,
            process.env.STRIPE_WEBHOOK_SECRET
        );
    } catch (err) {
        return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    if (event.type === 'payment_intent.succeeded') {
        const paymentIntent = event.data.object;
        const { userId, courseId } = paymentIntent.metadata;

        const transaction = await sequelize.transaction();
        try {
            const user = await User.findByPk(userId);
            const course = await Course.findByPk(courseId);

            if (user && course) {
                // Sequelize M:M helper (Enrollments table)
                await user.addEnrolledCourse(course, { transaction });
                console.log(`Success: Course ${courseId} added to User ${userId}`);
            }

            await transaction.commit();
        } catch (dbErr) {
            await transaction.rollback();
            console.error("Database update failed during webhook", dbErr);
        }
    }

    res.json({ received: true });
};