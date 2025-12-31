const User = require('../models/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// --- SIGNUP LOGIC ---
exports.signup = async (req, res) => {
    try {
        const { username, email, password } = req.body;

        // 1. Check if user exists
        const existingUser = await User.findOne({ email });
        if (existingUser) return res.status(400).json({ message: "User already exists" });

        // 2. Hash Password
        const hashedPassword = await bcrypt.hash(password, 12);

        // 3. Create User
        const newUser = await User.create({ 
            username, 
            email, 
            password: hashedPassword,
            role: 'student' // Default role
        });

        // 4. Generate Token (So they don't have to login immediately after signing up)
        const token = jwt.sign(
            { id: newUser._id, role: newUser.role }, 
            process.env.JWT_SECRET, 
            { expiresIn: '24h' }
        );

        res.status(201).json({ 
            token, 
            user: { username: newUser.username, email: newUser.email, role: newUser.role },
            message: "User registered successfully!" 
        });
    } catch (err) {
        console.error("Signup Error:", err);
        res.status(500).json({ message: "Something went wrong" });
    }
};

// --- LOGIN LOGIC ---
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // 1. Find User
        const user = await User.findOne({ email });
        if (!user) return res.status(404).json({ message: "User not found" });

        // 2. Verify Password
        const isPasswordCorrect = await bcrypt.compare(password, user.password);
        if (!isPasswordCorrect) return res.status(400).json({ message: "Invalid credentials" });

        // 3. Create JWT Token
        const token = jwt.sign(
            { id: user._id, role: user.role }, 
            process.env.JWT_SECRET, 
            { expiresIn: '24h' } // Increased to 24h for better UX
        );

        res.status(200).json({ 
            token, 
            user: { id: user._id, username: user.username, email: user.email, role: user.role } 
        });
    } catch (err) {
        console.error("Login Error:", err);
        res.status(500).json({ message: "Server error" });
    }
};

// --- GET PROFILE LOGIC ---
exports.getProfile = async (req, res) => {
    try {
        // req.user.id is provided by your verifyToken middleware
        const user = await User.findById(req.user.id)
            .select('-password') // Security: Remove password from response
            .populate('enrolledCourses'); // Joins the course data

        if (!user) return res.status(404).json({ msg: "User not found" });

        res.status(200).json(user);
    } catch (error) {
        console.error("Profile Error:", error);
        res.status(500).json({ msg: "Server Error" });
    }
};