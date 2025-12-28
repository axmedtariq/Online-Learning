import React from 'react';
import '../styles/Home.scss'; // We will create this folder/file next

const Home = () => {
  return (
    <div className="home-container">
      {/* --- NAVBAR --- */}
      <nav className="navbar">
        <div className="logo">E-LEARN</div>
        
        <div className="nav-links">
          <a href="#">Courses</a>
          <a href="#">Instructors</a>
          <a href="#">Resources</a>
        </div>

        <div className="auth-buttons">
          <button className="btn-login">Log In</button>
          <button className="btn-signup">Sign Up</button>
        </div>
      </nav>

      {/* --- HERO SECTION --- */}
      <header className="hero">
        <div className="hero-content">
          <h1>Unlock Your Potential</h1>
          <p>Learn from industry experts with over 5,000+ courses in development, business, and design.</p>
          <div className="search-bar">
            <input type="text" placeholder="Search for anything..." />
            <button>Search</button>
          </div>
        </div>
        <div className="decorative-circle"></div>
      </header>

      {/* --- TOP RATED COURSES --- */}
      <section className="section">
        <h2 className="section-title">Top Rated Courses</h2>
        <div className="course-grid">
          {[1, 2, 3, 4].map((item) => (
            <div key={item} className="course-card">
              <div className="course-image-placeholder">COURSE IMAGE</div>
              <div className="course-details">
                <h3>Fullstack MERN Masterclass</h3>
                <p className="instructor">Dr. Angela Yu</p>
                <div className="rating">
                  <span className="stars">4.8</span>
                  <span className="reviews">(12,450 reviews)</span>
                </div>
                <p className="price">$89.99</p>
              </div>
            </div>
          ))}
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
            <button>🌐 English</button>
          </div>
        </div>
        <div className="footer-bottom">
          <div className="footer-logo">E-LEARN</div>
          <div className="copyright">© 2024 E-Learn, Inc.</div>
        </div>
      </footer>
    </div>
  );
};

export default Home;