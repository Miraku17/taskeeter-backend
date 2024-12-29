const db = require('../config/database');
const bcrypt = require('bcryptjs');

const userModel = {
    create: async (userData) => {
        try {
            // Hash password
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(userData.password, salt);

            // Using promise-based query
            const [result] = await db.query(
                'INSERT INTO users (name, email, password) VALUES (?, ?, ?)',
                [userData.name, userData.email, hashedPassword]
            );

            if (!result || !result.insertId) {
                throw new Error('Failed to create user');
            }

            return result.insertId;
        } catch (err) {
            if (err.code === 'ER_DUP_ENTRY') {
                throw new Error('Email already exists');
            }
            throw new Error('Error creating user: ' + err.message);
        }
    },

    findByEmail: async (email) => {
        if (!email) {
            throw new Error('Email is required');
        }

        try {
            const [rows] = await db.query(
                'SELECT * FROM users WHERE email = ?',
                [email]
            );

            return rows.length > 0 ? rows[0] : null;
        } catch (err) {
            throw new Error('Error finding user: ' + err.message);
        }
    },

    verifyPassword: async (plainPassword, hashedPassword) => {
        if (!plainPassword || !hashedPassword) {
            throw new Error('Both password and hash are required');
        }
        return await bcrypt.compare(plainPassword, hashedPassword);
    }
};

module.exports = userModel;