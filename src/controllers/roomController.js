const Room = require('../models/roomModel');
const AppError = require('../utils/AppError');
const Image = require('../models/imageModel');
const Booking = require('../models/bookingModel');
const { Op } = require('sequelize');
require('dotenv').config();

// get all rooms 
const getAllRooms = async (req, res, next) => {
  try {
    const rooms = await Room.findAll({ attributes: ['id', 'name', 'type', 'status', 'note', 'description'], include: [{ model: Image, as: 'images', attributes: ['image'], }] });
    res.status(200).json({
      status: "success",
      rooms,
    })
  } catch (err) {
    return next(new AppError(err.message, 400));
  }
}



//get all avvailable rooms 
const getAllAvailableRooms = async (req, res, next) => {
  try {
    const { start_time, end_time } = req.body;

    if (!start_time || !end_time) {
      return res.status(400).json({ error: 'start_time and end_time are required' });
    }

    // Step 1: Get bookings that overlap the given range
    const overlappingBookings = await Booking.findAll({
      where: {
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
      },
    });
    const bookedRoomIds = overlappingBookings.map(b => b.room_id);
    // Step 2: Get rooms that are NOT in those bookedRoomIds
    const availableRooms = await Room.findAll({
      where: {
        id: {
          [Op.notIn]: bookedRoomIds,
        },
        status: 'Available',
      },
    });

    res.status(200).json({
      status: "success",
      data: availableRooms,
    });
  } catch (err) {
    next(err);
  }
}
// get one room by id

const getOneRoomById = async (req, res, next) => {
  try {
    const room = await Room.findByPk(req.params.id, {
      include: [{ model: Image, as: 'images', attributes: ['image'], }], // Include associated images
    });
    console.log(room);
    res.status(200).json({
      status: "success",
      room,
    })
  } catch (err) {
    return (new AppError(err.message, 400));
  }
}
// create a room 
const createRoom = async (req, res, next) => {
  try {
    const room = await Room.create(req.body);
    const imageArray = [];
    for (const image of req.images) {
      imageArray.push({ room_id: room.id, image: image });
    }
    await Image.bulkCreate(imageArray);

    const finalRoom = await Room.findByPk(room.id, {
      include: [{ model: Image, as: 'images', attributes: ['image'] }],
    });
    console.log("okk");
    res.status(201).json({
      status: "success",
      finalRoom,
    })
  } catch (err) {
    return (new AppError(err.message, 400));
  }
}
// update specific room
const updateRoom = async (req, res, next) => {
  try {
    if (req.images) {
      //find all the images of the room
      const images = await Image.findAll({ where: { room_id: req.params.id } });
      //delete all the images in the db (images array)
      await Image.destroy({ where: { room_id: req.params.id } })
      //create the new images in the db from req.images
      const imageData = req.images.map((image) => ({
        room_id: req.params.id,
        image: image,
      }))
      await Image.bulkCreate(imageData);
    }
    const room = await Room.findByPk(req.params.id);
    if (!room) {
      next(new AppError("room not found"), 404);
    }
    const { name, capacity, amenities, type, note, description, status } = req.body;
    const initialObj = { name, capacity, amenities, type, note, description, status };
    const finalObj = {};
    for (const key in initialObj) {
      if (initialObj.hasOwnProperty(key)) {
        if (initialObj[key]) {
          finalObj[key] = initialObj[key];
        }
      }
    }
    await Room.update(finalObj, { where: { id: req.params.id } });
    const updatedRoom = await Room.findByPk(req.params.id, { include: [{ model: Image, as: 'images', attributes: ['image'] }] });
    res.status(200).json({
      status: "success",
      room: updatedRoom,
    })
  } catch (err) {
    return (new AppError(err.message, 400));
  }
}

//delete room
const deleteRoom = async (req, res, next) => {
  try {
    const room = await Room.findByPk(req.params.id);
    if (!room) {
      next(new AppError("room not found"), 404);
    }
    await Room.destroy({ where: { id: req.params.id } });
    res.status(204).json({})
  } catch (err) {
    return (new AppError(err.message, 400));
  }
}


module.exports = { getAllRooms, getAllAvailableRooms, getOneRoomById, updateRoom, deleteRoom, createRoom };