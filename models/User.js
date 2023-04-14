const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");
const jwt = require("jsonwebtoken");

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: true,
  },
  roles: {
    type: String,
    default: "user",
  },
  status: {
    type: String,
    default: "",
  },
  email: {
    type: String,
    required: true,
    lowercase: true,
    unique: true,
    match: [/\S+@\S+\.\S+/, "is invalid"],
    index: true,
  },
  avatar: {
    type: String,
    default: "",
  },
});

UserSchema.plugin(uniqueValidator);

// @desc generate access token for a user
// @required valid username and password
UserSchema.methods.generateAccessToken = function () {
  const accessToken = jwt.sign(
    {
      "user": {
        "id": this._id,
        "username": this.username,
        "email": this.email
      },
    },
    process.env.JWT_SECRET_TOKEN,
    { expiresIn: "20m" }
  );
  return accessToken;
};

UserSchema.methods.toUserResponse = function () {
  return {
    id: this._id,
    username: this.username,
    email: this.email,
    status: this.status,
    avatar: this.avatar,
    accessToken: this.generateAccessToken(),
  };
};

UserSchema.methods.toProfileJSON = function () {
  return {
    id: this._id,
    username: this.username,
    status: this.status,
    avatar: this.avatar,
    roles: this.roles,
  };
};

const User = mongoose.model("User", UserSchema);

module.exports = User;
