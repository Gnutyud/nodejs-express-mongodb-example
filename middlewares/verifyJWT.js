const jwt = require("jsonwebtoken");

const verifyJWT = (req, res, next) => {
  const authHeader = req.headers.authorization || req.headers.Authorization;

  if (!authHeader?.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const token = authHeader.split(" ")[1];

  jwt.verify(token, process.env.JWT_SECRET_TOKEN, (err, decoded) => {
    if (err) {
      return res.status(403).json({ message: "Forbidden" });
    }
    req.userId = decoded.user.id;
    req.userEmail = decoded.user.email;
    req.userName = decoded.user.username;
    next();
  });
};

const verifyJWTOptional = (req, res, next) => {
  const authHeader = req.headers.authorization || req.headers.Authorization;

  if (!authHeader || !authHeader?.startsWith("Bearer ") || !authHeader.split(" ")[1].length) {
    req.loggedin = false;
    return next();
  }

  const token = authHeader.split(" ")[1];

  jwt.verify(token, process.env.JWT_SECRET_TOKEN, (err, decoded) => {
    if (err) {
      return res.status(403).json({ message: "Forbidden" });
    }
    req.loggedin = true;
    req.userId = decoded.user.id;
    req.userEmail = decoded.user.email;
    req.userName = decoded.user.username;
    next();
  });
};

module.exports = { verifyJWT, verifyJWTOptional };
