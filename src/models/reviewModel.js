const { DataTypes, ENUM, INTEGER } = require('sequelize');
const sequelize = require('../config/db');
const Room = require('./roomModel');
const User = require('./user.model');


const Review = sequelize.define('Review', {
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
  comment: {
    type: DataTypes.STRING(250),
    allowNull: true,
  },
  rating: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  created_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
}, {
  tableName: 'REVIEW',
  timestamps: false,
  underscored: true,
  hooks: {
    afterCreate: async (review, options) => {
      await recalculateRoomRating(review.room_id);
    },

    afterUpdate: async (review, options) => {
      if (review.changed('rating') || review.changed('room_id')) {
        await recalculateRoomRating(review.room_id);
      }
    },

    afterDestroy: async (review, options) => {
      await recalculateRoomRating(review.room_id);
    }
  }
});

// Define associations
Room.hasMany(Review, {
  foreignKey: 'room_id',
});

User.hasMany(Review, {
  foreignKey: 'user_id',
});

Review.belongsTo(User, {
  foreignKey: 'user_id',
  onDelete: 'CASCADE',
  as: 'user',
});

Review.belongsTo(Room, {
  foreignKey: 'room_id',
  onDelete: 'CASCADE',
  as: 'room',
});


async function recalculateRoomRating(roomId) {
  const reviews = await Review.findAll({
    where: { room_id: roomId },
    attributes: ['rating'],
  });

  let totalRatings = 0;
  reviews.forEach(r => {
    totalRatings += r.rating;
  });

  const RoomRating = reviews.length > 0 ? totalRatings / reviews.length : 0;

  const room = await Room.findByPk(roomId);
  if (room) {
    await room.update({ rating: RoomRating });
  }
}

module.exports = Review;
