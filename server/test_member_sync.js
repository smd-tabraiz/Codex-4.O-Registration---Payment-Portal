const dns = require('dns');
dns.setServers(['8.8.8.8', '1.1.1.1']);

const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

const User = require('./models/User');
const Registration = require('./models/Registration');

const testSync = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✓ Connected to MongoDB Atlas:', mongoose.connection.name);

    // Sync all existing registrations members into User collection
    const allRegs = await Registration.find();
    let count = 0;
    for (const reg of allRegs) {
      for (const m of reg.members) {
        await User.findOneAndUpdate(
          { email: m.email.toLowerCase() },
          {
            $set: {
              name: m.name,
              email: m.email.toLowerCase(),
              rollNo: m.rollNo,
              year: m.year,
              branch: m.branch,
              college: m.college || 'GPREC',
              mobile: m.mobile,
            },
          },
          { upsert: true, new: true, setDefaultsOnInsert: true }
        );
        count++;
      }
    }

    console.log(`✓ Successfully synced ${count} team members into 'users' collection!`);

    const users = await User.find();
    console.log(`\n--- ALL USERS CURRENTLY IN 'users' COLLECTION (${users.length}) ---`);
    users.forEach((u, i) => {
      console.log(`[User #${i + 1}] Name: "${u.name}" | Email: ${u.email} | Roll: ${u.rollNo} | Year: ${u.year} | Branch: ${u.branch} | Mobile: ${u.mobile}`);
    });

    await mongoose.disconnect();
  } catch (err) {
    console.error(err);
  }
};

testSync();
