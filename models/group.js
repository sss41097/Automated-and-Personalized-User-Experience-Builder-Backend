const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const groupSchema = new Schema({
  projectId: {
    type: Schema.Types.ObjectId,
    ref: "Project",
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  templateList: {
    type: Array,
  },
});

module.exports = mongoose.model("Group", groupSchema);
