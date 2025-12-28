import axios from 'axios';

// Set the base URL for your backend
const API_URL = 'http://localhost:5000/api/auth';

// 1. Signup Request
export const registerUser = async (userData) => {
    return await axios.post(`${API_URL}/signup`, userData);
};

// 2. Login Request
export const loginUser = async (userData) => {
    return await axios.post(`${API_URL}/login`, userData);
};

// 3. Forgot Password Request
export const sendResetEmail = async (email) => {
    return await axios.post(`${API_URL}/forgot-password`, { email });
};

// 4. Reset Password Request
export const updatePassword = async (id, token, password) => {
    return await axios.post(`${API_URL}/reset-password/${id}/${token}`, { password });
};