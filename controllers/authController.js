const User = require("../models/User");
const { matchPassword } = require("../helpers/password");
const { createToken, createRefreshToken, verifyJwtToken } = require("../helpers/jwt");
const asyncHandler = require("express-async-handler");

// @desc Login
// @route POST /auth
// @access Public
const login = asyncHandler(async (req, res) => {
  const { username, password } = req.body;
  if (!username) throw new Error("Username is required!");
  if (!password) throw new Error("Password is required!");

  const foundUser = await User.findOne({ username }).exec();

  if (!foundUser) {
    return res.status(401).json({ message: "Incorrect username. Please try again." });
  }

  const matchPwd = await matchPassword(foundUser.password, password);

  if (!matchPwd) {
    return res.status(401).json({ message: "Incorrect password. Please try again!" });
  }

  const accessToken = await createToken(foundUser);
  const refreshToken = await createRefreshToken(foundUser);
  // Create secure cookie with refresh token
  res.cookie("jwtcookie", refreshToken, {
    httpOnly: true, //accessible only by web server
    secure: true, //https
    sameSite: "None", //cross-site cookie
    path: "/auth",
    maxAge: 7 * 24 * 60 * 60 * 1000, //cookie expiry: set to match rT
  });

  let userInfo = {
    username: foundUser.username,
    userId: foundUser._id,
    avatar: foundUser.avatar,
    status: foundUser.status,
    roles: foundUser.roles
  }

  res.json({ accessToken, userInfo });
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

    const foundUser = await User.findOne({ username: refreshTokenDecoded.UserInfo.username }).exec();

    if (!foundUser) return res.status(401).json({ message: "Unauthorized" });

    const accessToken = await createToken(foundUser);

    let userInfo = {
      username: foundUser.username,
      userId: foundUser._id,
      avatar: foundUser.avatar,
      status: foundUser.status,
      roles: foundUser.roles
    }

    res.json({ accessToken, userInfo });
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
  console.log(cookies, cookieName);

  if (cookies && !cookies[cookieName]) return res.sendStatus(204); //No content
  res.clearCookie(cookieName, {
    httpOnly: true, //accessible only by web server
    secure: true, //https
    sameSite: "None", //cross-site cookie
    path: "/auth",
  });
  res.json({ message: "Cookie cleared" });
};

module.exports = {
  login,
  refresh,
  logout,
};
