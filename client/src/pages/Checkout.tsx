import React, { useState, useEffect } from 'react';
import { useStripe, useElements, CardNumberElement, CardExpiryElement, CardCvcElement } from '@stripe/react-stripe-js';
import axios from 'axios';
import { useParams, useNavigate, Link } from 'react-router-dom';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const CheckoutPage = () => {
    const { courseId } = useParams();
    const navigate = useNavigate();
    const stripe = useStripe();
    const elements = useElements();
    const [loading, setLoading] = useState(false);
    const [course, setCourse] = useState<any>(null);
    const [user, setUser] = useState<any>(null);
    const [email, setEmail] = useState('');

    useEffect(() => {
        const fetchCourse = async () => {
            try {
                const { data } = await axios.get(`${API_URL}/api/courses/${courseId}`);
                setCourse(data);
            } catch (err) {
                console.error("Course load failed");
            }
        };

        const userData = localStorage.getItem('user');
        if (userData) {
            const parsedUser = JSON.parse(userData);
            setUser(parsedUser);
            setEmail(parsedUser.email || '');
        }

        fetchCourse();
    }, [courseId]);

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        if (!course || !stripe || !elements) return;

        setLoading(true);

        try {
            const token = localStorage.getItem('token');
            const response: any = await axios.post(`${API_URL}/api/payment/create-payment-intent`, {
                amount: course.price * 100, // Convert to cents
                courseId: courseId
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            const clientSecret = response.data.clientSecret;

            const result = await stripe.confirmCardPayment(clientSecret, {
                payment_method: {
                    card: elements.getElement(CardNumberElement)!,
                    billing_details: {
                        email: email,
                        name: user?.username || 'Guest'
                    }
                }
            });

            if (result.error) {
                alert(result.error.message || "Payment failed");
            } else {
                if (result.paymentIntent?.status === 'succeeded') {
                    // Update user's enrolled courses on the backend
                    await axios.post(`${API_URL}/api/courses/${courseId}/enroll`, {}, {
                        headers: { Authorization: `Bearer ${token}` }
                    });
                    
                    alert("Payment Successful! Course Unlocked.");
                    navigate('/profile');
                }
            }
        } catch (err) {
            console.error("Payment initiation failed", err);
            alert("Payment failed. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    if (!course) {
        return (
            <div className="min-h-screen bg-[#0b1326] flex items-center justify-center">
                <div className="w-12 h-12 border-4 border-[#c0c1ff] border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    const elementOptions = {
        style: {
            base: {
                fontSize: '16px',
                color: '#dae2fd',
                fontFamily: 'Inter, sans-serif',
                '::placeholder': {
                    color: '#464554',
                },
            },
            invalid: {
                color: '#ffb4ab',
            },
        },
    };

    return (
        <div className="bg-background text-on-background font-body selection:bg-primary/30 min-h-screen">
            {/* Top Navigation Anchor */}
            <nav className="fixed top-0 w-full z-50 bg-slate-950/70 backdrop-blur-3xl shadow-[0_20px_40px_rgba(6,14,32,0.4)]">
                <div className="flex justify-between items-center px-12 py-6 w-full max-w-screen-2xl mx-auto">
                    <span className="text-primary font-headline italic text-2xl tracking-tight">Lumina Premiere</span>
                    <div className="flex items-center gap-8">
                        <Link className="text-slate-400 font-light hover:text-slate-200 transition-all duration-500 hover:opacity-80 text-xs uppercase tracking-widest" to={`/course/${courseId}`}>Back to Course</Link>
                        <span className="material-symbols-outlined text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>lock</span>
                    </div>
                </div>
                <div className="bg-gradient-to-r from-transparent via-slate-800/15 to-transparent h-px w-full absolute bottom-0"></div>
            </nav>

            <main className="pt-32 pb-24 px-6 md:px-12 max-w-screen-xl mx-auto">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
                    {/* Left Column: Secure Checkout Form */}
                    <div className="lg:col-span-7 space-y-16">
                        <header>
                            <h1 className="font-headline italic text-5xl text-on-surface mb-4">Complete your enrollment</h1>
                            <p className="text-outline font-light tracking-wide">Secure transaction encrypted with 256-bit SSL technology.</p>
                        </header>

                        <form onSubmit={handleSubmit} className="space-y-16">
                            {/* Contact Information */}
                            <section className="space-y-8">
                                <div className="flex items-center gap-4">
                                    <span className="text-xs font-label uppercase tracking-widest text-primary/60 px-3 py-1 border border-primary/20 rounded-full">Step 01</span>
                                    <h2 className="font-headline italic text-2xl">Contact Information</h2>
                                </div>
                                <div className="grid grid-cols-1 gap-8">
                                    <div className="group">
                                        <label className="block text-xs font-label uppercase tracking-widest text-outline mb-2 group-focus-within:text-primary transition-colors">Email Address</label>
                                        <input 
                                            className="w-full bg-transparent border-0 border-b border-outline-variant py-3 px-0 focus:ring-0 focus:border-primary text-on-surface placeholder:text-outline-variant transition-all font-sans" 
                                            placeholder="curator@lumina.com" 
                                            type="email" 
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            required
                                        />
                                    </div>
                                </div>
                            </section>

                            {/* Payment Method Selection */}
                            <section className="space-y-8">
                                <div className="flex items-center gap-4">
                                    <span className="text-xs font-label uppercase tracking-widest text-primary/60 px-3 py-1 border border-primary/20 rounded-full">Step 02</span>
                                    <h2 className="font-headline italic text-2xl">Payment Method</h2>
                                </div>
                                <div className="grid grid-cols-1 gap-4">
                                    {/* Card Option (Always checked for this implementation) */}
                                    <label className="relative flex items-center justify-between p-6 rounded-xl border border-primary/50 bg-surface-container-low cursor-pointer hover:bg-surface-container transition-all group">
                                        <div className="flex items-center gap-4">
                                            <span className="material-symbols-outlined text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>credit_card</span>
                                            <span className="font-label text-sm uppercase tracking-wider text-primary">Credit Card</span>
                                        </div>
                                        <div className="w-5 h-5 border-2 border-primary rounded-full bg-primary flex items-center justify-center">
                                            <div className="w-2 h-2 bg-on-primary rounded-full"></div>
                                        </div>
                                    </label>
                                </div>

                                {/* Credit Card Details */}
                                <div className="pt-4 space-y-8">
                                    <div className="group">
                                        <label className="block text-xs font-label uppercase tracking-widest text-outline mb-2 group-focus-within:text-primary transition-colors">Cardholder Name</label>
                                        <input className="w-full bg-transparent border-0 border-b border-outline-variant py-3 px-0 focus:ring-0 focus:border-primary text-on-surface placeholder:text-outline-variant transition-all" placeholder={user?.username || "Full Name"} type="text" />
                                    </div>
                                    <div className="group">
                                        <label className="block text-xs font-label uppercase tracking-widest text-outline mb-2 group-focus-within:text-primary transition-colors">Card Number</label>
                                        <div className="w-full bg-transparent border-0 border-b border-outline-variant py-3 px-0 focus-within:border-primary transition-all">
                                            <CardNumberElement options={elementOptions} />
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-12">
                                        <div className="group">
                                            <label className="block text-xs font-label uppercase tracking-widest text-outline mb-2 group-focus-within:text-primary transition-colors">Expiry Date</label>
                                            <div className="w-full bg-transparent border-0 border-b border-outline-variant py-3 px-0 focus-within:border-primary transition-all text-on-surface">
                                                <CardExpiryElement options={elementOptions} />
                                            </div>
                                        </div>
                                        <div className="group">
                                            <label className="block text-xs font-label uppercase tracking-widest text-outline mb-2 group-focus-within:text-primary transition-colors">CVC</label>
                                            <div className="w-full bg-transparent border-0 border-b border-outline-variant py-3 px-0 focus-within:border-primary transition-all text-on-surface">
                                                <CardCvcElement options={elementOptions} />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </section>

                            <button 
                                type="submit"
                                disabled={!stripe || loading}
                                className="w-full py-6 px-12 bg-gradient-to-br from-primary to-primary-container text-on-primary-container font-label uppercase tracking-[0.2em] text-sm rounded-full shadow-[0_10px_30px_rgba(192,193,255,0.3)] hover:shadow-[0_15px_40px_rgba(192,193,255,0.5)] active:scale-[0.98] transition-all duration-500 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
                            >
                                {loading && <div className="w-4 h-4 border-2 border-on-primary-container border-t-transparent rounded-full animate-spin"></div>}
                                {loading ? 'Processing...' : `Complete Purchase — $${course.price}`}
                            </button>
                        </form>
                    </div>

                    {/* Right Column: Sidebar Order Summary */}
                    <aside className="lg:col-span-5 sticky top-32">
                        <div className="bg-surface-container-low/70 backdrop-blur-2xl p-10 rounded-3xl border border-white/5 shadow-[0_20px_40px_rgba(6,14,32,0.4)]">
                            <h3 className="font-headline italic text-3xl mb-8">Order Summary</h3>
                            <div className="flex gap-6 mb-10 pb-10 border-b border-outline-variant/20">
                                <div className="relative w-28 h-20 flex-shrink-0 overflow-hidden rounded-xl border border-white/5">
                                    <img alt={course.title} className="w-full h-full object-cover grayscale opacity-70" src={course.thumbnail || "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80&w=300"} />
                                </div>
                                <div>
                                    <h4 className="font-headline text-xl leading-tight mb-1 italic font-bold">{course.title}</h4>
                                    <p className="text-[10px] font-label uppercase tracking-widest text-outline">Masterclass by {course.instructor?.username || 'Elena Ross'}</p>
                                </div>
                            </div>

                            <div className="space-y-6 mb-10">
                                <div className="flex justify-between items-center text-xs">
                                    <span className="font-label text-outline uppercase tracking-widest">Enrollment Fee</span>
                                    <span className="text-on-surface font-sans">${course.price}.00</span>
                                </div>
                                <div className="flex justify-between items-center text-xs">
                                    <span className="font-label text-outline uppercase tracking-widest">Academic Tax (5%)</span>
                                    <span className="text-on-surface font-sans">${(course.price * 0.05).toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between items-center text-xs">
                                    <span className="font-label text-outline uppercase tracking-widest">Digital Processing</span>
                                    <span className="text-primary font-label text-[10px] uppercase tracking-widest">Included</span>
                                </div>
                            </div>

                            <div className="pt-8 border-t border-primary/20 flex justify-between items-end">
                                <div>
                                    <p className="text-[10px] font-label uppercase tracking-[0.3em] text-primary mb-2">Total Amount</p>
                                    <p className="font-headline text-5xl italic text-on-surface">${(course.price * 1.05).toFixed(2).toLocaleString()}</p>
                                </div>
                                <span className="text-[10px] font-label uppercase tracking-widest text-outline pb-2 font-black">USD</span>
                            </div>

                            <div className="mt-12 bg-primary/5 p-6 rounded-2xl flex items-start gap-4 border border-primary/10">
                                <span className="material-symbols-outlined text-primary text-xl" style={{ fontVariationSettings: "'FILL' 1" }}>verified</span>
                                <p className="text-[11px] leading-relaxed text-on-surface/70 font-serif italic">
                                    Your purchase includes lifetime access to all course materials, curated digital resources, and a 12-month mentorship window.
                                </p>
                            </div>
                        </div>
                    </aside>
                </div>
            </main>

            {/* Footer Shell */}
            <footer className="w-full py-16 border-t border-white/5 bg-slate-950 flex flex-col items-center gap-6">
                <div className="flex gap-12 text-slate-600 font-sans text-[10px] uppercase tracking-widest font-black">
                    <button className="hover:text-primary transition-colors">Privacy Policy</button>
                    <button className="hover:text-primary transition-colors">Terms of Service</button>
                    <button className="hover:text-primary transition-colors">Help Center</button>
                </div>
                <p className="font-sans text-[10px] uppercase tracking-widest text-slate-500 font-black">© 2026 Lumina Premiere. Academic Excellence in Digital Curations.</p>
            </footer>
            
            <style>{`
                .StripeElement {
                    width: 100%;
                }
            `}</style>
        </div>
    );
};

export default CheckoutPage;