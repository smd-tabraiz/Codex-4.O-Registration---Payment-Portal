const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/userAuth');

/**
 * GET /api/user/me
 * Protected by userAuth middleware. Verifies JWT session from cookie/header and returns current user data.
 */
router.get('/me', protect, (req, res) => {
  res.json({
    success: true,
    user: {
      id: req.user._id,
      name: req.user.name,
      email: req.user.email,
      googleId: req.user.googleId,
      picture: req.user.picture,
      rollNo: req.user.rollNo,
      year: req.user.year,
      branch: req.user.branch,
      college: req.user.college,
      mobile: req.user.mobile,
      createdAt: req.user.createdAt,
    },
  });
});

/**
 * GET /api/user/my-registration
 */
router.get('/my-registration', protect, async (req, res) => {
  try {
    const Registration = require('../models/Registration');
    const userEmail = req.user.email ? req.user.email.toLowerCase() : '';
    const userRollNo = req.user.rollNo ? req.user.rollNo.toUpperCase() : '';

    const queryConditions = [];
    if (userEmail) queryConditions.push({ 'members.email': userEmail });
    if (userRollNo) queryConditions.push({ 'members.rollNo': userRollNo });

    if (queryConditions.length === 0) {
      return res.json({ success: true, registered: false, registration: null });
    }

    const registration = await Registration.findOne({
      status: 'paid',
      $or: queryConditions,
    }).sort({ createdAt: -1 });

    if (registration) {
      return res.json({
        success: true,
        registered: true,
        registration,
      });
    }

    return res.json({
      success: true,
      registered: false,
      registration: null,
    });
  } catch (err) {
    console.error('[my-registration] Error:', err);
    return res.status(500).json({ success: false, message: 'Server error checking registration.' });
  }
});

/**
 * POST /api/user/logout
 */
router.post('/logout', (req, res) => {
  res.cookie('token', '', {
    httpOnly: true,
    expires: new Date(0),
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
  });
  return res.json({ success: true, message: 'Logged out successfully.' });
});

module.exports = router;
