const express = require('express');
const Router = express.Router();
const { protect, restrictTo } = require('../controllers/authenticationController');
const { deleteReview, updateReview, getReviewById, getAllReviewsForRoom, createReview } = require('../controllers/ReviewControllers');
Router.route("/").post(protect, restrictTo('Client'), createReview).get(getAllReviewsForRoom);
Router.route("/:id").get(getReviewById).patch(protect, restrictTo("Client"), updateReview).delete(protect, restrictTo("Client"), deleteReview);

module.exports = Router;