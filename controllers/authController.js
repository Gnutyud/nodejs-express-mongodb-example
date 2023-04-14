const User = require("../models/User");
const { matchPassword, hashPassword } = require("../helpers/password");
const { createRefreshToken, verifyJwtToken } = require("../helpers/jwt");
const asyncHandler = require("express-async-handler");

// @desc Signup
// @route POST auth/signup
// @access Private
const signup = asyncHandler(async (req, res) => {
  const { username, password, roles, email } = req.body;
  //  check input data
  if (!username || !password || !email) {
    return res.status(400).json({ message: "All Fields are required!" });
  }
  // check duplicate
  const duplicate = await User.findOne({ username }).lean().exec();
  if (duplicate) {
    return res.status(409).json({ fieldError: "username", message: "username already exist" });
  }
  const duplicateEmail = await User.findOne({ email }).lean().exec();
  if (duplicateEmail) {
    return res.status(409).json({ fieldError: "email", message: "email already exist" });
  }
  // hash password
  const hashPwd = await hashPassword(password);

  let userObject = { username, password: hashPwd, email };
  if (roles) userObject = { ...userObject, roles };
  // Create and store new user
  const user = await User.create(userObject);
  if (user) {
    res.status(200).json({ user: user.toUserResponse() });
  } else {
    res.status(400).json({ message: "Invalid user data received" });
  }
});

// @desc Login
// @route POST /auth
// @access Public
const login = asyncHandler(async (req, res) => {
  const { username, password } = req.body;
  if (!username) throw new Error("Username is required!");
  if (!password) throw new Error("Password is required!");

  const foundUser = await User.findOne({ username }).exec();

  if (!foundUser) {
    return res.status(401).json({ fieldError: "username", message: "Incorrect username. Please try again." });
  }

  const matchPwd = await matchPassword(foundUser.password, password);

  if (!matchPwd) {
    return res.status(401).json({ fieldError: "password", message: "Incorrect password. Please try again!" });
  }

  const refreshToken = await createRefreshToken(foundUser);
  // Create secure cookie with refresh token
  let cookieName = process.env.REFRESH_TOKEN_COOKIE_NAME;
  res.cookie(cookieName, refreshToken, {
    httpOnly: true, //accessible only by web server
    secure: true, //https
    sameSite: "None", //cross-site cookie
    path: "/api/v1/auth",
    maxAge: 7 * 24 * 60 * 60 * 1000, //cookie expiry: set to match rT
  });

  res.status(200).json({ user: foundUser.toUserResponse() });
});

// @desc Refresh
// @route GET /auth/refresh
// @access Public - because access token has expired
const refresh = async (req, res) => {
  const cookies = req.cookies;
  let cookieName = process.env.REFRESH_TOKEN_COOKIE_NAME;

  if (cookies && !cookies[cookieName]) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const refreshToken = cookies[cookieName];
  try {
    const refreshTokenDecoded = await verifyJwtToken(refreshToken, process.env.JWT_SECRET_REFRESH_TOKEN);

    if (!refreshTokenDecoded) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const foundUser = await User.findOne({ username: refreshTokenDecoded.user.username }).exec();

    if (!foundUser) return res.status(401).json({ message: "Unauthorized" });

    res.status(200).json({ user: foundUser.toUserResponse() });
  } catch (error) {
    return res.status(403).json({
      errors: { body: ["Forbidden", error.message] },
    });
  }
};

// @desc Logout
// @route POST /auth/logout
// @access Public - just to clear cookie if exists
const logout = (req, res) => {
  const cookies = req.cookies;
  let cookieName = process.env.REFRESH_TOKEN_COOKIE_NAME;

  if (cookies && !cookies[cookieName]) return res.sendStatus(204); //No content
  res.clearCookie(cookieName, {
    httpOnly: true, //accessible only by web server
    secure: true, //https
    sameSite: "None", //cross-site cookie
    path: "/api/v1/auth",
  });
  res.json({ message: "Cookie cleared" });
};

module.exports = {
  login,
  signup,
  refresh,
  logout,
};
