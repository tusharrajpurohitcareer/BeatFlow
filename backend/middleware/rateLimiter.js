const rateLimit = require("express-rate-limit");

exports.authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: {
    success: false,
    message: "Too many authentication attempts. Please try again later."
  },
  standardHeaders: true,
  legacyHeaders: false
});

exports.apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: {
    success: false,
    message: "Too many requests. Please slow down."
  }
});

exports.searchLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 50,
  message: {
    success: false,
    message: "Too many search requests. Please wait."
  }
});
