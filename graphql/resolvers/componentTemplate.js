const mongoose = require("mongoose");
const ComponentTemplate = require("../../models/componentTemplate");

module.exports = {
  getAllComponentTemplates: async ({}, { errorName, req }) => {
    try {
      var data = await ComponentTemplate.find();
      let componentTemplates = {};
      console.log(data);
      for (let i = 0; i < data.length; i++) {
        console.log(data[i].componentTemplate["type"]);
        componentTemplates[data[i].componentTemplate["type"]] = {
          ...data[i].componentTemplate,
        };
        delete componentTemplates[data[i].componentTemplate["type"]]["type"];
      }

      console.log(data);
      return { componentTemplates };
    } catch (err) {
      throw new Error(err);
    }
  },
};
