const Registration = require('../models/Registration');
const User = require('../models/User');
const SystemSetting = require('../models/SystemSetting');
const { getNextSequenceValue } = require('../models/Counter');
const { createCashfreeOrder, verifyCashfreeOrder, getCashfreeAppId, getCashfreeEnv, isMockMode } = require('../utils/cashfree');
const { sendConfirmationEmail } = require('../utils/mailer');
const { syncRegistrationToSheet } = require('../utils/googleSheets');

/**
 * Helper to fetch the dynamic registration fee configured by Admin (Default: 300)
 */
const getRegistrationFee = async () => {
  try {
    const feeSetting = await SystemSetting.findOne({ key: 'registrationFee' });
    if (feeSetting && feeSetting.value !== undefined && feeSetting.value !== null) {
      const parsed = parseInt(feeSetting.value, 10);
      if (!isNaN(parsed) && parsed >= 0) return parsed;
    }
  } catch (err) {
    console.error('[getRegistrationFee] Error reading fee:', err);
  }
  return parseInt(process.env.EVENT_FEE_PER_TEAM || '300', 10);
};

/**
 * Helper to fetch the registration capacity cap (Default: 200)
 */
const getRegistrationCap = async () => {
  try {
    const capSetting = await SystemSetting.findOne({ key: 'registrationCap' });
    if (capSetting && capSetting.value !== undefined && capSetting.value !== null) {
      const parsed = parseInt(capSetting.value, 10);
      if (!isNaN(parsed) && parsed > 0) return parsed;
    }
  } catch (err) {
    console.error('[getRegistrationCap] Error reading cap:', err);
  }
  return parseInt(process.env.REGISTRATION_CAP || '200', 10);
};

/**
 * Clean up expired pending registrations helper
 */
const cleanupExpiredPending = async () => {
  try {
    const now = new Date();
    await Registration.deleteMany({ status: 'pending', expiresAt: { $lt: now } });
  } catch (err) {
    console.error('[Cleanup] Error removing expired pending registrations:', err);
  }
};

/**
 * POST /api/register/check-roll
 * Check if roll numbers are already registered in paid or active pending teams
 */
const checkRollNumbers = async (req, res) => {
  try {
    await cleanupExpiredPending();

    const { rollNumbers } = req.body;
    if (!rollNumbers || !Array.isArray(rollNumbers) || rollNumbers.length === 0) {
      return res.status(400).json({ success: false, message: 'Invalid or empty roll numbers array.' });
    }

    const cleanRolls = rollNumbers.map((r) => String(r).trim().toUpperCase()).filter(Boolean);

    // Find any paid or active non-expired pending registrations containing these roll numbers
    const now = new Date();
    const existing = await Registration.find({
      $or: [
        { status: 'paid' },
        { status: 'pending', expiresAt: { $gt: now } },
      ],
      'members.rollNo': { $in: cleanRolls },
    });

    const registeredRolls = [];
    existing.forEach((reg) => {
      reg.members.forEach((m) => {
        if (cleanRolls.includes(m.rollNo) && !registeredRolls.includes(m.rollNo)) {
          registeredRolls.push(m.rollNo);
        }
      });
    });

    return res.json({
      success: true,
      available: registeredRolls.length === 0,
      occupiedRolls: registeredRolls,
    });
  } catch (error) {
    console.error('[checkRollNumbers] Error:', error);
    return res.status(500).json({ success: false, message: 'Server error checking roll numbers.' });
  }
};

/**
 * POST /api/register/create-order
 * Validates team details, enforces 4th year rule & uniqueness, creates Cashfree Order & MongoDB record
 */
const createOrder = async (req, res) => {
  try {
    await cleanupExpiredPending();

    const { teamName, members } = req.body;

    // 1. Basic Payload Validation
    if (!teamName || !teamName.trim()) {
      return res.status(400).json({ success: false, message: 'Team Name is required.' });
    }

    if (!members || !Array.isArray(members) || members.length < 2 || members.length > 3) {
      return res.status(400).json({
        success: false,
        message: 'Team size constraint violation: Team must consist of 2 to 3 members.',
      });
    }

    // 2. Strict 4th Year Student Constraint (Max 1 allowed)
    const fourthYearMembers = members.filter((m) => String(m.year).trim() === '4th');
    if (fourthYearMembers.length > 1) {
      return res.status(400).json({
        success: false,
        message: 'Rule Violation: A team may include zero or ONE 4th-year student — never two or more.',
      });
    }

    // 3. Member Format & Duplicate Check within the payload
    const rollNumbersInPayload = [];
    const emailsInPayload = [];
    let leaderFound = false;

    for (let i = 0; i < members.length; i++) {
      const m = members[i];
      if (!m.name || !m.email || !m.rollNo || !m.year || !m.branch || !m.mobile) {
        return res.status(400).json({
          success: false,
          message: `Incomplete data for Member ${i + 1}. All fields are mandatory.`,
        });
      }

      const cleanRoll = String(m.rollNo).trim().toUpperCase();
      const cleanEmail = String(m.email).trim().toLowerCase();

      if (rollNumbersInPayload.includes(cleanRoll)) {
        return res.status(400).json({
          success: false,
          message: `Duplicate roll number ${cleanRoll} within the same team submission.`,
        });
      }
      rollNumbersInPayload.push(cleanRoll);

      if (emailsInPayload.includes(cleanEmail)) {
        return res.status(400).json({
          success: false,
          message: `Duplicate email ${cleanEmail} within the same team submission.`,
        });
      }
      emailsInPayload.push(cleanEmail);

      if (m.isLeader) {
        leaderFound = true;
      }
    }

    // Ensure first member is marked as leader if not explicitly specified
    if (!leaderFound && members.length > 0) {
      members[0].isLeader = true;
    }

    // 3.5. Registrations Closed Check
    const closedSetting = await SystemSetting.findOne({ key: 'registrationsClosed' });
    if (closedSetting && closedSetting.value === true) {
      return res.status(400).json({
        success: false,
        message: 'Registrations Closed: Team requirements have been satisfied and registrations are officially closed.',
      });
    }

    // 4. Registration Cap Check
    const registrationCap = await getRegistrationCap();
    const paidTeamsCount = await Registration.countDocuments({ status: 'paid' });
    if (paidTeamsCount >= registrationCap) {
      return res.status(400).json({
        success: false,
        message: 'Registration Full: The maximum cap of registered teams has been reached.',
      });
    }

    // 5. Database Roll Number Uniqueness Check
    const now = new Date();
    const existingRegistrations = await Registration.find({
      $or: [
        { status: 'paid' },
        { status: 'pending', expiresAt: { $gt: now } },
      ],
      'members.rollNo': { $in: rollNumbersInPayload },
    });

    const leader = members.find((m) => m.isLeader) || members[0];
    const feeAmount = await getRegistrationFee();

    if (existingRegistrations.length > 0) {
      const leaderEmail = leader?.email?.trim()?.toLowerCase();
      const existingLeaderPending = existingRegistrations.find(
        (reg) => reg.status === 'pending' && reg.members[0]?.email?.toLowerCase() === leaderEmail
      );

      if (existingLeaderPending) {
        const clientOrigin = req.headers.origin || req.headers.referer || process.env.CLIENT_URL;
        const cleanOrigin = clientOrigin ? clientOrigin.replace(/\/+$/, '') : 'https://codex-4-o-registration-portal.onrender.com';
        const cfOrder = await createCashfreeOrder(feeAmount, existingLeaderPending.teamId, {
          name: leader.name,
          email: leader.email,
          phone: leader.mobile,
          returnUrl: `${cleanOrigin}/register?order_id={order_id}`,
        });

        existingLeaderPending.paymentDetails.cfOrderId = cfOrder.order_id;
        existingLeaderPending.paymentDetails.paymentSessionId = cfOrder.payment_session_id;
        await existingLeaderPending.save();

        return res.status(200).json({
          success: true,
          message: 'Resumed your existing pending registration.',
          teamId: existingLeaderPending.teamId,
          order: cfOrder,
          paymentSessionId: cfOrder.payment_session_id,
          registrationId: existingLeaderPending._id,
          amount: feeAmount,
          isExistingPending: true,
        });
      }

      const conflictingRolls = [];
      existingRegistrations.forEach((reg) => {
        reg.members.forEach((m) => {
          if (rollNumbersInPayload.includes(m.rollNo) && !conflictingRolls.includes(m.rollNo)) {
            conflictingRolls.push(m.rollNo);
          }
        });
      });

      return res.status(400).json({
        success: false,
        message: `The following roll number(s) are already registered in another active team: ${conflictingRolls.join(', ')}`,
        conflictingRolls,
      });
    }

    // 6. Generate Unique Team ID (e.g. CDX4-0001)
    const teamId = await getNextSequenceValue('teamId');

    // 7. Create Cashfree Order
    const clientOrigin = req.headers.origin || req.headers.referer || process.env.CLIENT_URL;
    const cleanOrigin = clientOrigin ? clientOrigin.replace(/\/+$/, '') : 'https://codex-4-o-registration-portal.onrender.com';
    const cfOrder = await createCashfreeOrder(feeAmount, teamId, {
      name: leader.name,
      email: leader.email,
      phone: leader.mobile,
      returnUrl: `${cleanOrigin}/register?order_id={order_id}`,
    });

    // 8. Save Pending Registration in MongoDB (holds slot for 10 minutes)
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

    const formattedMembers = members.map((m) => ({
      name: String(m.name).trim(),
      email: String(m.email).trim().toLowerCase(),
      rollNo: String(m.rollNo).trim().toUpperCase(),
      year: String(m.year).trim(),
      branch: String(m.branch).trim(),
      gender: m.gender ? String(m.gender).trim() : 'Male',
      college: m.college ? String(m.college).trim() : 'G. Pulla Reddy Engineering College',
      mobile: String(m.mobile).trim(),
      isLeader: Boolean(m.isLeader),
    }));

    const newRegistration = new Registration({
      teamId,
      teamName: String(teamName).trim(),
      members: formattedMembers,
      status: 'pending',
      paymentDetails: {
        cfOrderId: cfOrder.order_id,
        paymentSessionId: cfOrder.payment_session_id,
        amount: feeAmount,
        currency: 'INR',
      },
      expiresAt,
    });

    await newRegistration.save();

    return res.status(201).json({
      success: true,
      message: 'Cashfree order created successfully.',
      teamId,
      order: cfOrder,
      paymentSessionId: cfOrder.payment_session_id,
      registrationId: newRegistration._id,
      amount: feeAmount,
    });
  } catch (error) {
    console.error('[createOrder] Error:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Server error creating registration order.',
    });
  }
};

/**
 * POST /api/register/verify-payment
 * Verify Cashfree order status, update status to paid, trigger confirmation email
 */
const verifyPayment = async (req, res) => {
  try {
    const { orderId, cfOrderId, razorpay_order_id, teamId } = req.body;
    const targetOrderId = orderId || cfOrderId || razorpay_order_id;

    if (!targetOrderId && !teamId) {
      return res.status(400).json({
        success: false,
        message: 'Missing payment verification details (orderId or teamId required).',
      });
    }

    // 1. Find registration record
    let registration = null;
    if (teamId) {
      registration = await Registration.findOne({ teamId });
    }
    if (!registration && targetOrderId) {
      registration = await Registration.findOne({
        $or: [
          { 'paymentDetails.cfOrderId': targetOrderId },
          { 'paymentDetails.razorpayOrderId': targetOrderId },
        ],
      });
    }

    if (!registration) {
      return res.status(404).json({
        success: false,
        message: 'Registration record not found for the provided order/team ID.',
      });
    }

    if (registration.status === 'paid') {
      return res.json({
        success: true,
        message: 'Payment was already verified and confirmed.',
        teamId: registration.teamId,
        registration,
      });
    }

    const verifyOrderId = targetOrderId || registration.paymentDetails?.cfOrderId || registration.paymentDetails?.razorpayOrderId;

    // 2. Verify with Cashfree API / Mock logic
    const verifyResult = await verifyCashfreeOrder(verifyOrderId);

    if (!verifyResult.success || (verifyResult.order_status !== 'PAID' && !verifyResult.isMock)) {
      console.warn('[verifyPayment] Verification returned non-paid status:', verifyResult);
      return res.status(400).json({
        success: false,
        message: verifyResult.message || `Payment verification failed. Order status: ${verifyResult.order_status || 'UNKNOWN'}`,
      });
    }

    // 3. Update registration to PAID
    registration.status = 'paid';
    registration.paymentDetails.cfPaymentId = verifyResult.cf_payment_id || `cf_pay_${Date.now()}`;
    registration.paymentDetails.paidAt = new Date();
    registration.expiresAt = undefined; // Remove expiration

    await registration.save();

    // 3.5. Sync to Google Sheets (Async background sync)
    syncRegistrationToSheet(registration).catch((sheetErr) => {
      console.error('[GoogleSheets] Sync error during verification:', sheetErr.message);
    });

    // 4. Sync team members into User collection ONLY AFTER successful payment verification
    for (const m of registration.members) {
      try {
        await User.findOneAndUpdate(
          { email: m.email.toLowerCase() },
          {
            $set: {
              name: m.name,
              email: m.email.toLowerCase(),
              rollNo: m.rollNo,
              year: m.year,
              branch: m.branch,
              college: m.college || 'GPREC',
              mobile: m.mobile,
            },
          },
          { upsert: true, new: true, setDefaultsOnInsert: true }
        );
      } catch (uErr) {
        console.log('[verifyPayment] User sync note:', uErr.message);
      }
    }

    // 5. Send Confirmation Email (Async non-blocking)
    const emailResult = await sendConfirmationEmail(registration);
    if (emailResult) {
      registration.emailSent = true;
      registration.emailSentAt = new Date();
      await registration.save();
    }

    return res.json({
      success: true,
      message: 'Payment verified successfully! Registration is now complete.',
      teamId: registration.teamId,
      registration,
    });
  } catch (error) {
    console.error('[verifyPayment] Error:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error verifying payment status.',
    });
  }
};

/**
 * GET /api/register/pending
 * Retrieve active non-expired pending registration for user
 */
const getPendingRegistration = async (req, res) => {
  try {
    await cleanupExpiredPending();
    const email = req.query.email || req.user?.email;
    if (!email) {
      return res.status(400).json({ success: false, message: 'Email parameter required.' });
    }

    const cleanEmail = String(email).trim().toLowerCase();
    const now = new Date();

    const pending = await Registration.findOne({
      status: 'pending',
      expiresAt: { $gt: now },
      'members.email': cleanEmail,
    });

    if (!pending) {
      return res.json({ success: true, pending: null });
    }

    return res.json({
      success: true,
      pending: {
        teamId: pending.teamId,
        teamName: pending.teamName,
        members: pending.members,
        expiresAt: pending.expiresAt,
        amount: pending.paymentDetails?.amount || 300,
        paymentSessionId: pending.paymentDetails?.paymentSessionId,
        orderId: pending.paymentDetails?.cfOrderId,
      },
    });
  } catch (error) {
    console.error('[getPendingRegistration] Error:', error);
    return res.status(500).json({ success: false, message: 'Server error checking pending registration.' });
  }
};

/**
 * POST /api/register/retry-order
 * Retry/resume payment for active pending registration
 */
const retryPendingOrder = async (req, res) => {
  try {
    await cleanupExpiredPending();
    const { teamId } = req.body;
    if (!teamId) {
      return res.status(400).json({ success: false, message: 'teamId is required.' });
    }

    const now = new Date();
    const registration = await Registration.findOne({
      teamId,
      status: 'pending',
      expiresAt: { $gt: now },
    });

    if (!registration) {
      return res.status(404).json({
        success: false,
        message: 'Pending registration expired or not found. Please register again.',
      });
    }

    const leader = registration.members.find((m) => m.isLeader) || registration.members[0];
    const feeAmount = registration.paymentDetails?.amount || await getRegistrationFee();

    const clientOrigin = req.headers.origin || req.headers.referer || process.env.CLIENT_URL;
    const cleanOrigin = clientOrigin ? clientOrigin.replace(/\/+$/, '') : 'https://codex-4-o-registration-portal.onrender.com';
    const cfOrder = await createCashfreeOrder(feeAmount, teamId, {
      name: leader?.name,
      email: leader?.email,
      phone: leader?.mobile,
      returnUrl: `${cleanOrigin}/register?order_id={order_id}`,
    });

    registration.paymentDetails.cfOrderId = cfOrder.order_id;
    registration.paymentDetails.paymentSessionId = cfOrder.payment_session_id;
    await registration.save();

    return res.json({
      success: true,
      message: 'Pending registration order ready.',
      teamId: registration.teamId,
      order: cfOrder,
      paymentSessionId: cfOrder.payment_session_id,
      amount: feeAmount,
      registration,
    });
  } catch (error) {
    console.error('[retryPendingOrder] Error:', error);
    return res.status(500).json({ success: false, message: 'Server error retrying pending order.' });
  }
};

/**
 * POST /api/register/cancel-pending
 * Cancel an active pending registration
 */
const cancelPendingRegistration = async (req, res) => {
  try {
    const { teamId } = req.body;
    if (!teamId) {
      return res.status(400).json({ success: false, message: 'teamId is required.' });
    }

    await Registration.updateOne(
      { teamId, status: 'pending' },
      { status: 'cancelled', expiresAt: new Date() }
    );

    return res.json({ success: true, message: 'Pending registration cancelled successfully.' });
  } catch (error) {
    console.error('[cancelPendingRegistration] Error:', error);
    return res.status(500).json({ success: false, message: 'Server error cancelling pending registration.' });
  }
};

/**
 * GET /api/register/system-settings
 * Retrieve public system settings
 */
const getSystemSettings = async (req, res) => {
  try {
    const underConstructionSetting = await SystemSetting.findOne({ key: 'underConstruction' });
    const underConstruction = underConstructionSetting ? underConstructionSetting.value === true : false;
    const closedSetting = await SystemSetting.findOne({ key: 'registrationsClosed' });
    const registrationsClosed = closedSetting ? closedSetting.value === true : false;
    const registrationFee = await getRegistrationFee();
    const registrationCap = await getRegistrationCap();
    return res.json({
      success: true,
      settings: {
        underConstruction,
        registrationsClosed,
        registrationFee,
        registrationCap,
      },
    });
  } catch (error) {
    console.error('[getSystemSettings] Error:', error);
    return res.status(500).json({ success: false, message: 'Server error retrieving system settings.' });
  }
};

/**
 * GET /api/register/my-registration
 * Retrieve confirmed paid registration for a user by email or rollNo
 */
const getMyRegistration = async (req, res) => {
  try {
    let email = req.query.email ? String(req.query.email).trim().toLowerCase() : '';
    let rollNo = req.query.rollNo ? String(req.query.rollNo).trim().toUpperCase() : '';

    if (req.user) {
      if (req.user.email) email = req.user.email.toLowerCase();
      if (req.user.rollNo) rollNo = req.user.rollNo.toUpperCase();
    }

    if (!email && !rollNo) {
      return res.json({ success: true, registered: false, registration: null });
    }

    const queryConditions = [];
    if (email) queryConditions.push({ 'members.email': email });
    if (rollNo) queryConditions.push({ 'members.rollNo': rollNo });

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
  } catch (error) {
    console.error('[getMyRegistration] Error:', error);
    return res.status(500).json({ success: false, message: 'Server error retrieving registration.' });
  }
};

module.exports = {
  checkRollNumbers,
  createOrder,
  verifyPayment,
  getPendingRegistration,
  retryPendingOrder,
  cancelPendingRegistration,
  getSystemSettings,
  getMyRegistration,
};
