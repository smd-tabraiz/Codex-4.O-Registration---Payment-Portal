const Registration = require('../models/Registration');
const { verifyWebhookSignature } = require('../utils/razorpay');
const { sendConfirmationEmail } = require('../utils/mailer');

const handleRazorpayWebhook = async (req, res) => {
  try {
    const signature = req.headers['x-razorpay-signature'];
    if (!signature) {
      return res.status(400).json({ success: false, message: 'Missing Razorpay webhook signature header.' });
    }

    // req.rawBody must be enabled or buffer parsed
    const rawBody = req.rawBody || JSON.stringify(req.body);
    const isValid = verifyWebhookSignature(rawBody, signature);

    if (!isValid) {
      console.warn('[Webhook] Invalid Razorpay webhook signature');
      return res.status(400).json({ success: false, message: 'Invalid webhook signature' });
    }

    const eventPayload = req.body;
    console.log(`[Webhook] Received Razorpay Event: ${eventPayload.event}`);

    if (eventPayload.event === 'payment.captured' || eventPayload.event === 'order.paid') {
      const paymentEntity = eventPayload.payload.payment.entity;
      const orderId = paymentEntity.order_id;
      const paymentId = paymentEntity.id;

      const registration = await Registration.findOne({ 'paymentDetails.razorpayOrderId': orderId });

      if (registration && registration.status !== 'paid') {
        registration.status = 'paid';
        registration.paymentDetails.razorpayPaymentId = paymentId;
        registration.paymentDetails.paidAt = new Date();
        registration.expiresAt = undefined;
        await registration.save();

        console.log(`[Webhook] Marked registration ${registration.teamId} as PAID via Webhook.`);

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
    console.error('[Webhook] Error handling Razorpay webhook:', error);
    return res.status(500).json({ success: false, message: 'Server error handling webhook' });
  }
};

module.exports = { handleRazorpayWebhook };
