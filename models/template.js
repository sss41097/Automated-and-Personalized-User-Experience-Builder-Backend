const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const templateSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  idList: {
    type: Array,
    required: true,
  },
  data: {
    type: Array,
    required: true,
  },
  count: {
    type: Number,
    required: true,
  },
  DOMString: {
    type: String,
  },
  toolTip: {
    type: Boolean,
  },
  overLay: {
    type: Boolean,
  },
});

module.exports = mongoose.model("Template", templateSchema);
