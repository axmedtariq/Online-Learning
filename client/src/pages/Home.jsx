import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import '../styles/Home.scss';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const Home = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Check auth state
  const token = localStorage.getItem('token');

  // Fetch courses (CI-safe)
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await axios.get(`${API_URL}/api/courses`);
        setCourses(response.data);
      } catch (error) {
        console.error('Error fetching courses:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  return (
    <div className="home-container">
      {/* --- NAVBAR --- */}
      <nav className="navbar">
        <div
          className="logo"
          onClick={() => navigate('/')}
          style={{ cursor: 'pointer' }}
        >
          E-LEARN
        </div>

        <div className="nav-links">
          <Link to="/">Courses</Link>
          <button
            type="button"
            className="link-button"
            onClick={() => navigate('/instructors')}
          >
            Instructors
          </button>
          <button
            type="button"
            className="link-button"
            onClick={() => navigate('/resources')}
          >
            Resources
          </button>
        </div>

        <div className="auth-buttons">
          {token ? (
            <button
              className="btn-signup"
              onClick={() => navigate('/profile')}
            >
              My Profile
            </button>
          ) : (
            <>
              <button
                className="btn-login"
                onClick={() => navigate('/login')}
              >
                Log In
              </button>
              <button
                className="btn-signup"
                onClick={() => navigate('/signup')}
              >
                Sign Up
              </button>
            </>
          )}
        </div>
      </nav>

      {/* --- HERO SECTION --- */}
      <header className="hero">
        <div className="hero-content">
          <h1>Unlock Your Potential</h1>
          <p>
            Learn from industry experts with over 5,000+ courses in development,
            business, and design.
          </p>
          <div className="search-bar">
            <input type="text" placeholder="Search for anything..." />
            <button type="button">Search</button>
          </div>
        </div>
        <div className="decorative-circle"></div>
      </header>

      {/* --- COURSES SECTION --- */}
      <section className="section">
        <h2 className="section-title">Top Rated Courses</h2>

        <div className="course-grid">
          {loading ? (
            <div className="loading-spinner">Loading Courses...</div>
          ) : courses.length > 0 ? (
            courses.map((course) => (
              <div
                key={course._id}
                className="course-card"
                onClick={() => navigate(`/course/${course._id}`)}
              >
                <div className="course-image-placeholder">
                  {course.thumbnail ? (
                    <img
                      src={course.thumbnail}
                      alt={course.title}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                      }}
                    />
                  ) : (
                    <span>No Image</span>
                  )}
                </div>

                <div className="course-details">
                  <h3>{course.title}</h3>
                  <p className="instructor">
                    {course.instructorName || 'MERN Expert'}
                  </p>
                  <div className="rating">
                    <span className="stars">
                      ★ {course.rating || '4.8'}
                    </span>
                    <span className="reviews">
                      ({course.numReviews || '0'} reviews)
                    </span>
                  </div>
                  <p className="price">${course.price}</p>
                </div>
              </div>
            ))
          ) : (
            <div className="no-courses">No courses available.</div>
          )}
        </div>
      </section>

      {/* --- FOOTER --- */}
      <footer className="footer">
        <div className="footer-grid">
          <ul>
            <li>E-Learn Business</li>
            <li>Teach on E-Learn</li>
            <li>Get the app</li>
            <li>About us</li>
          </ul>
          <ul>
            <li>Careers</li>
            <li>Blog</li>
            <li>Help and Support</li>
            <li>Affiliate</li>
          </ul>
          <ul>
            <li>Terms</li>
            <li>Privacy policy</li>
            <li>Sitemap</li>
            <li>Accessibility</li>
          </ul>
          <div className="language-selector">
            <button type="button">🌐 English</button>
          </div>
        </div>

        <div className="footer-bottom">
          <div className="footer-logo">E-LEARN</div>
          <div className="copyright">
            © 2024 E-Learn, Inc.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
