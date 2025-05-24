const AppError = require('../utils/AppError');
const User = require('../models/user.model');
const { Op } = require('sequelize');
const Feedback = require('../models/FeedbackModel');
const Booking = require('../models/bookingModel');
// create feedback
const createFeedback = async (req, res, next) => {
  try {
    const user_id = req.user.id;
    const booking = await Booking.findOne({
      where: {
        user_id: user_id,
        // end_time: {
        //   [Op.lt]: new Date(),
        // },
        status: "Confirmed",
      },
    })
    if (!booking) {
      return res.status(401).json({
        status: "fail",
        message: "you need to try a room before giving feedback",
      })
    }
    req.body.user_id = user_id;
    const feedback = await Feedback.create(req.body);
    res.status(200).json({
      status: "success",
      feedback,
    })
  } catch (err) {
    return next(new AppError(err.message, 400));
  }
}
// get all feedbacks
const getAllFeedbacks = async (req, res, next) => {
  try {
    let { limit, email } = req.query;
    const whereClause = {};
    if (limit) {
      limit = parseInt(limit, 10);
    }
    if (email) {
      whereClause.email = email;
    }
    const feedbacks = await Feedback.findAll({
      where: whereClause,
      include: {
        model: User,
        as: 'user',
        attributes: ['image'],
      },
      limit: limit,
    });
    const fnalFeedback = {};
    feedbacks.forEach((feedback) => {
      fnalFeedback.name = feedback.userName;
      fnalFeedback.email = feedback.email;
      const createdAt = feedback.created_at;
      const day = String(createdAt.getDate()).padStart(2, '0');
      const month = String(createdAt.getMonth() + 1).padStart(2, '0');
      const year = createdAt.getFullYear();
      fnalFeedback.date = `${day}/${month}/${year}`;
      fnalFeedback.rating = feedback.rating;
      fnalFeedback.seen = feedback.seen;
      fnalFeedback.image = feedback.user?.image;
    })
    const data = { ...fnalFeedback };
    res.status(200).json({
      status: "success",
      data,
    })
  } catch (err) {
    return next(new AppError(err.message, 400));
  }
}
// get one feedback by id
const getOneFeedback = async (req, res, next) => {
  try {
    const feedback = await Feedback.findByPk(req.params.id, {
      include: {
        model: User,
        as: 'user',
        attributes: ['image'],
      },
    });
    if (!feedback) {
      res.status(404).json({
        status: "fail",
        message: "this feedback is no longer exists",
      })
    }
    const fnalFeedback = {};
    fnalFeedback.userName = feedback.userName;
    fnalFeedback.email = feedback.email;
    const createdAt = feedback.created_at;
    const day = String(createdAt.getDate()).padStart(2, '0');
    const month = String(createdAt.getMonth() + 1).padStart(2, '0');
    const year = createdAt.getFullYear();
    fnalFeedback.date = `${day}/${month}/${year}`;
    fnalFeedback.rating = feedback.rating;
    fnalFeedback.feedback = feedback.message;
    fnalFeedback.seen = feedback.seen;
    fnalFeedback.image = feedback.user.image;
    const data = { ...fnalFeedback };
    res.status(200).json({
      status: "success",
      data,
    })
  } catch (err) {
    return next(new AppError(err.message, 400));
  }
}
// delete feedback
const deleteFeedback = async (req, res, next) => {
  try {
    const feedback = await Feedback.findByPk(req.params.id)
    if (!feedback) {
      res.status(404).json({
        status: "fail",
        message: "this is user does not exists"
      })
      return;
    }
    await Feedback.destroy({ where: { id: req.params.id } })
    console.log(deleteFeedback);
    res.status(204).json({})
  } catch (err) {
    return next(new AppError(err.message, 400));
  }
}

module.exports = { createFeedback, getAllFeedbacks, getOneFeedback, deleteFeedback }