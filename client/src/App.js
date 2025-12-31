import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';

// Import your pages
import Home from './pages/Home';
import Login from './pages/Login';
import SignUp from './pages/SignUp';
import ForgetPassword from './pages/ForgetPassword';
import ResetPassword from './pages/ResetPassword';
import WatchCourse from './pages/WatchCourse';
import AdminPanel from './pages/AdminPanel';
import CreateCourse from './pages/CreateCourse';
import StudentProfile from './pages/StudentProfile'; 
import CoursePreview from './pages/CoursePreview';
import CheckoutPage from './pages/Checkout';

// Initialize Stripe with your Public Key
const stripePromise = loadStripe('pk_test_your_public_key_here');

// --- 🛡️ PROTECTED ROUTE COMPONENT ---
// This prevents unauthorized access (OWASP: Broken Access Control)
const ProtectedRoute = ({ children, roleRequired }) => {
  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user'));

  if (!token) {
    return <Navigate to="/login" />;
  }

  if (roleRequired && user?.role !== roleRequired) {
    return <Navigate to="/" />; // Redirect if role doesn't match
  }

  return children;
};

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          {/* --- PUBLIC ROUTES --- */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/forgot-password" element={<ForgetPassword />} />
          <Route path="/reset-password/:id/:token" element={<ResetPassword />} />
          <Route path="/course/:courseId" element={<CoursePreview />} />

          {/* --- SECURE CHECKOUT (Wrapped in Stripe Elements) --- */}
          <Route path="/checkout/:courseId" element={
            <ProtectedRoute>
              <Elements stripe={stripePromise}>
                <CheckoutPage />
              </Elements>
            </ProtectedRoute>
          } />

          {/* --- STUDENT ROUTES (Login Required) --- */}
          <Route path="/profile" element={
            <ProtectedRoute>
              <StudentProfile />
            </ProtectedRoute>
          } />
          <Route path="/watch/:courseId" element={
            <ProtectedRoute>
              <WatchCourse />
            </ProtectedRoute>
          } />

          {/* --- INSTRUCTOR ROUTES (Role Required) --- */}
          <Route path="/instructor/create-course" element={
            <ProtectedRoute roleRequired="instructor">
              <CreateCourse />
            </ProtectedRoute>
          } />

          {/* --- ADMIN ROUTES (Admin Only) --- */}
          <Route path="/admin-dashboard" element={
            <ProtectedRoute roleRequired="admin">
              <AdminPanel />
            </ProtectedRoute>
          } />

          {/* Catch-all: Redirect unknown URLs to Home */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;