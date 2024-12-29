const userModel = require('../models/userModel');
const jwt = require('jsonwebtoken');

const userController = {
    register: async (req, res) => {
        try {
            // Validate input
            const { name, email, password } = req.body;
            if (!name || !email || !password) {
                return res.status(400).json({
                    error: 'Please provide name, email, and password'
                });
            }

            // Validate email format
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                return res.status(400).json({
                    error: 'Please provide a valid email address'
                });
            }

            // Validate password strength
            if (password.length < 6) {
                return res.status(400).json({
                    error: 'Password must be at least 6 characters long'
                });
            }

            // Create user
            const userId = await userModel.create({ name, email, password });
            
            // Generate JWT token
            const token = jwt.sign(
                { id: userId },
                process.env.JWT_SECRET,
                { expiresIn: '24h' }
            );

            res.status(201).json({
                message: 'User registered successfully',
                token,
                user: {
                    id: userId,
                    name,
                    email
                }
            });
        } catch (err) {
            if (err.message === 'Email already exists') {
                return res.status(409).json({ error: 'Email already registered' });
            }
            console.error('Registration error:', err);
            res.status(500).json({ error: 'Error registering user' });
        }
    },

    login: async (req, res) => {
        try {
            const { email, password } = req.body;
            
            // Validate input
            if (!email || !password) {
                return res.status(400).json({
                    error: 'Please provide email and password'
                });
            }

            // Find user
            const user = await userModel.findByEmail(email);
            if (!user) {
                return res.status(401).json({
                    error: 'Invalid credentials'
                });
            }

            // Verify password
            const validPassword = await userModel.verifyPassword(
                password,
                user.password
            );

            if (!validPassword) {
                return res.status(401).json({
                    error: 'Invalid credentials'
                });
            }

            // Generate JWT token
            const token = jwt.sign(
                { id: user.id },
                process.env.JWT_SECRET,
                { expiresIn: '24h' }
            );

            res.json({
                message: 'Login successful',
                token,
                user: {
                    id: user.id,
                    name: user.name,
                    email: user.email
                }
            });
        } catch (err) {
            console.error('Login error:', err);
            res.status(500).json({ error: 'Error during login' });
        }
    }
};

module.exports = userController;