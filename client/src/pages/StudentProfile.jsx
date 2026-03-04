import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { HiPlay, HiStar, HiHeart, HiArchive } from 'react-icons/hi';
import '../styles/StudentProfile.scss';

const StudentProfile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('learning');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) return navigate('/login');
        const response = await axios.get('http://localhost:5000/api/auth/profile', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setUser(response.data);
      } catch (err) {
        console.error("Session expired");
        localStorage.removeItem('token');
        navigate('/login');
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [navigate]);

  if (loading) return <div className="loader">Loading...</div>;

  const enrolledCourses = user?.enrolledCourses || [];

  return (
    <div className="ud-profile-page">
      <Navbar />

      <header className="profile-header">
        <div className="container">
          <div className="profile-info">
            <div className="avatar">
              {user?.username?.charAt(0).toUpperCase()}
            </div>
            <div className="text">
              <h1>{user?.username}</h1>
              <p>{user?.email}</p>
            </div>
          </div>
        </div>
      </header>

      <div className="profile-tabs-nav">
        <div className="container">
          <button
            className={`tab-btn ${activeTab === 'learning' ? 'active' : ''}`}
            onClick={() => setActiveTab('learning')}
          >All courses</button>
          <button
            className={`tab-btn ${activeTab === 'wishlist' ? 'active' : ''}`}
            onClick={() => setActiveTab('wishlist')}
          >Wishlist</button>
          <button
            className={`tab-btn ${activeTab === 'archived' ? 'active' : ''}`}
            onClick={() => setActiveTab('archived')}
          >Archived</button>
          <button
            className={`tab-btn ${activeTab === 'tools' ? 'active' : ''}`}
            onClick={() => setActiveTab('tools')}
          >Learning tools</button>
        </div>
      </div>

      <main className="profile-main">
        <div className="container">
          {activeTab === 'learning' && (
            <div className="course-grid">
              {enrolledCourses.length > 0 ? (
                enrolledCourses.map(course => (
                  <div key={course._id} className="ud-course-card" onClick={() => navigate(`/watch/${course._id}`)}>
                    <div className="card-image">
                      <img src={course.thumbnail} alt={course.title} />
                      <div className="overlay"><HiPlay size={48} /></div>
                    </div>
                    <div className="card-content">
                      <h3>{course.title}</h3>
                      <p className="instructor">{course.instructor?.username}</p>
                      <div className="progress-container">
                        <div className="progress-bar-bg">
                          <div className="progress-bar-fill" style={{ width: `${course.progress || 0}%` }}></div>
                        </div>
                        <div className="progress-text">
                          <span>{course.progress || 0}% complete</span>
                          <div className="stars">
                            <HiStar className="star-icon" />
                            <span>Leave a rating</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="empty-state">
                  <p>You haven't started any courses yet.</p>
                  <button className="btn-browse" onClick={() => navigate('/')}>Browse now</button>
                </div>
              )}
            </div>
          )}
          {activeTab === 'wishlist' && (
            <div className="empty-state">
              <HiHeart size={64} color="#d1d7dc" />
              <p>Your wishlist is empty.</p>
              <button className="btn-browse" onClick={() => navigate('/')}>Explore courses</button>
            </div>
          )}
          {activeTab === 'archived' && (
            <div className="empty-state">
              <HiArchive size={64} color="#d1d7dc" />
              <p>Focus on the courses you're currently learning.</p>
              <button className="btn-browse" onClick={() => setActiveTab('learning')}>Go to All courses</button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default StudentProfile;