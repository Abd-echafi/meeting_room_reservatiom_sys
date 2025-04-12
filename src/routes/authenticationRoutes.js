const express = require('express');
const { login, signup, signToken, sendResetCode, verifyResetCode, resetPassword } = require('../controllers/authenticationController');
const Router = express.Router();
const passport = require('passport');
const Cloudinary = require('../config/cloudinary');
const upload = require("../middlewares/multer");
const bcrypt = require("bcryptjs");

Router.route('/signup').post(upload.single("image"), Cloudinary.uploadSingle, signup);
Router.route('/login').post(login);
Router.route('/forgot-password').post(sendResetCode);
Router.route('/verify-reset-code').post(verifyResetCode);
Router.route('/reset-password').post(resetPassword);
//redirects the user to Google’s OAuth consent screen
Router.route('/google').get(passport.authenticate('google', {
  scope: ['profile', 'email']
}));

//google redirect user the the url : api/v1/auth/google/callback
Router.route('/callback').get(
  passport.authenticate('google', { session: false }),
  (req, res) => {
    console.log(req.user);
    const token = signToken(req.user.id)
    res.redirect(`http://localhost:5173/dashboard?token=${token}`);
  });

module.exports = Router;

