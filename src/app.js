const express = require('express');
const cors = require('cors');
const userRoutes = require('./routes/userRoutes');
const quoteRoutes = require('./routes/quoteRoutes');
const todoRoutes = require('./routes/todoRoutes');  // Add this line
const { port } = require('./config/config');

const app = express();

// CORS Middleware
app.use(cors({
  origin: 'http://localhost:5173',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Middleware
app.use(express.json());

// Routes
app.use('/api/users', userRoutes);
app.use('/api/quote', quoteRoutes);  // Updated to be consistent with /api prefix
app.use('/api/todos', todoRoutes);    // Add this line

// Basic route
app.get('/', (req, res) => {
    res.send('Welcome to Taskeeter API');
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        success: false,
        error: 'Internal Server Error',
        message: err.message
    });
});

// 404 handler - place this after all routes
app.use((req, res) => {
    res.status(404).json({
        success: false,
        error: 'Not Found',
        message: 'The requested resource was not found'
    });
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});