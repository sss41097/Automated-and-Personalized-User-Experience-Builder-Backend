const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const templateSchema = new Schema({
  componentTemplate: {
    type: Object,
  },
});

module.exports = mongoose.model("componenttemplate", templateSchema);
