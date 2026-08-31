const mongoose = require('mongoose');

const memberSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Member name is required'],
    trim: true,
  },
  email: {
    type: String,
    required: [true, 'Member email is required'],
    trim: true,
    lowercase: true,
  },
  rollNo: {
    type: String,
    required: [true, 'Member roll number is required'],
    trim: true,
    uppercase: true,
  },
  year: {
    type: String,
    required: [true, 'Member year of study is required'],
    enum: ['1st', '2nd', '3rd', '4th'],
  },
  branch: {
    type: String,
    required: [true, 'Member branch is required'],
    trim: true,
  },
  college: {
    type: String,
    required: [true, 'Member college is required'],
    default: 'GPREC',
    trim: true,
  },
  mobile: {
    type: String,
    required: [true, 'Member mobile number is required'],
    trim: true,
  },
  isLeader: {
    type: Boolean,
    default: false,
  },
});

const registrationSchema = new mongoose.Schema(
  {
    teamId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    teamName: {
      type: String,
      required: [true, 'Team name is required'],
      trim: true,
    },
    members: {
      type: [memberSchema],
      validate: {
        validator: function (val) {
          return val && val.length >= 2 && val.length <= 3;
        },
        message: 'Team must have between 2 and 3 members.',
      },
    },
    status: {
      type: String,
      enum: ['pending', 'paid', 'failed', 'expired'],
      default: 'pending',
      index: true,
    },
    paymentDetails: {
      razorpayOrderId: { type: String, index: true },
      razorpayPaymentId: { type: String },
      razorpaySignature: { type: String },
      amount: { type: Number, default: 300 },
      currency: { type: String, default: 'INR' },
      paidAt: { type: Date },
    },
    emailSent: {
      type: Boolean,
      default: false,
    },
    emailSentAt: {
      type: Date,
    },
    expiresAt: {
      type: Date,
      index: true, // TTL or explicit status check
    },
  },
  {
    timestamps: true,
  }
);

// Pre-save hook: Ensure 4th-year constraint rule on Mongoose model level as extra safety
registrationSchema.pre('save', function (next) {
  if (this.members && this.members.length > 0) {
    const fourthYearCount = this.members.filter((m) => m.year === '4th').length;
    if (fourthYearCount > 1) {
      return next(new Error('Constraint Violation: A team can have at most one 4th-year student.'));
    }
  }
  next();
});

module.exports = mongoose.model('Registration', registrationSchema);
