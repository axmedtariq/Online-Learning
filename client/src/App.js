import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Import your pages
import Home from './pages/Home';
import Login from './pages/Login';
import SignUp from './pages/SignUp';
import ForgetPassword from './pages/ForgetPassword';
import ResetPassword from './pages/ResetPassword';
import WatchCourse from './pages/WatchCourse';
import AdminPanel from './pages/AdminPanel';
import CreateCourse from './pages/CreateCourse';

// --- ADD THESE TWO IMPORTS ---
import StudentProfile from './pages/StudentProfile'; 
import CoursePreview from './pages/CoursePreview';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/forgot-password" element={<ForgetPassword />} />
          <Route path="/reset-password/:id/:token" element={<ResetPassword />} />

          {/* --- ADD THIS FOR COURSE PREVIEW --- */}
          <Route path="/course/:courseId" element={<CoursePreview />} />

          {/* Student Routes */}
          <Route path="/watch/:courseId" element={<WatchCourse />} />
          
          {/* --- ADD THIS FOR PROFILE --- */}
          <Route path="/profile" element={<StudentProfile />} />

          {/* Instructor Routes */}
          <Route path="/instructor/create-course" element={<CreateCourse />} />

          {/* Admin Routes */}
          <Route path="/admin-dashboard" element={<AdminPanel />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;