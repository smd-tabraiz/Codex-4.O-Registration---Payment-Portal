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

  // Title Banner
  sheet.mergeCells('A1:L1');
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

  // Sub-header date & total count
  sheet.mergeCells('A2:L2');
  const subCell = sheet.getCell('A2');
  subCell.value = `Export Generated on: ${new Date().toLocaleString()} | Total Teams: ${registrations.length}`;
  subCell.font = { name: 'Calibri', size: 11, italic: true, color: { argb: 'D1D5DB' } };
  subCell.fill = {
    type: 'pattern',
    pattern: 'solid',
    fgColor: { argb: '374151' },
  };
  subCell.alignment = { vertical: 'middle', horizontal: 'center' };
  sheet.getRow(2).height = 22;

  // Table Columns
  const columns = [
    { header: 'S.No', key: 'sno', width: 6 },
    { header: 'Team ID', key: 'teamId', width: 14 },
    { header: 'Team Name', key: 'teamName', width: 22 },
    { header: 'Member Role', key: 'role', width: 14 },
    { header: 'Member Name', key: 'memberName', width: 22 },
    { header: 'Gender', key: 'gender', width: 10 },
    { header: 'Roll No', key: 'rollNo', width: 16 },
    { header: 'Year', key: 'year', width: 8 },
    { header: 'Branch', key: 'branch', width: 14 },
    { header: 'College', key: 'college', width: 26 },
    { header: 'Email', key: 'email', width: 28 },
    { header: 'Mobile', key: 'mobile', width: 16 },
    { header: 'Payment Status', key: 'status', width: 16 },
    { header: 'Amount (₹)', key: 'amount', width: 12 },
    { header: 'Payment ID / Ref', key: 'paymentId', width: 24 },
    { header: 'Registration Date', key: 'registeredAt', width: 20 },
  ];

  // Set header row at Row 3
  const headerRow = sheet.getRow(3);
  columns.forEach((col, idx) => {
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

    reg.members.forEach((mem, memIdx) => {
      const row = sheet.getRow(rowIdx);

      row.values = {
        sno: memIdx === 0 ? snoCounter : '',
        teamId: reg.teamId,
        teamName: reg.teamName,
        role: mem.isLeader ? 'Leader' : 'Member',
        memberName: mem.name,
        gender: mem.gender || 'N/A',
        rollNo: mem.rollNo,
        year: mem.year,
        branch: mem.branch,
        college: mem.college,
        email: mem.email,
        mobile: mem.mobile,
        status: reg.status.toUpperCase(),
        amount: reg.paymentDetails?.amount || 300,
        paymentId: reg.paymentDetails?.cfPaymentId || reg.paymentDetails?.razorpayPaymentId || 'N/A',
        registeredAt: reg.createdAt ? new Date(reg.createdAt).toLocaleDateString() : 'N/A',
      };

      // Styling each cell in the data row
      row.eachCell({ includeEmpty: true }, (cell, colNumber) => {
        cell.font = { name: 'Calibri', size: 10 };
        cell.alignment = { vertical: 'middle', horizontal: colNumber === 1 || colNumber === 7 || colNumber === 12 || colNumber === 13 ? 'center' : 'left' };
        cell.border = {
          top: { style: 'thin', color: { argb: 'E5E7EB' } },
          left: { style: 'thin', color: { argb: 'E5E7EB' } },
          bottom: { style: 'thin', color: { argb: 'E5E7EB' } },
          right: { style: 'thin', color: { argb: 'E5E7EB' } },
        };
      });

      // Highlight Paid vs Pending vs Expired
      const statusCell = row.getCell(12);
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

      // Highlight Leader
      if (mem.isLeader) {
        const roleCell = row.getCell(4);
        roleCell.font = { name: 'Calibri', size: 10, bold: true, color: { argb: '4338CA' } };
      }

      row.height = 20;
      rowIdx++;
    });

    snoCounter++;
  });

  // Apply Column Widths
  columns.forEach((col, i) => {
    sheet.getColumn(i + 1).width = col.width;
  });

  // Generate Buffer
  const buffer = await workbook.xlsx.writeBuffer();
  return buffer;
};

module.exports = { generateRegistrationsExcel };
