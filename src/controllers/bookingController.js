const Booking = require('../models/bookingModel');
const AppError = require('../utils/AppError');

const getAllBookings = async (req, res, next) => {
  try {
    const bookings = await Booking.findAll();
    res.status(200).json({
      status: "success",
      bookings,
    })
  } catch (err) {
    return next(new AppError(err.message, 400));
  }
}

const getOneBookingById = async (req, res, next) => {
  try {
    const booking = await Booking.findByPk(req.params.id);
    res.status(200).json({
      status: "success",
      booking,
    })
  } catch (err) {
    return next(new AppError(err.message, 400));
  }
}



const createBooking = async (req, res, next) => {
  try {
    const booking = await Booking.create(req.body);
    res.status(200).json({
      status: "success",
      booking,
    })
  } catch (err) {
    return next(new AppError(err.message, 400));
  }
}


const updateBooking = async (req, res, next) => {
  try {
    console.log(req.body);
    await Booking.update(req.body, { where: { id: req.params.id } })
    const updatedBooking = await Booking.findByPk(req.params.id);
    res.status(200).json({
      status: "success",
      updatedBooking,
    })
  } catch (err) {
    return next(new AppError(err.message, 400));
  }
}

const deleteBooking = async (req, res, next) => {
  try {
    await Booking.destroy({ where: { id: req.params.id } })
    res.status(204).json({})
  } catch (err) {
    return next(new AppError(err.message, 400));
  }
}

module.exports = { deleteBooking, updateBooking, createBooking, getOneBookingById, getAllBookings }