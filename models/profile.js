const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const profileSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: "Account",
    required: true,
  },
  firstName: {
    type: String,
  },
  lastName: {
    type: String,
  },
  mobileNumber: {
    type: Number,
  },
  dob: {
    type: Date,
  },
  profilePicUrl: {
    type: String,
  },
  maritialStatus: {
    type: Boolean,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
  },
});

module.exports = mongoose.model("ProfileUser", profileSchema);
