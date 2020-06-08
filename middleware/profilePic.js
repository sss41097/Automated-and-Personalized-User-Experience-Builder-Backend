const express = require("express");
const router = express.Router();
const multer = require("multer");
const Profile = require("../models/profile");
var cloudinary = require("cloudinary");
var cloudinaryStorage = require("multer-storage-cloudinary");

cloudinary.config({
  cloud_name: "dh636gobd",
  api_key: "235177691699437",
  api_secret: "VGZfumbiMfoKKmc0ZT-CJ7L6s0s",
});

var storage = cloudinaryStorage({
  cloudinary: cloudinary,
  folder: "uploads",
  allowedFormats: ["jpeg", "png", "jpg"],
  filename: function (req, file, cb) {
    cb(
      undefined,
      Date.now() +
        "_" +
        file.originalname.substr(0, file.originalname.lastIndexOf(".")) || input
    );
  },
});

// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(
//       null,
//       "C:/Users/This PC/Desktop/react project/login system/middleware/uploads"
//     );
//   },
//   filename: function (req, file, cb) {
//     cb(null, Date.now() + file.originalname);
//   },
// });

const fileFilter = (req, file, cb) => {
  // reject a file
  //console.log(file);
  if (file.mimetype === "image/jpeg" || file.mimetype === "image/png") {
    cb(null, true);
  } else {
    cb("File should be a JPEG or PNG type only", false);
  }
};

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 1024 * 1024,
  },
  fileFilter: fileFilter,
}).single("images");

router.put("/", (req, res) => {
  if (req.isAuth === false) {
    res.status(400).send({ error: "Not authenticated." });
  }

  const upload = multer({
    storage: storage,
    limits: {
      fileSize: 1024 * 1024,
    },
    fileFilter: fileFilter,
  }).single("images");

  upload(req, res, function (err) {
    if (err) {
      if (err.code === "LIMIT_FILE_SIZE") {
        res
          .status(400)
          .send({ error: "File is too large. Max size of 1MB allowed." });
      } else {
        res
          .status(400)
          .send({ error: "File must be of JPEG/PNG?JPG extension." });
      }
    } else {
      // console.log(req.file.url);
      if (!req.file) {
        res.status(400).send("File Upload Error");
      }
      const field = { profilePicUrl: req.file.url };
      Profile.findOneAndUpdate(
        { userId: req.userId },
        { $set: field },
        { new: true }
      )
        .then((profile) => {
          console.log(profile.profilePicUrl);
          res.send({ profilePicUrl: profile.profilePicUrl });
        })
        .catch((err) => {
          res.status(400).send("Database Error.");
        });
    }
  });
});

module.exports = router;
