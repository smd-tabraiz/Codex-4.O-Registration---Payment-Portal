const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      trim: true,
      lowercase: true,
    },
    password: {
      type: String,
      // Optional for Google OAuth users
    },
    googleId: {
      type: String,
    },
    picture: {
      type: String,
    },
    rollNo: {
      type: String,
      trim: true,
      uppercase: true,
    },
    year: {
      type: String,
      enum: ['1st', '2nd', '3rd', '4th', ''],
      default: '2nd',
    },
    branch: {
      type: String,
      trim: true,
      default: 'CSE',
    },
    college: {
      type: String,
      trim: true,
      default: 'GPREC',
    },
    mobile: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

// Hash password before saving
userSchema.pre('save', async function (next) {
  if (!this.isModified('password') || !this.password) {
    return next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Compare password method
userSchema.methods.matchPassword = async function (enteredPassword) {
  if (!this.password) return false;
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
