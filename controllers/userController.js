const User = require('../models/User');
const asyncHandler = require('express-async-handler');
const { hashPassword } = require('../helpers/password');

// @desc Get all users
// @route Get /users
// @access Private
const getAllUsers = asyncHandler(async (req, res) => {
  const users = await User.find().select('-password').lean();
  if (!users?.length) {
    return res.status(400).json({ message: "No users found!" })
  }
  return res.status(200).json(users);
})

// @desc Create new user
// @route POST /users
// @access Private
const createNewUser = asyncHandler(async (req, res) => {
  const { username, password, roles, email } = req.body;
  //  check input data
  if (!username || !password || !email) {
    return res.status(400).json({ message: 'All Fields are required!' });
  }
  // check duplicate
  const duplicate = await User.findOne({ username }).lean().exec();
  if (duplicate) {
    return res.status(409).json({ message: "username already exist" });
  }
  const duplicateEmail = await User.findOne({ email }).lean().exec();
  if (duplicateEmail) {
    return res.status(409).json({ message: "email already exist" });
  }
  // hash password
  const hashPwd = await hashPassword(password);

  let userObject = { username, "password": hashPwd, email };
  if (roles) userObject = { ...userObject, roles }
  // Create and store new user
  const user = await User.create(userObject);
  if (user) {
    res.status(200).json({ message: `New user ${username} created` })
  } else {
    res.status(400).json({ message: 'Invalid user data received' })
  }
})

// @desc Update a user
// @route PATCH /users
// @access Private
const updateUser = asyncHandler(async (req, res) => {
  const { username, password, roles, id, active } = req.body;
  // confirm data
  if (!username || !id || !Array.isArray(roles) || !roles.length || typeof active !== "boolean") {
    return res.status(400).json({ message: 'All fields are required!' })
  }

  const user = await User.findById(id).exec();

  if (!user) {
    return res.status(400).json({ message: 'User not found!' })
  }

  // check duplicate
  const duplicate = await User.findOne({ username }).lean().exec();
  if (duplicate && duplicate?._id.toString() !== id) {
    return res.status(409).json({ message: "username already exist" });
  }

  user.username = username;
  user.roles = roles;
  user.active = active;

  if (password) {
    // Hash password
    user.password = await hashPassword(password);
  }

  const updateUser = await user.save();
  res.status(200).json({ message: 'updated user' });
})

// @desc Delete a user
// @route DELETE /users
// @access Private
const deleteUser = asyncHandler(async (req, res) => {
  const { id } = req.body;

  if (!id) {
    return res.status(400).json({ message: 'User ID is required!' })
  }

  const user = await User.findById(id).exec();

  if (!user) {
    return res.status(400).json({ message: 'User not found' })
  }

  const result = await user.deleteOne();

  res.status(200).json({ message: `Username ${result.username} with ID ${result._id} deleted!` })
})

module.exports = { getAllUsers, createNewUser, updateUser, deleteUser };