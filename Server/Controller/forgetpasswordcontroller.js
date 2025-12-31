const User = require('../models/user');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const bcrypt = require('bcryptjs');

exports.forgotPassword = async (req, res) => {
    const { email } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) return res.status(404).json({ msg: "User not found" });

        const secret = process.env.JWT_SECRET + user.password;
        const token = jwt.sign({ id: user._id, email: user.email }, secret, { expiresIn: '15m' });

        // Link matches the App.js route structure
        const link = `http://localhost:3000/reset-password/${user._id}/${token}`;

        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS 
            }
        });

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'Password Reset Link - E-LEARN',
            html: `
                <div style="font-family: Arial; border: 1px solid #ddd; padding: 20px; border-radius: 10px;">
                    <h2 style="color: #6b21a8;">Reset Your Password</h2>
                    <p>Click the button below to reset your password. Valid for 15 minutes.</p>
                    <a href="${link}" style="background: #6b21a8; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block;">Reset Password</a>
                </div>`
        };

        await transporter.sendMail(mailOptions);
        res.status(200).json({ msg: "Reset link sent to your email!" });

    } catch (error) {
        res.status(500).json({ msg: "Error sending email. Check server logs." });
    }
};

exports.resetPassword = async (req, res) => {
    const { id, token } = req.params;
    const { password } = req.body;

    try {
        const user = await User.findOne({ _id: id });
        if (!user) return res.status(404).json({ msg: "User not found" });

        const secret = process.env.JWT_SECRET + user.password;
        jwt.verify(token, secret); 

        const hashedPassword = await bcrypt.hash(password, 12);
        await User.findByIdAndUpdate(id, { password: hashedPassword });

        res.status(200).json({ msg: "Password updated successfully!" });
    } catch (error) {
        res.status(500).json({ msg: "Invalid or expired token" });
    }
};