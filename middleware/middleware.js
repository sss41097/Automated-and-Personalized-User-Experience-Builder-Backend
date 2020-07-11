const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  console.log("inside auth middleware");
  // console.log(req.headers);

  console.log(req.body.query);
  req.isAuth = false;
  //console.log("middle token detected");
  //console.log(req.headers);
  if (req.headers.Token || req.headers.token) {
    const token = req.headers.Token || req.headers.token;

    try {
      const decoded = jwt.verify(token, "secretkey");
      console.log(decoded);
      req.isAuth = true;
      req.email = decoded.email;
      req.userId = decoded.userId;
      // console.log(req.email);
      next();
    } catch (err) {
      req.isAuth = false;
      next();
    }
  } else {
    // console.log(req);
    next();
  }
};
