const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const userSchema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  firstName: {
    type: String,
  },
  lastName: {
    type: String,
  },
  isEmailVerified: {
    type: Boolean,
  },
  resetPasswordToken: {
    type: String,
  },
  resetPasswordExpiry: {
    type: Number,
  },
  isFirstProjectCreated: {
    type: Boolean,
  },
  password: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Account", userSchema);
