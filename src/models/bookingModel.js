const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

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
module.exports = Booking;

