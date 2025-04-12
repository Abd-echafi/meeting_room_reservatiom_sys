const express = require('express');
const { protect, restrictTo } = require('../controllers/authenticationController');
const { getAllRooms, getOneRoomById, updateRoom, createRoom, deleteRoom } = require('../controllers/roomController');
const Cloudinary = require('../config/cloudinary');
const upload = require("../middlewares/multer");
const Router = express.Router();

Router.route('/').get(getAllRooms).post(protect, restrictTo('Admin', 'Room Manager'), upload.array("images"), Cloudinary.uploadMultiple, createRoom);
Router.route('/:id')
  .get(getOneRoomById)
  .patch(protect, restrictTo('Admin', 'Room Manager'), upload.array("images"), Cloudinary.uploadMultiple, updateRoom)
  .delete(protect, restrictTo('Admin', 'Room Manager'), deleteRoom);


module.exports = Router;