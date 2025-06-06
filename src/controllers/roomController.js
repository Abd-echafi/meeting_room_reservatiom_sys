const Room = require('../models/roomModel');
const AppError = require('../utils/AppError');
const Image = require('../models/imageModel');
const Booking = require('../models/bookingModel');
const APIFeatures = require('../utils/feautures');
const { Op } = require('sequelize');
require('dotenv').config();

// get all rooms 
const getAllRooms = async (req, res, next) => {
  try {
    const search = req.query.search;
    let rooms;
    if (search) {
      rooms = await Room.findAll({ attributes: ['id', 'name', 'type', 'status', 'note', 'description', 'pricing', 'amenities'], include: [{ model: Image, as: 'images', attributes: ['image'], }], where: { name: { [Op.like]: `%${search}%` } } });
    } else {
      rooms = await Room.findAll({ attributes: ['id', 'name', 'type', 'status', 'note', 'description', 'pricing', 'amenities'], include: [{ model: Image, as: 'images', attributes: ['image'], }] });
    }

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
    console.log(req.query);
    const { start_time, end_time } = req.query;
    let bookedRoomIds;
    if (start_time || end_time) {
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
          status: "Confirmed",
        },
      });
      bookedRoomIds = overlappingBookings.map(b => b.room_id);
      // return res.status(400).json({ error: 'start_time and end_time are required' });
    }
    console.log(bookedRoomIds);
    // Step 2: Get rooms that are NOT in those bookedRoomIds
    const features = new APIFeatures(Room, req.query).filter()
      .sort()
      .paginate();
    features.options.attributes = ['id', 'name', 'type', 'status', 'note', 'description', 'pricing', 'amenities']
    features.options.include = [{ model: Image, as: 'images', attributes: ['image'], }]
    if (bookedRoomIds) features.options.where.id = { [Op.notIn]: bookedRoomIds }
    features.options.where.status = 'Available';
    console.log(features.options);
    const availableRooms = await features.exec();

    res.status(200).json({
      status: "success",
      data: availableRooms,
    });
  } catch (err) {
    next(err);
  }
}
//get the bookings start-end time for a room for a specific day
const getBookingsForRoomOnDate = async (req, res, next) => {
  try {
    // if (!req.body.date) {
    //   throw new AppError("you must enter a date", 400);
    // }
    // const date = new Date(req.body.date);
    // const startOfDay = new Date(date);
    // startOfDay.setHours(0, 0, 0, 0);

    // const endOfDay = new Date(date);
    // endOfDay.setHours(23, 59, 59, 999);
    const weekNumber = req.query.page;
    // 1. Define time range 
    const now = new Date();
    const threeMonthsLater = new Date();
    threeMonthsLater.setMonth(threeMonthsLater.getMonth() + 3);
    // 2. Fetch bookings between now and 12 weeks later
    const bookings = await Booking.findAll({
      where: {
        room_id: req.params.roomId,
        start_time: {
          [Op.between]: [now, threeMonthsLater],
        },
        status: "Confirmed",
      },
      attributes: ["start_time", "end_time"],
      order: [["start_time", "ASC"]],
    });
    // 3. Initialize empty structure: 12 weeks, each week 7 days
    const weeks = Array.from({ length: 12 }, () => Array.from({ length: 7 }, () => []));

    // 4. Process each booking
    for (const booking of bookings) {
      const startDate = new Date(booking.start_time);

      // Calculate difference in days from now
      const diffInTime = startDate.getTime() - now.getTime();
      const diffInDays = Math.floor(diffInTime / (1000 * 60 * 60 * 24)); // 1 day = 86400000 ms

      if (diffInDays >= 0 && diffInDays < 12 * 7) {
        const weekIndex = Math.floor(diffInDays / 7); // which week
        const dayIndex = diffInDays % 7;              // which day in the week

        weeks[weekIndex][dayIndex].push({
          start_time: booking.start_time,
          end_time: booking.end_time,
        });
      }
    }
    const finalBookings = weeks[weekNumber - 1];
    res.status(200).json({
      status: "success",
      data: finalBookings,
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
    console.log("okk");
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
    const { name, capacity, amenities, type, note, description, status, pricing } = req.body;
    const initialObj = { name, capacity, amenities, type, note, description, status, pricing };
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
    await Booking.destroy({ where: { room_id: req.params.id } })
    await room.destroy({ where: { id: req.params.id } });
    res.status(204).json({})
  } catch (err) {
    return (new AppError(err.message, 400));
  }
}


module.exports = { getAllRooms, getAllAvailableRooms, getOneRoomById, updateRoom, deleteRoom, createRoom, getBookingsForRoomOnDate };