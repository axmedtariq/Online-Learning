import React, { useState, useEffect } from 'react';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import '../styles/checkout.scss'; // Link to your SCSS file

const CheckoutPage = () => {
    const { courseId } = useParams();
    const navigate = useNavigate();
    const stripe = useStripe();
    const elements = useElements();
    const [loading, setLoading] = useState(false);
    const [course, setCourse] = useState(null);

    useEffect(() => {
        const fetchCourse = async () => {
            try {
                const { data } = await axios.get(`http://localhost:5000/api/courses/${courseId}`);
                setCourse(data);
            } catch (err) {
                console.error("Course load failed");
            }
        };
        fetchCourse();
    }, [courseId]);

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (!course || !stripe || !elements) return;
        setLoading(true);

        try {
            const token = localStorage.getItem('token');
            const { data: { clientSecret } } = await axios.post('http://localhost:5000/api/payment/create-payment-intent', {
                amount: course.price * 100, // Convert to cents
                courseId: courseId
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });

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
                    navigate('/profile');
                }
            }
        } catch (err) {
            console.error("Payment initiation failed", err);
            alert("Payment failed. Please try again.");
        }
        setLoading(false);
    };

    if (!course) return <div className="loading">Loading Payment Details...</div>;

    return (
        <div className="checkout-container">
            <div className="checkout-card">
                <div className="checkout-summary">
                    <h2>Checkout Summary</h2>
                    <div className="checkout-item">
                        <img src={course.thumbnail} alt={course.title} />
                        <div className="item-details">
                            <h4>{course.title}</h4>
                            <p className="item-price">Total: ${course.price}</p>
                        </div>
                    </div>
                </div>
                <form onSubmit={handleSubmit} className="payment-form">
                    <h3>Secure Payment</h3>
                    <div className="card-input-wrapper">
                        <CardElement options={{
                            style: {
                                base: {
                                    fontSize: '16px',
                                    color: '#424770',
                                    '::placeholder': {
                                        color: '#aab7c4',
                                    },
                                },
                                invalid: {
                                    color: '#9e2146',
                                },
                            },
                        }} />
                    </div>
                    <button disabled={!stripe || loading} className="pay-btn">
                        {loading ? <div className="spinner"></div> : `Pay $${course.price} Now`}
                    </button>
                    <p className="secure-note">🔒 Secure SSL Encrypted Payment</p>
                </form>
            </div>
        </div>
    );
};

export default CheckoutPage;