import React, { useState } from 'react';
import { HiCheckCircle, HiPlay, HiChevronLeft } from 'react-icons/hi';
import '../styles/WatchCourse.scss';

const WatchCourse = () => {
  const [activeLesson, setActiveLesson] = useState(0);

  const courseData = {
    title: "Fullstack MERN Mastery",
    lessons: [
      { id: 1, title: "01. Introduction to MERN", video: "https://vjs.zencdn.net/v/oceans.mp4", duration: "10:00", completed: true },
      { id: 2, title: "02. Setting up MongoDB", video: "https://www.w3schools.com/html/mov_bbb.mp4", duration: "15:45", completed: false },
      { id: 3, title: "03. Express.js Routing", video: "https://vjs.zencdn.net/v/oceans.mp4", duration: "12:20", completed: false },
    ]
  };

  return (
    <div className="watch-container">
      {/* --- TOP BAR --- */}
      <header className="watch-header">
        <div className="header-left">
          <a href="/dashboard" className="back-btn"><HiChevronLeft size={24}/></a>
          <h1 className="course-title">{courseData.title}</h1>
        </div>
        <div className="progress-indicator">Your Progress: 33%</div>
      </header>

      <div className="watch-main">
        {/* --- VIDEO PLAYER --- */}
        <div className="video-section">
          <video 
            key={courseData.lessons[activeLesson].video} 
            controls 
            className="main-video"
            controlsList="nodownload"
          >
            <source src={courseData.lessons[activeLesson].video} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </div>

        {/* --- CURRICULUM SIDEBAR --- */}
        <aside className="curriculum-sidebar">
          <div className="sidebar-header">
            <h2>Course Content</h2>
          </div>
          
          <div className="lesson-list">
            {courseData.lessons.map((lesson, index) => (
              <button
                key={lesson.id}
                onClick={() => setActiveLesson(index)}
                className={`lesson-item ${activeLesson === index ? 'active' : ''}`}
              >
                <div className="status-icon">
                  {lesson.completed ? (
                    <HiCheckCircle className="completed" size={20} />
                  ) : (
                    <HiPlay className={activeLesson === index ? 'playing' : 'idle'} size={20} />
                  )}
                </div>
                <div className="lesson-info">
                  <p className="lesson-title">{lesson.title}</p>
                  <span className="lesson-duration">{lesson.duration}</span>
                </div>
              </button>
            ))}
          </div>
        </aside>
      </div>

      {/* --- BOTTOM BAR: DESCRIPTION --- */}
      <footer className="lesson-details">
        <h3>About this lesson</h3>
        <p>
          In this section, we cover the core concepts of the current module. 
          Make sure to download the resources attached to this lesson.
        </p>
      </footer>
    </div>
  );
};

export default WatchCourse;