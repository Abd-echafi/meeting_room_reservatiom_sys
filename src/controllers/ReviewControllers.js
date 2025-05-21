const Room = require('../models/roomModel');
const AppError = require('../utils/AppError');
const Booking = require('../models/bookingModel');
const Review = require('../models/reviewModel');
const User = require('../models/user.model');
const APIFeatures = require('../utils/feautures');
const { Op } = require('sequelize');
require('dotenv').config();


const createReview = async (req, res, next) => {
  try {
    console.log("okkk");
    const { room_id, comment, rating } = req.body;
    // rating between 1-5
    if (rating < 1 || rating > 5) {
      return res.status(400).json({
        status: "fail",
        message: "Rating must be between 1 and 5",
      });
    }

    const user_id = req.user.id;

    //no duplicate review to the same room
    const existingReview = await Review.findOne({
      where: {
        user_id,
        room_id,
      },
    });

    if (existingReview) {
      return res.status(400).json({
        status: "fail",
        message: "You have already reviewed this room",
      });
    }
    // make sure the user already tried the room
    const booking = await Booking.findOne({
      where: {
        user_id: user_id,
        room_id: room_id,
        end_time: {
          [Op.lt]: new Date(),
        },
        status: "Confirmed",
      },
    })
    if (!booking) {
      return res.status(401).json({
        status: "fail",
        message: "you need to try the room before reviewing it",
      })
    }
    //creating the review in the db
    console.log("okk");
    const review = await Review.create({
      user_id,
      room_id,
      comment,
      rating,
    });

    res.status(201).json({
      status: "success",
      review,
    });
  } catch (err) {
    return next(new AppError(err.message, 400));
  }
};


const getAllReviewsForRoom = async (req, res, next) => {
  try {
    let { sortRating, sortTime } = req.query
    let rating = [];
    rating[0] = req.query.rating;
    const room_id = req.body.room_id;
    if (!room_id) {
      res.status(400).json({
        status: "fail",
        message: "you need to specify the room_id in the req.body"
      })
    }
    if (!sortRating) {
      sortRating = "DESC";
    }
    if (!sortTime) {
      sortTime = "DESC";
    }
    if (rating[0] === undefined) {
      console.log("entred");
      rating = [1, 2, 3, 4, 5];
    }
    const reviews = await Review.findAll({
      where: {
        rating: {
          [Op.in]: rating, // only include ratings between 1 and 5
        },
        room_id: room_id,
      },
      include: [
        {
          model: User,
          as: "user",
          attributes: ['id', 'name', 'email'],
        },
        {
          model: Room,
          as: "room",
          attributes: ['id', 'name'],
        },
      ],
      order: [
        ['rating', sortRating],        // Sort by stars in descending order (high to low)
        ['created_at', sortTime],    // Then by created_at in ascending order (old to new)
      ]
    });
    res.status(201).json({
      status: "success",
      reviews,
    });
  } catch (err) {
    return next(new AppError(err.message, 400));
  }
};


const getReviewById = async (req, res) => {
  try {
    const review = await Review.findByPk(req.params.id, {
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'name', 'email'],
        },
        {
          model: Room,
          as: 'room',
          attributes: ['id', 'name'],
        },
      ],
    }
    );
    console.log(review);
    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }

    res.status(200).json({
      status: "success",
      review,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


const updateReview = async (req, res) => {
  try {
    const review = await Review.findByPk(req.params.id);
    if (req.user.id !== review.user_id) {
      return res.status(401).json({
        status: "fail",
        message: "you can not update another's review"
      });
    }
    if (!review) {
      return res.status(404).json({
        status: "fail",
        message: 'Review not found'
      });
    }
    await review.update(req.body);
    res.status(200).json(review);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};



const deleteReview = async (req, res) => {
  try {
    const review = await Review.findByPk(req.params.id);
    if (!review) {
      return res.status(404).json({
        status: "fail",
        message: 'Review not found'
      });
    }
    await review.destroy();
    res.status(200).json({
      status: "success",
      message: 'Review deleted successfully'
    });
  } catch (err) {
    res.status(500).json({
      status: "fail",
      error: err.message
    });
  }
};

module.exports = { deleteReview, updateReview, getReviewById, getAllReviewsForRoom, createReview }