const express = require('express');
const router = express.Router();
const {
  checkRollNumbers,
  createOrder,
  verifyPayment,
  getPendingRegistration,
  retryPendingOrder,
  cancelPendingRegistration,
  getSystemSettings,
} = require('../controllers/registerController');
const { checkRollLimiter, createOrderLimiter } = require('../middleware/rateLimiter');

router.post('/check-roll', checkRollLimiter, checkRollNumbers);
router.post('/create-order', createOrderLimiter, createOrder);
router.post('/verify-payment', verifyPayment);
router.get('/pending', getPendingRegistration);
router.post('/retry-order', retryPendingOrder);
router.post('/cancel-pending', cancelPendingRegistration);
router.get('/system-settings', getSystemSettings);

module.exports = router;
