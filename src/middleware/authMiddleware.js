// middleware/authMiddleware.js
const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
    try {
        console.log('Full headers:', req.headers); // Debug headers

        const authHeader = req.headers.authorization;
        console.log('Auth header:', authHeader);  // Debug auth header

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({
                success: false,
                error: 'No token provided'
            });
        }

        const token = authHeader.split(' ')[1];
        console.log('Token to verify:', token); // Debug token

        // Add this line to debug JWT_SECRET
        console.log('JWT_SECRET exists:', !!process.env.JWT_SECRET);

        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            console.log('Successfully decoded token:', decoded);
            req.user = { id: decoded.id };
            next();
        } catch (jwtError) {
            console.log('JWT verification error:', jwtError);
            return res.status(401).json({
                success: false,
                error: 'Invalid token',
                details: process.env.NODE_ENV === 'development' ? jwtError.message : undefined
            });
        }
    } catch (error) {
        console.log('General auth error:', error);
        return res.status(401).json({
            success: false,
            error: 'Authentication failed'
        });
    }
};

module.exports = authMiddleware;