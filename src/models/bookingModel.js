const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const Room = require('./roomModel');
const { getIO, userSocketMap } = require('../config/socketIO');
const Notification = require('../models/NotificationModel');
const User = require('../models/user.model');
const nodemailer = require('nodemailer');
const { CancelationTextTemplate, CancelationHtmlTemplate } = require('../utils/bookingCancellation');
const { ConfirmationTextTemplate, ConfirmationHtmlTemplate } = require('../utils/bookingConfirmation');
require('dotenv').config();
const Booking = sequelize.define('Booking', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  user_id: {
    type: DataTypes.STRING(36),
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
      if (booking.status && booking.changed('status')) {
        const socketId = userSocketMap[booking.user_id];
        const user = await User.findByPk(booking.user_id);
        const room = await Room.findByPk(booking.room_id);

        if (!user || !room) return; // safety check

        const email = user.email;
        const formattedDate = new Date(booking.start_time).toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        });

        const transporter = nodemailer.createTransport({
          service: 'gmail',
          auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
          },
        });

        const notif = {
          user_id: booking.user_id,
          status: booking.status === 'Confirmed' ? 'Sent' : 'Read',
          type: 'Booking',
          message: booking.status === 'Confirmed'
            ? "Your booking has been confirmed."
            : "Your booking has been Canceled.",
          bookingId: booking.id,
        };

        const mailOptions = {
          from: process.env.EMAIL_USER,
          to: email,
          subject: booking.status === 'Confirmed'
            ? 'Your Booking is Confirmed ✅ '
            : 'Your Booking is Canceled ❌ ',
          html: '',
          // text: '',
        };
        // Choose templates
        if (booking.status === 'Confirmed') {
          mailOptions.html = ConfirmationHtmlTemplate(user.name, formattedDate, booking.id, room.name);
          mailOptions.text = ConfirmationTextTemplate(user.name, formattedDate, booking.id, room.name);
        } else if (booking.status === 'Canceled') {
          mailOptions.html = CancelationHtmlTemplate(user.name, formattedDate, booking.id, room.name);
          mailOptions.text = CancelationTextTemplate(user.name, formattedDate, booking.id, room.name);
        }
        console.log(mailOptions.html);
        // Send email
        await transporter.sendMail(mailOptions);

        // Create notification
        const notification = await Notification.create(notif);

        // Emit socket notification if connected
        if (socketId) {
          getIO().to(socketId).emit('notification', notification);
        }
      }
    },
  }

});

// Associations (to be set up outside the model definition)
Booking.belongsTo(User, {
  foreignKey: 'user_id',
  onDelete: 'CASCADE',
  as: 'user',
});
Booking.belongsTo(Room, {
  foreignKey: 'room_id',
  as: 'room', // ✅ Must match the query alias
  onDelete: 'CASCADE',
});

Room.hasMany(Booking, {
  foreignKey: 'room_id',
  as: 'bookings', // You can keep this for the other direction
});

User.hasMany(Booking, {
  foreignKey: 'user_id',
  as: 'bookings', // You can keep this for the other direction
});

Notification.belongsTo(Booking, {
  foreignKey: 'bookingId', // or 'booking_id' if you prefer snake_case
  as: 'booking',
});

module.exports = Booking;

