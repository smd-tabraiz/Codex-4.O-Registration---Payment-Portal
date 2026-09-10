const ExcelJS = require('exceljs');

/**
 * Generates an Excel workbook buffer containing registrations
 * @param {Array} registrations Array of Registration MongoDB documents
 */
const generateRegistrationsExcel = async (registrations) => {
  const workbook = new ExcelJS.Workbook();
  workbook.creator = "Coders' Club GPREC";
  workbook.lastModifiedBy = "Codex 4.0 Portal";
  workbook.created = new Date();

  // Sheet 1: Detailed Member-wise Registrations
  const sheet = workbook.addWorksheet('Registrations Detailed', {
    views: [{ state: 'frozen', ySplit: 3 }],
  });

  // Define Columns
  sheet.columns = [
    { header: 'S.No', key: 'sno', width: 8 },
    { header: 'Team ID', key: 'teamId', width: 14 },
    { header: 'Team Name', key: 'teamName', width: 24 },
    { header: 'Member Role', key: 'role', width: 14 },
    { header: 'Member Name', key: 'memberName', width: 24 },
    { header: 'Gender', key: 'gender', width: 10 },
    { header: 'Roll No', key: 'rollNo', width: 16 },
    { header: 'Year', key: 'year', width: 8 },
    { header: 'Branch', key: 'branch', width: 14 },
    { header: 'College', key: 'college', width: 30 },
    { header: 'Email', key: 'email', width: 28 },
    { header: 'Mobile', key: 'mobile', width: 16 },
    { header: 'Payment Status', key: 'status', width: 16 },
    { header: 'Amount (₹)', key: 'amount', width: 12 },
    { header: 'Payment ID / Ref', key: 'paymentId', width: 26 },
    { header: 'Registration Date', key: 'registeredAt', width: 20 },
  ];

  // Title Banner at Row 1
  sheet.mergeCells('A1:P1');
  const titleCell = sheet.getCell('A1');
  titleCell.value = "CODEX 4.0 - Team Event Registrations Report (Coders' Club GPREC)";
  titleCell.font = { name: 'Calibri', size: 16, bold: true, color: { argb: 'FFFFFF' } };
  titleCell.fill = {
    type: 'pattern',
    pattern: 'solid',
    fgColor: { argb: '1E1B4B' }, // Dark Indigo
  };
  titleCell.alignment = { vertical: 'middle', horizontal: 'center' };
  sheet.getRow(1).height = 35;

  // Sub-header date & total count at Row 2
  sheet.mergeCells('A2:P2');
  const subCell = sheet.getCell('A2');
  subCell.value = `Export Generated on: ${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })} | Total Teams: ${registrations.length}`;
  subCell.font = { name: 'Calibri', size: 11, italic: true, color: { argb: 'D1D5DB' } };
  subCell.fill = {
    type: 'pattern',
    pattern: 'solid',
    fgColor: { argb: '374151' },
  };
  subCell.alignment = { vertical: 'middle', horizontal: 'center' };
  sheet.getRow(2).height = 22;

  // Header row at Row 3
  const headerRow = sheet.getRow(3);
  sheet.columns.forEach((col, idx) => {
    const cell = headerRow.getCell(idx + 1);
    cell.value = col.header;
    cell.font = { name: 'Calibri', size: 11, bold: true, color: { argb: 'FFFFFF' } };
    cell.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: '4F46E5' }, // Primary Indigo
    };
    cell.alignment = { vertical: 'middle', horizontal: 'center' };
    cell.border = {
      top: { style: 'thin', color: { argb: '6366F1' } },
      left: { style: 'thin', color: { argb: '6366F1' } },
      bottom: { style: 'medium', color: { argb: '4338CA' } },
      right: { style: 'thin', color: { argb: '6366F1' } },
    };
  });
  headerRow.height = 26;

  let rowIdx = 4;
  let snoCounter = 1;

  registrations.forEach((reg) => {
    const isPaid = reg.status === 'paid';

    if (Array.isArray(reg.members) && reg.members.length > 0) {
      reg.members.forEach((mem, memIdx) => {
        const row = sheet.getRow(rowIdx);

        // Assign cell values in order (1-indexed matching column indexes A-P)
        row.values = [
          memIdx === 0 ? snoCounter : '',
          reg.teamId || '',
          reg.teamName || '',
          mem.isLeader ? 'Leader' : 'Member',
          mem.name || '',
          mem.gender || 'Male',
          mem.rollNo || '',
          mem.year || '',
          mem.branch || '',
          mem.college || 'G. Pulla Reddy Engineering College',
          mem.email || '',
          mem.mobile || '',
          (reg.status || 'PAID').toUpperCase(),
          reg.paymentDetails?.amount || 300,
          reg.paymentDetails?.cfPaymentId || reg.paymentDetails?.razorpayPaymentId || 'N/A',
          reg.createdAt ? new Date(reg.createdAt).toLocaleDateString('en-IN', { timeZone: 'Asia/Kolkata' }) : 'N/A',
        ];

        // Styling each cell in the data row
        row.eachCell({ includeEmpty: true }, (cell, colNumber) => {
          cell.font = { name: 'Calibri', size: 10 };
          cell.alignment = { 
            vertical: 'middle', 
            horizontal: [1, 6, 7, 8, 12, 13, 14, 16].includes(colNumber) ? 'center' : 'left' 
          };
          cell.border = {
            top: { style: 'thin', color: { argb: 'E5E7EB' } },
            left: { style: 'thin', color: { argb: 'E5E7EB' } },
            bottom: { style: 'thin', color: { argb: 'E5E7EB' } },
            right: { style: 'thin', color: { argb: 'E5E7EB' } },
          };
        });

        // Highlight Payment Status (Col 13)
        const statusCell = row.getCell(13);
        if (isPaid) {
          statusCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'DCFCE7' } }; // Light Green
          statusCell.font = { name: 'Calibri', size: 10, bold: true, color: { argb: '15803D' } };
        } else if (reg.status === 'pending') {
          statusCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FEF9C3' } }; // Light Yellow
          statusCell.font = { name: 'Calibri', size: 10, bold: true, color: { argb: 'A16207' } };
        } else {
          statusCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FEE2E2' } }; // Light Red
          statusCell.font = { name: 'Calibri', size: 10, bold: true, color: { argb: 'B91C1C' } };
        }

        // Highlight Leader Role (Col 4)
        if (mem.isLeader) {
          const roleCell = row.getCell(4);
          roleCell.font = { name: 'Calibri', size: 10, bold: true, color: { argb: '4338CA' } };
        }

        row.height = 20;
        rowIdx++;
      });
    }

    snoCounter++;
  });

  const buffer = await workbook.xlsx.writeBuffer();
  return buffer;
};

module.exports = { generateRegistrationsExcel };
