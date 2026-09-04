const Registration = require('../models/Registration');
const { verifyCashfreeWebhookSignature } = require('../utils/cashfree');
const { sendConfirmationEmail } = require('../utils/mailer');
const { syncRegistrationToSheet } = require('../utils/googleSheets');

/**
 * Handles incoming Cashfree Webhooks (e.g. PAYMENT_SUCCESS_WEBHOOK, ORDER_PAID)
 */
const handleCashfreeWebhook = async (req, res) => {
  try {
    const signature = req.headers['x-webhook-signature'];
    const timestamp = req.headers['x-webhook-timestamp'];
    const rawBody = req.rawBody || JSON.stringify(req.body);

    if (signature && timestamp) {
      const isValid = verifyCashfreeWebhookSignature(rawBody, signature, timestamp);
      if (!isValid) {
        console.warn('[Cashfree Webhook] Invalid webhook signature');
        return res.status(400).json({ success: false, message: 'Invalid webhook signature' });
      }
    }

    const payload = req.body || {};
    const eventType = payload.type || payload.event || '';
    console.log(`[Cashfree Webhook] Received Event: ${eventType}`);

    const data = payload.data || {};
    const orderData = data.order || {};
    const paymentData = data.payment || {};

    const orderId = orderData.order_id || payload.order_id;
    const paymentId = String(paymentData.cf_payment_id || paymentData.payment_id || `cf_${Date.now()}`);
    const paymentStatus = paymentData.payment_status || orderData.order_status;

    if (orderId && (paymentStatus === 'SUCCESS' || paymentStatus === 'PAID' || eventType.includes('SUCCESS') || eventType.includes('PAID'))) {
      const registration = await Registration.findOne({
        $or: [
          { 'paymentDetails.cfOrderId': orderId },
          { 'paymentDetails.razorpayOrderId': orderId },
        ],
      });

      if (registration && registration.status !== 'paid') {
        registration.status = 'paid';
        registration.paymentDetails.cfPaymentId = paymentId;
        registration.paymentDetails.paidAt = new Date();
        registration.expiresAt = undefined;
        await registration.save();

        console.log(`[Cashfree Webhook] Marked registration ${registration.teamId} as PAID.`);

        syncRegistrationToSheet(registration).catch((sheetErr) => {
          console.error('[GoogleSheets Webhook Sync] Error:', sheetErr.message);
        });

        if (!registration.emailSent) {
          const emailSent = await sendConfirmationEmail(registration);
          if (emailSent) {
            registration.emailSent = true;
            registration.emailSentAt = new Date();
            await registration.save();
          }
        }
      }
    }

    return res.status(200).json({ status: 'ok' });
  } catch (error) {
    console.error('[Cashfree Webhook] Error:', error);
    return res.status(500).json({ success: false, message: 'Server error handling Cashfree webhook' });
  }
};

module.exports = { handleCashfreeWebhook, handleRazorpayWebhook: handleCashfreeWebhook };
