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

module.exports = router;
