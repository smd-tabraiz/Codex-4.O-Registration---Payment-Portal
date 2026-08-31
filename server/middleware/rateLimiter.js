const rateLimit = require('express-rate-limit');

// Rate limiter for roll number checking (e.g. max 300 checks per 15 minutes per IP)
const checkRollLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 300,
  message: {
    success: false,
    message: 'Too many roll number check requests. Please try again later.',
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Rate limiter for order creation (e.g. max 100 orders per 15 minutes per IP)
const createOrderLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: {
    success: false,
    message: 'Too many registration order attempts. Please wait a few minutes before trying again.',
  },
  standardHeaders: true,
  legacyHeaders: false,
});

module.exports = { checkRollLimiter, createOrderLimiter };
