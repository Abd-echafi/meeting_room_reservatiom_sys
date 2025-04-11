const express = require('express');
const path = require('path');
const session = require('express-session');
const passport = require('passport');
const morgan = require('morgan');
const cors = require('cors');
const helmet = require('helmet');
const authRouter = require("./routes/authenticationRoutes");
const User = require("./models/user.model")
require('dotenv').config();

const app = express();

// Set up session middleware
app.use(session({
    secret: 'your_secret_key',  // You can change this to a more secure secret
    resave: false,              // Don't save session if unmodified
    saveUninitialized: true,    // Store sessions even if they're uninitialized
    cookie: { secure: false }   // Set to true if using https, or in production environments
}));

// Initialize Passport.js
app.use(passport.initialize());
app.use(passport.session());

// Middleware setup
app.use(express.json());
app.use(cors());
app.use(helmet());
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}
// Serve static files from "public" folder
app.use(express.static(path.join(__dirname, 'public')));
// Mount routes
app.use('/api/v1/auth', authRouter);

// Handle 404 errors
app.use((req, res, next) => {
    res.status(404).json({
        status: false,
        message: 'Resource not found',
    });
});

// Global error handler (optional, centralized error handling)
app.use((err, req, res, next) => {
    res.status(err.statusCode || 500).json({
        status: false,
        message: err.message || 'Server Error',
    });
});

// Export the app instance
module.exports = app;