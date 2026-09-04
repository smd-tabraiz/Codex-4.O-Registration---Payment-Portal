const express = require('express');
const router = express.Router();
const { handleCashfreeWebhook } = require('../controllers/webhookController');

// Cashfree Webhook endpoint
router.post('/cashfree', handleCashfreeWebhook);

// Backward compatibility alias for legacy webhook endpoints
router.post('/razorpay', handleCashfreeWebhook);

module.exports = router;
