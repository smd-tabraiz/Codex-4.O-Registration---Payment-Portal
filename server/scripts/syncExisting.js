require('dotenv').config({ path: require('path').join(__dirname, '../.env') });
const mongoose = require('mongoose');
const dns = require('dns');

// Fallback to public DNS servers if local Windows ISP DNS blocks/fails MongoDB Atlas SRV lookup
try {
  dns.setServers(['8.8.8.8', '1.1.1.1']);
} catch (e) {}

const Registration = require('../models/Registration');
const { syncRegistrationToSheet } = require('../utils/googleSheets');

const sync = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI;
    if (!mongoUri) {
      console.error('MONGODB_URI not found in .env');
      process.exit(1);
    }

    console.log('Connecting to MongoDB...');
    await mongoose.connect(mongoUri);
    console.log('Connected to MongoDB.');

    console.log('Fetching paid registrations...');
    const paidRegistrations = await Registration.find({ status: 'paid' }).sort({ 'paymentDetails.paidAt': 1 });
    console.log(`Found ${paidRegistrations.length} paid registrations to sync.`);

    for (const reg of paidRegistrations) {
      console.log(`Syncing Team ID: ${reg.teamId} (${reg.teamName})...`);
      const success = await syncRegistrationToSheet(reg);
      if (success) {
        console.log(`✅ Successfully synced Team ID: ${reg.teamId}`);
      } else {
        console.log(`❌ Failed to sync Team ID: ${reg.teamId}`);
      }
    }

    console.log('Sync process completed.');
    process.exit(0);
  } catch (err) {
    console.error('Error during sync:', err);
    process.exit(1);
  }
};

sync();
