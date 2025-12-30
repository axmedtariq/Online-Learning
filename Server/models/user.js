// Import mongoose at the top
const mongoose = require('mongoose');

// Define the schema
const userSchema = new mongoose.Schema({
    username: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { 
        type: String,   
        default: 'student', 
        enum: ['student', 'instructor', 'admin'] 
    },
    isApproved: { 
        type: Boolean, 
        default: false // Admin must change this to true
    }
}, { timestamps: true });

// Export the model
module.exports = mongoose.model('User', userSchema);
