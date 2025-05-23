const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const crypto = require("crypto");
const bcrypt = require("bcryptjs");
const { v4: uuidv4 } = require('uuid');
const User = sequelize.define('User', {
  id: {
    type: DataTypes.STRING(36),
    primaryKey: true,
    allowNull: false,
    defaultValue: uuidv4,
  },
  name: {
    type: DataTypes.STRING(50),
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING(100),
    allowNull: false,
    unique: true,
    validate: {
      is: /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/,
    },
  },
  phoneNumber: {
    type: DataTypes.STRING(100),
    allowNull: true,
  },
  password: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  created_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
  image: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  emailNotification: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
    //true for ON / false for OFF
  },
  resetCode: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  resetCodeExpiresAt: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  updated_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
  role_name: {
    type: DataTypes.ENUM('Client', 'Admin', 'Booking Manager', 'Room Manager'),
    defaultValue: 'Client',
  },
  referral_source: {
    type: DataTypes.STRING(255),
  },
  profession: {
    type: DataTypes.STRING(255),
  },
  passwordChangedAt: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  googleId: {
    type: DataTypes.STRING,
    allowNull: true
  }
}, {
  tableName: 'users',
  timestamps: false, // we manually manage created_at and updated_at
  hooks: {
    beforeCreate: async (user, options) => {
      // Only hash the password if it's modified or new
      if (user.password && user.changed('password')) {
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(user.password, salt);
      }
    },
    beforeUpdate: async (user, options) => {
      console.log("hook entered");
      if (user.password && user.changed('password')) {
        console.log("password changed");
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(user.password, salt);
        user.passwordChangedAt = new Date();
      }
    },
  }
}

);

User.prototype.correctPassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

User.prototype.changedPasswordAfter = function (JWTTimestamp) {
  if (this.passwordChangedAt) {
    const changedTimestamp = parseInt(this.passwordChangedAt.getTime() / 1000, 10);
    return JWTTimestamp < changedTimestamp;
  }

  // Password not changed after token issued
  return false;
};

module.exports = User;
