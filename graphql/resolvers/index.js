const authResolver = require("./auth");
const profileResolver = require("./profile.js");
const templateResolver = require("./template.js");
const projectResolver = require("./project.js");
const groupResolver = require("./group.js");
const componentTemplateResolver = require("./componentTemplate.js");

const rootResolver = {
  ...authResolver,
  ...profileResolver,
  ...templateResolver,
  ...projectResolver,
  ...groupResolver,
  ...componentTemplateResolver,
};

module.exports = rootResolver;
