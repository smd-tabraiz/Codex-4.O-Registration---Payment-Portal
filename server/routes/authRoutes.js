const express = require('express');
const router = express.Router();
const { registerUser, loginUser, googleAuth, getMe, logoutUser } = require('../controllers/authController');

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/google', googleAuth);
router.post('/logout', logoutUser);
router.get('/me', getMe);

module.exports = router;
