const express = require('express');
const { protect, restrictTo } = require('../controllers/authenticationController');
const { getOneById, updateUser, updateUserPassword, deleteUser } = require('../controllers/userControllers');
const Cloudinary = require('../config/cloudinary');
const upload = require("../middlewares/multer");

const Router = express.Router();
Router.route('/:id').get(protect, getOneById).patch(protect, upload.single("image"), Cloudinary.uploadSingle, updateUser).delete(protect, deleteUser);
Router.route('/:id/password').patch(protect, updateUserPassword);

module.exports = Router;