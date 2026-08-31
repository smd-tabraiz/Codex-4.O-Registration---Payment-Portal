const dns = require('dns');
dns.setServers(['8.8.8.8', '1.1.1.1']);

const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

const Registration = require('./models/Registration');
const { getNextSequenceValue } = require('./models/Counter');

const insertTestTeam = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✓ Connected to MongoDB Atlas:', mongoose.connection.name);

    const seq = await getNextSequenceValue('registrationId');
    const teamId = `CDX4-${String(seq).padStart(4, '0')}`;

    const newTeam = await Registration.create({
      teamId: teamId,
      teamName: 'Codex Champions',
      status: 'paid',
      members: [
        {
          name: 'SMD TABRAIZ',
          email: 'smdtabraiz@gmail.com',
          rollNo: '219X1A0599',
          year: '3rd',
          branch: 'CSE',
          college: 'GPREC',
          mobile: '9391491123',
          isLeader: true,
        },
        {
          name: 'Rahul Sharma',
          email: 'rahul.sharma@gprec.ac.in',
          rollNo: '219X1A0588',
          year: '3rd',
          branch: 'CSE',
          college: 'GPREC',
          mobile: '9876543210',
          isLeader: false,
        },
      ],
      paymentDetails: {
        razorpayOrderId: `order_test_${Date.now()}`,
        razorpayPaymentId: `pay_test_${Date.now()}`,
        amount: 300,
        currency: 'INR',
        paidAt: new Date(),
      },
    });

    console.log(`\n🎉 SUCCESS! Inserted new team directly into Atlas:`);
    console.log(`  Team ID: ${newTeam.teamId}`);
    console.log(`  Team Name: ${newTeam.teamName}`);
    console.log(`  Status: ${newTeam.status}`);

    const count = await Registration.countDocuments();
    console.log(`\n• Total registrations in MongoDB Atlas is now: ${count}`);

    await mongoose.disconnect();
  } catch (err) {
    console.error('Error inserting into Atlas:', err);
  }
};

insertTestTeam();
