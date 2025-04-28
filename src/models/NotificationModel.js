const { DataTypes } = require('sequelize');
const sequelize = require('../config/db'); // Adjust this to your actual sequelize instance

const Notification = sequelize.define('Notification', {
  notification_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  user_id: {
    type: DataTypes.STRING,
    allowNull: false,
    references: {
      model: 'users', // The table name of the referenced model
      key: 'id', // The column to reference
    },
    onDelete: 'CASCADE',
  },
  bookingId: {
    type: DataTypes.INTEGER, // or UUID if your Booking model uses UUIDs
    references: {
      model: 'bookings',
      key: 'id',
    },
    allowNull: false,
  },
  message: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  status: {
    type: DataTypes.ENUM('Sent', 'Read'),
    allowNull: false,
    defaultValue: 'Sent',
  },
  type: {
    type: DataTypes.ENUM('Booking', 'Feedback'),
    allowNull: false,
  },
  created_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
}, {
  tableName: 'NOTIFICATIONS', // Table name
  timestamps: true, // Sequelize will not automatically add createdAt/updatedAt fields
});

// Notification.belongsTo(Booking, {
//   foreignKey: 'bookingId', // or 'booking_id' if you prefer snake_case
//   as: 'booking',
// });

module.exports = Notification;
