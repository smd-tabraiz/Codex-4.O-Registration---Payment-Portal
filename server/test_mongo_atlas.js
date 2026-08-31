const dns = require('dns');
dns.setServers(['8.8.8.8', '1.1.1.1']);

const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

const Registration = require('./models/Registration');
const User = require('./models/User');

const runAtlasInspection = async () => {
  try {
    const uri = process.env.MONGODB_URI;
    console.log('Connecting to MongoDB Atlas Cluster...');
    await mongoose.connect(uri);
    console.log('✓ Connected to Database:', mongoose.connection.name);

    const userCount = await User.countDocuments();
    const regCount = await Registration.countDocuments();

    console.log(`\n--- MONGODB ATLAS COLLECTION SUMMARY ---`);
    console.log(`• Total Accounts in 'users' collection: ${userCount}`);
    console.log(`• Total Registrations in 'registrations' collection: ${regCount}`);

    const latestRegs = await Registration.find().sort({ createdAt: -1 }).limit(5);
    console.log(`\n--- LATEST REGISTRATION DOCUMENTS IN ATLAS ---`);
    latestRegs.forEach((reg, i) => {
      console.log(`\n[Doc #${i + 1}] Team ID: ${reg.teamId} | Team Name: "${reg.teamName}" | Status: ${reg.status}`);
      console.log(`  Members (${reg.members.length}):`);
      reg.members.forEach((m) => {
        console.log(`   - ${m.name} (${m.email}, Roll: ${m.rollNo}, Year: ${m.year}, Branch: ${m.branch}) [${m.isLeader ? 'LEADER' : 'MEMBER'}]`);
      });
      console.log(`  Payment: Amount ₹${reg.paymentDetails?.amount || 300} | OrderId: ${reg.paymentDetails?.razorpayOrderId}`);
    });

    const latestUsers = await User.find().sort({ createdAt: -1 }).limit(5);
    console.log(`\n--- LATEST USER ACCOUNTS IN ATLAS ---`);
    latestUsers.forEach((u, i) => {
      console.log(`[User #${i + 1}] Name: ${u.name} | Email: ${u.email} | Roll: ${u.rollNo || 'N/A'}`);
    });

    await mongoose.disconnect();
    console.log('\nAtlas inspection complete.');
  } catch (err) {
    console.error('Error connecting to Atlas:', err.message);
  }
};

runAtlasInspection();
