import React, { useState } from 'react';
import '../styles/CreateCourse.scss';

const CreateCourse = () => {
  const [course, setCourse] = useState({ title: '', description: '', price: '' });

  const handleUpload = (e) => {
    e.preventDefault();
    console.log("Uploading course:", course);
    // Logic for Axios post request
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
              />
            </div>
            <div className="form-group">
              <label>Thumbnail Image</label>
              <input type="file" className="file-input" />
            </div>
          </div>

          <button type="submit" className="btn-submit">
            Create Course & Move to Lessons →
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateCourse;