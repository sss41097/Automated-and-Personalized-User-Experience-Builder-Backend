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
const User = require("./models/user");
const jwt = require("jsonwebtoken");

const app = express();
connectDB();

app.use(bodyParser.json());

// authentication middleware
app.use(tokenCheckMiddleware);

// set profile picture middleware
app.use("/setProfilePic", require("./middleware/profilePic"));

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
    const route = `onboard/`;
    const url = host + route;
    return res.redirect(url);
  } catch (e) {
    console.log(e);
    return res.redirect("https://whispering-mesa-83020.herokuapp.com/");
  }
});

app.use(
  "/graphql",
  graphqlHttp({
    schema: graphQlSchema,
    rootValue: graphQlResolvers,
    graphiql: true,
  })
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
