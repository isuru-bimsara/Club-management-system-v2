const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    studentId: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      select: false,
    },
    profilePhoto: {
      type: String,
      default: '',
    },
    role: {
      type: String,
      default: 'student',
      enum: ['student', 'president', 'admin', 'superadmin'],
    },
    clubsJoined: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Club',
      },
    ],
    presidentOf: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Club',
      default: null,
    },
    status: {
      type: String,
      default: 'active',
      enum: ['active', 'banned'],
    },
  },
  { timestamps: true }
);

userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    next();
  }
  const salt = await bcrypt.genSalt(12);
  this.password = await bcrypt.hash(this.password, salt);
});

module.exports = mongoose.model('User', userSchema);
