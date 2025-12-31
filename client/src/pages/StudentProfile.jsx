import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../styles/StudentProfile.scss';

const StudentProfile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) return navigate('/login');

        // --- ENDPOINT: GET /api/auth/me ---
        // This fetches the specific user data using their Token
        const response = await axios.get('http://localhost:5000/api/auth/profile', {
          headers: { Authorization: `Bearer ${token}` }
        });

        setUser(response.data);
      } catch (err) {
        console.error("Session expired or invalid");
        localStorage.removeItem('token');
        navigate('/login');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [navigate]);

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = "/";
  };

  if (loading) return <div>Loading your profile...</div>;

  return (
    <div className="profile-layout">
      <aside className="profile-sidebar">
        <h2 className="sidebar-logo">My Learning</h2>
        <nav className="sidebar-nav">
          <div className="nav-item active">My Courses</div>
          <div className="nav-item" onClick={() => navigate('/settings')}>Profile Settings</div>
          <button onClick={logout} className="btn-logout">Logout</button>
        </nav>
      </aside>

      <main className="profile-content">
        <section className="user-header-card">
          <div className="profile-img-wrapper">
            <img src={user?.profilePic || "https://via.placeholder.com/150"} alt="profile" />
          </div>
          <div className="user-info">
            <h1>{user?.name}</h1>
            <p>{user?.bio || "No bio added yet."}</p>
            <p className="user-email">{user?.email}</p>
          </div>
        </section>

        <section className="purchased-section">
          <h3>Purchased Courses</h3>
          <div className="course-grid">
            {/* We map the real courses the user bought */}
            {user?.enrolledCourses?.length > 0 ? (
              user.enrolledCourses.map((course) => (
                <div key={course._id} className="course-progress-card">
                  <h4>{course.title}</h4>
                  <div className="progress-container">
                    <div className="progress-bar" style={{ width: `${course.progress || 0}%` }}></div>
                  </div>
                  <p className="progress-text">{course.progress || 0}% Completed</p>
                  <button 
                    className="btn-continue" 
                    onClick={() => navigate(`/watch/${course._id}`)}
                  >
                    Continue Watching
                  </button>
                </div>
              ))
            ) : (
              <p>You haven't enrolled in any courses yet.</p>
            )}
          </div>
        </section>
      </main>
    </div>
  );
};

export default StudentProfile;