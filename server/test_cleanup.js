const dns = require('dns');
dns.setServers(['8.8.8.8', '1.1.1.1']);

const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

const Registration = require('./models/Registration');

const cleanupTest = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    await Registration.deleteOne({ teamName: 'Codex Champions' });
    console.log('✓ Cleaned up test record.');
    const count = await Registration.countDocuments();
    console.log(`• Current live registrations count: ${count}`);
    await mongoose.disconnect();
  } catch (err) {
    console.error(err);
  }
};

cleanupTest();
