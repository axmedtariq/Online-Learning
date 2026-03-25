import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../styles/CreateCourse.scss';

const CreateCourse = () => {
  const [course, setCourse] = useState({ title: '', description: '', price: '' });
  const [thumbnail, setThumbnail] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleUpload = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Get the JWT token from localStorage for authorization
    const token = localStorage.getItem('token');

    // Use FormData because we are sending a file (image)
    const formData = new FormData();
    formData.append('title', course.title);
    formData.append('description', course.description);
    formData.append('price', course.price);
    if (thumbnail) formData.append('thumbnail', thumbnail);

    try {
      const response = await axios.post(
        'http://localhost:5000/api/courses/create', 
        formData, 
        {
          headers: {
            'Authorization': `Bearer ${token}`, // Passes through authMiddleware
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      if (response.status === 201) {
        alert("Course Created Successfully!");
        // Redirect to the lessons page or dashboard
        navigate('/instructor/dashboard');
      }
    } catch (err) {
      console.error("Error creating course:", err);
      alert(err.response?.data?.msg || "Failed to create course");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="create-course-page">
      <h1 className="page-title">Create New Course</h1>
      
      <div className="form-container">
        <form onSubmit={handleUpload} className="course-form">
          <div className="form-group">
            <label>Course Title</label>
            <input 
              type="text" 
              placeholder="e.g. Master React in 30 Days"
              onChange={(e) => setCourse({...course, title: e.target.value})}
              required
            />
          </div>

          <div className="form-group">
            <label>Description</label>
            <textarea 
              rows="5"
              placeholder="What will students learn in this course?"
              onChange={(e) => setCourse({...course, description: e.target.value})}
              required
            ></textarea>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Price ($)</label>
              <input 
                type="number" 
                placeholder="0.00"
                onChange={(e) => setCourse({...course, price: e.target.value})}
                required
              />
            </div>
            <div className="form-group">
              <label>Thumbnail Image</label>
              <input 
                type="file" 
                className="file-input" 
                accept="image/*"
                onChange={(e) => setThumbnail(e.target.files[0])}
                required
              />
            </div>
          </div>

          <button type="submit" className="btn-submit" disabled={loading}>
            {loading ? "Creating..." : "Create Course & Move to Lessons →"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateCourse;