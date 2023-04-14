const User = require("../models/User");
const asyncHandler = require("express-async-handler");
const { hashPassword } = require("../helpers/password");

// @desc Get all users
// @route Get /users
// @access Private
const getAllUsers = asyncHandler(async (req, res) => {
  const users = await User.find().select("-password").lean();
  if (!users?.length) {
    return res.status(400).json({ message: "No users found!" });
  }
  const usersResponve = await Promise.all(users.map(async (user) => await user.toProfileJSON()));
  return res.status(200).json({ users: usersResponve });
});

// @desc Get profile
// @route Get /users/username
// @access Private
const getProfile = asyncHandler(async (req, res) => {
  const { username } = req.params;

  const user = await User.findOne({ username }).exec();
  if (!user) {
    return res.status(400).json({ message: "No users found!" });
  }
  return res.status(200).json(user.toProfileJSON(user));
});

// @desc Update a user
// @route PATCH /users
// @access Private
const updateUser = asyncHandler(async (req, res) => {
  const { password, email, status, avatar, username } = req.body;

  const userEmail = req.userEmail;
  const user = await User.findOne({ email: userEmail }).exec();

  if (!user) {
    return res.status(400).json({ message: "User not found!" });
  }

  if (username) {
    // check duplicate
    const duplicate = await User.findOne({ username }).lean().exec();
    if (duplicate && duplicate?._id.toString() !== id) {
      return res.status(409).json({ message: "username already exist" });
    }
    user.username = username;
  }
  if (email) {
    // check duplicate
    const duplicateEmail = await User.findOne({ email }).lean().exec();
    if (duplicateEmail) {
      return res.status(409).json({ message: "email already exist" });
    }
    user.email = email;
  }
  if (status) user.status = status;
  if (avatar) user.avatar = avatar;
  if (password) {
    // Hash password
    user.password = await hashPassword(password);
  }

  await user.save();
  res.status(200).json({ user: user.toUserResponse() });
});

// @desc Delete a user
// @route DELETE /users
// @access Private
const deleteUser = asyncHandler(async (req, res) => {
  const userEmail = req.userEmail;

  const user = await User.findOne({ email: userEmail }).exec();

  if (!user) {
    return res.status(400).json({ message: "User not found!" });
  }

  const result = await user.deleteOne();

  res.status(200).json({ message: `Username ${result.username} with ID ${result._id} deleted!` });
});

module.exports = { getAllUsers, getProfile, updateUser, deleteUser };
