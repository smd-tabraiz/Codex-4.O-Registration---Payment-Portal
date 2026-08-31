const dotenv = require('dotenv');
dotenv.config();

const { generateRegistrationsExcel } = require('./utils/exportExcel');
const { verifyPaymentSignature } = require('./utils/razorpay');

async function testBackendLogic() {
  console.log('--- CODEX 4.0 BACKEND VALIDATION TEST ---');

  // 1. Signature Verification Test
  const mockValid = verifyPaymentSignature('order_mock_123', 'pay_mock_123', 'sig_mock_123');
  console.log('✓ Razorpay Signature Test (Mock Mode):', mockValid ? 'PASSED' : 'FAILED');

  // 2. Excel Generation Test
  const dummyRegistrations = [
    {
      teamId: 'CDX4-0001',
      teamName: 'Algo Knights',
      status: 'paid',
      createdAt: new Date(),
      paymentDetails: { amount: 150, razorpayPaymentId: 'pay_test_999' },
      members: [
        { name: 'Rahul Sharma', email: 'rahul@gprec.ac.in', rollNo: '219X1A0501', year: '3rd', branch: 'CSE', college: 'GPREC', mobile: '9876543210', isLeader: true },
        { name: 'Priya Verma', email: 'priya@gprec.ac.in', rollNo: '229X1A0502', year: '2nd', branch: 'CSE', college: 'GPREC', mobile: '9876543211', isLeader: false },
        { name: 'Amit Kumar', email: 'amit@gprec.ac.in', rollNo: '209X1A0503', year: '4th', branch: 'ECE', college: 'GPREC', mobile: '9876543212', isLeader: false },
      ]
    }
  ];

  try {
    const excelBuffer = await generateRegistrationsExcel(dummyRegistrations);
    console.log('✓ ExcelJS Export Generation Test:', excelBuffer && excelBuffer.length > 0 ? `PASSED (${excelBuffer.length} bytes generated)` : 'FAILED');
  } catch (err) {
    console.error('✕ Excel Export Error:', err.message);
  }

  console.log('-----------------------------------------');
}

testBackendLogic();
