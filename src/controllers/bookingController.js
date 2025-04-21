const Booking = require('../models/bookingModel');
const AppError = require('../utils/AppError');
const APIFeatures = require('../utils/feautures');
const getAllBookings = async (req, res, next) => {
  try {

    const features = new APIFeatures(Booking, req.query)
      .filter()
      .sort()
      .paginate();
    console.log(features.options);
    const bookings = await features.exec();
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
    const booking = await Booking.findByPk(req.params.id)
    await booking.update(req.body)
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