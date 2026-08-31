const Registration = require('../models/Registration');
const { generateRegistrationsExcel } = require('../utils/exportExcel');
const { sendConfirmationEmail } = require('../utils/mailer');
const jwt = require('jsonwebtoken');
const { syncRegistrationToSheet } = require('../utils/googleSheets');

const JWT_SECRET = process.env.JWT_SECRET || 'codex4_jwt_secret_key_2026';
const ADMIN_USERNAME = process.env.ADMIN_USERNAME || 'SMD-TABRAIZ';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'Shamstabraiz@100251';

/**
 * POST /api/admin/login
 * Admin Login with hardcoded credentials (SMD-TABRAIZ / Shamstabraiz@100251)
 */
const adminLogin = async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ success: false, message: 'Username and Password are required.' });
    }

    if (username.trim() === ADMIN_USERNAME && password.trim() === ADMIN_PASSWORD) {
      const token = jwt.sign({ role: 'admin', username: ADMIN_USERNAME }, JWT_SECRET, { expiresIn: '7d' });
      return res.json({
        success: true,
        message: 'Admin authentication successful!',
        token,
      });
    }

    return res.status(401).json({ success: false, message: 'Invalid Admin Username or Password.' });
  } catch (error) {
    console.error('[Admin] Login error:', error);
    return res.status(500).json({ success: false, message: 'Server error during admin login.' });
  }
};

/**
 * GET /api/admin/registrations
 * Admin list view with stats summary and filters
 */
const getAllRegistrations = async (req, res) => {
  try {
    const { status, search } = req.query;

    const query = {};
    if (status && ['paid', 'pending', 'failed', 'expired'].includes(status)) {
      query.status = status;
    }

    if (search && search.trim()) {
      const searchRegex = new RegExp(search.trim(), 'i');
      query.$or = [
        { teamId: searchRegex },
        { teamName: searchRegex },
        { 'members.name': searchRegex },
        { 'members.rollNo': searchRegex },
        { 'members.email': searchRegex },
        { 'members.mobile': searchRegex },
      ];
    }

    const registrations = await Registration.find(query).sort({ createdAt: -1 });

    // Calculate Dashboard Statistics
    const allRegs = await Registration.find({});
    const totalTeams = allRegs.length;
    const paidTeams = allRegs.filter((r) => r.status === 'paid');
    const pendingTeams = allRegs.filter((r) => r.status === 'pending');
    const failedTeams = allRegs.filter((r) => r.status === 'failed');

    const totalRevenue = paidTeams.reduce((sum, r) => sum + (r.paymentDetails?.amount || 300), 0);

    // Member Analytics
    let totalParticipants = 0;
    const yearBreakdown = { '1st': 0, '2nd': 0, '3rd': 0, '4th': 0 };
    const collegeBreakdown = {};

    paidTeams.forEach((team) => {
      team.members.forEach((mem) => {
        totalParticipants++;
        if (yearBreakdown[mem.year] !== undefined) {
          yearBreakdown[mem.year]++;
        }
        const collegeName = mem.college ? mem.college.trim().toUpperCase() : 'GPREC';
        collegeBreakdown[collegeName] = (collegeBreakdown[collegeName] || 0) + 1;
      });
    });

    return res.json({
      success: true,
      stats: {
        totalTeams,
        paidTeamsCount: paidTeams.length,
        pendingTeamsCount: pendingTeams.length,
        failedTeamsCount: failedTeams.length,
        totalRevenue,
        totalParticipants,
        yearBreakdown,
        collegeBreakdown,
        registrationCap: parseInt(process.env.REGISTRATION_CAP || '50', 10),
      },
      registrations,
    });
  } catch (error) {
    console.error('[Admin] Error fetching registrations:', error);
    return res.status(500).json({ success: false, message: 'Server error fetching registrations.' });
  }
};

/**
 * GET /api/admin/export
 * Download Excel file generated on demand from MongoDB
 */
const exportExcel = async (req, res) => {
  try {
    const { status } = req.query;
    const query = {};
    if (status && ['paid', 'pending', 'failed', 'expired'].includes(status)) {
      query.status = status;
    }

    const registrations = await Registration.find(query).sort({ createdAt: -1 });

    const buffer = await generateRegistrationsExcel(registrations);

    const filename = `Codex4_Registrations_${new Date().toISOString().split('T')[0]}.xlsx`;

    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    return res.send(buffer);
  } catch (error) {
    console.error('[Admin] Error exporting Excel:', error);
    return res.status(500).json({ success: false, message: 'Server error generating Excel export.' });
  }
};

/**
 * POST /api/admin/resend-email/:id
 * Manually resend confirmation email
 */
const resendEmail = async (req, res) => {
  try {
    const { id } = req.params;
    const registration = await Registration.findById(id);

    if (!registration) {
      return res.status(404).json({ success: false, message: 'Registration record not found.' });
    }

    const success = await sendConfirmationEmail(registration);

    if (success) {
      registration.emailSent = true;
      registration.emailSentAt = new Date();
      await registration.save();
      return res.json({ success: true, message: `Confirmation email resent to ${registration.teamId}` });
    } else {
      return res.status(500).json({ success: false, message: 'Failed to send confirmation email. Check SMTP settings.' });
    }
  } catch (error) {
    console.error('[Admin] Error resending email:', error);
    return res.status(500).json({ success: false, message: 'Server error resending email.' });
  }
};

/**
 * PATCH /api/admin/registration-status/:id
 * Manually update status
 */
const updateRegistrationStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!['paid', 'pending', 'failed', 'expired'].includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid status value.' });
    }

    const registration = await Registration.findById(id);
    if (!registration) {
      return res.status(404).json({ success: false, message: 'Registration record not found.' });
    }

    registration.status = status;
    if (status === 'paid' && !registration.paymentDetails?.paidAt) {
      if (!registration.paymentDetails) registration.paymentDetails = {};
      registration.paymentDetails.paidAt = new Date();
      registration.paymentDetails.razorpayPaymentId = registration.paymentDetails.razorpayPaymentId || `MANUAL_${Date.now()}`;
      registration.expiresAt = undefined;
    }

    await registration.save();

    // Sync status change to Google Sheets in background
    syncRegistrationToSheet(registration).catch((sheetErr) => {
      console.error('[GoogleSheets] Sync error during manual status update:', sheetErr.message);
    });

    return res.json({ success: true, message: `Registration status updated to ${status}`, registration });
  } catch (error) {
    console.error('[Admin] Error updating status:', error);
    return res.status(500).json({ success: false, message: 'Server error updating status.' });
  }
};

/**
 * DELETE /api/admin/registration/:id
 * Permanently delete a registration record
 */
const deleteRegistration = async (req, res) => {
  try {
    const { id } = req.params;
    const registration = await Registration.findByIdAndDelete(id);

    if (!registration) {
      return res.status(404).json({ success: false, message: 'Registration record not found.' });
    }

    // Sync deletion to Google Sheets in background
    syncRegistrationToSheet(registration, true).catch((sheetErr) => {
      console.error('[GoogleSheets] Sync error during deletion:', sheetErr.message);
    });

    return res.json({
      success: true,
      message: `Registration ${registration.teamId} (${registration.teamName}) has been permanently deleted.`,
      deletedTeamId: registration.teamId,
    });
  } catch (error) {
    console.error('[Admin] Error deleting registration:', error);
    return res.status(500).json({ success: false, message: 'Server error deleting registration.' });
  }
};

/**
 * POST /api/admin/system-settings
 * Update system settings (e.g. underConstruction toggle)
 */
const updateSystemSettings = async (req, res) => {
  try {
    const { underConstruction } = req.body;
    if (underConstruction === undefined) {
      return res.status(400).json({ success: false, message: 'underConstruction value is required.' });
    }

    const SystemSetting = require('../models/SystemSetting');
    await SystemSetting.findOneAndUpdate(
      { key: 'underConstruction' },
      { value: underConstruction === true },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    return res.json({
      success: true,
      message: `System underConstruction toggle updated to ${underConstruction === true}`,
      underConstruction: underConstruction === true,
    });
  } catch (error) {
    console.error('[updateSystemSettings] Error:', error);
    return res.status(500).json({ success: false, message: 'Server error updating system settings.' });
  }
};

module.exports = {
  adminLogin,
  getAllRegistrations,
  exportExcel,
  resendEmail,
  updateRegistrationStatus,
  deleteRegistration,
  updateSystemSettings,
};
