const User = require('../models/user.model');
const jwt = require('jsonwebtoken');
const AppError = require('../utils/AppError');
const GoogleStrategy = require('passport-google-oauth2').Strategy;
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const passport = require('passport');
const bcrypt = require("bcryptjs");
const { log } = require('console');
require('dotenv').config();
// Generate JWT
const signToken = (id) => jwt.sign({ id }, process.env.JWT_SECRET, {
  expiresIn: "999h",
});

// Send Token Response
const createSendToken = (user, statusCode, res) => {
  const token = signToken(user.id);

  // Exclude password from response
  user.password = undefined;

  // Send token via secure cookie
  const cookieExpiresIn = process.env.JWT_COOKIE_EXPIRES_IN || 7; // Default to 7 days if not set

  res.cookie('jwt', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    expires: new Date(Date.now() + cookieExpiresIn * 24 * 60 * 60 * 1000),
  });


  // JSON response
  res.status(statusCode).json({
    status: 'success',
    data: user,
  });
};


// User Signup
const signup = async (req, res, next) => {
  try {
    const user = await User.findOne({
      where: { email: req.body.email }
    });
    if (user) {
      return new AppError(err.message, 400);
    }
    if (req.image) {
      req.body.image = req.image
    }

    const newUser = await User.create(req.body);
    createSendToken(newUser, 201, res);
  } catch (err) {
    next(err);
  }
};



// User Login
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Check email and password
    if (!email || !password) {
      throw new AppError('Please provide email and password', 400);
    }
    // Find user and include password field
    const user = await User.findOne({
      where: { email },
      // attributes: ['id', 'name', 'email', 'password'], // Specify the attributes you want to retrieve, including 'password'
    });
    // Verify user and password
    if (!user || !(await user.correctPassword(password))) {
      throw new AppError('Invalid email or password', 400);  // More specific error message
    }

    // Send token to user
    createSendToken(user, 200, res);
  } catch (err) {
    next(err);
  }
};

//forgot password function
const sendResetCode = async (req, res, next) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.status(400).json({ success: false, message: 'Email not found' });
    }

    // Generate a 6-digit random code
    const resetCode = crypto.randomBytes(3).toString('hex'); // Generates a 6-digit hex code
    await User.update(
      {
        resetCode,
        resetCodeExpiresAt: new Date(Date.now() + 10 * 60 * 1000) // 10 min later
      },
      {
        where: { email: req.body.email }
      }
    );
    // Send the reset code to the user's email via Nodemailer
    const transporter = nodemailer.createTransport({
      service: 'gmail', // Use your email service provider
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Password Reset Code',
      text: `Your password reset code is: ${resetCode}`,
    };

    await transporter.sendMail(mailOptions);

    return res.status(200).json({ success: true, message: 'Password reset code sent to email' });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Server error' });
  }
}
//verify reset code 
const verifyResetCode = async (req, res) => {
  const { email, code } = req.body;

  try {
    // Check if the code matches the one sent to the email
    //1 get user from the db
    const user = await User.findOne({ where: { email } });
    //2 check the code and expiration time
    if (user.resetCode === code && new Date() < user.resetCodeExpiresAt) {
      return res.status(200).json({ success: true, message: 'Code verified successfully' });
    }

    return res.status(400).json({ success: false, message: 'Invalid code' });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Server error' });
  }
}
//reset password function
const resetPassword = async (req, res) => {
  const { email, newPassword } = req.body;

  try {
    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.status(400).json({ success: false, message: 'Email not found' });
    }

    // Update the user's password 
    await user.update(
      {
        resetCodeExpiresAt: null,
        resetCode: null,
        password: newPassword,
      },
      {
        where: { email: email },
      }
    );
    const updatedUser = await User.findOne({ where: { email } });
    return res.status(200).json({ success: true, message: 'Password reset successfully', user: updatedUser });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Server error' });
  }
}


//
const protect = async (req, res, next) => {
  try {
    // Get token from header
    const token = req.cookies.jwt;

    // Check token presence
    if (!token) {
      return next(new AppError('You are not logged in! Please log in to get access.', 401));
    }

    // Verify token
    let decoded;
    try {
      decoded = await jwt.verify(token, process.env.JWT_SECRET);

    } catch (err) {
      if (err.name === 'TokenExpiredError') {
        throw new AppError('Your session has expired. Please log in again.', 401);
      }
      throw new AppError('Invalid token. Please log in again.', 401);
    }


    // Find user by decoded ID
    const freshUser = await User.findByPk(decoded.id);
    if (!freshUser) {
      return next(new AppError('The user belonging to this token no longer exists.', 401));
    }

    // Check if user changed password
    if (freshUser.changedPasswordAfter(decoded.iat)) {
      return next(new AppError('User recently changed password. Please log in again.', 401));
    }

    // Attach user to request
    req.user = freshUser;
    next();
  } catch (error) {
    next(error);
  }
};

// restrict to function 
const restrictTo = (...roles) => (req, res, next) => {

  try {
    if (!roles.includes(req.user.role_name)) {
      return next(new AppError('You do not have permission to perform this action', 403));
    }
    next();
  } catch (error) {
    next(error);
  }
};


//passport strategy for any one authenticated with google 
passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: "http://localhost:3000/api/v1/auth/callback",
  passReqToCallback: true
},
  function (request, accessToken, refreshToken, profile, done) {
    console.log(profile);
    // Generate a random password
    const randomPassword = crypto.randomBytes(8).toString('hex');

    User.findOrCreate({
      where: { id: profile.id },
      defaults: {
        name: profile.displayName,
        email: profile.emails?.[0]?.value,
        password: randomPassword,
        id: profile.id
      }
    })
      .then(([user, created]) => {
        console.log(user);
        return done(null, user);
      })
      .catch(err => done(err));
  }
));
// Serialize user (store user.id in session)
passport.serializeUser((user, done) => {
  console.log("Serializing user:", user);
  done(null, user.id);  // Store the user ID in session
});

// Deserialize user (find user from session ID)
passport.deserializeUser((id, done) => {
  console.log("Deserializing user with ID:", id);
  User.findByPk(id)  // Using Sequelize's findByPk to find the user by ID
    .then(user => {
      console.log("Found user:", user);
      done(null, user);  // Attach the full user object to the session
    })
    .catch(err => done(err, null));  // Handle errors if user is not found
});


module.exports = { login, signup, signToken, sendResetCode, verifyResetCode, resetPassword, protect, restrictTo };