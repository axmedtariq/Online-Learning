import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { HiOutlineLockClosed, HiStar } from 'react-icons/hi';
import axios from 'axios';
import '../styles/coursepreview.scss';

const CoursePreview = () => {
  const { courseId } = useParams(); // Gets ID from the URL
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        // --- CONNECTING TO ENDPOINT: GET /api/courses/:id ---
        const response = await axios.get(`http://localhost:5000/api/courses/${courseId}`);
        setCourse(response.data);
      } catch (error) {
        console.error("Error fetching course data", error);
      } finally {
        setLoading(false);
      }
    };
    fetchCourse();
  }, [courseId]);

  if (loading) return <div className="loader">Loading Course Details...</div>;
  if (!course) return <div className="error">Course not found.</div>;

  return (
    <div className="course-preview-container">
      <div className="course-banner">
        <div className="banner-grid">
          <div className="banner-text">
            <h1>{course.title}</h1>
            <p className="subtitle">{course.description}</p>
            <div className="banner-meta">
              <span><HiStar className="star" /> {course.averageRating.toFixed(1)} ({course.numReviews} reviews)</span>
              <span>Created by: <strong>{course.instructor?.username}</strong></span>
            </div>
          </div>

          <div className="purchase-card">
            <div className="video-placeholder">
              <img src={course.thumbnail} alt="course thumbnail" />
              <span className="play-overlay">▶ PREVIEW VIDEO</span>
            </div>
            <div className="card-body">
              <p className="price">${course.price}</p>
              {/* --- CONNECTING TO ENDPOINT: Navigate to Checkout --- */}
              <button
                className="btn-enroll"
                onClick={() => navigate(`/checkout/${courseId}`)}
              >
                Enroll Now
              </button>
              <p className="guarantee">Full Lifetime Access</p>
            </div>
          </div>
        </div>
      </div>

      <div className="curriculum-section">
        <h2>Course Modules</h2>
        <div className="module-list">
          {course.lessons?.map((lesson, i) => (
            <div key={i} className="module-item">
              <span>{lesson.title}</span>
              <HiOutlineLockClosed className="lock-icon" />
            </div>
          ))}
        </div>
      </div>

      <div className="reviews-section">
        <h2>Student Reviews</h2>
        {course.reviews?.length > 0 ? (
          <div className="review-grid">
            {course.reviews.map((review, i) => (
              <div key={i} className="review-card">
                <div className="review-header">
                  <strong>{review.name}</strong>
                  <div className="review-rating">
                    {[...Array(5)].map((_, idx) => (
                      <HiStar key={idx} className={idx < review.rating ? "star active" : "star"} />
                    ))}
                  </div>
                </div>
                <p>{review.comment}</p>
              </div>
            ))}
          </div>
        ) : (
          <p>No reviews yet. Be the first to review this course!</p>
        )}
      </div>
    </div>
  );
};

export default CoursePreview;