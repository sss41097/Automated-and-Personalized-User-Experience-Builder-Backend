const Profile = require("../../models/profile");

module.exports = {
  updateProfile: async ({ profileInput }, req) => {
    try {
      if (req.isAuth === false) {
        throw new Error("User not authenticated");
      }
      console.log("inside resoluver");
      console.log(profileInput);
      fields = {};
      if (profileInput.firstName) fields.firstName = profileInput.firstName;
      if (profileInput.lastName) fields.lastName = profileInput.lastName;
      if (profileInput.dob !== "null") fields.dob = new Date(profileInput.dob);
      if (profileInput.mobileNumber) {
        fields.mobileNumber = profileInput.mobileNumber;
      }
      if (profileInput.maritialStatus !== null)
        fields.maritialStatus = profileInput.maritialStatus;

      profile = await Profile.findOneAndUpdate(
        { userId: req.userId },
        { $set: fields },
        { new: true }
      );
      console.log(profile);

      return profile;
    } catch (err) {
      throw new Error(err);
    }
  },

  getProfile: async ({}, req) => {
    try {
      if (req.isAuth === false) {
        throw new Error("User not authenticated.");
      }
      console.log(req.userId);
      const profile = await Profile.findOne({ userId: req.userId });
      if (!profile) {
        throw new Error("No profile for this user.");
      }
      return profile;
    } catch (err) {
      throw new Error(err);
    }
  },
};
