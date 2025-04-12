const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../config/db'); // Adjust path as needed

const Image = sequelize.define('Image', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  room_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'rooms', // References the rooms table
      key: 'id',
    },
  },
  image: {
    type: DataTypes.STRING(255), // Store image path or URL
    allowNull: false,
  },
}, {
  tableName: 'images',
  timestamps: false,
  underscored: true,
});

module.exports = Image;