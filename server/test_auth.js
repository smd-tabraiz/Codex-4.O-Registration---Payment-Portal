const dotenv = require('dotenv');
dotenv.config();

const { adminLogin } = require('./controllers/adminController');

// Mock req and res
const reqMock = {
  body: {
    username: 'SMD-TABRAIZ',
    password: 'Shamstabraiz@100251',
  },
};

const resMock = {
  json: (data) => {
    console.log('✓ Admin Login Response:', data.success ? 'SUCCESS' : 'FAILED');
    if (data.token) {
      console.log('  Admin JWT Token Generated:', data.token.substring(0, 25) + '...');
    }
  },
  status: (code) => ({
    json: (data) => console.log(`✕ Status ${code}:`, data),
  }),
};

console.log('--- ADMIN AUTHENTICATION TEST ---');
adminLogin(reqMock, resMock);
