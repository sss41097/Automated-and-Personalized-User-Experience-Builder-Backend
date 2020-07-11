const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const projectSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: "Account",
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
  },
  groupCount: {
    type: Number,
  },
  updatedAt: {
    type: Date,
  },
});

module.exports = mongoose.model("Project", projectSchema);
