const express = require('express');
const router = express.Router();
const { registerUser, loginUser, googleAuth, getMe } = require('../controllers/authController');

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/google', googleAuth);
router.get('/me', getMe);

module.exports = router;
