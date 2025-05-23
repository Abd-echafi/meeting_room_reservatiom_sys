const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const Image = require('./imageModel');

const Room = sequelize.define('Room', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING(20),
    allowNull: false,
  },
  capacity: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  amenities: {
    type: DataTypes.STRING(150),
    allowNull: true,
  },
  type: {
    type: DataTypes.STRING(50),
    allowNull: true,
  },
  note: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  status: {
    type: DataTypes.ENUM('Available', 'Maintenance'),
    defaultValue: 'Available',
  },
  rating: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  pricing: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  created_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
}, {
  tableName: 'rooms',
  timestamps: false,
  underscored: true,
});

Room.hasMany(Image, {
  foreignKey: 'room_id',
  as: 'images', // Alias for easier querying
});

Image.belongsTo(Room, {
  foreignKey: 'room_id',
});


module.exports = Room;