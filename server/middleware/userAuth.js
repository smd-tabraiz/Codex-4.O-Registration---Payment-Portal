const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
  let token;

  // 1. Read JWT from httpOnly cookie first
  if (req.cookies && req.cookies.token) {
    token = req.cookies.token;
  } 
  // 2. Read JWT from Authorization header fallback
  else if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Not authorized: Missing session token.',
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'codex4_jwt_secret_key_2026');

    // Attach req.user (excluding password)
    const user = await User.findById(decoded.id).select('-password');
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized: User no longer exists.',
      });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error('[Auth Middleware Error]', error.message);
    return res.status(401).json({
      success: false,
      message: 'Not authorized: Invalid or expired token.',
    });
  }
};

module.exports = { protect };
