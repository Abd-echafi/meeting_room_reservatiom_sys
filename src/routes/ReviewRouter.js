const express = require('express');
const Router = express.Router();
const { protect, restrictTo } = require('../controllers/authenticationController');
const { deleteReview, updateReview, getReviewById, getAllReviewsForRoom, createReview } = require('../controllers/ReviewControllers');
Router.route("/").post(protect, restrictTo('Client'), createReview);
Router.route("/rooms/:room_id").get(getAllReviewsForRoom);
Router.route("/:id").get(getReviewById).patch(protect, restrictTo("Client"), updateReview).delete(protect, restrictTo("Admin", "Client"), deleteReview);

module.exports = Router;