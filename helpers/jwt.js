const jwt = require('jsonwebtoken');

const createToken = async (user) => {
  return new Promise((resolve, reject) => {
    jwt.sign({
      "UserInfo": {
        "username": user.username,
        "roles": user.roles
      }
    },
      process.env.JWT_SECRET_TOKEN,
      { expiresIn: "20m" }, (err, token) => {
        if (err) return reject(err);
        return resolve(token)
      })
  })
}

const createRefreshToken = async (user) => {
  return new Promise((resolve, reject) => {
    jwt.sign({
      "UserInfo": {
        "username": user.username,
        "roles": user.roles
      }
    },
      process.env.JWT_SECRET_REFRESH_TOKEN,
      { expiresIn: "7d" }, (err, token) => {
        if (err) return reject(err);
        return resolve(token)
      })
  })
}

const verifyJwtToken = async (token, secretKey) => {
  return new Promise((resolve, reject) => {
    jwt.verify(token, secretKey, (err, decoded) => {
      if (err) {
        return reject(err);
      }
      return resolve(decoded);
    });
  });
};

module.exports = { createToken, createRefreshToken, verifyJwtToken }