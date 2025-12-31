import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { HiCheckCircle, HiPlay, HiChevronLeft } from 'react-icons/hi';
import axios from 'axios';
import '../styles/WatchCourse.scss';

const WatchCourse = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const [activeLesson, setActiveLesson] = useState(0);
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFullCourse = async () => {
      try {
        const token = localStorage.getItem('token');
        
        // --- ENDPOINT: GET /api/courses/watch/:id ---
        // This route should check if the user is enrolled before sending video links
        const response = await axios.get(`http://localhost:5000/api/courses/watch/${courseId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        setCourse(response.data);
      } catch (err) {
        console.error("Access denied or course not found");
        // Redirect to preview if they haven't bought it
        navigate(`/course/${courseId}`);
      } finally {
        setLoading(false);
      }
    };

    fetchFullCourse();
  }, [courseId, navigate]);

  if (loading) return <div className="loading">Initializing Video Player...</div>;
  if (!course || !course.lessons.length) return <div>No lessons found.</div>;

  return (
    <div className="watch-container">
      <header className="watch-header">
        <div className="header-left">
          <button onClick={() => navigate(-1)} className="back-btn"><HiChevronLeft size={24}/></button>
          <h1 className="course-title">{course.title}</h1>
        </div>
        <div className="progress-indicator">Lesson {activeLesson + 1} of {course.lessons.length}</div>
      </header>

      <div className="watch-main">
        <div className="video-section">
          <video 
            key={course.lessons[activeLesson].videoUrl} 
            controls 
            className="main-video"
            controlsList="nodownload"
          >
            <source src={course.lessons[activeLesson].videoUrl} type="video/mp4" />
          </video>
        </div>

        <aside className="curriculum-sidebar">
          <div className="sidebar-header"><h2>Course Content</h2></div>
          <div className="lesson-list">
            {course.lessons.map((lesson, index) => (
              <button
                key={index}
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

      <footer className="lesson-details">
        <h3>About this lesson: {course.lessons[activeLesson].title}</h3>
        <p>{course.lessons[activeLesson].description || "No description provided for this lesson."}</p>
      </footer>
    </div>
  );
};

export default WatchCourse;