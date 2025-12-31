import React, { useState } from 'react';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import axios from 'axios';
import '../styles/checkout.scss'; // Link to your SCSS file

const CheckoutPage = ({ courseAmount }) => {
    const stripe = useStripe();
    const elements = useElements();
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (event) => {
        event.preventDefault();
        setLoading(true);

        // 1. Get Client Secret from Backend
        const { data: { clientSecret } } = await axios.post('/api/payment/create-payment-intent', {
            amount: courseAmount * 100 // Convert to cents
        });

        // 2. Confirm Payment with Stripe
        const result = await stripe.confirmCardPayment(clientSecret, {
            payment_method: {
                card: elements.getElement(CardElement),
            }
        });

        if (result.error) {
            alert(result.error.message);
        } else {
            if (result.paymentIntent.status === 'succeeded') {
                alert("Payment Successful! Course Unlocked.");
                // Redirect to Watch Course page here
            }
        }
        setLoading(false);
    };

    return (
        <form onSubmit={handleSubmit} className="payment-form">
            <h3>Pay with Credit or Debit Card</h3>
            <CardElement />
            <button disabled={!stripe || loading}>
                {loading ? "Processing..." : `Pay $${courseAmount}`}
            </button>
        </form>
    );
};

export default CheckoutPage;