const User = require('../models/user.model');
const AppError = require('../utils/AppError');
require('dotenv').config();
//get all users 
const getAllUsers = async (req, res, next) => {
  try {
    const users = await User.findAll();
    res.status(200).json({
      status: "success",
      data: users
    })
  } catch (err) {
    next(err);
  }
}

//get one user by id 
const getOneById = async (req, res, next) => {
  try {
    const {
      id,
      name,
      email,
      phoneNumber,
      image,
      referral_source,
      profession,
      role_name
    } = req.user;
    const userObj = {
      id,
      name,
      email,
      phoneNumber,
      image,
      referral_source,
      profession,
      role_name
    }
    res.status(200).json({
      status: "success",
      data: userObj
    })
  } catch (err) {
    return (new AppError(err.message, 400));
  }
}

const updateUser = async (req, res) => {
  try {
    if (req.image) {
      req.body.image = req.image
    }
    const { name, email, referral_source, image, profession, emailNotification } = req.body;
    const initialObj = { name, email, referral_source, image, profession, emailNotification };
    const finalObj = {};
    for (const key in initialObj) {
      if (initialObj.hasOwnProperty(key)) {
        if (initialObj[key]) {
          finalObj[key] = initialObj[key];
        }
      }
    }
    await User.update(finalObj, { where: { id: req.user.id } });
    const updatedUser = await User.findByPk(req.user.id);
    res.status(200).json({
      status: "success",
      data: { ...updatedUser },

    })
  } catch (err) {
    return (new AppError(err.message, 400));
  }
}

//fucntion to update user password
const updateUserPassword = async (req, res, next) => {
  try {
    // 1/ get current password confirmNewPassword and new password from the body and get the user from the db
    const { newPassword, confirmNewPassword, currentPassword } = req.body;
    const user = await User.findByPk(req.user.id);
    // 2/ check if currentPassword from the body much the password in the db     // 3/ if no throw an error  
    if (! await user.correctPassword(currentPassword)) {
      console.log("wrong current password");
      throw new AppError("you entered a wrong password please enter the correct one", 400);
    }
    // 4/ if yes compare the newPassword with the confirmNewPassword if no throw error if yes continue 

    if (!(newPassword === confirmNewPassword)) {
      throw new AppError("make sure new password and confirm password are the same", 400);
    }
    // 5/ updating the user password in the database
    await user.update(
      {
        resetCodeExpiresAt: null,
        resetCode: null,
        password: newPassword,
      }
    );
    res.status(201).json({
      status: "success",
      message: "password updated successfuly",
    })
  } catch (err) {
    next(err)
  }
}

const deleteUser = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id);
    await user.destroy();
    res.status(204).json({
    })
  } catch (err) {
    return (new AppError(err.message, 400));
  }
}

module.exports = { getOneById, getAllUsers, updateUser, updateUserPassword, deleteUser };