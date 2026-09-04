const crypto = require('crypto');

const getCashfreeAppId = () => process.env.CASHFREE_APP_ID || '';
const getCashfreeSecretKey = () => process.env.CASHFREE_SECRET_KEY || '';
const getCashfreeEnv = () => (process.env.CASHFREE_ENV || 'SANDBOX').toUpperCase();
const getCashfreeApiVersion = () => process.env.CASHFREE_API_VERSION || '2023-08-01';

const getBaseUrl = () => {
  const env = getCashfreeEnv();
  return env === 'PRODUCTION'
    ? 'https://api.cashfree.com/pg'
    : 'https://sandbox.cashfree.com/pg';
};

/**
 * Checks if Cashfree is in Mock / Development Mode (when credentials are missing or default)
 */
const isMockMode = () => {
  const appId = getCashfreeAppId();
  const secret = getCashfreeSecretKey();
  return (
    !appId ||
    appId.includes('your_cashfree_app_id') ||
    !secret ||
    secret.includes('your_cashfree_secret_key')
  );
};

/**
 * Creates a Cashfree Order
 * @param {number} amountInINR Amount in Indian Rupees (e.g. 300)
 * @param {string} teamId Unique Team ID (e.g. CDX4-0001)
 * @param {object} customerDetails { name, email, phone, returnUrl }
 */
const createCashfreeOrder = async (amountInINR, teamId, customerDetails = {}) => {
  const sanitizedTeamId = String(teamId).replace(/[^a-zA-Z0-9_-]/g, '_');
  const orderId = `order_${sanitizedTeamId}_${Date.now()}`;
  const customerId = `cust_${sanitizedTeamId}`;

  // If credentials are not configured, return test/mock order
  if (isMockMode()) {
    console.log(`[Cashfree Mock] Generating test session for Team ${teamId}`);
    return {
      order_id: orderId,
      payment_session_id: `session_mock_${Date.now()}_${Math.floor(Math.random() * 10000)}`,
      order_status: 'ACTIVE',
      order_amount: Number(amountInINR),
      order_currency: 'INR',
      isMock: true,
    };
  }

  const cleanPhone =
    String(customerDetails.phone || '9999999999')
      .replace(/\D/g, '')
      .slice(-10) || '9999999999';
  const cleanEmail = String(customerDetails.email || 'participant@example.com').trim().toLowerCase();
  const cleanName = String(customerDetails.name || 'Participant').trim().slice(0, 50);

  const orderMeta = {
    return_url:
      customerDetails.returnUrl ||
      `${process.env.CLIENT_URL || 'https://codex-4-o-registration-portal.onrender.com'}/register?order_id={order_id}`,
  };

  if (process.env.SERVER_URL && process.env.SERVER_URL.startsWith('http')) {
    orderMeta.notify_url = `${process.env.SERVER_URL.replace(/\/+$/, '')}/api/webhook/cashfree`;
  }

  const payload = {
    order_id: orderId,
    order_amount: Number(amountInINR),
    order_currency: 'INR',
    customer_details: {
      customer_id: customerId,
      customer_name: cleanName,
      customer_email: cleanEmail,
      customer_phone: cleanPhone,
    },
    order_meta: orderMeta,
    order_note: `Registration Fee for Codex 4.0 Team ${teamId}`,
  };

  try {
    const response = await fetch(`${getBaseUrl()}/orders`, {
      method: 'POST',
      headers: {
        'x-client-id': getCashfreeAppId(),
        'x-client-secret': getCashfreeSecretKey(),
        'x-api-version': getCashfreeApiVersion(),
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    const data = await response.json();

    if (!response.ok) {
      console.warn('[Cashfree API Error]', data);
      if (response.status === 401 || data.code === 'authentication_failed' || (data.message && data.message.toLowerCase().includes('authentication'))) {
        const currentEnv = getCashfreeEnv();
        const secretKey = getCashfreeSecretKey();
        let hint = '';
        if (currentEnv === 'SANDBOX' && secretKey.includes('_prod_')) {
          hint = ' (Detected Production Secret Key with CASHFREE_ENV=SANDBOX. Change CASHFREE_ENV=PRODUCTION in server/.env and VITE_CASHFREE_MODE=production in client/.env)';
        } else if (currentEnv === 'PRODUCTION' && secretKey.includes('_test_')) {
          hint = ' (Detected Test/Sandbox Secret Key with CASHFREE_ENV=PRODUCTION. Change CASHFREE_ENV=SANDBOX in server/.env and VITE_CASHFREE_MODE=sandbox in client/.env)';
        } else {
          hint = ' (Please check that your CASHFREE_APP_ID and CASHFREE_SECRET_KEY match your CASHFREE_ENV sandbox/production)';
        }
        throw new Error(`Cashfree Authentication Failed: ${data.message || 'Invalid API Credentials'}.${hint}`);
      }
      throw new Error(data.message || 'Failed to create Cashfree order');
    }

    return {
      order_id: data.order_id,
      payment_session_id: data.payment_session_id,
      order_status: data.order_status,
      order_amount: data.order_amount,
      order_currency: data.order_currency,
      isMock: false,
    };
  } catch (error) {
    console.error('[Cashfree] Order creation error:', error.message);
    if (isMockMode()) {
      return {
        order_id: orderId,
        payment_session_id: `session_mock_${Date.now()}`,
        order_status: 'ACTIVE',
        order_amount: Number(amountInINR),
        order_currency: 'INR',
        isMock: true,
      };
    }
    throw error;
  }
};

/**
 * Verifies Order Status from Cashfree API
 * @param {string} orderId Cashfree Order ID
 */
const verifyCashfreeOrder = async (orderId) => {
  if (!orderId) {
    return { success: false, message: 'Order ID is required.' };
  }

  if (orderId.startsWith('order_mock_') || isMockMode()) {
    console.log(`[Cashfree Mock Verification] Order ${orderId} verified successfully in mock mode.`);
    return {
      success: true,
      order_status: 'PAID',
      cf_payment_id: `cf_mock_pay_${Date.now()}`,
      order_amount: 300,
      isMock: true,
    };
  }

  try {
    const response = await fetch(`${getBaseUrl()}/orders/${orderId}`, {
      method: 'GET',
      headers: {
        'x-client-id': getCashfreeAppId(),
        'x-client-secret': getCashfreeSecretKey(),
        'x-api-version': getCashfreeApiVersion(),
        'Content-Type': 'application/json',
      },
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('[Cashfree Verify Order Error]', data);
      return {
        success: false,
        message: data.message || 'Failed to fetch order status from Cashfree',
      };
    }

    const isPaid = data.order_status === 'PAID';

    // Attempt to fetch specific payment transaction ID if available
    let cfPaymentId = `cf_order_${orderId}`;
    try {
      const paymentsRes = await fetch(`${getBaseUrl()}/orders/${orderId}/payments`, {
        method: 'GET',
        headers: {
          'x-client-id': getCashfreeAppId(),
          'x-client-secret': getCashfreeSecretKey(),
          'x-api-version': getCashfreeApiVersion(),
          'Content-Type': 'application/json',
        },
      });
      if (paymentsRes.ok) {
        const paymentsList = await paymentsRes.json();
        if (Array.isArray(paymentsList) && paymentsList.length > 0) {
          const successfulPayment = paymentsList.find((p) => p.payment_status === 'SUCCESS') || paymentsList[0];
          cfPaymentId = String(successfulPayment.cf_payment_id || successfulPayment.payment_id || cfPaymentId);
        }
      }
    } catch (payErr) {
      console.warn('[Cashfree] Could not fetch payment list:', payErr.message);
    }

    return {
      success: isPaid,
      order_status: data.order_status,
      cf_payment_id: cfPaymentId,
      order_amount: data.order_amount,
      rawOrder: data,
    };
  } catch (error) {
    console.error('[Cashfree] Verification error:', error.message);
    return { success: false, message: error.message };
  }
};

/**
 * Verifies Cashfree Webhook Signature
 * @param {string} rawBody Raw string payload
 * @param {string} signature Header x-webhook-signature
 * @param {string} timestamp Header x-webhook-timestamp
 */
const verifyCashfreeWebhookSignature = (rawBody, signature, timestamp) => {
  if (isMockMode()) return true;

  const secret = getCashfreeSecretKey();
  if (!secret || !signature || !timestamp) return false;

  const signedPayload = `${timestamp}${rawBody}`;
  const expectedSignature = crypto
    .createHmac('sha256', secret)
    .update(signedPayload)
    .digest('base64');

  return expectedSignature === signature;
};

module.exports = {
  createCashfreeOrder,
  verifyCashfreeOrder,
  verifyCashfreeWebhookSignature,
  getCashfreeAppId,
  getCashfreeEnv,
  isMockMode,
};
