const authResolver = require("./auth");
const profileResolver = require("./profile.js");

const rootResolver = {
  ...authResolver,
  ...profileResolver,
};

module.exports = rootResolver;
