const express = require('express');
const router = express.Router();
const adminAuth = require('../middleware/adminAuth');
const {
  adminLogin,
  getAllRegistrations,
  exportExcel,
  resendEmail,
  updateRegistrationStatus,
  deleteRegistration,
  updateSystemSettings,
  syncGoogleSheets,
} = require('../controllers/adminController');

// Public route for admin login
router.post('/login', adminLogin);

// Protected routes requiring admin authentication
router.use(adminAuth);
router.get('/registrations', getAllRegistrations);
router.get('/export', exportExcel);
router.post('/resend-email/:id', resendEmail);
router.patch('/registration-status/:id', updateRegistrationStatus);
router.delete('/registration/:id', deleteRegistration);
router.post('/system-settings', updateSystemSettings);
router.post('/sync-sheets', syncGoogleSheets);

module.exports = router;

