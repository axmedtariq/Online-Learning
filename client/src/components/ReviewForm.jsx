import React, { useState } from 'react';
import axios from 'axios';
import { HiStar } from 'react-icons/hi';
import '../styles/ReviewForm.scss';

const ReviewForm = ({ courseId, onReviewSuccess }) => {
    const [rating, setRating] = useState(0);
    const [hover, setHover] = useState(0);
    const [comment, setComment] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (rating === 0) return setError('Please select a rating');
        if (!comment.trim()) return setError('Please write a comment');

        setLoading(true);
        setError('');

        try {
            const token = localStorage.getItem('token');
            await axios.post(`http://localhost:5000/api/courses/${courseId}/reviews`, {
                rating,
                comment
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            onReviewSuccess();
            alert('Thank you for your review!');
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to submit review');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="review-form-container">
            <h3>Leave a Review</h3>
            <form onSubmit={handleSubmit} className="review-form">
                <div className="star-rating">
                    {[...Array(5)].map((_, index) => {
                        const starValue = index + 1;
                        return (
                            <button
                                type="button"
                                key={starValue}
                                className={starValue <= (hover || rating) ? 'star active' : 'star'}
                                onClick={() => setRating(starValue)}
                                onMouseEnter={() => setHover(starValue)}
                                onMouseLeave={() => setHover(0)}
                            >
                                <HiStar size={32} />
                            </button>
                        );
                    })}
                </div>
                {error && <p className="error-msg">{error}</p>}
                <textarea
                    placeholder="Tell us what you liked about this course..."
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    rows="4"
                    required
                />
                <button type="submit" disabled={loading} className="btn-submit">
                    {loading ? 'Submitting...' : 'Submit Review'}
                </button>
            </form>
        </div>
    );
};

export default ReviewForm;
