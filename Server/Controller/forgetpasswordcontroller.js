const User = require('../models/user');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const bcrypt = require('bcryptjs');

// 1. Send Email Logic
exports.forgotPassword = async (req, res) => {
    const { email } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) return res.status(404).json({ message: "User not found" });

        // Create a one-time reset token (valid for 15 mins)
        const secret = process.env.JWT_SECRET + user.password;
        const token = jwt.sign({ id: user._id, email: user.email }, secret, { expiresIn: '15m' });

        const link = `http://localhost:3000/reset-password/${user._id}/${token}`;

        // Configure Nodemailer
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER, // Your Gmail
                pass: process.env.EMAIL_PASS  // Your Gmail App Password
            }
        });

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'Password Reset Link - E-LEARN',
            html: `
                <div style="font-family: Arial, sans-serif; border: 1px solid #e1e1e1; padding: 20px; border-radius: 10px;">
                    <h2 style="color: #6b21a8;">Reset Your Password</h2>
                    <p>Click the button below to reset your password. This link expires in 15 minutes.</p>
                    <a href="${link}" style="background: #6b21a8; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block;">Reset Password</a>
                </div>
            `
        };

        await transporter.sendMail(mailOptions);
        res.status(200).json({ message: "Reset link sent to your email!" });

    } catch (error) {
        res.status(500).json({ message: "Error sending email" });
    }
};

// 2. Update Password Logic
exports.resetPassword = async (req, res) => {
    const { id, token } = req.params;
    const { password } = req.body;

    try {
        const user = await User.findOne({ _id: id });
        if (!user) return res.status(404).json({ message: "User not found" });

        const secret = process.env.JWT_SECRET + user.password;
        jwt.verify(token, secret); // Verify token hasn't expired or been tampered with

        const hashedPassword = await bcrypt.hash(password, 12);
        await User.findByIdAndUpdate(id, { password: hashedPassword });

        res.status(200).json({ message: "Password updated successfully!" });
    } catch (error) {
        res.status(500).json({ message: "Invalid or expired token" });
    }
};