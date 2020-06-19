const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const profileSchema = new Schema({
  projectId: {
    type: Schema.Types.ObjectId,
    ref: "Project",
    required: true,
  },
  idList: {
    type: Array,
    required: true,
  },
  data: {
    type: Object,
    required: true,
  },
  count: {
    type: Number,
    required: true,
  },
});

module.exports = mongoose.model("Component", profileSchema);
