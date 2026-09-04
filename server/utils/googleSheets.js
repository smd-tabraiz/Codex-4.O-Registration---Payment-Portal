const { google } = require('googleapis');
const path = require('path');

const SPREADSHEET_ID = '1Yor_zjBkP5jfk-c4m63ZMXAIwNwIcCLYfIKvjsHQwOA';
const SHEET_NAME = 'Sheet1';
const CREDENTIALS_PATH = path.join(__dirname, '../google-service-account.json');

// Column headers for the sheet
const HEADERS = [
  'S.No',
  'Team ID',
  'Team Name',
  'Payment Date & Time',
  'Amount Paid (₹)',
  'Payment ID / Ref',
  'Order ID',
  // Leader
  'Leader Name',
  'Leader Email',
  'Leader Roll No',
  'Leader Year',
  'Leader Branch',
  'Leader College',
  'Leader Mobile',
  // Member 2
  'Member 2 Name',
  'Member 2 Email',
  'Member 2 Roll No',
  'Member 2 Year',
  'Member 2 Branch',
  'Member 2 College',
  'Member 2 Mobile',
  // Member 3
  'Member 3 Name',
  'Member 3 Email',
  'Member 3 Roll No',
  'Member 3 Year',
  'Member 3 Branch',
  'Member 3 College',
  'Member 3 Mobile',
  // Status column appended at the end so we don't remove or reorder existing columns
  'Status',
];

let sheetsClient = null;

const getSheetClient = async () => {
  if (sheetsClient) return sheetsClient;

  const auth = new google.auth.GoogleAuth({
    keyFile: CREDENTIALS_PATH,
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
  });

  const authClient = await auth.getClient();
  sheetsClient = google.sheets({ version: 'v4', auth: authClient });
  return sheetsClient;
};

/**
 * Ensure the header row exists. If the sheet is empty, write headers first.
 */
const ensureHeaders = async (sheets) => {
  try {
    const res = await sheets.spreadsheets.values.get({
      spreadsheetId: SPREADSHEET_ID,
      range: `${SHEET_NAME}!A1:A1`,
    });

    const firstCell = res.data.values?.[0]?.[0];
    if (!firstCell || firstCell.trim() === '') {
      // Write headers
      await sheets.spreadsheets.values.update({
        spreadsheetId: SPREADSHEET_ID,
        range: `${SHEET_NAME}!A1`,
        valueInputOption: 'RAW',
        requestBody: { values: [HEADERS] },
      });
      console.log('[GoogleSheets] Header row written.');
    }
  } catch (err) {
    console.error('[GoogleSheets] Error ensuring headers:', err.message);
  }
};

/**
 * Build the row array matching the HEADERS format
 */
const buildRow = (serialNo, registration, isDeleted = false) => {
  const paidAt = registration.paymentDetails?.paidAt
    ? new Date(registration.paymentDetails.paidAt).toLocaleString('en-IN', {
        timeZone: 'Asia/Kolkata',
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      })
    : '—';

  const amount = registration.paymentDetails?.amount || 0;
  const leader = registration.members?.[0] || {};
  const member2 = registration.members?.[1] || {};
  const member3 = registration.members?.[2] || {};

  const teamName = isDeleted ? `[DELETED] ${registration.teamName}` : registration.teamName;
  const status = isDeleted ? 'DELETED' : registration.status;

  return [
    serialNo,
    registration.teamId || '',
    teamName || '',
    paidAt,
    amount,
    registration.paymentDetails?.cfPaymentId || registration.paymentDetails?.razorpayPaymentId || '',
    registration.paymentDetails?.cfOrderId || registration.paymentDetails?.razorpayOrderId || '',
    // Leader
    leader.name || '',
    leader.email || '',
    leader.rollNo || '',
    leader.year || '',
    leader.branch || '',
    leader.college || 'GPREC',
    leader.mobile || '',
    // Member 2
    member2.name || '',
    member2.email || '',
    member2.rollNo || '',
    member2.year || '',
    member2.branch || '',
    member2.college || 'GPREC',
    member2.mobile || '',
    // Member 3
    member3.name || '',
    member3.email || '',
    member3.rollNo || '',
    member3.year || '',
    member3.branch || '',
    member3.college || 'GPREC',
    member3.mobile || '',
    // Status
    status,
  ];
};

/**
 * Sync a registration to Google Sheets (Handles Append, Update, and Delete)
 * @param {Object} registration - The MongoDB Registration document
 * @param {Boolean} isDeleted - Set true to mark the row status as DELETED
 */
const syncRegistrationToSheet = async (registration, isDeleted = false) => {
  try {
    const sheets = await getSheetClient();
    await ensureHeaders(sheets);

    // Fetch existing columns to find the team row index
    const res = await sheets.spreadsheets.values.get({
      spreadsheetId: SPREADSHEET_ID,
      range: `${SHEET_NAME}!A:B`, // fetch S.No and Team ID columns
    });

    const rows = res.data.values || [];
    let rowIndex = -1;

    // Search for existing Team ID in column B (index 1)
    for (let i = 1; i < rows.length; i++) {
      if (rows[i][1] === registration.teamId) {
        rowIndex = i + 1; // Google Sheets row numbers are 1-indexed
        break;
      }
    }

    if (rowIndex !== -1) {
      // Row exists -> Update it (retain same serial number)
      const serialNo = rows[rowIndex - 1][0] || rowIndex - 1;
      const updatedRow = buildRow(serialNo, registration, isDeleted);

      await sheets.spreadsheets.values.update({
        spreadsheetId: SPREADSHEET_ID,
        range: `${SHEET_NAME}!A${rowIndex}`,
        valueInputOption: 'RAW',
        requestBody: { values: [updatedRow] },
      });

      console.log(`[GoogleSheets] ✅ Updated Team ID: ${registration.teamId} at row ${rowIndex}.`);
    } else {
      // Row does not exist -> Append new row
      const serialNo = rows.length; // serialNo = current header + data rows count
      const newRow = buildRow(serialNo, registration, isDeleted);

      await sheets.spreadsheets.values.append({
        spreadsheetId: SPREADSHEET_ID,
        range: `${SHEET_NAME}!A:A`,
        valueInputOption: 'RAW',
        insertDataOption: 'INSERT_ROWS',
        requestBody: { values: [newRow] },
      });

      console.log(`[GoogleSheets] ✅ Appended Team ID: ${registration.teamId} to sheet.`);
    }

    return true;
  } catch (err) {
    console.error('[GoogleSheets] ❌ Error syncing registration:', err.message);
    return false;
  }
};

module.exports = { syncRegistrationToSheet };
