const express = require('express');
const { protect, restrictTo } = require('../controllers/authenticationController');
const { deleteBooking, updateBooking, createBooking, getOneBookingById, getAllBookings, getBookingsByUser } = require('../controllers/bookingController');
const Router = express.Router();

Router.route("/")
  .get(protect, restrictTo('Admin', 'Booking Manager'), getAllBookings)
  .post(protect, createBooking)

Router.route('/user/:id').get(protect, getBookingsByUser)
Router.route('/:id')
  .get(protect, restrictTo('Admin', 'Booking Manager', 'Client'), getOneBookingById)
  .patch(protect, restrictTo('Admin', 'Booking Manager'), updateBooking)
  .delete(protect, restrictTo('Admin', 'Booking Manager'), deleteBooking);

module.exports = Router;