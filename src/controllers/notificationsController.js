const AppError = require('../utils/AppError');
const Notification = require('../models/NotificationModel');

const createNotification = async (user_id, message, status, type) => {
  try {
    const notification = await Notification.create({
      user_id,
      message,
      status,
      type,
    });
    return notification;
  } catch (err) {
    next(new AppError(err.message, 400));
  }
};

// Get all notifications for a user
const getNotificationsByUser = async (req, res, next) => {
  try {
    console.log("okk");
    const notifications = await Notification.findAll({
      where: { user_id: req.user.id },
      order: [['created_at', 'DESC']], // Optional: order by creation date
    });
    res.status(200).json({
      status: "success",
      notifications,
    })
  } catch (err) {
    next(new AppError(err.message, 400));
  }
};

// Get a specific notification by ID
const getNotificationById = async (req, res, next) => {
  try {
    const notification = await Notification.findByPk(req.params.id);
    res.status(200).json({
      status: "success",
      notification,
    })
  } catch (err) {
    next(new AppError(err.message, 400));
  }
};
//update the notification
const updateNotification = async (req, res, next) => {
  try {
    const notification = await Notification.findByPk(req.params.id);
    if (!notification) throw new AppError("Notification not found", 400);
    if (req.body.status) {
      await notification.update({ status: req.body.status }, { where: { id: req.params.id } });
    } else {
      throw new AppErrorError("you can just update the notification status", 400);
    }
    res.status(200).json({
      status: "success",
      notification,
    })
  } catch (error) {
    next(err);
  }
};
//delete notification
const deleteNotification = async (req, res, next) => {
  try {
    const notification = await Notification.findByPk(req.params.id);
    if (!notification) throw new AppError("Notification not found");
    await notification.destroy();
    res.status(204).json({})
  } catch (err) {
    next(err);
  }
};

module.exports = { deleteNotification, updateNotification, getNotificationById, getNotificationsByUser, createNotification }