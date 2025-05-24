const express = require('express');
const { protect, restrictTo } = require('../controllers/authenticationController');
const { createFeedback, getAllFeedbacks, getOneFeedback, updateFeedback, deleteFeedback } = require('../controllers/FeedbackController');
const Router = express.Router();

Router.route("/").get(protect, restrictTo("Admin"), getAllFeedbacks).post(protect, createFeedback);
Router.route("/:id").get(protect, restrictTo("Client", "Admin"), getOneFeedback).patch(protect, restrictTo("Admin"), updateFeedback).delete(protect, restrictTo("Admin"), deleteFeedback)

module.exports = Router;