import React from 'react';
import { HiOutlineLockClosed, HiStar } from 'react-icons/hi';
import '../styles/coursepreview.scss';

const CoursePreview = () => {
  return (
    <div className="course-preview-container">
      {/* Banner Section */}
      <div className="course-banner">
        <div className="banner-grid">
          <div className="banner-text">
            <h1>Mastering MERN Stack 2024</h1>
            <p className="subtitle">Build real-world apps with Node, Express, React, and MongoDB.</p>
            <div className="banner-meta">
              <span><HiStar className="star" /> 4.9 (2,300 ratings)</span>
              <span>Created by: <a href="#">Prof. Purple</a></span>
            </div>
          </div>

          {/* Floating Purchase Card */}
          <div className="purchase-card">
            <div className="video-placeholder">
              <span>▶ PREVIEW VIDEO</span>
            </div>
            <div className="card-body">
              <p className="price">$49.99</p>
              <button className="btn-enroll">Enroll Now</button>
              <p className="guarantee">30-Day Money-Back Guarantee</p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Curriculum Section */}
      <div className="curriculum-section">
        <h2>Course Modules</h2>
        <div className="module-list">
          {["Introduction", "MongoDB Setup", "Express Routing", "React Fundamentals"].map((mod, i) => (
            <div key={i} className="module-item">
              <span>{mod}</span>
              <HiOutlineLockClosed className="lock-icon" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CoursePreview;