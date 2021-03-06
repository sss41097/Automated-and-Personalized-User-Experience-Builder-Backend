const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../../models/user");
const Profile = require("../../models/profile");
const Project = require("../../models/project");
const nodemailer = require("nodemailer");
var CryptoJS = require("crypto-js");

const transporter = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: "nodemailer41097@gmail.com",
    pass: "!@#123qwe",
  },
});

module.exports = {
  createFirstProject: async ({ email, name }, { errorName, req }) => {
    console.log(email);
    try {
      var user = await User.findOne({
        email: email,
      });
      const token = jwt.sign(
        { userId: user.id, email: user.email },
        "secretkey"
      );
      //console.log(email);
      if (!user) {
        throw errorName.INVALID_EMAIL;
      }

      const project = new Project({
        userId: user.id,
        name: name,
        groupCount: 0,
        updatedAt: Date.now(),
        createdAt: Date.now(),
      });

      await project.save();

      user.isFirstProjectCreated = true;
      await user.save();
      return {
        email: user.email,
        userId: user.id,
        token: token,
        isEmailVerified: user.isEmailVerified,
        isFirstProjectCreated: user.isFirstProjectCreated,
      };
    } catch (err) {
      throw new Error(err);
    }
  },

  resetPassword: async ({ email, password }, req) => {
    try {
      //   console.log("inside reset passord");
      var user = await User.findOne({
        email: email,
      });
      //console.log(email);
      if (!user) {
        throw new Error("User not found.");
      }

      const newPassword = await bcrypt.hash(password, 12);
      user.password = newPassword;
      await user.save();
      return {
        email: user.email,
      };
    } catch (err) {
      throw new Error(err);
    }
  },

  resetPasswordAllowed: async ({ resetPasswordToken }, req) => {
    try {
      console.log(resetPasswordToken);
      console.log(Date.now());
      var user = await User.findOne({
        resetPasswordToken: resetPasswordToken,
        resetPasswordExpiry: { $gt: Date.now() },
      });
      //console.log(email);
      if (!user) {
        throw new Error("Token expired or wrong Token");
      }
      return {
        email: user.email,
      };
    } catch (err) {
      throw new Error(err);
    }
  },

  resetPasswordEmail: async ({}, req) => {
    try {
      if (req.isAuth === false) {
        throw new Error("Used not authorized");
      }

      var user = await User.findOne({ email: req.email });

      if (!user) {
        throw new Error("User does not exist.");
      }
      //console.log(email);

      var resetPasswordToken = CryptoJS.HmacSHA1(req.email, "reset").toString();
      console.log(resetPasswordToken);
      var resetPasswordExpiry = Date.now() + 3600000; //1 hour expiry

      const host = "https://whispering-mesa-83020.herokuapp.com";
      const route = `/reset/${resetPasswordToken}`;
      const url = host + route;

      user.resetPasswordToken = resetPasswordToken;
      user.resetPasswordExpiry = resetPasswordExpiry;

      await user.save();
      await transporter.sendMail({
        to: user.email,
        subject: "Password Reset Email",
        html: `Please click this email to reset your password: <a href="${url}">${url}</a>`,
      });
      return {
        email: user.email,
      };
    } catch (err) {
      throw new Error(err);
    }
  },

  sendVerifyEmail: async ({ email }, { errorName, req }) => {
    try {
      var user = await User.findOne({ email: email });
      console.log(email);
      const token = jwt.sign(
        { userId: user.id, email: user.email },
        "secretkey"
        //        { expiresIn: 30 }
      );

      const host = req.protocol + "://" + req.get("host");
      const route = `/verify/${token}`;
      const url = host + route;

      await transporter.sendMail({
        to: user.email,
        subject: "Confirm Email",
        html: `Please click this email to confirm your email: <a href="${url}">${url}</a>`,
      });
      return {
        email: user.email,
        userId: user.id,
        token: token,
        isEmailVerified: user.isEmailVerified,
        isFirstProjectCreated: user.isFirstProjectCreated,
      };
    } catch (err) {
      throw new Error(err);
    }
  },

  loadUser: async (email, { errorName, req }) => {
    console.log(req);
    try {
      if (req.isAuth === false) {
        throw new Error("Not Authenticated");
      }
      // console.log(email);
      // throw new Error(req.email);

      var user = await User.findOne({ email: req.email });
      if (!user) {
        throw new Error("user does not exist.");
      }

      const token = jwt.sign(
        { userId: user.id, email: user.email },
        "secretkey"
      );
      const ret = {
        email: user.email,
        userId: user.id,
        token: token,
        isEmailVerified: user.isEmailVerified,
        isFirstProjectCreated: user.isFirstProjectCreated,
      };
      // console.log(ret);
      return ret;
    } catch (err) {
      // console.log(err);
      throw new Error(err);
    }
  },

  loginUserSocial: async (args, { errorName, req }) => {
    try {
      var user = await User.findOne({ email: args.socialLoginInput.email });
      if (!user) {
        user = new User({
          email: args.socialLoginInput.email,
          firstName: args.socialLoginInput.firstName,
          lastName: args.socialLoginInput.lastName,
          isEmailVerified: true,
          isFirstProjectCreated: false,
        });
        user = await user.save();
        const profile = new Profile({
          firstName: args.socialLoginInput.firstName,
          lastName: args.socialLoginInput.lastName,
          userId: user.id,
        });
        await profile.save();
      }

      const token = jwt.sign(
        { userId: user.id, email: user.email },
        "secretkey"
      );

      return {
        email: user.email,
        userId: user.id,
        token: token,
        isEmailVerified: user.isEmailVerified,
        isFirstProjectCreated: user.isFirstProjectCreated,
      };
    } catch (err) {
      throw new Error(err);
    }
  },

  createUser: async (args, { errorName, req }) => {
    try {
      const existingUser = await User.findOne({ email: args.userInput.email });

      if (existingUser) {
        throw errorName.REGISTRATION_USER_ALREADY_EXISTS;
      }
      console.log(args.userInput.email);
      var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      if (!re.test(String(args.userInput.email).toLowerCase())) {
        throw Error("EMAIL NOT VALID");
      }

      if (
        args.userInput.email.trim().length === 0 ||
        args.userInput.password.trim().length < 6
      ) {
        throw errorName.REGISTRATION_EMAIL_PASSWORD_ERROR;
      }

      const hashedPassword = await bcrypt.hash(args.userInput.password, 12);

      const user = new User({
        email: args.userInput.email,
        password: hashedPassword,
        isEmailVerified: false,
        isFirstProjectCreated: false,
      });
      // console.log(user);
      const profile = new Profile({
        userId: user.id,
        profilePicUrl:
          "https://res.cloudinary.com/dh636gobd/image/upload/v1590380268/uploads/handle_pvysyh.jpg",
      });

      const token = jwt.sign(
        { userId: user.id, email: user.email },
        "secretkey"
      );

      const host = req.protocol + "://" + req.get("host");
      const route = `/verify/${token}`;
      const url = host + route;

      await transporter.sendMail({
        to: user.email,
        subject: "Confirm Email",
        html: `Please click this email to confirm your email: <a href="${url}">${url}</a>`,
      });
      const result = await user.save();
      await profile.save();
      return {
        email: user.email,
        userId: user.id,
        token: token,
        isEmailVerified: user.isEmailVerified,
        isFirstProjectCreated: user.isFirstProjectCreated,
      };
    } catch (err) {
      throw new Error(err);
    }
  },

  login: async ({ email, password }, { errorName, req }) => {
    console.log(email);
    try {
      const user = await User.findOne({ email: email });

      if (!user) {
        throw errorName.INVALID_EMAIL;
      }
      if (!user.password) {
        throw errorName.PASSWORD_NOT_SET;
      }
      const isEqual = await bcrypt.compare(password, user.password);
      if (!isEqual) {
        throw errorName.INVALID_PASSWORD;
      }
      const token = jwt.sign(
        { userId: user.id, email: user.email },
        "secretkey"
      );
      return {
        email: user.email,
        userId: user.id,
        token: token,
        isEmailVerified: user.isEmailVerified,
        isFirstProjectCreated: user.isFirstProjectCreated,
      };
    } catch (err) {
      console.log(err);
      throw new Error(err);
    }
  },
};
