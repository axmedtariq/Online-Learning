import { Request, Response, NextFunction } from 'express';
// @ts-ignore
import { User, Course } from '../models';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

// Helper to generate JWT
const generateToken = (user: any) => {
    return jwt.sign(
        { id: user.id, role: user.role },
        process.env.JWT_SECRET as string,
        { expiresIn: '24h' }
    );
};

// --- SIGNUP LOGIC ---
export const signup = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { username, email, password, role } = req.body;

        // Validate inputs
        if (!username || username.length < 3)
            return res.status(400).json({ message: "Username must be at least 3 characters" });
        if (!email || !/\S+@\S+\.\S+/.test(email))
            return res.status(400).json({ message: "Invalid email" });
        if (!password || password.length < 6)
            return res.status(400).json({ message: "Password must be at least 6 characters" });

        // Check if user already exists
        const existingUser = await User.findOne({ where: { email } });
        if (existingUser)
            return res.status(400).json({ message: "User already exists" });

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 12);

        // Create new user
        const newUser: any = await User.create({
            username,
            email,
            password: hashedPassword,
            role: role || 'student'
        });

        // Generate token
        const token = generateToken(newUser);

        res.status(201).json({
            token,
            user: {
                id: newUser.id,
                username: newUser.username,
                email: newUser.email,
                role: newUser.role
            },
            message: "User registered successfully!"
        });
    } catch (err) {
        console.error("Signup Error:", err);
        next(err);
    }
};

// --- LOGIN LOGIC ---
export const login = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { email, password } = req.body;

        if (!email || !password)
            return res.status(400).json({ message: "Email and password are required" });

        const user: any = await User.findOne({ where: { email } });
        if (!user)
            return res.status(404).json({ message: "User not found" });

        const isPasswordCorrect = await bcrypt.compare(password, user.password);
        if (!isPasswordCorrect)
            return res.status(400).json({ message: "Invalid credentials" });

        const token = generateToken(user);

        res.status(200).json({
            token,
            user: {
                id: user.id,
                username: user.username,
                email: user.email,
                role: user.role
            }
        });
    } catch (err) {
        console.error("Login Error:", err);
        next(err);
    }
};

// --- GET PROFILE LOGIC ---
export const getProfile = async (req: Request, res: Response, next: NextFunction) => {
    try {
        // @ts-ignore
        const user: any = await User.findByPk(req.user.id, {
            attributes: { exclude: ['password'] },
            include: [{ model: Course, as: 'enrolledCourses' }]
        });

        if (!user)
            return res.status(404).json({ message: "User not found" });

        res.status(200).json(user);
    } catch (err) {
        console.error("Profile Error:", err);
        next(err);
    }
};
