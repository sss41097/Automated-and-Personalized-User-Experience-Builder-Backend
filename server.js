const express = require("express");
const bodyParser = require("body-parser");
const graphqlHttp = require("express-graphql");
const mongoose = require("mongoose");
const { addMiddleware } = require("graphql-add-middleware");
const path = require("path");
var graphQlSchema = require("./graphql/schema/index");
const graphQlResolvers = require("./graphql/resolvers/index");
const connectDB = require("./config/db");
const tokenCheckMiddleware = require("./middleware/middleware");
const FormatError = require("easygraphql-format-error");
const User = require("./models/user");
const jwt = require("jsonwebtoken");
const errorTemplate = require("./graphql/errorTemplate.json");

const app = express();
connectDB();

app.use(bodyParser.json());

// authentication middleware
app.use(tokenCheckMiddleware);

// set profile picture middleware
app.use("/setProfilePic", require("./middleware/profilePic"));

// upload image middleware(for slideshow and image component)
app.use("/imageUpload", require("./middleware/imageUpload"));

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST,GET,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  }
  next();
});

app.get("./");

app.get("/verify/:token", async (req, res) => {
  try {
    const decoded = jwt.verify(req.params.token, "secretkey");
    console.log(decoded);

    var user = await User.findOne({ email: decoded.email });
    user.isEmailVerified = true;
    console.log(user.email);
    await user.save();
    res.header("token", req.params.token);
    const host = "http://localhost:3000/";
    const route = `register/`;
    const url = host + route;
    return res.redirect(url);
  } catch (e) {
    console.log(e);
    return res.redirect("http://localhost:3000");
  }
});

const formatError = new FormatError(errorTemplate.errors);
const errorName = formatError.errorName;

app.use(
  "/graphql",
  graphqlHttp((request) => ({
    schema: graphQlSchema,
    rootValue: graphQlResolvers,
    graphiql: true,
    context: { errorName, req: request },
    formatError: (err) => {
      return formatError.getError(err);
    },
  }))
);

if (process.env.NODE_ENV === "production") {
  //Set static folder
  app.use(express.static("client/build"));

  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
  });
}

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
