const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const Room = require('./roomModel');
const { getIO, userSocketMap } = require('../config/socketIO');
const Notification = require('../models/NotificationModel');
const User = require('../models/user.model');
const nodemailer = require('nodemailer');
require('dotenv').config();
const Booking = sequelize.define('Booking', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  user_id: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  room_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  start_time: {
    type: DataTypes.DATE,
    allowNull: false,
    validate: {
      isAfterNow(value) {
        if (new Date(value) <= new Date()) {
          throw new Error('start_time must be in the future');
        }
      },
      isBeforeEndTime(value) {
        if (this.end_time && new Date(value) >= new Date(this.end_time)) {
          throw new Error('start_time must be before end_time');
        }
      },
    },
  },
  end_time: {
    type: DataTypes.DATE,
    allowNull: false,
    validate: {
      isAfterStartTime(value) {
        if (this.start_time && new Date(value) <= new Date(this.start_time)) {
          throw new Error('end_time must be after start_time');
        }
      },
    },
  },
  status: {
    type: DataTypes.ENUM('Pending', 'Confirmed', 'Canceled'),
    defaultValue: 'Pending',
  },
  created_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
}, {
  tableName: 'bookings',
  timestamps: false,
  underscored: true,
  validate: {
    // Optional: Model-level validation for extra safety
    startTimeBeforeEndTime() {
      if (this.start_time && this.end_time && new Date(this.start_time) >= new Date(this.end_time)) {
        throw new Error('start_time must be before end_time');
      }
    },
    startTimeInFuture() {
      if (this.start_time && new Date(this.start_time) <= new Date()) {
        throw new Error('start_time must be in the future');
      }
    },
  },
  //
  hooks: {
    beforeUpdate: async (booking, options) => {
      console.log("hook entered");
      console.log(booking.status);
      console.log(booking.changed('status'));
      console.log(booking.status && booking.changed('status'));
      if (booking.status && booking.changed('status')) {
        console.log("condition entred");
        console.log('userSocketMap : ', userSocketMap);
        const socketId = userSocketMap[booking.user_id];
        console.log(socketId);
        if (socketId) {
          const user = await User.findByPk(booking.user_id)
          const email = user.email;
          const transporter = nodemailer.createTransport({
            service: 'gmail', // Use your email service provider
            auth: {
              user: process.env.EMAIL_USER,
              pass: process.env.EMAIL_PASS,
            },
          });
          if (booking.status === 'Confirmed') {
            const notif = {
              user_id: booking.user_id, // The ID of the user (must match an existing user in the 'users' table)
              message: "Your booking has been confirmed.",
              status: "Sent", // Can be either 'Sent' or 'Read'
              type: "Booking", // Can be 'Booking' or 'Feedback'
            };


            const mailOptions = {
              from: process.env.EMAIL_USER,
              to: email,
              subject: 'Your Booking is Confirmed ✅ ',
              text: `booking confirmed`,
            };

            await transporter.sendMail(mailOptions);
            const notification = await Notification.create(notif);
            getIO().to(socketId).emit('notification', notification);
          }
          else if (booking.status === 'Canceled') {
            const notif = {
              user_id: booking.user_id, // The ID of the user (must match an existing user in the 'users' table)
              message: "Your booking has been canceled.",
              status: "Sent", // Can be either 'Sent' or 'Read'
              type: "Booking", // Can be 'Booking' or 'Feedback'
            };
            const mailOptions = {
              from: process.env.EMAIL_USER,
              to: email,
              subject: 'Your Booking is canceled ❌ ',
              text: `booking canceled`,
            };
            await transporter.sendMail(mailOptions);
            const notification = await Notification.create(notif);
            getIO().to(socketId).emit('notification', notification);
          }
        }
      }
    },
  }
});

// Associations (to be set up outside the model definition)
Booking.associate = (models) => {
  Booking.belongsTo(models.User, {
    foreignKey: 'user_id',
    onDelete: 'CASCADE',
  });

  Booking.belongsTo(models.Room, {
    foreignKey: 'room_id',
    onDelete: 'CASCADE',
  });
};
Booking.belongsTo(Room, {
  foreignKey: 'room_id',
  as: 'room', // ✅ Must match the query alias
});

Room.hasMany(Booking, {
  foreignKey: 'room_id',
  as: 'bookings', // You can keep this for the other direction
});



module.exports = Booking;

