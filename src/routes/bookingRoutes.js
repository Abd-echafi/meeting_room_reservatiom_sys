const express = require('express');
const { protect, restrictTo } = require('../controllers/authenticationController');
const { deleteBooking, updateBooking, createBooking, getOneBookingById, getAllBookings } = require('../controllers/bookingController');
const Router = express.Router();

Router.route("/")
  .get(protect, restrictTo('Admin', 'Booking Manager'), getAllBookings)
  .post(protect, restrictTo('Client'), createBooking)

Router.route('/:id')
  .get(protect, restrictTo('Admin', 'Booking Manager', 'Client'), getOneBookingById)
  .patch(protect, restrictTo('Admin', 'Booking Manager', 'Client'), updateBooking)
  .delete(protect, restrictTo('Admin', 'Booking Manager'), deleteBooking);

module.exports = Router;