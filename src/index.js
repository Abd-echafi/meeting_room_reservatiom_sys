const express = require('express');
const path = require('path');
const { createServer } = require("http");
const session = require('express-session');
const passport = require('passport');
const morgan = require('morgan');
const cors = require('cors');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');
const authRouter = require("./routes/authenticationRoutes");
const userRouter = require("./routes/userRoutes");
const roomRouter = require('./routes/roomRoutes');
const bookingRouter = require('./routes/bookingRoutes');
const User = require("./models/user.model");
const Room = require("./models/roomModel");
const Booking = require("./models/bookingModel");
const Image = require('./models/imageModel');
require('dotenv').config();

const app = express();
const httpServer = createServer(app);
// Set up session middleware
app.use((req, res, next) => {
    res.setHeader("Content-Security-Policy", "script-src 'self' https://cdn.socket.io");
    next();
});

app.use(session({
    secret: 'your_secret_key',  // You can change this to a more secure secret
    resave: false,              // Don't save session if unmodified
    saveUninitialized: true,    // Store sessions even if they're uninitialized
    cookie: { secure: false }   // Set to true if using https, or in production environments
}));
app.use(cors({
    origin: 'http://localhost:5173', // Your frontend domain
    credentials: true,               // Important! Allows sending cookies
}));
// Initialize Passport.js
app.use(passport.initialize());
app.use(passport.session());

// Middleware setup
app.use(express.json());
app.use(cookieParser());
// Use express.json() and express.urlencoded() to parse form data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(helmet());
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}
// Serve static files from "public" folder
app.use(express.static(path.join(__dirname, 'public')));
// Mount routes
app.use('/api/v1/auth', authRouter);
app.use('/api/v1/user', userRouter);
app.use("/api/v1/rooms", roomRouter);
app.use("/api/v1/bookings", bookingRouter);
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
module.exports = httpServer;