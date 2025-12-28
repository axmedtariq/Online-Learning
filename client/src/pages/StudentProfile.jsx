import React, { useState } from 'react';
import '../styles/StudentProfile.scss';

const StudentProfile = () => {
  const [user, setUser] = useState({
    username: "John Doe",
    bio: "Passionate learner exploring Fullstack Development.",
    profilePic: "https://via.placeholder.com/150"
  });

  const logout = () => {
    localStorage.removeItem('token');
    window.location.href = "/";
  };

  return (
    <div className="profile-layout">
      {/* Sidebar */}
      <aside className="profile-sidebar">
        <h2 className="sidebar-logo">My Learning</h2>
        <nav className="sidebar-nav">
          <div className="nav-item active">My Courses</div>
          <div className="nav-item">Profile Settings</div>
          <button onClick={logout} className="btn-logout">Logout</button>
        </nav>
      </aside>

      {/* Main Content Area */}
      <main className="profile-content">
        {/* Header Card */}
        <section className="user-header-card">
          <div className="profile-img-wrapper">
            <img src={user.profilePic} alt="profile" />
          </div>
          <div className="user-info">
            <h1>{user.username}</h1>
            <p>{user.bio}</p>
            <button className="btn-text">Change Photo</button>
          </div>
        </section>

        {/* Courses Section */}
        <section className="purchased-section">
          <h3>Purchased Courses</h3>
          <div className="course-grid">
            <div className="course-progress-card">
              <h4>MERN Stack Mastery</h4>
              <div className="progress-container">
                <div className="progress-bar" style={{ width: '65%' }}></div>
              </div>
              <p className="progress-text">65% Completed</p>
              <button className="btn-continue">Continue Watching</button>
            </div>
            
            {/* You can map more courses here */}
          </div>
        </section>
      </main>
    </div>
  );
};

export default StudentProfile;