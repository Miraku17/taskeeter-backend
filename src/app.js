const express = require('express');
const cors = require('cors');
const userRoutes = require('./routes/userRoutes');
const quoteRoutes = require('./routes/quoteRoutes');
const todoRoutes = require('./routes/todoRoutes');
const { SecretsManagerClient, GetSecretValueCommand } = require('@aws-sdk/client-secrets-manager');

const app = express();

// CORS Middleware
app.use(cors({
  origin: 'http://localhost:5173',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Middleware
app.use(express.json());

// Configure the AWS Secrets Manager client
const secretsManagerClient = new SecretsManagerClient({ region: process.env.AWS_REGION || 'ap-southeast-2' });

// Retrieve the secrets from AWS Secrets Manager
async function getSecrets() {
  try {
    const response = await secretsManagerClient.send(
      new GetSecretValueCommand({
        SecretId: 'taskeeter_env',
        VersionStage: 'AWSCURRENT'
      })
    );
    return JSON.parse(response.SecretString);
  } catch (error) {
    console.error('Error retrieving secrets:', error);
    throw error;
  }
}

// Routes
app.use('/api/users', userRoutes);
app.use('/api/quote', quoteRoutes);
app.use('/api/todos', todoRoutes);

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

// Start the server
async function startServer() {
  try {
    const secrets = await getSecrets();
    const { PORT, NODE_ENV } = secrets;

    // Handle undefined PORT
    if (!PORT) {
      console.error('PORT is not defined in secrets.');
      process.exit(1); // Exit if PORT is not set
    }

    // Update AWS SDK credentials dynamically from environment variables
    secretsManagerClient.config.credentials = {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    };

    console.log('Secrets successfully retrieved. Starting server...');
    console.log(`Environment: ${NODE_ENV}`);

    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('Error starting server:', error);
  }
}

startServer();
