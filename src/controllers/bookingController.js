const Booking = require('../models/bookingModel');
const AppError = require('../utils/AppError');
const APIFeatures = require('../utils/feautures');
const Room = require('../models/roomModel');
const User = require('../models/user.model');
const { Op } = require('sequelize');
const getAllBookings = async (req, res, next) => {
  try {
    const features = new APIFeatures(Booking, req.query)
      .filter()
      .sort()
      .paginate();
    features.options.include = [{ model: Room, as: 'room', attributes: ['name'] }, { model: User, as: 'user', attributes: ['email'] }]
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
    const booking = await Booking.findByPk(req.params.id, {
      include: [
        {
          model: Room,
          as: 'room',
          attributes: ['name'], // Or any attributes you want
        },
        {
          model: User,
          as: 'user',
          attributes: ['email'], // Or any other user attributes you need
        }
      ]
    });
    res.status(200).json({
      status: "success",
      booking,
    })
  } catch (err) {
    return next(new AppError(err.message, 400));
  }
}

//get bookings by user
const getBookingsByUser = async (req, res, next) => {
  try {
    const bookings = await Booking.findAll({ where: { user_id: req.params.id } });
    res.status(200).json({
      status: "success",
      bookings,
    })
  } catch (err) {
    next(err);
  }
}

const createBooking = async (req, res, next) => {
  try {
    const user_id = req.user.id;
    const { room_id, start_time, end_time } = req.body;
    if (new Date(start_time) >= new Date(end_time)) {
      return res.status(400).json({
        status: "fail",
        message: "start_time must be before end_time",
      });
    }
    const coincideBooking = await Booking.findOne({
      where: {
        room_id: room_id,
        user_id: user_id,
        [Op.or]: [
          {
            start_time: {
              [Op.between]: [start_time, end_time],
            },
          },
          {
            end_time: {
              [Op.between]: [start_time, end_time],
            },
          },
          {
            start_time: {
              [Op.lte]: start_time,
            },
            end_time: {
              [Op.gte]: end_time,
            },
          },
        ],
      }
    })
    if (coincideBooking) {
      return res.status(409).json({
        status: "fail",
        message: "you already bookied this room for that time",
      })
    }
    const booking = await Booking.create(req.body);
    res.status(201).json({
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
    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }
    req.body.OldStatus = booking.status;
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


module.exports = { deleteBooking, updateBooking, createBooking, getOneBookingById, getAllBookings, getBookingsByUser }