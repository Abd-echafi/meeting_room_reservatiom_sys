const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const User = require('./user.model');

const Feedback = sequelize.define('Feedback', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  user_id: {
    type: DataTypes.STRING(36),
  },
  email: {
    type: DataTypes.STRING(100),
    allowNull: true,
    validate: {
      is: /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/,
    },
  },
  userName: {
    type: DataTypes.STRING,
    allowNull: true
  },
  message: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  rating: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  seen: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  Anonymous: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  created_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
}, {
  tableName: 'feedbacks',
  timestamps: false
});

Feedback.belongsTo(User, {
  foreignKey: {
    name: 'user_id',
    allowNull: true
  },
  as: "user",
  onDelete: 'SET NULL'
});

module.exports = Feedback;

