const { google } = require('googleapis');
const path = require('path');
const fs = require('fs');

const SPREADSHEET_ID = process.env.SPREADSHEET_ID || '1Yor_zjBkP5jfk-c4m63ZMXAIwNwIcCLYfIKvjsHQwOA';
const SHEET_NAME = process.env.SHEET_NAME || 'Sheet1';
const CREDENTIALS_PATH = path.join(__dirname, '../google-service-account.json');

// Built-in fallback credentials in case google-service-account.json is not present on cloud host (e.g. Render)
const FALLBACK_CREDENTIALS = {
  type: 'service_account',
  project_id: 'codex-4-o',
  private_key_id: '47f610c38880887c26e9d3a054ef39f161d9d9b0',
  private_key:
    '-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQC1XXNy3w9g7jD4\nqXTYgF4vKxDYjIswk375mtKTkRd5o3kzKFTXtxzQbPEQdcmnpO2wz5rNuYYRwoLE\nirK0SQ+Hbq+r9zNICEjXvoeLxBZ1XCKv/95icWLyOjq2cRosW4tXH3WCni0iy6cH\nPPEMScVjZntRePodKywOa/rFQRS92C9HMoJGxjonkLLvoaUnV6VwkSxRsUsVKIEH\na7z0YoJaVWQoeYufitaxZZi6AXzOApBLd8BATRzvxNnwYWdjdj6yNbyMdDw87yyX\nkPYOcpz3umR+rDsug9LBlwwPk0mzh7rAYkHI0dRcHwxpIFqQNQiFLPzMlwoz0W/q\nUv+1NRz5AgMBAAECggEAEdXv3ZMcIw8pl7qqeAQfvwnALVuc8JkAurFEFikFovu1\nlpdXyKMEXWbpShIbU7Y/fczcz3B4Q9TaIVP2gQ5STaJP+lxkGahe6YCeOdt9zerS\nqnZCO3IlJeceEQUMauJR0K6SUtcVXz+h3G9c0TWMCNtyMy/vgODXA1ARKEbfMFAg\nt3pgbROMFTTeJFJSSBtB8cNFs3tn/kSUg+b+yygaar7lBna8eJMhc52q6bswFqb3\nFv5+01YJmwbTyDlHw70UNBT5cwT/0sB+/xr4SUfmwo4NPspN3gK1PkGqh4upjBwX\nVyQ/fySRQ0HL3vbNlB8o2khKe1s99s8YdNCEZDSSUQKBgQDt4v/iapleHdgOMiu3\nJmsBFLIw04PYqQYjitstR1acwfR0C7SRPMQRUbX1vx+yhfLgp1B0qdPJN1KhOBpj\najcgI7XFgSiWpPFYp/ih0Pp74KAsuPXBBGH6Xu2PcY/AWhFR/+mgU+pDichwJmV6\n7WMkm43fov/RLhVbllSJzbK0hQKBgQDDLLRG0/RATYbHufyPGAU6JRZqAXNB0TNf\nz5m1hhWlNsXCGf+bwj27xXxL5XfxDiV2mpjnVuLyXMsVms1Z99zQGhJGaAaJ/2lc\noXc55TPO2al1bNXzGgXArG1RgwksVSW38hlGj2VOLWA3vK997RF78ifhtu2QFpLr\nD9WUa7265QKBgEy78HaElDw7vDm4DUni5plOp7wAPoNg4k4MuG5+mH2wQr48GF7R\nDx3XEa7Xm83mT1YQIm+/aEV7xveiNUDkPivr2PKAmyscwY0rgZQQ6PuUlZZXg05j\nr4cnn9GpfAk8BGJC/oVtDCAFDda/S/S/Jj/kvXrqBULgbptAfryE0aRRAoGBALZ6\no4rdPK6qTWuLbqDzGmAEsPInrPVKfTgFR3c6iB5SGY+i8yNT9pgKym3De+K7ETfU\nz0TsLX/gVlg6xehqH9/JoHCHbiWz0XSz2l8c9tVdGF0bhuWl3N8J16OwWfFDIuLa\nzdr00wjG0AEMvx+DeSdjfvpAJ9jh4jc4NL5yBZApAoGAH6STDhqycdSk4wWjdjc/\nQeO5dRLllzjm2BDIotmY+l53cNJh/8/FqKKAmKBeKAUac981DjhhGAv3NxmkgSz/\nFBipQ8G1I7P9XLlVydkrv46dpJEmKERhQaKLR/OzPde6n3UD44D7nv5MXXqHiEdr\nQSTFi1XqEmndXbtTijyqyk8=\n-----END PRIVATE KEY-----\n',
  client_email: 'codex-4-o@codex-4-o.iam.gserviceaccount.com',
  client_id: '112676413100521077250',
};

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
  // Status column appended at the end
  'Status',
];

let sheetsClient = null;

const getSheetClient = async () => {
  if (sheetsClient) return sheetsClient;

  let authConfig = {
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
  };

  if (process.env.GOOGLE_SERVICE_ACCOUNT_JSON) {
    try {
      authConfig.credentials = JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT_JSON);
    } catch (e) {
      console.error('[GoogleSheets] Error parsing GOOGLE_SERVICE_ACCOUNT_JSON:', e.message);
      authConfig.credentials = FALLBACK_CREDENTIALS;
    }
  } else if (fs.existsSync(CREDENTIALS_PATH)) {
    authConfig.keyFile = CREDENTIALS_PATH;
  } else {
    authConfig.credentials = FALLBACK_CREDENTIALS;
  }

  const auth = new google.auth.GoogleAuth(authConfig);
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
 * Helper to dispatch to Google Apps Script Webhook if configured
 */
const syncViaAppsScript = async (registration, isDeleted = false) => {
  const webhookUrl = process.env.GOOGLE_APPS_SCRIPT_URL;
  if (!webhookUrl) return;

  try {
    const payload = {
      action: isDeleted ? 'delete' : 'sync',
      teamId: registration.teamId,
      teamName: registration.teamName,
      status: isDeleted ? 'DELETED' : registration.status,
      paymentDetails: registration.paymentDetails,
      members: registration.members,
      row: buildRow(0, registration, isDeleted),
    };

    if (typeof fetch === 'function') {
      await fetch(webhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
    }
  } catch (err) {
    console.error('[GoogleSheets] Error posting to Apps Script webhook:', err.message);
  }
};

/**
 * Sync a registration to Google Sheets (Handles Append, Update, and Delete)
 * @param {Object} registration - The MongoDB Registration document
 * @param {Boolean} isDeleted - Set true to mark the row status as DELETED
 */
const syncRegistrationToSheet = async (registration, isDeleted = false) => {
  // Fire Apps Script webhook in background if URL is provided
  syncViaAppsScript(registration, isDeleted).catch(() => {});

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

/**
 * Sync ALL registrations to Google Sheets in a single batch
 * Overwrites Sheet1 data rows with the latest accurate MongoDB state
 */
const syncAllToSheet = async (registrations) => {
  try {
    const sheets = await getSheetClient();
    await ensureHeaders(sheets);

    const rows = registrations.map((reg, idx) => buildRow(idx + 1, reg, reg.status === 'deleted'));

    if (rows.length === 0) {
      return { success: true, count: 0 };
    }

    // Clear existing data rows below header and write fresh batch
    try {
      await sheets.spreadsheets.values.clear({
        spreadsheetId: SPREADSHEET_ID,
        range: `${SHEET_NAME}!A2:AD`,
      });
    } catch (clearErr) {
      console.warn('[GoogleSheets] Clear range warning:', clearErr.message);
    }

    await sheets.spreadsheets.values.update({
      spreadsheetId: SPREADSHEET_ID,
      range: `${SHEET_NAME}!A2`,
      valueInputOption: 'RAW',
      requestBody: { values: rows },
    });

    console.log(`[GoogleSheets] ✅ Batch synced ${rows.length} rows to Google Sheets.`);
    return { success: true, count: rows.length };
  } catch (err) {
    console.error('[GoogleSheets] ❌ Error in syncAllToSheet:', err.message);
    throw err;
  }
};

module.exports = { syncRegistrationToSheet, syncAllToSheet };
