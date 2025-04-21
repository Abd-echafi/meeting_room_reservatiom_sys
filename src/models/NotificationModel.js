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
  message: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  status: {
    type: DataTypes.ENUM('Sent', 'Read'),
    allowNull: false,
  },
  type: {
    type: DataTypes.ENUM('Booking', 'Feedback'),
    allowNull: false,
  },
  // created_at: {
  //   type: DataTypes.TIMESTAMP,
  //   defaultValue: DataTypes.NOW,
  // },
}, {
  tableName: 'NOTIFICATIONS', // Table name
  timestamps: false, // Sequelize will not automatically add createdAt/updatedAt fields
});

module.exports = Notification;
