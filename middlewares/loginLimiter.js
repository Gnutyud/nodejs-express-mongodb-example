const rateLimit = require('express-rate-limit');
const { logEvents } = require('./logger');

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
  message:
  {
    message: 'Too many accounts created from this IP, please try again after an hour'
  },
  handler: (req, res, next, options) => {
    logEvents(`Too Many Requests: ${options.message.message}\t
    ${req.headers.origin}`, 'errLog log')
    res.status(options.statusCode).send(options.message)
  },
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
})

module.exports = loginLimiter;