const express = require('express');
const { protect, restrictTo } = require('../controllers/authenticationController');
const { deleteNotification, updateNotification, getNotificationById, getNotificationsByUser, createNotification } = require('../controllers/notificationsController')
const Router = express.Router();

Router.route('/').get(protect, getNotificationsByUser)
Router.route('/:id').get(protect, getNotificationById).patch(protect, updateNotification).delete(protect, deleteNotification);


module.exports = Router;