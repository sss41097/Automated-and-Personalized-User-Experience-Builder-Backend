const authResolver = require("./auth");
const profileResolver = require("./profile.js");
const componentResolver = require("./component.js");

const rootResolver = {
  ...authResolver,
  ...profileResolver,
  ...componentResolver,
};

module.exports = rootResolver;
